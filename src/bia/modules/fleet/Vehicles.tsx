import { useState } from "react";
import type { ModProps } from "../../Module";
import type { Vehicle } from "../../story";
import { toast, useBia } from "../../store";
import { Bar, Btn, Card, Empty, Head, Kpis, Pill, SearchBox, Segmented, Table, type Col } from "../../ui";
import VehicleDrawer from "./VehicleDrawer";
import { daysUntil, fleetCounts, liveVehicles, statusLabel } from "./derive";

const TYPE_FILTER: Record<string, Vehicle["type"] | null> = { All: null, "Bin trucks": "MacPac Bin Truck", Artics: "Artic Curtainsider", Tankers: "Tanker", Support: "Support Vehicle" };

export default function Vehicles({ go }: ModProps) {
  const s = useBia();
  const vs = liveVehicles(s);
  const c = fleetCounts(vs);
  const [f, setF] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const rows = vs.filter((v) => (!TYPE_FILTER[f] || v.type === TYPE_FILTER[f]) && (!q || [v.id, v.reg, v.driver, v.route, v.location].join(" ").toLowerCase().includes(q.toLowerCase())));
  const cols: Col<Vehicle>[] = [
    { key: "id", label: "Vehicle", render: (v) => <span style={{ fontWeight: 600, color: "var(--ink)" }}>{v.id}</span> },
    { key: "reg", label: "Registration", render: (v) => <span style={{ color: "var(--dim)" }}>{v.reg}</span> },
    { key: "type", label: "Type" },
    { key: "status", label: "Status", render: (v) => { const st = statusLabel(v, s); return <Pill tone={st.tone}>{st.label}</Pill>; } },
    { key: "driver", label: "Driver" },
    { key: "route", label: "Current route" },
    { key: "next", label: "Next", render: (v) => <span style={{ color: "var(--dim)" }}>{v.next}</span> },
    { key: "utilisation", label: "Utilisation", w: "130px", render: (v) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 110 }}><div style={{ flex: 1 }}><Bar value={v.utilisation} tone={v.utilisation < 75 ? "warn" : "accent"} /></div><span style={{ fontSize: 12, color: "var(--ink)", width: 30, textAlign: "right" }}>{v.utilisation}%</span></div>
    ) },
    { key: "nextInspection", label: "Next inspection", render: (v) => { const d = daysUntil(v.nextInspection); return <span style={{ color: d <= 7 ? "var(--warn)" : "var(--body)", fontWeight: d <= 7 ? 600 : 400 }}>{v.nextInspection} <span style={{ color: "var(--faint)", fontWeight: 400, fontSize: 11.5 }}>{d} d</span></span>; } },
  ];

  return (
    <>
      <Head eyebrow="FLEET" title="Vehicles" sub="All 16 vehicles with driver, route, utilisation and inspection dates. Click a row for the full record."
        right={<Btn onClick={() => toast("Updated in Documents", "Fleet register exported, 16 vehicles")}>Export register</Btn>} />
      <Kpis min={140} items={[
        { label: "Vehicles", value: c.total, hero: true, sub: "8 bin, 4 artic, 2 tanker, 2 support" },
        { label: "Active", value: c.active, tone: "ok", sub: `${c.standby} standby` },
        { label: "Off road", value: c.maintenance + c.fault, tone: "bad", sub: "BIA-07, BIA-10" },
        { label: "Average mileage", value: Math.round(vs.reduce((a, v) => a + v.mileage, 0) / vs.length / 1000) + "k km", sub: "Fleet age 3.4 years" },
        { label: "Inspections within 7 days", value: vs.filter((v) => daysUntil(v.nextInspection) <= 7).length, tone: "warn", sub: "BIA-12, BIA-10" },
      ]} />
      <Card pad={false} title={`${rows.length} vehicles`} right={<div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}><Segmented options={Object.keys(TYPE_FILTER)} value={f} onChange={setF} /><SearchBox value={q} onChange={setQ} placeholder="Search vehicle, reg, driver" /></div>}>
        {rows.length ? <Table cols={cols} rows={rows} onRow={(v) => setOpen(v.id)} selected={open} dense /> : <Empty>No vehicles match.</Empty>}
      </Card>
      <VehicleDrawer id={open} onClose={() => setOpen(null)} go={go} />
    </>
  );
}
