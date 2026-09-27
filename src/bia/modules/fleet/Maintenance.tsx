import { useState, type MouseEvent } from "react";
import type { ModProps } from "../../Module";
import { fmtEur } from "../../story";
import { bulk204, decide, toast, useBia } from "../../store";
import { Btn, Card, Grid, Head, Kpis, Pill, Table, toneColor, type Col } from "../../ui";
import VehicleDrawer from "./VehicleDrawer";
import { COST_SPLIT, DOWNTIME, WO_HISTORY, workOrders, type WorkOrder } from "./derive";

const DAYS = ["Tue 29", "Wed 30", "Thu 1", "Fri 2", "Sat 3", "Sun 4", "Mon 5"];
type Hist = (typeof WO_HISTORY)[number];

export default function Maintenance({ go }: ModProps) {
  const s = useBia();
  const b = bulk204(s);
  const wos = workOrders(s);
  const [open, setOpen] = useState<string | null>(null);
  const stop = (fn: () => void) => (e: MouseEvent) => { e.stopPropagation(); fn(); };

  const action = (w: WorkOrder) => {
    if (w.id === "WS-2291" && !b.moved) return <Btn small kind="primary" onClick={() => setOpen("BIA-07")}>Review BIA-07</Btn>;
    if (w.id === "WS-2293" && s.approvals.bia12 !== "approved") return <Btn small kind="primary" onClick={() => decide("bia12", "approved", "BIA-12 roadworthiness test booked Thu 08:00.")}>Book test</Btn>;
    if (w.status === "Parts ordered") return <Btn small onClick={() => toast("Updated in Email", `Parts supplier chased for ${w.id}, delivery confirmed tomorrow`)}>Chase parts</Btn>;
    if (w.status.startsWith("Booked") || w.status === "In workshop" || w.status === "In progress") return <Btn small onClick={() => toast("Updated in Work", `${w.id} progress note requested from workshop`)}>Request update</Btn>;
    return <Btn small onClick={() => toast("Updated in Work", `${w.id} assigned to Huntstown workshop, fitter 2`)}>Assign fitter</Btn>;
  };

  const cols: Col<WorkOrder>[] = [
    { key: "id", label: "Work order", render: (w) => <span style={{ fontWeight: 600, color: "var(--ink)" }}>{w.id}</span> },
    { key: "vehicle", label: "Vehicle" },
    { key: "title", label: "Work" },
    { key: "kind", label: "Type", render: (w) => <span style={{ color: "var(--dim)" }}>{w.kind}</span> },
    { key: "opened", label: "Opened", render: (w) => <span style={{ color: "var(--dim)" }}>{w.opened}</span> },
    { key: "due", label: "Back / due" },
    { key: "cost", label: "Est. cost", align: "right", render: (w) => fmtEur(w.cost) },
    { key: "status", label: "Status", render: (w) => <Pill tone={w.tone}>{w.status}</Pill> },
    { key: "act", label: "", render: (w) => <span onClick={stop(() => undefined)}>{action(w)}</span> },
  ];
  const hcols: Col<Hist>[] = [
    { key: "id", label: "Work order", render: (h) => <span style={{ fontWeight: 600, color: "var(--ink)" }}>{h.id}</span> },
    { key: "vehicle", label: "Vehicle" },
    { key: "title", label: "Work" },
    { key: "closed", label: "Closed" },
    { key: "days", label: "Off road", align: "right", render: (h) => h.days < 1 ? `${Math.round(h.days * 24)} h` : `${h.days} d` },
    { key: "cost", label: "Cost", align: "right", render: (h) => fmtEur(h.cost) },
  ];

  const inWorkshop = 1 + (b.moved ? 1 : 0);
  return (
    <>
      <Head eyebrow="FLEET" title="Maintenance" sub="Open work orders, planned downtime and what the workshop has closed this month."
        right={<Btn onClick={() => toast("Updated in Work", "New work order drafted. Pick a vehicle to continue.")}>New work order</Btn>} />
      <Kpis min={150} items={[
        { label: "Open work orders", value: wos.length, hero: true, sub: "2 breakdown or inspection" },
        { label: "In workshop now", value: inWorkshop, tone: "warn", sub: b.moved ? "BIA-10, BIA-07" : "BIA-10, BIA-07 pending" },
        { label: "Planned downtime, 7 days", value: "6.4 days", sub: "Across 6 vehicles" },
        { label: "Maintenance spend YTD", value: fmtEur(COST_SPLIT[1].v), sub: "Parts and labour" },
        { label: "Average turnaround", value: "1.6 days", tone: "accent", sub: "Last 30 days" },
      ]} />
      <Grid>
        <Card span={12} pad={false} title="Open work orders" sub="Click a row for the vehicle record">
          <Table cols={cols} rows={wos} onRow={(w) => setOpen(w.vehicle)} dense />
        </Card>
        <Card span={7} title="Planned downtime" sub="Next 7 days, by vehicle">
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 520 }}>
              <div style={{ display: "grid", gridTemplateColumns: "70px repeat(7,1fr)", fontSize: 10.5, color: "var(--faint)", marginBottom: 6 }}>
                <span />{DAYS.map((d) => <span key={d} style={{ textAlign: "center" }}>{d}</span>)}
              </div>
              {DOWNTIME.map((d) => (
                <div key={d.vehicle} style={{ display: "grid", gridTemplateColumns: "70px 1fr", alignItems: "center", borderTop: "1px solid var(--border)", height: 40 }}>
                  <b style={{ fontSize: 12.5, color: "var(--ink)" }}>{d.vehicle}</b>
                  <div style={{ position: "relative", height: "100%" }}>
                    {DAYS.map((_, i) => <span key={i} style={{ position: "absolute", left: `${(i / 7) * 100}%`, top: 0, bottom: 0, width: 1, background: "var(--grid)" }} />)}
                    <span title={d.what} style={{ position: "absolute", left: `${(d.from / 7) * 100}%`, width: `max(${((d.to - d.from) / 7) * 100}%, 64px)`, top: 8, height: 24, borderRadius: 8, padding: "0 8px", display: "flex", alignItems: "center",
                      background: `color-mix(in srgb, ${toneColor[d.tone]} 22%, var(--surface))`, border: "1px solid " + toneColor[d.tone], fontSize: 10.5, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.what}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--dim)" }}>Planned around route demand. Thursday is the tightest day with 3 vehicles out.</div>
        </Card>
        <Card span={5} pad={false} title="Closed this month" sub={`${WO_HISTORY.length} work orders, ${fmtEur(WO_HISTORY.reduce((a, h) => a + h.cost, 0))}`}>
          <Table cols={hcols} rows={WO_HISTORY} dense onRow={(h) => setOpen(h.vehicle)} />
        </Card>
      </Grid>
      <VehicleDrawer id={open} onClose={() => setOpen(null)} go={go} />
    </>
  );
}
