import { useState } from "react";
import type { ModProps } from "../../Module";
import { fmtEur } from "../../story";
import { toast, useBia } from "../../store";
import { Bar, Bars, Btn, Card, Donut, Grid, Head, Kpis, Legend, SERIES, Segmented, Table, type Col } from "../../ui";
import VehicleDrawer from "./VehicleDrawer";
import { COST_SPLIT, CPK, MONTHLY, TYPES, liveVehicles, vehicleCost } from "./derive";

const DOWN = [
  { v: "BIA-07", days: 9.5, cost: 5320 }, { v: "BIA-15", days: 7, cost: 3710 }, { v: "BIA-08", days: 6, cost: 3360 },
  { v: "BIA-10", days: 11, cost: 3190 }, { v: "BIA-16", days: 4.5, cost: 2390 }, { v: "Other 11", days: 12, cost: 3490 },
];
const L100: Record<string, number> = { "MacPac Bin Truck": 38.2, "Artic Curtainsider": 31.6, Tanker: 33.4, "Support Vehicle": 12.8 };
type TypeRow = { id: string; label: string; n: number; cost: number; km: number; t: number };

export default function Costs({ go }: ModProps) {
  const s = useBia();
  const vs = liveVehicles(s);
  const [sort, setSort] = useState("Cost YTD");
  const [open, setOpen] = useState<string | null>(null);

  const withCost = vs.map((v) => ({ v, ...vehicleCost(v) }));
  const total = vs.reduce((a, v) => a + v.costYtd, 0);
  const km = withCost.reduce((a, x) => a + x.km, 0);
  const tonnes = withCost.reduce((a, x) => a + x.t, 0);
  const sorted = [...withCost].sort((a, c) => sort === "Cost YTD" ? c.v.costYtd - a.v.costYtd : c.cpk - a.cpk);
  const max = Math.max(...vs.map((v) => v.costYtd));

  const typeRows: TypeRow[] = TYPES.map((t) => {
    const g = withCost.filter((x) => x.v.type === t.type);
    return { id: t.type, label: t.label, n: g.length, cost: g.reduce((a, x) => a + x.v.costYtd, 0), km: g.reduce((a, x) => a + x.km, 0), t: g.reduce((a, x) => a + x.t, 0) };
  });
  const tcols: Col<TypeRow>[] = [
    { key: "label", label: "Type", render: (r) => <span style={{ fontWeight: 600, color: "var(--ink)" }}>{r.label}</span> },
    { key: "n", label: "Units", align: "right" },
    { key: "cpk", label: "€ / km", align: "right", render: (r) => "€" + CPK[r.id as keyof typeof CPK].toFixed(2) },
    { key: "cpt", label: "€ / tonne", align: "right", render: (r) => r.id === "Support Vehicle" ? <span style={{ color: "var(--faint)" }}>n/a</span> : "€" + (r.cost / r.t).toFixed(2) },
    { key: "l", label: "L / 100 km", align: "right", render: (r) => L100[r.id].toFixed(1) },
  ];

  return (
    <>
      <Head eyebrow="FLEET" title="Costs" sub="Year to date running cost by vehicle, unit costs and downtime. From Accounting and Fleet / telematics."
        right={<Btn onClick={() => toast("Updated in Accounting", "Fleet cost pack for September saved to the management accounts folder")}>Send to Accounting</Btn>} />
      <Kpis min={150} items={[
        { label: "Fleet cost YTD", value: fmtEur(total), hero: true, sub: "Jan to Sep" },
        { label: "Cost per km", value: "€" + (total / km).toFixed(2), sub: `${Math.round(km / 1000)}k km YTD` },
        { label: "Cost per tonne", value: "€" + (total / tonnes).toFixed(2), sub: `${tonnes.toLocaleString("en-IE")} t moved YTD` },
        { label: "Fuel and AdBlue YTD", value: fmtEur(COST_SPLIT[0].v), sub: `${Math.round((COST_SPLIT[0].v / total) * 100)}% of fleet cost` },
        { label: "Downtime cost YTD", value: fmtEur(DOWN.reduce((a, d) => a + d.cost, 0)), sub: "50 vehicle days off road", tone: "warn" },
      ]} />
      <Grid>
        <Card span={7} title="Cost YTD by vehicle" sub="Fuel, maintenance, tyres, insurance and telematics" right={<Segmented options={["Cost YTD", "€ / km"]} value={sort} onChange={setSort} />}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {sorted.map((x) => (
              <div key={x.v.id} className="bia-row" onClick={() => setOpen(x.v.id)} style={{ display: "grid", gridTemplateColumns: "60px minmax(0,1fr) 78px 54px", gap: 12, alignItems: "center", padding: "6px 4px", cursor: "pointer", borderRadius: 8 }}>
                <b style={{ fontSize: 12.5, color: "var(--ink)" }}>{x.v.id}</b>
                <Bar value={x.v.costYtd} max={max} tone={x.v.id === "BIA-07" ? "bad" : "accent"} h={8} />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtEur(x.v.costYtd)}</span>
                <span style={{ fontSize: 11.5, color: "var(--faint)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>€{x.cpk.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card span={5} title="Where the money goes" sub="YTD split">
          <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <Donut parts={COST_SPLIT.map((c, i) => ({ v: c.v, c: SERIES[i] }))} label={"€" + Math.round(total / 1000) + "k"} sub="YTD" />
            <Legend items={COST_SPLIT.map((c, i) => ({ label: c.label, value: Math.round((c.v / total) * 100) + "%", c: SERIES[i] }))} />
          </div>
          <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 12.5, color: "var(--body)", lineHeight: 1.55 }}>
            Maintenance is {fmtEur(COST_SPLIT[1].v)} against {fmtEur(COST_SPLIT[0].v)} on fuel, a ratio of 1 to {(COST_SPLIT[0].v / COST_SPLIT[1].v).toFixed(1)}. The two oldest artics, BIA-07 and BIA-08, carry 22% of fleet cost.
          </div>
        </Card>
        <Card span={7} title="Monthly fleet cost" sub="€ thousands, September to date">
          <Bars data={MONTHLY.map(([m, v]) => [m, Math.round(v / 100) / 10])} unit="k" h={170} />
        </Card>
        <Card span={5} pad={false} title="Unit cost by type">
          <Table cols={tcols} rows={typeRows} dense />
        </Card>
        <Card span={12} title="Downtime cost" sub="Lost capacity, hire cover and recovery, YTD">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10 }}>
            <div style={{ padding: "12px 14px", borderRadius: 14, background: "var(--bad-soft)", border: "1px solid color-mix(in srgb, var(--bad) 35%, transparent)" }}>
              <div style={{ fontSize: 12, color: "var(--bad)", fontWeight: 600 }}>BIA-07 today, estimate</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "var(--ink)", marginTop: 6 }}>{fmtEur(4020)}</div>
              <div style={{ fontSize: 11.5, color: "var(--dim)", marginTop: 4 }}>Repair €2,840, recovery €560, delay €620</div>
            </div>
            {DOWN.map((d) => (
              <div key={d.v} style={{ padding: "12px 14px", borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 12, color: "var(--dim)" }}>{d.v}</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: "var(--ink)", marginTop: 6 }}>{fmtEur(d.cost)}</div>
                <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 4 }}>{d.days} days off road</div>
              </div>
            ))}
          </div>
        </Card>
      </Grid>
      <VehicleDrawer id={open} onClose={() => setOpen(null)} go={go} />
    </>
  );
}
