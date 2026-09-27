import { useState, type ReactNode } from "react";
import type { ModProps } from "../Module";
import { decide, markDone, toast, useBia } from "../store";
import { EXPIRIES, INTAKE, VEHICLES, type Tone } from "../story";
import { AgentNote, Bars, Btn, Card, Donut, Drawer, Empty, Grid, Head, KV, Kpis, Legend, Page, Pill, SERIES, SearchBox, Section, Segmented, Table, Timeline, WriteBackBadge, toneColor, type Col } from "../ui";
import { Avatar, Chips, HRow, ListRow, Note, Stat, StatRow, Toolbar, n0 } from "./customers/bits";
import { CATEGORIES, DOCS, EWC, EWC_BY_INTAKE, EXPIRY_LIST, HEALTH_AREAS, INSPECTIONS, ISO_AUDITS, NCS, PERMIT, PERMIT_MONTHS, REJECTED, TOOLBOX, dateIn, urgency, vehicleRows, type Check, type Doc, type Expiry, type VRow } from "./compliance/data";

const BIA12_LABEL = "BIA-12 roadworthiness test booked Thu 08:00, Huntstown workshop.";
const bookBia12 = () => decide("bia12", "approved", BIA12_LABEL);

export default function Compliance({ tab, setTab, go }: ModProps) {
  const [docCat, setDocCat] = useState("All");
  let body;
  switch (tab) {
    case "Vehicles": body = <Vehicles go={go} />; break;
    case "Waste": body = <Waste go={go} />; break;
    case "Documents": body = <Documents cat={docCat} setCat={setDocCat} />; break;
    case "Audits": body = <Audits />; break;
    case "Expiries": body = <Expiries />; break;
    default: body = <Overview setTab={setTab} openCat={(c) => { setDocCat(c); setTab("Documents"); }} />;
  }
  return <Page>{body}</Page>;
}

/* 270° gauge on theme tokens. */
function Gauge({ value, size = 200, label, sub }: { value: number; size?: number; label: ReactNode; sub?: ReactNode }) {
  const r = size / 2 - 16, cx = size / 2, cy = size / 2;
  const pt = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = pt(135), [x1, y1] = pt(45);
  const d = `M${x0} ${y0} A${r} ${r} 0 1 1 ${x1} ${y1}`;
  const ticks = Array.from({ length: 11 }, (_, i) => 135 + i * 27);
  return (
    <div style={{ position: "relative", width: size, height: size * 0.84, flex: "none" }}>
      <svg width={size} height={size} style={{ display: "block" }}>
        {ticks.map((a) => {
          const ri = r - 16, ro = r - 11;
          const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
          return <line key={a} x1={cx + ri * c} y1={cy + ri * s} x2={cx + ro * c} y2={cy + ro * s} stroke="var(--border-strong)" strokeWidth="1.5" strokeLinecap="round" />;
        })}
        <path d={d} fill="none" stroke="var(--track)" strokeWidth="14" strokeLinecap="round" />
        <path d={d} fill="none" stroke="var(--accent)" strokeWidth="14" strokeLinecap="round" pathLength={100} strokeDasharray={`${value} 100`} style={{ filter: "drop-shadow(0 0 10px var(--accent-soft))" }} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: size * 0.3, textAlign: "center" }}>
        <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-2px", color: "var(--ink)", lineHeight: 1 }}>{label}</div>
        {sub && <div style={{ marginTop: 6, fontSize: 11.5, color: "var(--faint)" }}>{sub}</div>}
      </div>
    </div>
  );
}

function daysPill(days: number, done?: boolean, doneText = "Booked") {
  if (done) return <Pill tone="ok">{doneText}</Pill>;
  return <Pill tone={urgency(days)}>{days} {days === 1 ? "day" : "days"}</Pill>;
}

function useExpiryAction() {
  const s = useBia();
  const isDone = (e: Expiry) => (e.id === "bia12" ? s.approvals.bia12 === "approved" : !!s.done["exp-" + e.id]);
  const act = (e: Expiry) => {
    if (e.id === "bia12") return bookBia12();
    markDone("exp-" + e.id);
    toast(e.system === "Email" ? "Sent via Email" : "Updated in " + e.system, e.write);
  };
  return { isDone, act };
}

/* ---------------- Overview ---------------- */
function Overview({ setTab, openCat }: { setTab: (t: string) => void; openCat: (c: string) => void }) {
  const s = useBia();
  const booked = s.approvals.bia12 === "approved";
  const { isDone, act } = useExpiryAction();
  const soon = EXPIRY_LIST.filter((e) => EXPIRIES.some((x) => x.item === e.item));
  const total = CATEGORIES.reduce((a, c) => a + c.count, 0);
  const owners = [
    { name: "Ricarte Nazerenco", role: "H&S and Compliance", areas: "Health & Safety, ISO 45001, SOPs, toolbox talks, site inspections" },
    { name: "Larissa Franca", role: "Compliance", areas: "Waste permits, facility licence, ISO 9001 and 14001, waste transfer documentation" },
  ];
  return (
    <>
      <Head eyebrow="COMPLIANCE" title="Compliance"
        sub="Bia Energy operates under a waste collection permit and holds ISO 9001, ISO 14001 and ISO 45001 certification. Pulse checks every certificate, docket and inspection against its expiry each morning."
        right={<><Btn onClick={() => setTab("Documents")}>Document library</Btn><Btn kind="primary" onClick={() => setTab("Expiries")}>Expiry calendar</Btn></>} />
      <Grid>
        <Card span={4} title="Compliance health" sub={n0(total) + " records monitored"}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Gauge value={98} label="98%" sub="Target 97%" />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
              {["Waste collection permit", "ISO 9001", "ISO 14001", "ISO 45001"].map((x) => <Pill key={x} tone="ok">{x}</Pill>)}
            </div>
          </div>
        </Card>
        <Card span={8} pad={false} title="Expiring soon" sub="Next 45 days · owners notified automatically" right={<Btn small onClick={() => setTab("Expiries")}>All 90 days</Btn>}>
          {soon.map((e, i) => {
            const done = isDone(e);
            return (
              <ListRow key={e.id} first={i === 0} tone={done ? "ok" : urgency(e.days)} title={e.item}
                sub={<>{e.cat} · {e.days <= 7 ? "Due " : "Expires "}{dateIn(e.days)}{e.id === "bia12" && !done ? " · Unavailable if not completed" : ""}{done ? " · " + e.write : ""}</>}
                right={<>{daysPill(e.days, done, e.system === "Email" ? "Requested" : "Booked")}{done ? <WriteBackBadge system={e.system} /> : <Btn small kind={e.days <= 7 ? "primary" : "ghost"} onClick={() => act(e)}>{e.id === "bia12" ? "Book inspection" : e.action}</Btn>}</>} />
            );
          })}
          <div style={{ padding: "12px 18px 14px" }}>
            {booked ? (
              <Note tone="ok">BIA-12 test is in the Calendar for Thursday 08:00. The vehicle stays available for bin swaps until then.</Note>
            ) : (
              <AgentNote agent="Compliance Agent" actions={<Btn kind="primary" small onClick={bookBia12}>Book BIA-12 for Thu 08:00</Btn>}>
                Everything else is in date. BIA-12 needs its roadworthiness test in 3 days or it comes off the road. The workshop has Thursday 08:00 free and BIA-12 has no runs booked that morning.
              </AgentNote>
            )}
          </div>
        </Card>
        <Card span={8} title="Document categories" sub="Select a category to open it in the library">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 10 }}>
            {CATEGORIES.map((c) => (
              <button key={c.name} onClick={() => openCat(c.name)} className="bia-row"
                style={{ textAlign: "left", padding: "14px 14px 12px", borderRadius: 16, border: "1px solid var(--border)", background: "var(--surface-2)", cursor: "pointer", fontFamily: "inherit", color: "inherit", display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                <span style={{ fontSize: 12, color: "var(--dim)", fontWeight: 600 }}>{c.name}</span>
                <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-.8px", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{n0(c.count)}</span>
                <span style={{ fontSize: 11.5, color: "var(--faint)", lineHeight: 1.4, minHeight: 32 }}>{c.note}</span>
                <span><Pill tone={c.name === "Vehicle inspections" && booked ? "info" : c.tone}>{c.name === "Vehicle inspections" && booked ? "BIA-12 booked" : c.status}</Pill></span>
              </button>
            ))}
          </div>
        </Card>
        <Card span={4} pad={false} title="Owners" sub="Accountable for each area">
          {owners.map((o, i) => (
            <ListRow key={o.name} first={i === 0} lead={<Avatar name={o.name} />} title={o.name} sub={<><span style={{ color: "var(--ink)" }}>{o.role}</span><br />{o.areas}</>} />
          ))}
          <div style={{ padding: "4px 18px 14px" }}>
            <Note tone="info">Fleet, People and Plant teams own their own renewals. Pulse routes each reminder to the right owner and records the write-back.</Note>
          </div>
        </Card>
        <Card span={12} title="Health by area" sub="Share of records in date and complete">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", columnGap: 28 }}>
            {HEALTH_AREAS.map((a) => <HRow key={a.label} label={a.label} value={a.v - 80} max={20} display={a.v + "%"} tone={a.v >= 98 ? "accent" : "info"} />)}
          </div>
        </Card>
      </Grid>
    </>
  );
}

/* ---------------- Vehicles ---------------- */
function CheckCell({ c }: { c: Check }) {
  if (c.s === "N/A") return <span style={{ color: "var(--faint)" }}>N/A</span>;
  return (
    <div>
      <Pill tone={c.tone}>{c.s}</Pill>
      {c.d && <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 4 }}>{c.d}</div>}
    </div>
  );
}

function Vehicles({ go }: { go: (p: string, t?: string) => void }) {
  const s = useBia();
  const booked = s.approvals.bia12 === "approved";
  const rows = vehicleRows(booked);
  const [sel, setSel] = useState<VRow | null>(null);
  const [filter, setFilter] = useState("All");
  const flagged = (r: VRow) => [r.road, r.tacho, r.loler].some((c) => c.tone === "bad" || c.tone === "warn");
  const upcoming = (r: VRow) => [r.road, r.tacho, r.loler].some((c) => c.tone === "info");
  const shown = rows.filter((r) => filter === "All" || (filter === "Action needed" ? flagged(r) : upcoming(r)));
  const cols: Col<VRow>[] = [
    { key: "id", label: "Vehicle", render: (r) => <div><div style={{ color: "var(--ink)", fontWeight: 600 }}>{r.id}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{r.reg}</div></div> },
    { key: "type", label: "Type", render: (r) => <div><div>{r.type}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{r.status}</div></div> },
    { key: "road", label: "Roadworthiness", render: (r) => <CheckCell c={r.road} /> },
    { key: "tacho", label: "Tachograph calibration", render: (r) => <CheckCell c={r.tacho} /> },
    { key: "loler", label: "Tail-lift / LOLER", render: (r) => <CheckCell c={r.loler} /> },
    { key: "disc", label: "Operator licence disc", render: (r) => <CheckCell c={r.disc} /> },
    { key: "ins", label: "Insurance", render: () => <Pill tone="ok">Valid</Pill> },
    { key: "score", label: "Checks", align: "right", render: (r) => <span style={{ color: r.score === 5 ? "var(--ok)" : "var(--warn)", fontWeight: 600 }}>{r.score}/5</span> },
  ];
  const full = rows.filter((r) => r.score === 5).length;
  const v = sel ? VEHICLES.find((x) => x.id === sel.id) : undefined;
  return (
    <>
      <Head eyebrow="COMPLIANCE" title="Vehicle compliance" sub="Roadworthiness, tachograph calibration, lifting equipment, operator licence and insurance for all 16 vehicles. Pulled from Fleet / telematics and the workshop register." />
      <Kpis items={[
        { label: "Vehicles", value: rows.length, sub: "MacPac, artic, tanker, support" },
        { label: "All checks in date", value: full + " of " + rows.length, tone: "ok", hero: true },
        { label: "Action needed", value: rows.filter(flagged).length, sub: booked ? "BIA-07 re-exam, BIA-10 in workshop" : "BIA-12 test, BIA-07 re-exam", tone: "warn" },
        { label: "Due within 60 days", value: rows.filter(upcoming).length, sub: "Tachograph and LOLER" },
      ]} />
      <div style={{ marginBottom: 14 }}>
        {booked ? (
          <Card tone="ok" title="BIA-12 roadworthiness test booked" sub="Thu 1 Oct 08:00 · Huntstown workshop" right={<WriteBackBadge system="Calendar" />}>
            <div style={{ fontSize: 13, color: "var(--dim)" }}>Driver Ronan Hayes notified. BIA-12 stays on bin swaps until Wednesday evening.</div>
          </Card>
        ) : (
          <AgentNote agent="Compliance Agent" actions={<><Btn kind="primary" small onClick={bookBia12}>Book inspection</Btn><Btn small onClick={() => go("Fleet", "Inspections")}>Open in Fleet</Btn></>}>
            BIA-12 (221-D-6045) is due its annual roadworthiness test on Fri 2 Oct, in 3 days. If it lapses the vehicle is off road and the Dublin 15 bin swaps move to BIA-10, which is itself in the workshop until Thursday. Thursday 08:00 is free at the Huntstown workshop.
          </AgentNote>
        )}
      </div>
      <Toolbar right={<span style={{ fontSize: 12, color: "var(--faint)" }}>Select a vehicle for its compliance file</span>}>
        <Segmented options={["All", "Action needed", "Due soon"]} value={filter} onChange={setFilter} />
      </Toolbar>
      <Card pad={false} title="Compliance matrix" sub={shown.length + " vehicles"}>
        <Table cols={cols} rows={shown} onRow={setSel} selected={sel?.id} />
      </Card>
      <Drawer open={!!sel} onClose={() => setSel(null)} title={sel ? sel.id + " · " + sel.reg : ""} sub={sel ? sel.type + " · " + sel.status + (v ? " · " + v.driver : "") : ""}>
        {sel && v && (
          <>
            <StatRow>
              <Stat label="Checks in date" value={sel.score + "/5"} tone={sel.score === 5 ? "ok" : "warn"} />
              <Stat label="Mileage" value={n0(v.mileage) + " km"} />
              <Stat label="Last inspection" value={v.lastInspection} />
              <Stat label="Next periodic" value={v.nextInspection} />
            </StatRow>
            {v.note && <Note tone={v.status === "Fault" ? "bad" : "warn"}>{v.note}</Note>}
            <Section title="Checks">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {([["Roadworthiness test", sel.road], ["Tachograph calibration", sel.tacho], ["Tail-lift / LOLER", sel.loler], ["Operator licence disc", sel.disc], ["Insurance", sel.ins]] as [string, Check][]).map(([k, c]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                    <span style={{ flex: 1, fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>{k}</span>
                    <span style={{ fontSize: 12, color: "var(--faint)" }}>{c.d || ""}</span>
                    {c.s === "N/A" ? <span style={{ color: "var(--faint)", fontSize: 12 }}>N/A</span> : <Pill tone={c.tone}>{c.s}</Pill>}
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Linked records">
              <KV rows={[["Certificate file", "Documents · " + sel.id + " folder"], ["Workshop register", sel.id === "BIA-07" ? "WS-2291 open" : "No open tickets"], ["Telematics", "Fleet / telematics live"], ["Cost YTD", "€" + n0(v.costYtd)]]} />
            </Section>
            {sel.id === "BIA-12" && (booked ? <WriteBackBadge system="Calendar" /> : <Btn kind="primary" onClick={bookBia12}>Book inspection, Thu 08:00</Btn>)}
            {sel.id === "BIA-07" && <Btn onClick={() => { markDone("loler07"); toast("Updated in Fleet System", "LOLER re-examination requested for BIA-07 once WS-2291 is closed."); }}>{s.done["loler07"] ? "Re-exam requested" : "Request LOLER re-exam"}</Btn>}
          </>
        )}
      </Drawer>
    </>
  );
}

/* ---------------- Waste ---------------- */
type DocketRow = { id: string; arrival: string; customer: string; ewc: string; docket: string; producer: boolean; carrier: boolean; ticket: boolean; status: string; tone: Tone };
function Waste({ go }: { go: (p: string, t?: string) => void }) {
  const s = useBia();
  const requested = !!s.done["docket1049"];
  const rows: DocketRow[] = [...INTAKE].sort((a, z) => z.arrival.localeCompare(a.arrival)).map((i) => {
    const missing = i.id === "INT-1049";
    return { id: i.id, arrival: i.arrival, customer: i.customer + (i.customer === "Third-party haulier" ? ", " + i.vehicle : ""), ewc: EWC_BY_INTAKE[i.id], docket: i.docket,
      producer: !missing, carrier: !missing, ticket: i.status !== "In queue",
      status: missing ? (requested ? "Requested" : "Missing docket") : i.status === "Rejected" ? "Complete, rejected" : "Complete", tone: missing ? (requested ? "info" : "bad") : "ok" };
  });
  const tick = (b: boolean, pending?: string) => b ? <span style={{ color: "var(--ok)", fontWeight: 700 }}>✓</span> : <span style={{ color: pending ? "var(--faint)" : "var(--bad)", fontWeight: 600 }}>{pending || "Missing"}</span>;
  const cols: Col<DocketRow>[] = [
    { key: "id", label: "Load", render: (r) => <span style={{ color: "var(--ink)", fontWeight: 600 }}>{r.id}</span> },
    { key: "arrival", label: "Arrival" },
    { key: "customer", label: "Producer / carrier" },
    { key: "ewc", label: "EWC" },
    { key: "docket", label: "Docket" },
    { key: "producer", label: "Producer sig.", render: (r) => tick(r.producer) },
    { key: "carrier", label: "Carrier sig.", render: (r) => tick(r.carrier) },
    { key: "ticket", label: "Ticket", render: (r) => tick(r.ticket, "On tip") },
    { key: "status", label: "Status", render: (r) => <Pill tone={r.tone}>{r.status}</Pill> },
  ];
  const pctLimit = (PERMIT.ytd / PERMIT.limit) * 100;
  return (
    <>
      <Head eyebrow="COMPLIANCE" title="Waste documentation" sub="Waste transfer dockets, permitted tonnage and EWC codes for everything that crosses the Huntstown weighbridge." />
      <Kpis items={[
        { label: "Dockets captured today", value: "33 of 34", sub: requested ? "INT-1049 requested from haulier" : "1 missing, INT-1049", tone: requested ? "info" : "warn", hero: true },
        { label: "Permitted tonnage YTD", value: n0(PERMIT.ytd) + " t", sub: pctLimit.toFixed(1) + "% of " + n0(PERMIT.limit) + " t annual limit" },
        { label: "Projected year end", value: n0(PERMIT.projected) + " t", sub: "Within limit", tone: "ok" },
        { label: "Rejected loads, September", value: REJECTED.length, sub: "All third-party, NCRs raised" },
        { label: "EWC codes in use", value: EWC.length, sub: "Of 14 on the permit schedule" },
      ]} />
      <Grid>
        <Card span={12} pad={false} title="Waste transfer documentation, today" sub="Weighbridge loads since 09:58 · docket, signatures and ticket per load"
          right={<Btn small onClick={() => go("Plant", "Weighbridge")}>Open Weighbridge</Btn>}>
          <div style={{ padding: "4px 18px 12px" }}>
            {requested ? (
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}><WriteBackBadge system="Email" /><span style={{ fontSize: 12.5, color: "var(--dim)" }}>Signed docket WTD-58813 requested from the haulier for INT-1049 (08-D-55120). Load held at the tip until it arrives.</span></div>
            ) : (
              <AgentNote agent="Compliance Agent" actions={<Btn kind="primary" small onClick={() => { markDone("docket1049"); toast("Sent via Email", "Signed docket WTD-58813 requested from the haulier for INT-1049"); }}>Request missing docket</Btn>}>
                INT-1049 is a third-party load of packaged food (9.60 t net, 08-D-55120) queued at 13:02 without a signed transfer docket. It can't be tipped until the haulier sends the signed WTD-58813.
              </AgentNote>
            )}
          </div>
          <Table cols={cols} rows={rows} dense />
        </Card>
        <Card span={6} title="Permit tonnage against limit" sub={"Jan–Sep 2026 · dashed line is the monthly share of " + n0(PERMIT.limit) + " t"}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-1px", color: "var(--ink)" }}>{n0(PERMIT.ytd)} t</span>
            <span style={{ fontSize: 12.5, color: "var(--dim)" }}>of {n0(PERMIT.limit)} t · {PERMIT.yearElapsed}% of the year gone</span>
          </div>
          <div style={{ position: "relative", marginTop: 12 }}>
            <div style={{ height: 10, borderRadius: 9, background: "var(--track)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: pctLimit + "%", background: "var(--accent)", borderRadius: 9 }} />
            </div>
            <div title="Year elapsed" style={{ position: "absolute", top: -4, bottom: -4, left: PERMIT.yearElapsed + "%", width: 2, background: "var(--ink)", opacity: 0.55 }} />
          </div>
          <Bars data={PERMIT_MONTHS} plan={PERMIT_MONTHS.map(() => 8333)} h={140} unit=" t" />
        </Card>
        <Card span={6} title="EWC codes" sub="Share of accepted tonnes, year to date">
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <Donut parts={EWC.map((e, i) => ({ v: e.pct, c: SERIES[i % SERIES.length] }))} label={EWC.length} sub="codes" size={140} />
            <div style={{ flex: 1, minWidth: 240 }}>
              <Legend items={EWC.map((e, i) => ({ label: e.code + "  " + e.label, value: e.pct + "%", c: SERIES[i % SERIES.length] }))} />
            </div>
          </div>
        </Card>
        <Card span={12} pad={false} title="Rejected loads" sub="September · rejection note, photos and NCR on each docket">
          {REJECTED.map((r, i) => (
            <ListRow key={r.id} first={i === 0} tone={r.status === "Closed" ? "neutral" : "bad"} title={<>{r.id} · {r.haulier}</>}
              sub={<>{r.date} · {r.net.toFixed(2)} t net · {r.reason}</>} right={<><span style={{ fontSize: 12, color: "var(--faint)" }}>{r.ref}</span><Pill tone={r.status === "Closed" ? "neutral" : "warn"}>{r.status}</Pill></>} />
          ))}
        </Card>
      </Grid>
    </>
  );
}

/* ---------------- Documents ---------------- */
function Documents({ cat, setCat }: { cat: string; setCat: (c: string) => void }) {
  const s = useBia();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Doc | null>(null);
  const cats = CATEGORIES.map((c) => c.name);
  const counts: Record<string, number> = { All: DOCS.length };
  cats.forEach((c) => { counts[c] = DOCS.filter((d) => d.cat === c).length; });
  const rows = DOCS.filter((d) => (cat === "All" || d.cat === cat) && (!q || (d.title + " " + d.ref + " " + d.owner + " " + d.linked.join(" ")).toLowerCase().includes(q.toLowerCase())));
  const booked = s.approvals.bia12 === "approved";
  const statusOf = (d: Doc): [string, Tone] => d.id === "D04" && booked ? ["Test booked Thu", "info"] : d.id === "D23" && s.done["docket1049"] ? ["Requested", "info"] : [d.status, d.tone];
  const cols: Col<Doc>[] = [
    { key: "title", label: "Document", render: (r) => <div><div style={{ color: "var(--ink)", fontWeight: 600 }}>{r.title}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{r.ref} · {r.version}</div></div> },
    { key: "cat", label: "Category" },
    { key: "owner", label: "Owner" },
    { key: "issued", label: "Issued" },
    { key: "expiry", label: "Expiry / review" },
    { key: "status", label: "Status", render: (r) => { const [t, tone] = statusOf(r); return <Pill tone={tone}>{t}</Pill>; } },
  ];
  return (
    <>
      <Head eyebrow="COMPLIANCE" title="Document library" sub="Permits, certificates, inspections, SOPs and dockets in one place, each linked to the vehicle, load or customer it covers." />
      <Toolbar right={<span style={{ fontSize: 12, color: "var(--faint)" }}>{n0(CATEGORIES.reduce((a, c) => a + c.count, 0))} records in Documents · showing key files</span>}>
        <SearchBox value={q} onChange={setQ} placeholder="Search title, reference, owner, linked record" />
      </Toolbar>
      <div style={{ marginBottom: 14 }}><Chips options={["All", ...cats]} value={cat} onChange={setCat} counts={counts} /></div>
      <Card pad={false} title={rows.length + (rows.length === 1 ? " document" : " documents")} sub={cat === "All" ? "All categories" : cat}>
        {rows.length ? <Table cols={cols} rows={rows} onRow={setSel} selected={sel?.id} /> : <Empty>No documents match. Try another category or search term.</Empty>}
      </Card>
      <Drawer open={!!sel} onClose={() => setSel(null)} width={600} title={sel?.title || ""} sub={sel ? sel.ref + " · " + sel.cat : ""}>
        {sel && (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{(() => { const [t, tone] = statusOf(sel); return <Pill tone={tone}>{t}</Pill>; })()}<Pill tone="neutral">{sel.version}</Pill></div>
            <div style={{ borderRadius: 16, border: "1px solid var(--border)", background: "var(--surface-2)", padding: "20px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10.5, letterSpacing: ".14em", color: "var(--faint)", fontWeight: 600 }}>BIA ENERGY LTD · HUNTSTOWN</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginTop: 6 }}>{sel.title}</div>
                </div>
                <span style={{ fontSize: 11.5, color: "var(--faint)", whiteSpace: "nowrap" }}>{sel.ref}</span>
              </div>
              <div style={{ marginTop: 14, fontSize: 13, color: "var(--body)", lineHeight: 1.6 }}>{sel.summary}</div>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 7 }}>
                {[92, 100, 84, 96, 61].map((w, i) => <div key={i} style={{ height: 6, width: w + "%", borderRadius: 4, background: "var(--track)" }} />)}
              </div>
            </div>
            <KV rows={[["Owner", sel.owner], ["Category", sel.cat], ["Issued", sel.issued], ["Expiry / review", sel.expiry], ["Version", sel.version], ["Stored in", "Documents"]]} />
            <Section title="Linked records">
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{sel.linked.map((l) => <Pill key={l} tone="accent">{l}</Pill>)}</div>
            </Section>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn onClick={() => toast("Opened in Documents", sel.title)}>Open in Documents</Btn>
              {sel.id === "D04" ? (booked ? <WriteBackBadge system="Calendar" /> : <Btn kind="primary" onClick={bookBia12}>Book inspection</Btn>)
                : sel.id === "D23" ? (s.done["docket1049"] ? <WriteBackBadge system="Email" /> : <Btn kind="primary" onClick={() => { markDone("docket1049"); toast("Sent via Email", "Signed docket WTD-58813 requested from the haulier for INT-1049"); }}>Request missing docket</Btn>)
                : sel.tone !== "ok" ? (s.done["doc-" + sel.id] ? <WriteBackBadge system="Email" /> : <Btn kind="primary" onClick={() => { markDone("doc-" + sel.id); toast("Sent via Email", "Renewal reminder sent to " + sel.owner + " for " + sel.title); }}>Send renewal reminder</Btn>)
                : null}
            </div>
          </>
        )}
      </Drawer>
    </>
  );
}

/* ---------------- Audits ---------------- */
function Audits() {
  const s = useBia();
  type A = (typeof ISO_AUDITS)[number] & { id: string };
  const cols: Col<A>[] = [
    { key: "std", label: "Standard", render: (r) => <div><div style={{ color: "var(--ink)", fontWeight: 600 }}>{r.std}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{r.scope}</div></div> },
    { key: "type", label: "Next audit type" },
    { key: "last", label: "Last audit" },
    { key: "result", label: "Last result" },
    { key: "next", label: "Next audit", render: (r) => <span style={{ color: "var(--ink)", fontWeight: 600 }}>{r.next}</span> },
    { key: "days", label: "In", align: "right", render: (r) => <Pill tone={r.days <= 30 ? "warn" : r.days <= 60 ? "info" : "neutral"}>{r.days} days</Pill> },
  ];
  const attended = TOOLBOX.reduce((a, t) => a + t.attended, 0), invited = TOOLBOX.reduce((a, t) => a + t.of, 0);
  return (
    <>
      <Head eyebrow="COMPLIANCE" title="Audits and inspections" sub="ISO 9001, 14001 and 45001 audit schedule, open non-conformances, internal health and safety inspections and toolbox talks." />
      <Kpis items={[
        { label: "ISO certifications", value: "3 of 3", sub: "9001, 14001, 45001 valid", tone: "ok", hero: true },
        { label: "Open non-conformances", value: NCS.filter((n) => !s.done["nc-" + n.id]).length, sub: "0 major" },
        { label: "Next external audit", value: "17 Nov", sub: "ISO 9001 and 14001 surveillance" },
        { label: "Site inspections, Sep", value: INSPECTIONS.length + " of 6", sub: "Average score " + Math.round(INSPECTIONS.reduce((a, i) => a + i.score, 0) / INSPECTIONS.length) + "%" },
        { label: "Toolbox attendance", value: Math.round((attended / invited) * 100) + "%", sub: TOOLBOX.length + " talks in September" },
      ]} />
      <Grid>
        <Card span={12} pad={false} title="ISO audit schedule" sub="External certification body and internal IMS audits">
          <Table cols={cols} rows={ISO_AUDITS.map((a) => ({ ...a, id: a.std }))} />
        </Card>
        <Card span={7} pad={false} title="Open non-conformances" sub="From the August internal audit and March surveillance">
          {NCS.map((n, i) => {
            const closed = s.done["nc-" + n.id];
            return (
              <ListRow key={n.id} first={i === 0} tone={closed ? "ok" : n.grade === "Minor" ? "warn" : "info"} title={<>{n.id} · {n.title}</>}
                sub={<>{n.std} · {n.grade} · Owner {n.owner} · Due {n.due}</>}
                right={closed ? <WriteBackBadge system="Documents" /> : <><Pill tone={n.status === "In progress" ? "info" : "neutral"}>{n.status}</Pill><Btn small onClick={() => { markDone("nc-" + n.id); toast("Updated in Documents", n.id + " evidence filed and closed."); }}>Close with evidence</Btn></>} />
            );
          })}
        </Card>
        <Card span={5} title="Internal H&S inspections" sub="Monthly area inspections, September">
          {INSPECTIONS.map((i) => <HRow key={i.area} label={i.area} sub={i.last} value={i.score - 80} max={20} display={i.score + "%"} tone={i.score >= 97 ? "accent" : "info"} />)}
        </Card>
        <Card span={7} title="Toolbox talks" sub="September · signed attendance from Timesheets / HR"
          right={s.done["toolbox"] ? <WriteBackBadge system="Calendar" /> : <Btn small kind="primary" onClick={() => { markDone("toolbox"); toast("Updated in Calendar", "Toolbox talk booked Mon 5 Oct 06:15: pedestrian routes at the weighbridge."); }}>Schedule next talk</Btn>}>
          <Timeline items={TOOLBOX.map((t) => ({ time: t.date.split(" ").slice(1).join(" "), who: t.group, text: <>{t.topic} <span style={{ color: "var(--faint)" }}>· {t.attended} of {t.of} signed</span></>, tone: t.attended === t.of ? "ok" : "accent" }))} />
        </Card>
        <Card span={5} title="Audit readiness" sub="ISO 9001 and 14001 surveillance, 17 Nov">
          <HRow label="Evidence records linked" value={s.done["exp-iso"] ? 42 : 31} max={48} display={(s.done["exp-iso"] ? 42 : 31) + " of 48"} />
          <HRow label="Non-conformances closed" value={NCS.filter((n) => s.done["nc-" + n.id]).length + 4} max={7} display={NCS.filter((n) => s.done["nc-" + n.id]).length + 4 + " of 7"} tone="info" />
          <HRow label="Management review minutes" value={1} max={1} display="Filed" tone="ok" />
          <div style={{ marginTop: 10 }}><Note tone="info">Pulse builds the evidence pack from Documents, Weighbridge and Timesheets / HR records. Owners: Larissa Franca (9001, 14001), Ricarte Nazerenco (45001).</Note></div>
        </Card>
      </Grid>
    </>
  );
}

/* ---------------- Expiries ---------------- */
function Expiries() {
  const { isDone, act } = useExpiryAction();
  const [cat, setCat] = useState("All");
  const [win, setWin] = useState("90 days");
  const limit = win === "30 days" ? 30 : win === "60 days" ? 60 : 90;
  const cats = ["All", ...Array.from(new Set(EXPIRY_LIST.map((e) => e.cat)))];
  const counts: Record<string, number> = { All: EXPIRY_LIST.length };
  cats.slice(1).forEach((c) => { counts[c] = EXPIRY_LIST.filter((e) => e.cat === c).length; });
  const rows = EXPIRY_LIST.filter((e) => e.days <= limit && (cat === "All" || e.cat === cat));
  const actioned = EXPIRY_LIST.filter(isDone).length;
  const lanes: Record<number, number> = {};
  const months = [["Oct", 2], ["Nov", 33], ["Dec", 63]] as [string, number][];
  return (
    <>
      <Head eyebrow="COMPLIANCE" title="Expiry calendar" sub="Every certificate, test, calibration and licence expiring in the next 90 days. Each action books or requests the renewal and writes it back." />
      <Kpis items={[
        { label: "Expiring in 90 days", value: EXPIRY_LIST.length, sub: "Across Fleet, People, Plant and more" },
        { label: "Within 7 days", value: EXPIRY_LIST.filter((e) => e.days <= 7 && !isDone(e)).length, sub: "Need action this week", tone: "bad" },
        { label: "Within 30 days", value: EXPIRY_LIST.filter((e) => e.days <= 30).length, tone: "warn" },
        { label: "Actioned", value: actioned + " of " + EXPIRY_LIST.length, sub: "Booked or requested", tone: "ok", hero: true },
      ]} />
      <Card title="Next 90 days" sub={"From " + dateIn(0) + " to " + dateIn(90)}>
        <div style={{ position: "relative", height: 92, margin: "4px 6px 0" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 64, height: 2, background: "var(--border-strong)", borderRadius: 2 }} />
          {[0, 7, 30, 60, 90].map((d) => (
            <div key={d} style={{ position: "absolute", left: (d / 90) * 100 + "%", top: 70, transform: "translateX(-50%)", fontSize: 10.5, color: "var(--faint)", whiteSpace: "nowrap" }}>{d === 0 ? "Today" : d + "d"}</div>
          ))}
          {months.map(([m, d]) => (
            <div key={m} style={{ position: "absolute", left: (d / 90) * 100 + "%", top: 0, bottom: 28, borderLeft: "1px dashed var(--border)", paddingLeft: 5, fontSize: 10.5, color: "var(--faint)" }}>{m}</div>
          ))}
          {EXPIRY_LIST.map((e) => {
            const bucket = Math.round(e.days / 3);
            const lane = (lanes[bucket] = (lanes[bucket] ?? -1) + 1);
            const tone = isDone(e) ? "ok" : urgency(e.days);
            return <span key={e.id} title={e.item + " · " + dateIn(e.days)} style={{ position: "absolute", left: `calc(${(e.days / 90) * 100}% - 5px)`, top: 54 - lane * 13, width: 10, height: 10, borderRadius: 10, background: toneColor[tone], boxShadow: "0 0 0 2px var(--surface)" }} />;
          })}
        </div>
      </Card>
      <div style={{ height: 14 }} />
      <Toolbar right={<Segmented options={["30 days", "60 days", "90 days"]} value={win} onChange={setWin} />}>
        <Chips options={cats} value={cat} onChange={setCat} counts={counts} />
      </Toolbar>
      <Card pad={false} title={rows.length + " items"} sub="Sorted by date · tone shows urgency">
        {rows.length === 0 && <Empty>Nothing expiring in this window.</Empty>}
        {rows.map((e, i) => {
          const done = isDone(e);
          return (
            <ListRow key={e.id} first={i === 0} tone={done ? "ok" : urgency(e.days)}
              lead={<div style={{ width: 54, flex: "none", textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 600, color: done ? "var(--ok)" : toneColor[urgency(e.days)], fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{e.days}</div><div style={{ fontSize: 10.5, color: "var(--faint)", marginTop: 3 }}>{e.days === 1 ? "day" : "days"}</div></div>}
              title={e.item} sub={<>{e.cat} · {dateIn(e.days)}{done && <> · <span style={{ color: "var(--dim)" }}>{e.write}</span></>}</>}
              right={done ? <WriteBackBadge system={e.system} /> : <Btn small kind={e.days <= 7 ? "primary" : "ghost"} onClick={() => act(e)}>{e.id === "bia12" ? "Book inspection" : e.action}</Btn>} />
          );
        })}
      </Card>
    </>
  );
}
