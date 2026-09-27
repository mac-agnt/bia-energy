import { useState, type MouseEvent } from "react";
import type { ModProps } from "../../Module";
import { decide, toast, useBia } from "../../store";
import { AgentNote, Btn, Card, Grid, Head, Kpis, Pill, Segmented, Table, WriteBackBadge, type Col } from "../../ui";
import VehicleDrawer from "./VehicleDrawer";
import { inspections, liveVehicles, type Insp } from "./derive";

const CHECKS: Record<string, string | null> = { All: null, Roadworthiness: "Roadworthiness (CVRT)", Tachograph: "Tachograph calibration", LOLER: "Tail-lift LOLER (6-monthly)" };

const WALKAROUND = [
  { v: "BIA-01", t: "05:52", d: 0 }, { v: "BIA-02", t: "05:48", d: 0 }, { v: "BIA-03", t: "05:55", d: 1, note: "Nearside marker lamp out, fixed in yard" },
  { v: "BIA-04", t: "05:50", d: 0 }, { v: "BIA-05", t: "06:21", d: 0 }, { v: "BIA-06", t: "06:18", d: 0 }, { v: "BIA-07", t: "04:51", d: 0 },
  { v: "BIA-08", t: "04:55", d: 1, note: "Curtain strap worn, WS-2279 already open" }, { v: "BIA-11", t: "06:50", d: 0 }, { v: "BIA-13", t: "05:47", d: 0 }, { v: "BIA-14", t: "04:44", d: 0 },
  { v: "BIA-15", t: "05:58", d: 0 }, { v: "BIA-16", t: "05:53", d: 0 },
];

export default function Inspections({ go }: ModProps) {
  const s = useBia();
  const vs = liveVehicles(s);
  const all = inspections(vs);
  const [f, setF] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const booked = s.approvals.bia12 === "approved";
  const rows = all.filter((r) => !CHECKS[f] || r.check === CHECKS[f]);

  const cols: Col<Insp>[] = [
    { key: "vehicle", label: "Vehicle", render: (r) => <span style={{ fontWeight: 600, color: "var(--ink)" }}>{r.vehicle}</span> },
    { key: "type", label: "Type", render: (r) => <span style={{ color: "var(--dim)" }}>{r.type}</span> },
    { key: "check", label: "Check" },
    { key: "last", label: "Last", render: (r) => <span style={{ color: "var(--dim)" }}>{r.last}</span> },
    { key: "due", label: "Due" },
    { key: "days", label: "In", align: "right", render: (r) => {
      const isBooked = r.vehicle === "BIA-12" && r.check.startsWith("Road") && booked;
      return <Pill tone={isBooked ? "ok" : r.days <= 7 ? "bad" : r.days <= 30 ? "warn" : "neutral"}>{isBooked ? "Booked Thu" : `${r.days} days`}</Pill>;
    } },
    { key: "provider", label: "Provider", render: (r) => <span style={{ color: "var(--dim)" }}>{r.provider}</span> },
    { key: "act", label: "", render: (r) => (
      <span onClick={(e: MouseEvent) => e.stopPropagation()}>
        {r.vehicle === "BIA-12" && r.check.startsWith("Road")
          ? booked ? <WriteBackBadge system="Calendar" /> : <Btn small kind="primary" onClick={() => decide("bia12", "approved", "BIA-12 roadworthiness test booked Thu 08:00.")}>Book inspection</Btn>
          : r.days <= 30 ? <Btn small onClick={() => toast("Updated in Calendar", `${r.vehicle} ${r.check.toLowerCase()} pencilled for ${r.due}`)}>Book</Btn> : null}
      </span>
    ) },
  ];

  return (
    <>
      <Head eyebrow="FLEET" title="Inspections" sub="Roadworthiness, tachograph calibration and LOLER tail-lift checks for every vehicle, plus this morning's walkaround checks." />
      <Kpis min={150} items={[
        { label: "Due within 7 days", value: all.filter((r) => r.days <= 7).length, tone: "warn", hero: true, sub: "BIA-12 test on 2 Oct" },
        { label: "Due within 30 days", value: all.filter((r) => r.days <= 30).length, sub: "Across 3 check types" },
        { label: "Overdue", value: 0, tone: "ok", sub: "None this year" },
        { label: "Walkaround checks today", value: `${WALKAROUND.length} of ${WALKAROUND.length}`, tone: "accent", sub: "Submitted before departure" },
        { label: "Defects reported today", value: WALKAROUND.filter((w) => w.d).length, sub: "Both minor" },
      ]} />
      <Grid>
        <Card span={8} pad={false} title="Inspection schedule" sub="Sorted by due date" right={<Segmented options={Object.keys(CHECKS)} value={f} onChange={setF} />}>
          <Table cols={cols} rows={rows} rowKey="key" dense onRow={(r) => setOpen(r.vehicle)} />
        </Card>
        <div style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          <Card title="BIA-12 roadworthiness test" sub="Support vehicle · 221-D-6045" tone={booked ? undefined : "warn"}>
            <AgentNote agent="Compliance Agent" state={s.approvals.bia12}
              actions={booked ? <WriteBackBadge system="Calendar" /> : <Btn small kind="primary" onClick={() => decide("bia12", "approved", "BIA-12 roadworthiness test booked Thu 08:00.")}>Book inspection</Btn>}>
              {booked ? "Booked Thursday 08:00 at Huntstown workshop. Pre-test check WS-2293 runs first. Bin swaps moved to the afternoon."
                : "Due in 3 days. If it is missed BIA-12 is off road and Dublin 15 bin swaps need cover. Thursday 08:00 is free."}
            </AgentNote>
          </Card>
          <Card title="Walkaround checks" sub="This morning, from driver handhelds">
            {WALKAROUND.map((w) => (
              <div key={w.v} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                <b style={{ fontSize: 12.5, color: "var(--ink)", width: 52 }}>{w.v}</b>
                <span style={{ flex: 1, fontSize: 12, color: w.note ? "var(--body)" : "var(--faint)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={w.note}>{w.note || "No defects"}</span>
                <span style={{ fontSize: 11.5, color: "var(--faint)" }}>{w.t}</span>
                <Pill tone={w.d ? "warn" : "ok"}>{w.d ? "Defect" : "Pass"}</Pill>
              </div>
            ))}
          </Card>
        </div>
      </Grid>
      <VehicleDrawer id={open} onClose={() => setOpen(null)} go={go} />
    </>
  );
}
