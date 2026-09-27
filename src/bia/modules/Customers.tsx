import { useMemo, useState, type ReactNode } from "react";
import type { ModProps } from "../Module";
import { bulk204, decide, markDone, toast, useBia } from "../store";
import { CUSTOMERS, TODAY, WEEK, type Customer, type Tone } from "../story";
import { AgentNote, Btn, Card, Donut, Empty, Grid, Head, KV, Kpis, Page, Pill, SERIES, SearchBox, Segmented, Spark, Table, WriteBackBadge, type Col } from "../ui";
import { Chips, HRow, ListRow, Note, Toolbar, n0 } from "./customers/bits";
import { ISSUES, REQUESTS, SECTORS, SITES, SITE_TOTAL, SLA, YTD_TOTAL, byName, jobsFor, type Issue, type Site } from "./customers/data";
import CustomerRecord from "./customers/Record";

type Open = { name: string; tab?: string } | null;
type OpenFn = (name: string, tab?: string) => void;

export default function Customers({ tab, setTab, go }: ModProps) {
  const [open, setOpen] = useState<Open>(null);
  const openRec: OpenFn = (name, t) => setOpen({ name, tab: t });
  let body;
  switch (tab) {
    case "Accounts": body = <Accounts onOpen={openRec} />; break;
    case "Sites": body = <Sites onOpen={openRec} />; break;
    case "Service": body = <Service onOpen={openRec} />; break;
    case "Issues": body = <Issues onOpen={openRec} go={go} />; break;
    default: body = <Overview onOpen={openRec} setTab={setTab} go={go} />;
  }
  return (
    <Page>
      {body}
      <CustomerRecord customer={open ? byName(open.name) || null : null} initialTab={open?.tab} onClose={() => setOpen(null)} go={go} />
    </Page>
  );
}

const statusLabel = (c: Customer) => (c.status === "Watch" ? "Active (watch)" : c.status);
const statusToneOf = (c: Customer): Tone => (c.status === "Watch" ? "warn" : c.status === "Onboarding" ? "info" : "ok");

function useOpenIssues() {
  const s = useBia();
  return ISSUES.filter((i) => !s.done["reply-" + i.id]).length;
}

/* ---------------- Overview ---------------- */
function Overview({ onOpen, setTab, go }: { onOpen: OpenFn; setTab: (t: string) => void; go: (p: string, t?: string) => void }) {
  const s = useBia();
  const b = bulk204(s);
  const openIssues = useOpenIssues();
  const active = CUSTOMERS.filter((c) => c.status !== "Onboarding").length;
  const sectors = SECTORS.map((sec) => {
    const list = CUSTOMERS.filter((c) => c.industry === sec);
    return { sec, t: list.reduce((a, c) => a + c.ytd, 0), n: list.length };
  });
  const maxT = Math.max(...sectors.map((x) => x.t));
  const top = [...CUSTOMERS].sort((a, z) => z.ytd - a.ytd).slice(0, 6);
  const reportsSent = s.done["q3reports"];

  const topCols: Col<Customer & { id: string }>[] = [
    { key: "name", label: "Account", render: (r) => <div><div style={{ color: "var(--ink)", fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{r.industry}</div></div> },
    { key: "ytd", label: "YTD tonnes", w: "34%", render: (r) => (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 60, height: 6, borderRadius: 9, background: "var(--track)", overflow: "hidden" }}><div style={{ height: "100%", width: (r.ytd / top[0].ytd) * 100 + "%", background: "var(--accent)", borderRadius: 9 }} /></div>
        <span style={{ color: "var(--ink)", fontWeight: 600, minWidth: 54, textAlign: "right" }}>{n0(r.ytd)} t</span>
      </div>) },
    { key: "freq", label: "Frequency" },
    { key: "status", label: "Status", render: (r) => <Pill tone={statusToneOf(r)}>{statusLabel(r)}</Pill> },
  ];

  const attention: { name: string; tone: Tone; title: string; sub: string; right?: ReactNode; tab?: string }[] = [
    { name: "FreshFields Foods", tone: b.moved ? "info" : "bad", title: "FreshFields Foods · BULK-204",
      sub: b.moved ? "Reassigned to BIA-14. ETA 14:37 (+27 min). Customer notified via Email." : "BIA-07 hydraulic fault. 18.6 t bulk collection slipping +42 min. Reassignment to BIA-14 ready.",
      right: b.moved ? <Pill tone="info">Recovered</Pill> : <Btn small kind="primary" onClick={() => decide("reassign204", "approved", "BULK-204 reassigned to BIA-14. ETA +27 min sent to Orla Keane.")}>Approve</Btn> },
    { name: "Boyne Valley Dairies", tone: "bad", title: "Boyne Valley Dairies · TNK-044", sub: "19.8 t tanker lift at Drogheda has no compatible tanker free. Manual review.", right: <Btn small onClick={() => go("Collections", "Exceptions")}>Review</Btn> },
    { name: "Liffey Hospitality Group", tone: "warn", title: "Liffey Hospitality Group · Temple Bar", sub: "Lift missed Monday. Rebooked today as COL-1846, 15:30.", tab: "Sites" },
    { name: "GreenMart", tone: "warn", title: "GreenMart · Lucan", sub: "Plastics in food bins on three lifts this month. Contamination 3.8% across the account.", tab: "Sites" },
  ];

  return (
    <>
      <Head eyebrow="CUSTOMERS" title="Customer accounts"
        sub="Waste streams, collections, tonnes and sustainability reporting for every account, from store bins to bulk pallets and tankers."
        right={<><Btn onClick={() => setTab("Issues")}>Open issues</Btn><Btn kind="primary" onClick={() => setTab("Accounts")}>All accounts</Btn></>} />
      <Kpis items={[
        { label: "Active accounts", value: active, sub: "2 on watch · 1 onboarding" },
        { label: "Customer sites", value: SITE_TOTAL, sub: "Across 7 sectors" },
        { label: "YTD tonnes", value: n0(YTD_TOTAL) + " t", sub: "Key accounts, Jan–Sep", hero: true, tone: "accent" },
        { label: "Collections this week", value: WEEK.collections, sub: n0(WEEK.collectedT) + " t collected" },
        { label: "SLA this week", value: WEEK.sla + "%", sub: "On-time collections", tone: "ok" },
        { label: "Open issues", value: openIssues, sub: openIssues ? "Replies drafted by Pulse" : "All replied", tone: openIssues ? "warn" : "ok" },
      ]} />
      <Grid>
        <Card span={7} title="Tonnes by sector" sub="Year to date, key accounts">
          <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
            <Donut size={150} parts={sectors.filter((x) => x.t > 0).map((x, i) => ({ v: x.t, c: SERIES[i % SERIES.length] }))} label={n0(YTD_TOTAL)} sub="tonnes YTD" />
            <div style={{ flex: 1, minWidth: 240 }}>
              {sectors.map((x, i) => (
                <HRow key={x.sec} label={x.sec} sub={x.n + (x.n === 1 ? " account" : " accounts")} value={x.t} max={maxT} color={SERIES[i % SERIES.length]}
                  display={x.t > 0 ? n0(x.t) + " t" : <span style={{ color: "var(--dim)", fontWeight: 500 }}>Digestate offtake</span>} />
              ))}
            </div>
          </div>
        </Card>
        <Card span={5} pad={false} title="Accounts needing attention" sub="Pulse watches every live job against each account">
          {attention.map((a, i) => (
            <ListRow key={a.title} first={i === 0} tone={a.tone} title={a.title} sub={a.sub} onClick={() => onOpen(a.name, a.tab)}
              right={a.right ? <span onClick={(e) => e.stopPropagation()}>{a.right}</span> : undefined} />
          ))}
        </Card>
        <Card span={7} pad={false} title="Top accounts" sub="By tonnes collected, Jan–Sep 2026" right={<Btn small onClick={() => setTab("Accounts")}>View all 12</Btn>}>
          <Table cols={topCols} rows={top.map((c) => ({ ...c, id: c.name }))} onRow={(r) => onOpen(r.name)} />
        </Card>
        <Card span={5} title="Customer reporting" sub="Q3 2026 · Jan–Sep reporting period">
          <HRow label="Sustainability reports generated" value={11} max={11} display="11 of 11" />
          <HRow label="Reports sent" value={reportsSent ? 11 : 3} max={11} display={(reportsSent ? 11 : 3) + " of 11"} tone={reportsSent ? "ok" : "accent"} />
          <HRow label="Automatic ETA updates sent this week" value={42} max={60} display="42" tone="info" />
          <div style={{ marginTop: 12 }}>
            {reportsSent ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><WriteBackBadge system="Email" /><span style={{ fontSize: 12.5, color: "var(--dim)" }}>8 Q3 reports sent to sustainability contacts.</span></div>
            ) : (
              <AgentNote agent="Dispatch Agent" actions={<Btn kind="primary" small onClick={() => { markDone("q3reports"); toast("Sent via Email", "Q3 sustainability reports sent to 8 accounts"); }}>Send 8 reports</Btn>}>
                Q3 reports are built from weighbridge and plant data. 8 are ready to go to each account's sustainability contact.
              </AgentNote>
            )}
          </div>
        </Card>
      </Grid>
    </>
  );
}

/* ---------------- Accounts ---------------- */
type AccRow = Customer & { id: string; onTime: number; today: number };
function Accounts({ onOpen }: { onOpen: OpenFn }) {
  const s = useBia();
  const b = bulk204(s);
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("All");
  const [status, setStatus] = useState("All");
  const all: AccRow[] = CUSTOMERS.map((c) => ({ ...c, id: c.name, onTime: SLA[c.name].onTime, today: jobsFor(c.name).length }));
  const rows = all.filter((c) =>
    (sector === "All" || c.industry === sector) &&
    (status === "All" || c.status === status) &&
    (!q || (c.name + " " + c.town + " " + c.contact + " " + c.industry).toLowerCase().includes(q.toLowerCase())));
  const counts: Record<string, number> = { All: all.length };
  SECTORS.forEach((x) => { counts[x] = all.filter((c) => c.industry === x).length; });

  const cols: Col<AccRow>[] = [
    { key: "name", label: "Account", render: (r) => <div><div style={{ color: "var(--ink)", fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{r.town}</div></div> },
    { key: "industry", label: "Sector" },
    { key: "status", label: "Status", render: (r) => <Pill tone={statusToneOf(r)}>{statusLabel(r)}</Pill> },
    { key: "sites", label: "Sites", align: "right" },
    { key: "freq", label: "Frequency" },
    { key: "today", label: "Today", align: "right", render: (r) => (r.today ? r.today + " jobs" : "None") },
    { key: "ytd", label: "YTD", align: "right", render: (r) => <span style={{ color: "var(--ink)", fontWeight: 600 }}>{r.ytd ? n0(r.ytd) + " t" : "Digestate"}</span> },
    { key: "onTime", label: "On time", align: "right", render: (r) => <span style={{ color: r.onTime >= SLA[r.name].target ? "var(--ok)" : "var(--warn)" }}>{r.onTime}%</span> },
    { key: "contact", label: "Contact" },
    { key: "issue", label: "Current issue", render: (r) => r.name === "FreshFields Foods" ? <Pill tone={b.moved ? "info" : "warn"}>{b.moved ? "BULK-204 " + b.delay + ", notified" : "BULK-204 delay"}</Pill> : r.issue ? <Pill tone="bad">{r.issue}</Pill> : <span style={{ color: "var(--faint)" }}>None</span> },
  ];
  return (
    <>
      <Head eyebrow="CUSTOMERS" title="Accounts" sub="Every account with its sector, service level and live jobs. Select one for the full customer record." />
      <Toolbar right={<Segmented options={["All", "Active", "Watch", "Onboarding"]} value={status} onChange={setStatus} />}>
        <SearchBox value={q} onChange={setQ} placeholder="Search accounts, towns, contacts" />
      </Toolbar>
      <div style={{ marginBottom: 14 }}><Chips options={["All", ...SECTORS]} value={sector} onChange={setSector} counts={counts} /></div>
      <Card pad={false} title={rows.length + (rows.length === 1 ? " account" : " accounts")} sub={n0(rows.reduce((a, c) => a + c.ytd, 0)) + " t collected YTD · " + rows.reduce((a, c) => a + c.sites, 0) + " sites"}>
        {rows.length ? <Table cols={cols} rows={rows} onRow={(r) => onOpen(r.name)} /> : <Empty>No accounts match. Clear the search or pick another sector.</Empty>}
      </Card>
    </>
  );
}

/* ---------------- Sites ---------------- */
function Sites({ onOpen }: { onOpen: OpenFn }) {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("All");
  const [only, setOnly] = useState("All sites");
  const sectorOf = (x: Site) => byName(x.customer)?.industry || "";
  const rows = SITES.filter((x) =>
    (sector === "All" || sectorOf(x) === sector) &&
    (only === "All sites" || (only === "Due today" ? x.next.startsWith("Today") : !!x.flag)) &&
    (!q || (x.customer + " " + x.name + " " + x.containers + " " + x.access).toLowerCase().includes(q.toLowerCase())));
  const counts: Record<string, number> = { All: SITES.length };
  SECTORS.forEach((sec) => { counts[sec] = SITES.filter((x) => sectorOf(x) === sec).length; });
  const containers = SITES.reduce((a, x) => a + x.count, 0);
  const dueToday = SITES.filter((x) => x.next.startsWith("Today")).length;
  const flagged = SITES.filter((x) => x.flag).length;

  const cols: Col<Site>[] = [
    { key: "name", label: "Site", render: (r) => <div><div style={{ color: "var(--ink)", fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{r.customer}</div></div> },
    { key: "containers", label: "Containers", render: (r) => <div><div>{r.containers}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{r.count} {r.count === 1 ? "unit" : "units"}</div></div> },
    { key: "schedule", label: "Schedule" },
    { key: "last", label: "Last collection", render: (r) => <span style={{ color: r.last.startsWith("Today") ? "var(--ok)" : "var(--body)" }}>{r.last}</span> },
    { key: "next", label: "Next collection", render: (r) => <span style={{ color: r.next.startsWith("Today") ? "var(--accent)" : "var(--body)", fontWeight: r.next.startsWith("Today") ? 600 : 400 }}>{r.next}</span> },
    { key: "access", label: "Access notes", render: (r) => <div style={{ whiteSpace: "normal", minWidth: 240, maxWidth: 340, fontSize: 12.5, color: "var(--dim)", lineHeight: 1.4 }}>{r.access}</div> },
    { key: "flag", label: "", render: (r) => (r.flag ? <Pill tone={r.flagTone}>{r.flag}</Pill> : null) },
  ];
  return (
    <>
      <Head eyebrow="CUSTOMERS" title="Customer sites" sub="Every collection point with its containers, schedule and access notes. Drivers see the same notes in the driver app." />
      <Kpis items={[
        { label: "Customer sites", value: SITES.length, sub: "12 accounts" },
        { label: "Containers on site", value: n0(containers), sub: "Bins, Dolavs, tanks, pallet bays" },
        { label: "Collections due today", value: dueToday, sub: TODAY.collections + " jobs on today's plan", hero: true, tone: "accent" },
        { label: "Sites flagged", value: flagged, sub: "Delay, missed lift, contamination, onboarding", tone: "warn" },
      ]} />
      <Toolbar right={<Segmented options={["All sites", "Due today", "Flagged"]} value={only} onChange={setOnly} />}>
        <SearchBox value={q} onChange={setQ} placeholder="Search sites, accounts, access notes" />
      </Toolbar>
      <div style={{ marginBottom: 14 }}><Chips options={["All", ...SECTORS]} value={sector} onChange={setSector} counts={counts} /></div>
      <Card pad={false} title={rows.length + (rows.length === 1 ? " site" : " sites")} sub="Select a site to open its customer record">
        {rows.length ? <Table cols={cols} rows={rows} onRow={(r) => onOpen(r.customer, "Sites")} /> : <Empty>No sites match these filters.</Empty>}
      </Card>
    </>
  );
}

/* ---------------- Service ---------------- */
type SlaRow = { id: string; name: string; industry: string; target: number; onTime: number; missed: number; contamination: number; lifts: number; trend: number[] };
function Service({ onOpen }: { onOpen: OpenFn }) {
  const s = useBia();
  const rows: SlaRow[] = CUSTOMERS.map((c) => ({ id: c.name, name: c.name, industry: c.industry, ...SLA[c.name] }));
  const missed = rows.reduce((a, r) => a + r.missed, 0);
  const lifts = rows.reduce((a, r) => a + r.lifts, 0);
  const contam = rows.filter((r) => r.contamination > 0);
  const avgContam = Math.round((contam.reduce((a, r) => a + r.contamination * r.lifts, 0) / contam.reduce((a, r) => a + r.lifts, 0)) * 10) / 10;
  const pending = REQUESTS.filter((r) => !s.done["sr-" + r.id] && !s.done["sr-x-" + r.id]).length;

  const cols: Col<SlaRow>[] = [
    { key: "name", label: "Account", render: (r) => <div><div style={{ color: "var(--ink)", fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{r.industry}</div></div> },
    { key: "target", label: "SLA target", align: "right", render: (r) => r.target + "%" },
    { key: "onTime", label: "On time, 30 days", w: "22%", render: (r) => {
      const ok = r.onTime >= r.target;
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative", flex: 1, minWidth: 80, height: 6, borderRadius: 9, background: "var(--track)" }}>
            <div style={{ position: "absolute", inset: 0, width: ((r.onTime - 85) / 15) * 100 + "%", background: ok ? "var(--accent)" : "var(--warn)", borderRadius: 9 }} />
            <div title={"Target " + r.target + "%"} style={{ position: "absolute", top: -3, bottom: -3, left: ((r.target - 85) / 15) * 100 + "%", width: 2, background: "var(--ink)", opacity: 0.5 }} />
          </div>
          <span style={{ minWidth: 42, textAlign: "right", color: ok ? "var(--ink)" : "var(--warn)", fontWeight: 600 }}>{r.onTime}%</span>
        </div>);
    } },
    { key: "lifts", label: "Lifts", align: "right" },
    { key: "missed", label: "Missed", align: "right", render: (r) => <span style={{ color: r.missed ? "var(--bad)" : "var(--dim)" }}>{r.missed}</span> },
    { key: "contamination", label: "Contamination", align: "right", render: (r) => <Pill tone={r.contamination >= 3 ? "bad" : r.contamination >= 2 ? "warn" : "ok"}>{r.contamination.toFixed(1)}%</Pill> },
    { key: "trend", label: "6-week trend", render: (r) => <Spark data={r.trend} w={90} h={24} tone={r.onTime >= r.target ? "accent" : "warn"} /> },
  ];

  return (
    <>
      <Head eyebrow="CUSTOMERS" title="Service levels" sub="On-time performance, missed collections and contamination per account, with service requests waiting on a decision." />
      <Kpis items={[
        { label: "SLA this week", value: WEEK.sla + "%", sub: WEEK.collections + " collections", hero: true, tone: "accent" },
        { label: "On time today", value: TODAY.onTime + "%", sub: TODAY.complete + " of " + TODAY.collections + " complete" },
        { label: "Lifts, 30 days", value: n0(lifts), sub: "All accounts" },
        { label: "Missed collections", value: missed, sub: "Last 30 days, both rebooked", tone: missed ? "warn" : "ok" },
        { label: "Contamination", value: avgContam + "%", sub: "Weighted by lifts" },
        { label: "Service requests", value: pending, sub: pending ? "Awaiting approval" : "All decided", tone: pending ? "warn" : "ok" },
      ]} />
      <Grid>
        <Card span={12} pad={false} title="Service level by account" sub="Last 30 days · marker shows each account's SLA target">
          <Table cols={cols} rows={rows} onRow={(r) => onOpen(r.name)} />
        </Card>
        <Card span={7} pad={false} title="Service requests" sub="Approving writes the change back to the system that owns it">
          {REQUESTS.map((r, i) => {
            const ok = s.done["sr-" + r.id], no = s.done["sr-x-" + r.id];
            return (
              <ListRow key={r.id} first={i === 0} tone={ok ? "ok" : no ? "neutral" : "warn"}
                title={<>{r.kind} · {r.customer} <span style={{ color: "var(--faint)", fontWeight: 500 }}>{r.site}</span></>}
                sub={<>{r.id} · {r.detail} · Requested {r.when}{ok && <div style={{ marginTop: 4, color: "var(--dim)" }}>{r.write}</div>}</>}
                right={ok ? <WriteBackBadge system={r.system} /> : no ? <Pill tone="neutral">Declined</Pill> : <>
                  <Btn small onClick={() => { markDone("sr-x-" + r.id); toast("Declined. Nothing was changed.", r.customer + " will get a reply from the logistics desk."); }}>Decline</Btn>
                  <Btn small kind="primary" onClick={() => { markDone("sr-" + r.id); toast("Updated in " + r.system, r.write); }}>Approve</Btn>
                </>} />
            );
          })}
        </Card>
        <Card span={5} title="Contamination watch" sub="Share of lifts with non-food items, 30 days">
          {[...rows].filter((r) => r.contamination > 0).sort((a, z) => z.contamination - a.contamination).slice(0, 6).map((r) => (
            <HRow key={r.name} label={r.name} value={r.contamination} max={5} display={r.contamination.toFixed(1) + "%"} tone={r.contamination >= 3 ? "bad" : r.contamination >= 2 ? "warn" : "accent"} />
          ))}
          <div style={{ marginTop: 12 }}>
            {s.done["lucan-guide"] ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><WriteBackBadge system="Email" /><span style={{ fontSize: 12.5, color: "var(--dim)" }}>Bin guide and stickers sent to Úna Brady, GreenMart.</span></div>
            ) : (
              <AgentNote agent="Dispatch Agent" actions={<Btn small kind="primary" onClick={() => { markDone("lucan-guide"); toast("Sent via Email", "Bin guide and sticker order sent to Úna Brady, GreenMart"); }}>Send bin guide</Btn>}>
                GreenMart Lucan drives most of the account's contamination. A bin guide and lid stickers for the store team usually brings it under 2% within a month.
              </AgentNote>
            )}
          </div>
        </Card>
      </Grid>
    </>
  );
}

/* ---------------- Issues ---------------- */
function replyFor(i: Issue, moved: boolean, accepted: boolean): string {
  if (i.id === "ISS-311") return moved
    ? "Hi Orla, BIA-07 developed a hydraulic fault at 12:34 and has been taken off the road. BULK-204 is now on BIA-14 with the same driver, Marek Kowalski, and will arrive at Naas at about 14:37, 27 minutes later than planned. Dock 4 will be clear well before your 16:00 inbound. Dragos, Bia Energy logistics"
    : "Hi Orla, the truck due for BULK-204 has a hydraulic fault and is off the road. We are moving the collection to a replacement vehicle now and will confirm the new arrival time shortly. Current estimate is 14:52. Dock 4 will be clear before your 16:00 inbound. Dragos, Bia Energy logistics";
  if (i.id === "ISS-310") return accepted
    ? "Hi Brian, the review is complete. The load weighed 37.42 t gross and 18.15 t tare at Huntstown, 19.27 t net, and the pallet count matches your dispatch note, so the difference is in product weight rather than volume. The September invoice line has been updated to 19.27 t. The weighbridge ticket and docket WTD-58812 are attached. Natalia Biancha, Weighbridge"
    : "Hi Brian, thanks for flagging. The load weighed 37.42 t gross and 18.15 t tare at Huntstown, 19.27 t net. Our weighbridge team is checking it against the pallet count and your dispatch note now. The September invoice holds the line at 17.57 t until the review closes, and we will send the ticket and docket WTD-58812 with the outcome. Natalia Biancha, Weighbridge";
  return i.reply;
}

function Issues({ onOpen, go }: { onOpen: OpenFn; go: (p: string, t?: string) => void }) {
  const s = useBia();
  const b = bulk204(s);
  const accepted = s.approvals.int1048 === "approved";
  const [sel, setSel] = useState(ISSUES[0].id);
  const [edit, setEdit] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const issue = ISSUES.find((i) => i.id === sel) || ISSUES[0];
  const suggested = replyFor(issue, b.moved, accepted);
  const draft = drafts[issue.id] ?? suggested;
  const replied = (id: string) => !!s.done["reply-" + id];
  const open = ISSUES.filter((i) => !replied(i.id)).length;
  const contact = byName(issue.customer);
  const to = issue.id === "ISS-310" ? "Brian Tully" : issue.id === "ISS-305" ? "Úna Brady" : issue.id === "ISS-302" ? "Gavin Roche" : contact?.contact || "";
  const byKind = useMemo(() => {
    const m: Record<string, number> = {};
    ISSUES.forEach((i) => { m[i.kind] = (m[i.kind] || 0) + 1; });
    return m;
  }, []);

  const statusOf = (i: Issue) => {
    if (replied(i.id)) return <Pill tone="ok">Replied</Pill>;
    if (i.id === "ISS-311" && b.moved) return <Pill tone="info">Customer notified</Pill>;
    if (i.id === "ISS-310" && accepted) return <Pill tone="info">Review closed</Pill>;
    return <Pill tone={i.tone === "bad" ? "bad" : "warn"}>Open</Pill>;
  };

  return (
    <>
      <Head eyebrow="CUSTOMERS" title="Customer issues" sub="Delays, weight queries, missed lifts, contamination and invoice queries. Pulse links each one to the job, docket or invoice and drafts the reply." />
      <Kpis items={[
        { label: "Open issues", value: open, sub: open ? "Replies drafted" : "All replied", tone: open ? "warn" : "ok", hero: true },
        { label: "Replied today", value: ISSUES.length - open, sub: "Sent via Email" },
        { label: "Median first response", value: "38 min", sub: "Last 30 days" },
        { label: "Oldest open", value: replied("ISS-302") ? (replied("ISS-305") ? "1 day" : "2 days") : "3 days", sub: replied("ISS-302") ? "Next oldest" : "CityFresh invoice query" },
        { label: "By type", value: Object.keys(byKind).length, sub: Object.keys(byKind).join(", ") },
      ]} />
      <Grid>
        <Card span={5} pad={false} title="Issues" sub={ISSUES.length + " this week · newest first"}>
          {ISSUES.map((i, k) => (
            <div key={i.id} style={{ background: i.id === sel ? "var(--accent-faint)" : undefined, boxShadow: i.id === sel ? "inset 2px 0 0 var(--accent)" : undefined }}>
              <ListRow first={k === 0} tone={replied(i.id) ? "ok" : i.tone} onClick={() => { setSel(i.id); setEdit(false); }}
                title={i.title} sub={<>{i.customer} · {i.site}<br />{i.owner} · {i.age}</>} right={statusOf(i)} />
            </div>
          ))}
        </Card>
        <Card span={7} title={<>{issue.id} · {issue.title}</>} sub={issue.customer + " · " + issue.site} right={statusOf(issue)}>
          <KV cols={3} rows={[["Type", issue.kind], ["Owner", issue.owner], ["Opened", issue.opened], ["Age", issue.age], ["Channel", issue.channel], ["Linked", issue.linked.join(", ")]]} />
          <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11, color: "var(--faint)", marginBottom: 6 }}>{issue.channel === "Driver app" ? "Driver report" : "From the customer"}</div>
            <div style={{ fontSize: 13.5, color: "var(--body)", lineHeight: 1.55 }}>“{issue.message}”</div>
          </div>
          {issue.id === "ISS-311" && !b.moved && (
            <div style={{ marginTop: 12 }}><Note tone="warn">The reply gets a firm ETA once BULK-204 is reassigned to BIA-14. <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }} onClick={() => decide("reassign204", "approved", "BULK-204 reassigned to BIA-14. ETA +27 min sent to Orla Keane.")}>Approve reassignment</span></Note></div>
          )}
          {issue.id === "ISS-310" && !accepted && (
            <div style={{ marginTop: 12 }}><Note tone="warn">Weighbridge review for INT-1048 is still open. <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }} onClick={() => go("Plant", "Weighbridge")}>Open in Plant</span></Note></div>
          )}
          <div style={{ marginTop: 14 }}>
            {replied(issue.id) ? (
              <div style={{ padding: "12px 14px", borderRadius: 14, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}><WriteBackBadge system="Email" /><span style={{ fontSize: 12, color: "var(--faint)" }}>Sent to {to}</span></div>
                <div style={{ fontSize: 13, color: "var(--dim)", lineHeight: 1.55 }}>{draft}</div>
              </div>
            ) : (
              <AgentNote agent={"Dispatch Agent · suggested reply to " + to}
                actions={<>
                  <Btn kind="primary" small onClick={() => { markDone("reply-" + issue.id); setEdit(false); toast("Sent via Email", "Reply to " + to + ", " + issue.customer); }}>Send</Btn>
                  <Btn small onClick={() => setEdit(!edit)}>{edit ? "Done editing" : "Edit"}</Btn>
                  <Btn small onClick={() => onOpen(issue.customer, issue.kind === "Invoice query" || issue.kind === "Weight query" ? "Billing" : "Activity")}>Customer record</Btn>
                </>}>
                {edit ? (
                  <textarea value={draft} onChange={(e) => setDrafts({ ...drafts, [issue.id]: e.target.value })} rows={6}
                    style={{ width: "100%", boxSizing: "border-box", padding: 10, borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--ink)", fontFamily: "inherit", fontSize: 13, lineHeight: 1.5, resize: "vertical" }} />
                ) : draft}
              </AgentNote>
            )}
          </div>
        </Card>
      </Grid>
    </>
  );
}
