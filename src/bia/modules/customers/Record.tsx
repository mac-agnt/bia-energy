import { useEffect, useState } from "react";
import { bulk204, decide, markDone, toast, useBia } from "../../store";
import { INTAKE, type Customer, type Tone } from "../../story";
import { AgentNote, Bars, Btn, Card, Drawer, Grid, KV, Pill, Section, Segmented, Table, Timeline, WriteBackBadge, statusTone, type Col } from "../../ui";
import { Avatar, ListRow, Note, Stat, StatRow, eur, n0 } from "./bits";
import { CONTACTS, DOCS_FOR, FF_COLLECTIONS, META, SITES, SLA, invoicesFor, jobsFor, monthly, sustain } from "./data";

export const RECORD_TABS = ["Overview", "Collections", "Sites", "Contacts", "Documents", "Billing", "Sustainability", "Activity"];
const FF = "FreshFields Foods";

type CollRow = { id: string; date: string; site: string; type: string; vehicle: string; expected: number; actual?: number; status: string; variance?: string; tone?: Tone };

export default function CustomerRecord({ customer, initialTab, onClose, go }: { customer: Customer | null; initialTab?: string; onClose: () => void; go: (page: string, tab?: string) => void }) {
  const [tab, setTab] = useState("Overview");
  useEffect(() => { setTab(initialTab || "Overview"); }, [customer?.name, initialTab]);
  const s = useBia();
  const b = bulk204(s);
  if (!customer) return null;
  const c = customer;
  const ff = c.name === FF;
  const meta = META[c.name];
  const sla = SLA[c.name];
  const status = ff ? "Active (watch)" : c.status === "Watch" ? "Active (watch)" : c.status;

  return (
    <Drawer open={!!customer} onClose={onClose} width={760} title={c.name}
      sub={<span>{c.industry} · {c.town} · Customer since {meta.since} · Contract {meta.contract}</span>}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: -4 }}>
        <Pill tone={c.status === "Watch" ? "warn" : c.status === "Onboarding" ? "info" : "ok"}>{status}</Pill>
        {c.issue && <Pill tone={ff && b.moved ? "info" : "warn"}>{ff ? (b.moved ? "BULK-204 recovered " + b.delay : "BULK-204 delay " + b.delay) : c.issue}</Pill>}
        <span style={{ fontSize: 12, color: "var(--faint)" }}>Account owner {meta.owner}</span>
      </div>
      <div style={{ overflowX: "auto", paddingBottom: 2 }}>
        <Segmented options={RECORD_TABS} value={tab} onChange={setTab} />
      </div>
      {tab === "Overview" && <Overview c={c} go={go} setTab={setTab} />}
      {tab === "Collections" && <Collections c={c} go={go} />}
      {tab === "Sites" && <Sites c={c} />}
      {tab === "Contacts" && <Contacts c={c} />}
      {tab === "Documents" && <Documents c={c} />}
      {tab === "Billing" && <Billing c={c} />}
      {tab === "Sustainability" && <Sustainability c={c} />}
      {tab === "Activity" && <Activity c={c} />}
      {sla && tab === "Overview" && (
        <Note tone={sla.onTime >= sla.target ? "ok" : "warn"}>
          Service level last 30 days: {sla.onTime}% on time against a {sla.target}% target, {sla.lifts} lifts, {sla.missed} missed, contamination {sla.contamination}%.
        </Note>
      )}
    </Drawer>
  );
}

function Overview({ c, go, setTab }: { c: Customer; go: (p: string, t?: string) => void; setTab: (t: string) => void }) {
  const s = useBia();
  const b = bulk204(s);
  const ff = c.name === FF;
  const meta = META[c.name];
  const today = jobsFor(c.name);
  const dig = c.industry === "Agriculture";
  return (
    <>
      <StatRow>
        <Stat label="Sites" value={c.sites} />
        <Stat label="Collection frequency" value={c.freq} />
        <Stat label={dig ? "Digestate received YTD" : "YTD collected"} value={dig ? "1,840 t" : n0(c.ytd) + " t"} tone="accent" sub="Jan–Sep 2026" />
        <Stat label="Today" value={today.length + (today.length === 1 ? " job" : " jobs")} sub={today.filter((j) => j.status === "Complete").length + " complete"} />
      </StatRow>

      {ff && (
        <Card title="Current issue: BULK-204 delay" sub="Naas production facility · 18.6 t bulk packaged food on pallets" tone={b.moved ? undefined : "warn"}
          right={<Pill tone={b.moved ? "info" : "bad"}>{b.moved ? "En route" : "At risk"}</Pill>}>
          <KV cols={4} rows={[["Vehicle", b.vehicle], ["Original ETA", "14:10"], ["Current ETA", b.eta], ["Delay", b.delay]]} />
          <div style={{ marginTop: 14 }}>
            {b.moved ? (
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <WriteBackBadge system="Fleet System" />
                <WriteBackBadge system="Email" />
                <span style={{ fontSize: 12.5, color: "var(--dim)" }}>Reassigned to BIA-14. ETA +27 min. Customer notified, Orla Keane.</span>
              </div>
            ) : (
              <AgentNote agent="Logistics Agent" actions={<>
                <Btn kind="primary" small onClick={() => decide("reassign204", "approved", "BULK-204 reassigned to BIA-14. ETA +27 min sent to Orla Keane.")}>Approve reassignment to BIA-14</Btn>
                <Btn small onClick={() => go("Collections", "Live Jobs")}>Open in Collections</Btn>
              </>}>
                BIA-07 went off road at 12:34 with a hydraulic warning. BIA-14 is free at Huntstown after tipping INT-1048. Moving BULK-204 to BIA-14 cuts the delay from 42 to 27 minutes and I will send Orla the new ETA.
              </AgentNote>
            )}
          </div>
        </Card>
      )}
      {c.name === "Boyne Valley Dairies" && (
        <AgentNote agent="Logistics Agent" actions={<Btn small onClick={() => go("Collections", "Exceptions")}>Open exception</Btn>}>
          TNK-044 at Drogheda (19.8 t) has no compatible tanker free this afternoon. BIA-16 returns at 15:20 and could take it after wash-down, arriving about 17:10. Sinéad Kerr has been told the slot is under review.
        </AgentNote>
      )}

      <Grid cols="repeat(12,1fr)" gap={12}>
        <Card span={7} title={dig ? "Digestate delivered by month" : "Tonnes collected by month"} sub="2026, tonnes">
          <Bars data={dig ? [["Feb", 180], ["Mar", 420], ["Apr", 390], ["May", 210], ["Jun", 160], ["Jul", 120], ["Aug", 200], ["Sep", 160]] : monthly(c.ytd)} h={140} unit=" t" />
        </Card>
        <Card span={5} title="Account">
          <KV cols={1} rows={[["Industry", c.industry], ["Status", ff ? "Active (watch)" : c.status], ["Commercial basis", meta.basis], ["Contract renews", meta.renews], ["Main contact", c.contact]]} />
        </Card>
      </Grid>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Btn small onClick={() => setTab("Collections")}>Collections</Btn>
        <Btn small onClick={() => setTab("Sustainability")}>Sustainability report</Btn>
        <Btn small onClick={() => setTab("Activity")}>Activity</Btn>
      </div>
    </>
  );
}

function collectionRows(c: Customer, s: ReturnType<typeof useBia>): CollRow[] {
  const b = bulk204(s);
  if (c.name === FF) {
    const acc = s.approvals.int1048 === "approved";
    return [
      { id: "BULK-204", date: "Today", site: "Naas production facility", type: "Bulk Pallet", vehicle: b.vehicle, expected: 18.6, status: b.status, variance: "ETA " + b.eta + " (" + b.delay + ")" },
      { id: "BULK-201", date: "Today 12:46", site: "Naas production facility", type: "Bulk Pallet", vehicle: "BIA-14", expected: 17.57, actual: 19.27, status: acc ? "Accepted" : "Review", variance: "+1.70 t · INT-1048" },
      ...FF_COLLECTIONS.map((r) => ({ ...r, status: "Complete", variance: (r.actual - r.expected >= 0 ? "+" : "") + (r.actual - r.expected).toFixed(2) + " t" })),
    ];
  }
  const today: CollRow[] = jobsFor(c.name).map((j) => ({ id: j.id, date: "Today " + j.eta, site: j.site, type: j.type, vehicle: j.vehicle, expected: j.expected, actual: j.actual, status: j.status,
    variance: j.actual != null ? (j.actual - j.expected >= 0 ? "+" : "") + (j.actual - j.expected).toFixed(2) + " t" : undefined }));
  const sites = SITES.filter((x) => x.customer === c.name);
  if (c.industry === "Agriculture") {
    const del: CollRow[] = sites.slice(0, 4).map((x, i) => ({ id: "DEL-" + (298 - i * 4), date: x.last, site: x.name, type: "Customer Delivery", vehicle: "Haulier", expected: [22, 24, 22, 20][i], actual: [22.1, 23.8, 22.0, 20.2][i], status: "Complete", variance: "Digestate out" }));
    return [...today, ...del];
  }
  const past: CollRow[] = sites.slice(0, 4).map((x, i) => {
    const e = Math.max(0.8, Math.round(((c.ytd / 9 / 4 / Math.max(1, c.sites)) * (1 + i * 0.1)) * 10) / 10) || 1.2;
    return { id: (x.containers.includes("tank") ? "TNK-0" : x.containers.includes("Bulk") ? "BULK-1" : "COL-17") + (80 + i * 3), date: ["Mon 28 Sep", "Mon 28 Sep", "Fri 25 Sep", "Thu 24 Sep"][i], site: x.name,
      type: x.containers.includes("tank") ? "Tanker" : x.containers.includes("Dolav") ? "Dolav" : x.containers.includes("Bulk") ? "Bulk Pallet" : "Wheelie Bin", vehicle: ["BIA-02", "BIA-04", "BIA-06", "BIA-03"][i], expected: e, actual: e, status: "Complete", variance: "+0.00 t" };
  });
  return [...today, ...past];
}

function Collections({ c, go }: { c: Customer; go: (p: string, t?: string) => void }) {
  const s = useBia();
  const rows = collectionRows(c, s);
  const cols: Col<CollRow>[] = [
    { key: "id", label: "Job", render: (r) => <span style={{ color: "var(--ink)", fontWeight: 600 }}>{r.id}</span> },
    { key: "date", label: "When" },
    { key: "site", label: "Site" },
    { key: "vehicle", label: "Vehicle" },
    { key: "expected", label: "Expected", align: "right", render: (r) => r.expected.toFixed(2) + " t" },
    { key: "actual", label: "Net", align: "right", render: (r) => (r.actual != null ? r.actual.toFixed(2) + " t" : "Pending") },
    { key: "variance", label: "Variance / note", render: (r) => <span style={{ color: r.variance?.startsWith("+1.70") ? "var(--warn)" : "var(--dim)" }}>{r.variance || ""}</span> },
    { key: "status", label: "Status", render: (r) => <Pill>{r.status}</Pill> },
  ];
  const ff = c.name === FF;
  return (
    <>
      <Card pad={false} title="Recent collections" sub={rows.length + " shown · weights from Weighbridge"}><Table cols={cols} rows={rows} dense /></Card>
      {ff && (
        <Card title="INT-1048 weighbridge record" sub="BULK-201 tipped by BIA-14 at 12:46" right={<Btn small onClick={() => go("Plant", "Weighbridge")}>Open in Plant</Btn>}>
          <KV cols={4} rows={[["Gross", "37.42 t"], ["Tare", "18.15 t"], ["Net", "19.27 t"], ["Expected", "17.57 t"], ["Variance", <span style={{ color: "var(--warn)" }}>+1.70 t</span>], ["Docket", "WTD-58812"], ["Destination", INTAKE[0].destination], ["Status", <Pill>{s.approvals.int1048 === "approved" ? "Accepted" : "Review"}</Pill>]]} />
          <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--dim)" }}>Documents attached: waste transfer docket WTD-58812, customer reference FF-PO-77120, driver sign-off, weighbridge ticket.</div>
          {s.approvals.int1048 === "approved" && <div style={{ marginTop: 10, display: "flex", gap: 8 }}><WriteBackBadge system="Weighbridge" /><WriteBackBadge system="Accounting" /></div>}
        </Card>
      )}
    </>
  );
}

function Sites({ c }: { c: Customer }) {
  const sites = SITES.filter((x) => x.customer === c.name);
  return (
    <Grid cols="repeat(2,1fr)" gap={12}>
      {sites.map((x) => (
        <Card key={x.id} span={1} title={x.name} sub={x.containers} right={x.flag ? <Pill tone={x.flagTone}>{x.flag}</Pill> : <Pill tone="ok">Active</Pill>}>
          <KV rows={[["Schedule", x.schedule], ["Containers", x.count], ["Last collection", x.last], ["Next collection", x.next]]} />
          <div style={{ marginTop: 12, fontSize: 12.5, color: "var(--dim)", lineHeight: 1.5 }}>{x.access}</div>
        </Card>
      ))}
    </Grid>
  );
}

function Contacts({ c }: { c: Customer }) {
  const list = CONTACTS[c.name] || [];
  const s = useBia();
  return (
    <Card pad={false} title="Contacts" sub="Who Pulse notifies, and for what">
      {list.map((p, i) => (
        <ListRow key={p.name} first={i === 0} lead={<Avatar name={p.name} />} title={<>{p.name} <span style={{ color: "var(--faint)", fontWeight: 500 }}>· {p.role}</span></>}
          sub={<>{p.phone} · Receives: {p.receives}</>}
          right={s.done["contact-" + p.name] ? <WriteBackBadge system="Email" /> : <Btn small onClick={() => { markDone("contact-" + p.name); toast("Draft opened in Email", "To " + p.name + ", " + c.name); }}>Email</Btn>} />
      ))}
    </Card>
  );
}

function Documents({ c }: { c: Customer }) {
  const docs = DOCS_FOR(c);
  return (
    <Card pad={false} title="Documents" sub="Linked from Documents">
      {docs.map((d, i) => (
        <ListRow key={d.id} first={i === 0} tone="accent" title={d.name} sub={d.kind + " · " + d.date}
          right={<Btn small onClick={() => toast("Opened in Documents", d.name)}>View</Btn>} />
      ))}
    </Card>
  );
}

function Billing({ c }: { c: Customer }) {
  const s = useBia();
  const ff = c.name === FF;
  const acc = s.approvals.int1048 === "approved";
  const inv = invoicesFor(c);
  if (ff) inv[0].note = acc ? "INT-1048 line adjusted to 19.27 t" : "INT-1048 line pending weighbridge review";
  const cols: Col<(typeof inv)[number]>[] = [
    { key: "id", label: "Invoice", render: (r) => <span style={{ color: "var(--ink)", fontWeight: 600 }}>{r.id}</span> },
    { key: "period", label: "Period" },
    { key: "amount", label: "Amount", align: "right", render: (r) => eur(r.amount) },
    { key: "due", label: "Terms" },
    { key: "status", label: "Status", render: (r) => <Pill tone={r.status === "Paid" ? "ok" : r.status === "Due" ? "warn" : "neutral"}>{r.status}</Pill> },
    { key: "note", label: "Note", render: (r) => <span style={{ color: r.note && !acc ? "var(--warn)" : "var(--dim)" }}>{r.note || ""}</span> },
  ];
  const paid = inv.filter((i) => i.status === "Paid").reduce((a, i) => a + i.amount, 0);
  return (
    <>
      <StatRow>
        <Stat label="Billed YTD" value={eur(inv[1].amount * 8.6)} sub="Jan–Aug, from Accounting" />
        <Stat label="Outstanding" value={eur(inv[1].amount)} tone="warn" sub="1 invoice due 30 Sep" />
        <Stat label="Paid, last 3 months" value={eur(paid)} tone="ok" />
        <Stat label="Average days to pay" value={ff ? "27" : "31"} />
      </StatRow>
      <Card pad={false} title="Invoices" sub="From Accounting"><Table cols={cols} rows={inv} dense /></Card>
      {ff && (acc ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}><WriteBackBadge system="Accounting" /><span style={{ fontSize: 12.5, color: "var(--dim)" }}>September draft updated with INT-1048 at 19.27 t net.</span></div>
      ) : (
        <AgentNote agent="Finance Agent" actions={<Btn small kind="primary" onClick={() => decide("int1048", "approved", "INT-1048 accepted at 19.27 t. Invoice line adjusted.")}>Accept INT-1048 and update invoice</Btn>}>
          The September draft holds the INT-1048 line at the declared 17.57 t until the weighbridge review closes. Brian Tully has asked about the 1.70 t difference. Accepting the weighbridge weight updates the invoice line to 19.27 t.
        </AgentNote>
      ))}
    </>
  );
}

function Sustainability({ c }: { c: Customer }) {
  const s = useBia();
  const dig = c.industry === "Agriculture";
  const x = sustain(c.ytd);
  const sustainContact = (CONTACTS[c.name] || [])[2]?.name || c.contact;
  const sent = s.done["report-" + c.name];
  return (
    <>
      <Card title={dig ? "Digestate supply summary" : "Sustainability summary"} sub="Reporting period Jan–Sep 2026 · estimates from the Pulse reporting model"
        right={sent ? <WriteBackBadge system="Email" /> : <Btn kind="primary" small onClick={() => { markDone("report-" + c.name); toast("Sent via Email", "Q3 2026 sustainability report sent to " + sustainContact + ", " + c.name); }}>Send report</Btn>}>
        {dig ? (
          <StatRow>
            <Stat label="Digestate received" value="1,840 t" tone="accent" />
            <Stat label="Nitrogen supplied (est.)" value="9.4 t N" />
            <Stat label="Fertiliser displaced (est.)" value="27 t" />
            <Stat label="CO₂e avoided (est.)" value="41 t" />
          </StatRow>
        ) : (
          <StatRow min={150}>
            <Stat label="Waste diverted from landfill" value={n0(x.diverted) + " t"} tone="accent" sub="100% to anaerobic digestion" />
            <Stat label="Biomethane generated (est.)" value={n0(x.biomethane) + " MWh"} sub="Renewable gas to grid" />
            <Stat label="CO₂e avoided (est.)" value={n0(x.co2) + " t"} />
            <Stat label="Biofertiliser returned to land" value={n0(x.digestate) + " t"} />
          </StatRow>
        )}
        <div style={{ marginTop: 14 }}>
          <KV cols={3} rows={[["Reporting period", "Jan–Sep 2026"], ["Recipient", sustainContact], ["Format", "PDF + CSV data"], ["Packaging recovered", dig ? "n/a" : n0(x.packaging) + " t"], ["Data sources", "Weighbridge, Plant / SCADA data"], ["Last sent", sent ? "Just now" : "Q2, 3 Jul 2026"]]} />
        </div>
      </Card>
      {!dig && (
        <Card title="Waste diverted by month" sub="Tonnes, 2026">
          <Bars data={monthly(c.ytd)} h={130} unit=" t" />
        </Card>
      )}
      <Note tone="info">Factors for biomethane yield and CO₂e are demo values. The reporting model is configurable during onboarding to match Bia Energy's verified methodology.</Note>
    </>
  );
}

function Activity({ c }: { c: Customer }) {
  const s = useBia();
  const b = bulk204(s);
  if (c.name === FF) {
    const wbEta = s.writeBacks.find((w) => w.text.includes("Orla Keane"));
    const wbInt = s.writeBacks.find((w) => w.text.startsWith("INT-1048"));
    const items: { time: string; text: string; who?: string; tone?: Tone }[] = [];
    if (s.done["report-" + FF]) items.push({ time: "Now", who: "Email", text: "Q3 sustainability report sent to Aoife Nolan.", tone: "ok" });
    if (wbInt) items.push({ time: wbInt.time, who: "Accounting", text: "INT-1048 accepted at 19.27 t. September invoice line adjusted.", tone: "ok" });
    if (b.moved) items.push({ time: wbEta?.time || "12:52", who: "Pulse", text: "ETA auto-updated to " + b.eta + " (+27 min) after reassignment to BIA-14. Customer notified via Email.", tone: "ok" });
    else items.push({ time: "Now", who: "Pulse", text: "Reassignment of BULK-204 to BIA-14 awaiting approval. Customer ETA will update automatically.", tone: "neutral" });
    items.push(
      { time: "12:56", who: "Email", text: "Brian Tully asked about the INT-1048 weight. Thread linked to ISS-310.", tone: "info" },
      { time: "12:46", who: "Weighbridge", text: "INT-1048 weighed: 19.27 t net against 17.57 t expected (+1.70 t). Review opened.", tone: "warn" },
      { time: "12:38", who: "Email", text: "Thread \"BULK-204 collection time\" from Orla Keane linked to the account and ISS-311.", tone: "info" },
      { time: "12:36", who: "Pulse", text: "BULK-204 flagged at risk. ETA slipping 42 min.", tone: "warn" },
      { time: "12:34", who: "Fleet / telematics", text: "BIA-07 hydraulic pressure warning on tail-lift ram. Vehicle removed from service.", tone: "bad" },
      { time: "28 Sep", who: "Pulse", text: "Q3 sustainability report generated, ready to send.", tone: "neutral" },
      { time: "28 Sep", who: "Fleet System", text: "COL-1822 Naas cold store completed, 1.1 t.", tone: "ok" },
    );
    return <Card title="Activity" sub="Everything Pulse saw or did on this account"><Timeline items={items} /></Card>;
  }
  const jobs = jobsFor(c.name);
  const items = [
    ...jobs.map((j) => ({ time: j.eta, who: j.id, text: j.status === "Complete" ? `Collected at ${j.site}, ${j.actual?.toFixed(1)} t.` : `${j.status} at ${j.site}. ${j.note || "Expected " + j.expected.toFixed(1) + " t."}`, tone: statusTone(j.status) })),
    { time: "28 Sep", who: "Pulse", text: "Q3 sustainability report generated, ready to send.", tone: "neutral" as Tone },
    { time: "28 Sep", who: "Email", text: `Weekly service summary sent to ${c.contact}.`, tone: "ok" as Tone },
    { time: "25 Sep", who: "Accounting", text: "August invoice issued.", tone: "neutral" as Tone },
  ];
  return <Card title="Activity" sub="Everything Pulse saw or did on this account"><Timeline items={items} /></Card>;
}
