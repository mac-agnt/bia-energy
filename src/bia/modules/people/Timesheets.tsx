import { useState } from "react";
import type { ModProps } from "../../Module";
import { decide, toast, useBia } from "../../store";
import { JOBS, TIMESHEETS, type Sheet, type Tone } from "../../story";
import { AgentNote, Btn, Card, Drawer, Head, KV, Kpis, Page, Pill, Section, Segmented, Table, Timeline, WriteBackBadge, type Col } from "../../ui";
import { STAFF, jobName } from "./data";

const OT_REASON: Record<string, string> = {
  "Marek Nowak": "Weighbridge queue at Huntstown on the second tip, 10:40.",
  "Marek Kowalski": "Shift extended after the BIA-07 hydraulic fault; waited for recovery and transfer to BIA-14.",
  "Darragh Quinn": "City centre loop ran long. COL-1846 break window moved within limits.",
  "Tomasz Wiśniewski": "Second Carlow run added for Leinster Bakeries.",
  "Paul Doyle": "TNK-041 loading at Ballymount slower than booked.",
};

type Row = Sheet & { live: Sheet["status"] };

export default function Timesheets({ setTab }: ModProps) {
  const s = useBia();
  const allOk = s.approvals.overtime === "approved";
  const [local, setLocal] = useState<string[]>([]);
  const review = TIMESHEETS.filter((t) => t.status === "Review").map((t) => t.name);
  const [sel, setSel] = useState<string[]>(review);
  const [f, setF] = useState("All");
  const [open, setOpen] = useState<string | null>(null);

  const rows: Row[] = TIMESHEETS.map((t) => ({ ...t, live: t.status === "Review" && (allOk || local.includes(t.name)) ? "Approved" : t.status }));
  const shown = rows.filter((r) => f === "All" || r.live === f);
  const pendingRows = rows.filter((r) => r.live === "Review");
  const pendingOt = pendingRows.reduce((a, r) => a + r.overtime, 0);
  const selPending = rows.filter((r) => sel.includes(r.name) && r.live === "Review");
  const selOt = selPending.reduce((a, r) => a + r.overtime, 0);
  const worked = TIMESHEETS.reduce((a, t) => a + t.worked, 0), productive = TIMESHEETS.reduce((a, t) => a + t.productive, 0), ot = TIMESHEETS.reduce((a, t) => a + t.overtime, 0);

  const approve = () => {
    const names = selPending.map((r) => r.name);
    const next = [...local, ...names];
    setLocal(next);
    if (review.every((n) => next.includes(n))) decide("overtime", "approved", `${selOt.toFixed(1)} h Logistics overtime approved and posted to payroll period 40.`);
    else toast("Updated in Timesheets / HR", `${selOt.toFixed(1)} h overtime approved for ${names.length} ${names.length === 1 ? "person" : "people"}.`);
    setSel([]);
  };
  const toggle = (n: string) => setSel((x) => (x.includes(n) ? x.filter((y) => y !== n) : [...x, n]));
  const box = (on: boolean, onClick: () => void, dis?: boolean) => (
    <input type="checkbox" checked={on} disabled={dis} onChange={onClick} onClick={(e) => e.stopPropagation()} style={{ accentColor: "var(--accent)", width: 15, height: 15, cursor: dis ? "default" : "pointer" }} />
  );

  const cols: Col<Row>[] = [
    { key: "sel", label: "", w: "34px", render: (r) => box(sel.includes(r.name), () => toggle(r.name), r.live !== "Review") },
    { key: "name", label: "Employee", render: (r) => <span style={{ color: "var(--ink)", fontWeight: 600 }}>{r.name}</span> },
    { key: "role", label: "Role" },
    { key: "shift", label: "Shift" },
    { key: "worked", label: "Worked", align: "right", render: (r) => r.worked.toFixed(1) },
    { key: "productive", label: "Productive", align: "right", render: (r) => r.productive.toFixed(1) },
    { key: "overtime", label: "Overtime", align: "right", render: (r) => r.overtime ? <span style={{ color: r.live === "Review" ? "var(--warn)" : "var(--ink)", fontWeight: 600 }}>{r.overtime.toFixed(1)}</span> : <span style={{ color: "var(--faint)" }}>—</span> },
    { key: "status", label: "Status", render: (r) => <Pill>{r.live}</Pill> },
  ];

  const cur = rows.find((r) => r.name === open);
  const staff = STAFF.find((p) => p.name === open);
  const jobs = cur ? JOBS.filter((j) => j.driver === jobName(cur.name)) : [];
  const [st, en] = cur ? cur.shift.split("–") : ["", ""];
  const events: { time: string; text: string; tone?: Tone }[] = cur ? [
    { time: st, text: `Clocked in${staff?.vehicle ? `, walkaround check ${staff.vehicle.split(",")[0]}` : ""}`, tone: "info" },
    ...jobs.slice().sort((a, b) => a.eta.localeCompare(b.eta)).map((j) => ({ time: j.eta, text: `${j.id} ${j.customer}, ${j.site}. ${j.status}${j.actual ? `, ${j.actual} t` : ""}`, tone: (j.status === "Complete" ? "ok" : j.status === "At risk" ? "bad" : "neutral") as Tone })),
    { time: "", text: "Breaks 45 min, within limits" },
    { time: en, text: cur.overtime ? `Clock out, ${cur.overtime} h over rostered shift` : "Clock out", tone: cur.overtime ? "warn" : "ok" },
  ] : [];

  return (
    <Page>
      <Head eyebrow="People" title="Timesheets" sub="Today's operational timesheets from Timesheets / HR, checked against telematics and job records. Overtime needs approval before payroll."
        right={<Segmented options={["All", "Review", "Submitted", "Approved"]} value={f} onChange={setF} />} />

      <Kpis items={[
        { label: "Hours worked", value: `${worked.toFixed(1)} h`, sub: `${TIMESHEETS.length} timesheets today` },
        { label: "Productive", value: `${productive.toFixed(1)} h`, sub: `${Math.round((productive / worked) * 100)}% of worked` },
        { label: "Overtime", value: `${ot.toFixed(1)} h`, sub: "All departments" },
        { label: "Awaiting approval", value: `${pendingOt.toFixed(1)} h`, sub: pendingRows.length ? `${pendingRows.length} in Logistics` : "Posted to payroll", tone: pendingRows.length ? "warn" : "ok", hero: !pendingRows.length },
      ]} />

      <Card title="Today" sub="Select rows to approve overtime. Click a row for the day's record." pad={false}
        right={allOk ? <WriteBackBadge system="Timesheets / HR" /> : (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--dim)" }}>{selPending.length} selected</span>
            <Btn small onClick={() => setSel(sel.length ? [] : pendingRows.map((r) => r.name))}>{sel.length ? "Clear" : "Select review rows"}</Btn>
            <Btn small kind="primary" disabled={!selPending.length} onClick={approve}>Approve {selOt.toFixed(1)} h overtime</Btn>
          </div>
        )}>
        <Table cols={cols} rows={shown} rowKey="name" onRow={(r) => setOpen(r.name)} selected={open} />
      </Card>

      <div style={{ marginTop: 14 }}>
        <AgentNote agent="Timesheet Agent" state={allOk ? "approved" : undefined}
          actions={allOk ? <><WriteBackBadge system="Timesheets / HR" /><Btn small onClick={() => setTab("Productivity")}>See productivity</Btn></> : <Btn small onClick={() => setTab("Productivity")}>How productive hours are counted</Btn>}>
          {allOk ? "6.5 h of Logistics overtime is approved and posted to payroll period 40. All of today's timesheets are clean."
            : "All 6.5 h of pending overtime lines up with telematics and job records. 1.8 h is Marek Kowalski's extended shift after the BIA-07 fault, which is a fleet issue rather than a driver one. Nothing looks unusual; I'd approve the lot."}
        </AgentNote>
      </div>

      <Drawer open={!!cur} onClose={() => setOpen(null)} title={cur?.name ?? ""} sub={cur ? `${cur.role} · ${cur.dept} · ${cur.shift}` : undefined}>
        {cur && (
          <>
            <div><Pill>{cur.live}</Pill></div>
            <Section title="Hours"><KV cols={3} rows={[["Worked", `${cur.worked} h`], ["Productive", `${cur.productive} h`], ["Overtime", cur.overtime ? `${cur.overtime} h` : "None"]]} /></Section>
            {cur.overtime > 0 && <Section title="Overtime reason"><div style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.5 }}>{OT_REASON[cur.name] ?? "Short overrun at end of shift."}</div></Section>}
            <Section title="Day record"><Timeline items={events} /></Section>
            <Section title="Sources"><KV rows={[["Clock times", "Timesheets / HR"], ["Drive and task time", "Fleet / telematics"], ["Jobs and tonnes", "Pulse collections, Weighbridge"], ["Vehicle", staff?.vehicle ?? "Plant"]]} /></Section>
            {cur.live === "Review" && !allOk && (
              <div style={{ display: "flex", gap: 8 }}>
                <Btn kind="primary" onClick={() => { setSel([cur.name]); setOpen(null); }}>Select for approval</Btn>
                <Btn kind="danger" onClick={() => { toast("Query sent", `${cur.name} asked to confirm overtime reason in Timesheets / HR.`); setOpen(null); }}>Query</Btn>
              </div>
            )}
          </>
        )}
      </Drawer>
    </Page>
  );
}
