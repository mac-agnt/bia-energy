import { useState } from "react";
import type { ModProps } from "../../Module";
import { TODAY } from "../../story";
import { bulk204, toast, useBia } from "../../store";
import { Bar, Btn, Card, Grid, Head, Kpis, KV, Pill, RouteMap } from "../../ui";
import { liveVehicles } from "../fleet/derive";
import JobDrawer from "./JobDrawer";
import { ROUTES, hm, liveJobs, routeOfVehicle, routeStatus, routeTonnes, toMin } from "./derive";

export default function Routes({ go }: ModProps) {
  const s = useBia();
  const b = bulk204(s);
  const jobs = liveJobs(s);
  const vs = liveVehicles(s);
  const [sel, setSel] = useState("R-BLK");
  const [open, setOpen] = useState<string | null>(null);

  const route = ROUTES.find((r) => r.id === sel)!;
  const lead = (vids: string[]) => vids.filter((v) => v !== (b.moved ? "BIA-07" : "BIA-14"))[0];
  const st = routeStatus(route, s);
  const rJobs = jobs.filter((j) => route.vehicles.includes(j.vehicle) && j.status !== "Complete").sort((a, c) => toMin(a.eta) - toMin(c.eta));
  const doneAll = ROUTES.reduce((a, r) => a + r.done, 0);

  return (
    <>
      <Head eyebrow="COLLECTIONS" title="Routes" sub="Progress on every loop and bulk run. Select a route to highlight it on the map."
        right={<Btn onClick={() => toast("Updated in Fleet System", "Afternoon sequence optimised on 3 loops, 21 min saved")}>Optimise afternoon</Btn>} />
      <Kpis min={150} items={[
        { label: "Routes running", value: ROUTES.length, sub: "7 loops, bulk and tanker runs", hero: true },
        { label: "Stops done", value: doneAll, sub: "Since 05:00" },
        { label: "Stops remaining", value: ROUTES.reduce((a, r) => a + r.remaining, 0), sub: "Across all loops and runs" },
        { label: "Collected on routes", value: TODAY.collectedT + " t", sub: "Net, weighed" },
        { label: "Routes on time", value: ROUTES.filter((r) => routeStatus(r, s).tone === "ok").length + " of " + ROUTES.length, tone: "accent" },
      ]} />
      <Grid>
        <Card span={7} pad={false} title="All routes" sub="Stops done against remaining, planned against forecast time">
          <div style={{ overflowX: "auto" }}><div style={{ display: "flex", flexDirection: "column", minWidth: 640 }}>
            {ROUTES.map((r) => {
              const rs = routeStatus(r, s);
              const on = r.id === sel;
              return (
                <button key={r.id} onClick={() => setSel(r.id)} className="bia-row"
                  style={{ display: "grid", gridTemplateColumns: "minmax(150px,1.4fr) minmax(120px,1.2fr) 90px 70px 118px", gap: 14, alignItems: "center", padding: "12px 18px", border: 0, borderTop: "1px solid var(--border)", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "inherit",
                    background: on ? "var(--accent-faint)" : "transparent", boxShadow: on ? "inset 2px 0 0 var(--accent)" : "none" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{r.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.vehicles.filter((v) => v !== (b.moved ? "BIA-07" : "BIA-14")).join(", ")} · {r.drivers}</div>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--dim)", marginBottom: 5 }}><span>{r.done} done</span><span style={{ color: "var(--ink)", fontWeight: 600 }}>{r.remaining} left</span></div>
                    <Bar value={r.done} max={r.done + r.remaining} tone={rs.tone === "bad" ? "bad" : "accent"} />
                  </div>
                  <div style={{ fontSize: 12, color: "var(--dim)", fontVariantNumeric: "tabular-nums" }}>
                    <div>{hm(r.plannedMin)}</div>
                    <div style={{ color: rs.forecastMin > r.plannedMin + 5 ? "var(--warn)" : "var(--ok)" }}>{hm(rs.forecastMin)}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{routeTonnes(r, jobs).toFixed(1)} t</div>
                  <div style={{ textAlign: "right" }}><Pill tone={rs.tone}>{rs.label}</Pill></div>
                </button>
              );
            })}
          </div></div>
          <div style={{ padding: "10px 18px 8px", fontSize: 11.5, color: "var(--faint)" }}>Time column: planned on top, forecast below.</div>
        </Card>

        <Card span={5} title={route.name} sub={route.area} right={<Pill tone={st.tone}>{st.label}</Pill>}>
          <RouteMap vehicles={vs} selected={lead(route.vehicles)} h={260} labels
            onPick={(id) => { const r = routeOfVehicle(id); if (r) setSel(r.id); }} />
          <div style={{ marginTop: 14 }}>
            <KV cols={3} rows={[
              ["Vehicles", route.vehicles.filter((v) => v !== (b.moved ? "BIA-07" : "BIA-14")).join(", ")],
              ["Stops", `${route.done} / ${route.done + route.remaining}`],
              ["Tonnes", routeTonnes(route, jobs).toFixed(1) + " t"],
              ["Planned", hm(route.plannedMin)],
              ["Forecast", hm(st.forecastMin)],
              ["Start", route.start],
            ]} />
          </div>
          <div style={{ marginTop: 14, fontSize: 11, fontWeight: 600, letterSpacing: ".12em", color: "var(--faint)" }}>REMAINING COLLECTIONS</div>
          <div style={{ marginTop: 6 }}>
            {rJobs.length ? rJobs.map((j) => (
              <div key={j.id} className="bia-row" onClick={() => setOpen(j.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                <b style={{ fontSize: 12.5, color: "var(--ink)", width: 74 }}>{j.id}</b>
                <span style={{ flex: 1, fontSize: 12.5, color: "var(--body)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{j.customer}, {j.site}</span>
                <span style={{ fontSize: 12, color: "var(--dim)" }}>{j.eta}</span>
                <Pill>{j.status}</Pill>
              </div>
            )) : <div style={{ fontSize: 12.5, color: "var(--faint)", padding: "8px 0" }}>Bin-lift stops only. Next tip at Huntstown on return.</div>}
          </div>
        </Card>
      </Grid>
      <JobDrawer id={open} onClose={() => setOpen(null)} go={go} />
    </>
  );
}
