import { useState, type ReactNode } from "react";
import type { ModProps } from "../../Module";
import type { Tone } from "../../story";
import { bulk204, decide, markDone, toast, useBia } from "../../store";
import { Btn, Card, Donut, Grid, Head, Kpis, Legend, Pill, SERIES, Segmented, WriteBackBadge, toneColor } from "../../ui";
import JobDrawer from "./JobDrawer";

type Act = { label: string; primary?: boolean; run: () => void };
type Exc = { ref: string; title: string; detail: string; customer: string; owner: string; age: string; tone: Tone; resolved: boolean; resolvedText?: string; system?: string; actions: Act[]; job?: string; live: boolean };

const act = (key: string, system: string, sub: string) => () => { markDone("exc-" + key); toast("Updated in " + system, sub); };

export default function Exceptions({ go }: ModProps) {
  const s = useBia();
  const b = bulk204(s);
  const [f, setF] = useState("Open");
  const [open, setOpen] = useState<string | null>(null);
  const d = (k: string) => !!s.done["exc-" + k];
  const plan = s.approvals.dispatchPlan === "approved";

  const list: Exc[] = [
    { ref: "BULK-204", job: "BULK-204", live: true, title: "Bulk collection slipping 42 min", detail: "BIA-07 hydraulic fault at 12:34. BIA-14 is free at Huntstown and recovers to +27 min.", customer: "FreshFields Foods, Naas", owner: "Dragos Busuioc", age: "31 min", tone: "bad",
      resolved: b.moved, resolvedText: "Reassigned to BIA-14, ETA 14:37", system: "Fleet System",
      actions: [{ label: "Approve reassignment", primary: true, run: () => decide("reassign204", "approved", "BULK-204 reassigned to BIA-14. ETA 14:37, +27 min.") }, { label: "Open collection", run: () => setOpen("BULK-204") }] },
    { ref: "COL-1858", job: "COL-1858", live: true, title: "Sequence clash on Tallaght loop", detail: "COL-1858 and COL-1861 both due 14:25 to 14:45. Moving 1858 behind 1861 keeps both inside window.", customer: "GreenMart, Tallaght", owner: "Dispatch", age: "24 min", tone: "bad",
      resolved: plan, resolvedText: "Resequenced behind COL-1861", system: "Fleet System",
      actions: [{ label: "Approve dispatch plan", primary: true, run: () => decide("dispatchPlan", "approved", "Dispatch plan applied. 3 of 4 collections recovered.") }, { label: "Open collection", run: () => setOpen("COL-1858") }] },
    { ref: "COL-1846", job: "COL-1846", live: true, title: "Driver break window clash", detail: "D. Quinn's break lands on the 15:30 slot. Delaying it 18 min stays within permitted limits.", customer: "Liffey Hospitality Group, Temple Bar", owner: "Dispatch", age: "19 min", tone: "bad",
      resolved: plan, resolvedText: "Break moved 18 min later", system: "Timesheets / HR",
      actions: [{ label: "Approve dispatch plan", primary: true, run: () => decide("dispatchPlan", "approved", "Dispatch plan applied. 3 of 4 collections recovered.") }, { label: "Open collection", run: () => setOpen("COL-1846") }] },
    { ref: "TNK-044", job: "TNK-044", live: true, title: "No compatible tanker free", detail: "19.8 t liquid dairy by-product at 16:30. BIA-15 and BIA-16 both committed. Needs a person.", customer: "Boyne Valley Dairies, Drogheda", owner: "Dragos Busuioc", age: "46 min", tone: "bad",
      resolved: false, system: "Email",
      actions: [{ label: d("tnk044") ? "Quote requested" : "Request contract tanker", primary: !d("tnk044"), run: act("tnk044", "Email", "Quote request sent to contract haulier for 16:30 Drogheda") }, { label: "Notify customer", run: act("tnk044n", "Email", "Sinéad Kerr told the 16:30 tanker is being confirmed") }] },
    { ref: "INT-1041", live: false, title: "Rejected load, contaminated", detail: "Packaged food with glass and metal. 3.70 t net against 7.70 t declared. Returned to sender 10:52.", customer: "Third-party haulier, 11-MN-804", owner: "Natalia Biancha", age: "2 h 13 min", tone: "bad",
      resolved: d("int1041"), resolvedText: "Rejection notice and photos sent", system: "Email",
      actions: [{ label: "Send rejection notice", primary: true, run: act("int1041", "Email", "Rejection notice and 4 photos sent to the haulier") }, { label: "Raise contamination charge", run: act("int1041c", "Accounting", "Contamination and return charge raised, €385") }] },
    { ref: "COL-1829", live: false, title: "Missed bin, store locked", detail: "Bin store locked at 16:20 yesterday. Driver photo on file. No collection made.", customer: "Liffey Hospitality Group, Ranelagh", owner: "Dispatch", age: "Yesterday", tone: "warn",
      resolved: d("col1829"), resolvedText: "Return visit booked tomorrow 07:40", system: "Fleet System",
      actions: [{ label: "Book return visit", primary: true, run: act("col1829", "Fleet System", "Added to City centre loop tomorrow 07:40") }, { label: "Email site manager", run: act("col1829e", "Email", "Clare Dunphy asked to keep the Ranelagh bin store open") }] },
    { ref: "INT-1048", live: false, title: "Weight variance +1.70 t", detail: "19.27 t net against 17.57 t expected on BULK-201. Docket WTD-58812 and customer reference match.", customer: "FreshFields Foods, Naas", owner: "Weighbridge", age: "19 min", tone: "warn",
      resolved: s.approvals.int1048 === "approved", resolvedText: "Accepted at 19.27 t", system: "Weighbridge",
      actions: [{ label: "Open in Weighbridge", primary: true, run: () => go("Plant", "Weighbridge") }, { label: "Open BULK-201", run: () => setOpen("BULK-201") }] },
    { ref: "COL-1847", live: false, title: "Contamination flagged by driver", detail: "Plastic bags in the unpackaged stream, 2 of 6 bins. Photo attached from handheld.", customer: "GreenMart, Lucan", owner: "Customer service", age: "55 min", tone: "warn",
      resolved: d("col1847"), resolvedText: "Contamination notice sent", system: "Email",
      actions: [{ label: "Send contamination notice", primary: true, run: act("col1847", "Email", "Contamination notice and photo sent to Declan Moran") }, { label: "Log for monthly report", run: act("col1847l", "Documents", "Added to GreenMart September contamination report") }] },
    { ref: "COL-1857", live: false, title: "Gate code changed at depot", detail: "Driver waited 9 min yesterday. New code received from site by phone.", customer: "CityFresh, Malahide", owner: "Dispatch", age: "Yesterday", tone: "neutral",
      resolved: d("col1857"), resolvedText: "Site notes updated for all drivers", system: "Fleet System",
      actions: [{ label: "Update site notes", primary: true, run: act("col1857", "Fleet System", "New gate code pushed to driver handhelds") }] },
    { ref: "COL-1845", live: false, title: "Driver sign-off missing on docket", detail: "Handheld lost signal at Coolock. Docket saved without customer signature.", customer: "Northside Distribution, Coolock", owner: "Documents", age: "1 h 10 min", tone: "neutral",
      resolved: d("col1845"), resolvedText: "E-signature request sent", system: "Documents",
      actions: [{ label: "Request e-signature", primary: true, run: act("col1845", "Documents", "E-signature request sent to Rob Carey") }] },
  ];

  const openN = list.filter((e) => !e.resolved).length;
  const rows = list.filter((e) => (f === "Open" ? !e.resolved : f === "Resolved" ? e.resolved : true));
  const causes = [
    { label: "Vehicle fault", v: 3 }, { label: "Sequencing and traffic", v: 7 }, { label: "Site access", v: 5 },
    { label: "Contamination", v: 4 }, { label: "Weight variance", v: 3 }, { label: "Driver hours", v: 2 },
  ];

  const group = (title: string, items: Exc[]): ReactNode => items.length ? (
    <>
      <div style={{ padding: "12px 18px 6px", fontSize: 11, fontWeight: 600, letterSpacing: ".12em", color: "var(--faint)" }}>{title}</div>
      {items.map((e) => (
        <div key={e.ref} style={{ display: "flex", gap: 14, padding: "14px 18px", borderTop: "1px solid var(--border)", flexWrap: "wrap", opacity: e.resolved ? 0.78 : 1 }}>
          <span style={{ width: 10, height: 10, borderRadius: 4, marginTop: 5, flex: "none", background: e.resolved ? "var(--ok)" : toneColor[e.tone] }} />
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <b style={{ fontSize: 13, color: "var(--ink)", cursor: e.job ? "pointer" : "default" }} onClick={() => e.job && setOpen(e.job)}>{e.ref}</b>
              <span style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 500 }}>{e.title}</span>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--body)", marginTop: 4, lineHeight: 1.5 }}>{e.detail}</div>
            <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 5 }}>{e.customer} · Owner {e.owner} · Open {e.age}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end", flex: "0 1 auto" }}>
            {e.resolved ? (
              <><span style={{ fontSize: 12, color: "var(--dim)" }}>{e.resolvedText}</span>{e.system && <WriteBackBadge system={e.system} />}</>
            ) : e.actions.map((a) => <Btn key={a.label} small kind={a.primary ? "primary" : "ghost"} onClick={a.run}>{a.label}</Btn>)}
          </div>
        </div>
      ))}
    </>
  ) : null;

  return (
    <>
      <Head eyebrow="COLLECTIONS" title="Exceptions" sub="Everything that has gone off plan today and yesterday, with an owner and a suggested fix. Actions write back to the connected system." />
      <Kpis min={150} items={[
        { label: "Open exceptions", value: openN, tone: openN > 5 ? "bad" : "warn", hero: true, sub: `${list.length - openN} resolved today` },
        { label: "At risk collections", value: b.atRisk, tone: "bad", sub: "Live, today" },
        { label: "Rejected loads", value: 1, sub: "INT-1041, third-party" },
        { label: "Missed collections, 7 days", value: 2, sub: "Both rebooked within 24 h" },
        { label: "Median time to resolve", value: "38 min", sub: "Last 30 days", tone: "accent" },
      ]} />
      <Grid>
        <Card span={8} pad={false} title="Exception queue" right={<Segmented options={["Open", "Resolved", "All"]} value={f} onChange={setF} />}>
          {group("LIVE, TODAY'S COLLECTIONS", rows.filter((e) => e.live))}
          {group("RECENT", rows.filter((e) => !e.live))}
          {!rows.length && <div style={{ padding: 28, textAlign: "center", color: "var(--faint)", fontSize: 13 }}>Nothing here. Switch to All to see today's history.</div>}
        </Card>
        <Card span={4} title="Causes, last 7 days" sub="24 exceptions across 186 collections">
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <Donut parts={causes.map((c, i) => ({ v: c.v, c: SERIES[i % SERIES.length] }))} label="24" sub="exceptions" />
            <Legend items={causes.map((c, i) => ({ label: c.label, value: c.v, c: SERIES[i % SERIES.length] }))} />
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
            {[["Exception rate", "12.9%", "of collections, down from 14.2%"], ["Customer notified automatically", "100%", "for ETA slips over 20 min"], ["Resolved same day", "91%", "last 30 days"]].map(([k, v, sub]) => (
              <div key={k} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ flex: 1, fontSize: 12.5, color: "var(--body)" }}>{k}<div style={{ fontSize: 11, color: "var(--faint)" }}>{sub}</div></span>
                <b style={{ fontSize: 15, color: "var(--ink)" }}>{v}</b>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}><Pill tone="accent">Owners notified in Pulse and by email</Pill></div>
        </Card>
      </Grid>
      <JobDrawer id={open} onClose={() => setOpen(null)} go={go} />
    </>
  );
}
