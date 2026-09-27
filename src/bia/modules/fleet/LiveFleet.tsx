import { useState } from "react";
import type { ModProps } from "../../Module";
import { useBia } from "../../store";
import { Btn, Card, Grid, Head, KV, Pill, RouteMap, Segmented, toneColor } from "../../ui";
import { liveJobs } from "../collections/derive";
import VehicleDrawer from "./VehicleDrawer";
import { liveVehicles, statusLabel, telemetry } from "./derive";

export default function LiveFleet({ go }: ModProps) {
  const s = useBia();
  const vs = liveVehicles(s);
  const jobs = liveJobs(s);
  const [sel, setSel] = useState("BIA-07");
  const [f, setF] = useState("All");
  const [open, setOpen] = useState<string | null>(null);

  const v = vs.find((x) => x.id === sel) || vs[0];
  const tm = telemetry(v);
  const st = statusLabel(v, s);
  const job = jobs.find((j) => j.vehicle === v.id && j.status !== "Complete");
  const list = vs.filter((x) => f === "All" || (f === "Moving" ? telemetry(x).speed > 0 : f === "Stopped" ? telemetry(x).speed === 0 && x.status === "Active" : x.status !== "Active"));
  const eta = v.next.match(/\d{2}:\d{2}/)?.[0] || job?.eta || "n/a";

  return (
    <>
      <Head eyebrow="FLEET" title="Live fleet" sub="Positions, speed and next stop from Fleet / telematics. Updated every 30 seconds." right={<Pill tone="accent">{vs.filter((x) => telemetry(x).speed > 0).length} moving · {vs.filter((x) => x.status === "Active").length} active</Pill>} />
      <Grid>
        <Card span={8} title={<span style={{ display: "flex", alignItems: "center", gap: 10 }}>{v.id}<Pill tone={st.tone}>{st.label}</Pill></span>} sub={`${v.type} · ${v.driver} · ${v.location}`}
          right={<Btn small onClick={() => setOpen(v.id)}>Vehicle record</Btn>}>
          <RouteMap vehicles={vs} selected={v.id} onPick={setSel} h={440} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginTop: 12 }}>
            {[["Speed", tm.speed + " km/h"], ["ETA", eta], ["Next stop", job ? `${job.id}, ${job.site}` : v.next], ["Fuel", v.fuel + "%"], ["Km today", tm.kmToday + " km"], ["Last ping", tm.ping]].map(([k, val]) => (
              <div key={k} style={{ padding: "10px 12px", borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--border)", minWidth: 0 }}>
                <div style={{ fontSize: 11, color: "var(--faint)" }}>{k}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <KV cols={4} rows={[["Heading", tm.heading], ["Ignition", tm.ignition], ["Idle today", tm.idle], ["Route", v.route]]} />
          </div>
        </Card>
        <Card span={4} pad={false} title="Vehicles" right={<Segmented options={["All", "Moving", "Stopped", "Off"]} value={f} onChange={setF} />}>
          <div style={{ maxHeight: 640, overflowY: "auto" }}>
            {list.map((x) => {
              const t = telemetry(x);
              const xs = statusLabel(x, s);
              const on = x.id === v.id;
              return (
                <button key={x.id} onClick={() => setSel(x.id)} className="bia-row" style={{ display: "flex", width: "100%", alignItems: "center", gap: 10, padding: "11px 18px", border: 0, borderTop: "1px solid var(--border)", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "inherit", background: on ? "var(--accent-faint)" : "transparent", boxShadow: on ? "inset 2px 0 0 var(--accent)" : "none" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 3, background: toneColor[xs.tone], flex: "none" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{x.id} <span style={{ fontWeight: 400, color: "var(--faint)", fontSize: 11.5 }}>{x.driver}</span></div>
                    <div style={{ fontSize: 11.5, color: "var(--dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.next}</div>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: t.speed ? "var(--ink)" : "var(--faint)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{t.speed} km/h</span>
                </button>
              );
            })}
            {!list.length && <div style={{ padding: 24, textAlign: "center", fontSize: 12.5, color: "var(--faint)" }}>No vehicles in this view.</div>}
          </div>
        </Card>
      </Grid>
      <VehicleDrawer id={open} onClose={() => setOpen(null)} go={go} />
    </>
  );
}
