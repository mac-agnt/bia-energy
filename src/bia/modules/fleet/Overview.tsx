import { useState } from "react";
import type { ModProps } from "../../Module";
import { TODAY, VEHICLES } from "../../story";
import { bulk204, decide, useBia } from "../../store";
import { AgentNote, Btn, Card, Donut, Grid, Head, KV, Kpis, Legend, Meter, Pill, Timeline, WriteBackBadge, toneColor } from "../../ui";
import VehicleDrawer, { Bia07Actions } from "./VehicleDrawer";
import { TYPES, fleetCounts, liveVehicles, statusLabel } from "./derive";

export default function Overview({ go, setTab }: ModProps) {
  const s = useBia();
  const b = bulk204(s);
  const vs = liveVehicles(s);
  const c = fleetCounts(vs);
  const [open, setOpen] = useState<string | null>(null);
  const bia07 = vs.find((v) => v.id === "BIA-07")!;
  const booked = s.approvals.bia12 === "approved";

  const events = [
    ...(b.moved ? [{ time: "13:02", text: "BULK-204 reassigned to BIA-14. BIA-07 off road, WS-2291.", tone: "ok" as const, who: "Fleet System" }] : []),
    { time: "12:46", text: "BIA-14 tipped INT-1048 at Huntstown, now empty", tone: "info" as const, who: "Weighbridge" },
    { time: "12:34", text: "BIA-07 hydraulic pressure warning, stopped at Johnstown", tone: "bad" as const, who: "Fleet / telematics" },
    { time: "11:58", text: "BIA-11 back in yard, refuelled to 92%", tone: "neutral" as const },
    { time: "09:10", text: "BIA-12 pre-test check work order opened", tone: "warn" as const, who: "Workshop" },
    { time: "06:15", text: "13 of 13 walkaround checks submitted, 2 minor defects", tone: "ok" as const, who: "Drivers" },
  ];

  return (
    <>
      <Head eyebrow="FLEET" title="Fleet today" sub="16 vehicles across bin, bulk, tanker and support work. Live from Fleet / telematics and the workshop."
        right={<><Btn onClick={() => setTab("Live Fleet")}>Live map</Btn><Btn onClick={() => setTab("Vehicles")}>All vehicles</Btn></>} />
      <Kpis items={[
        { label: "Total fleet", value: c.total, sub: "Owned and leased", hero: true },
        { label: "Available", value: c.available, sub: "Excludes workshop and faults", tone: "ok" },
        { label: "Active now", value: c.active, sub: `${c.standby} on standby` },
        { label: "Maintenance", value: c.maintenance, sub: "BIA-10, back Thursday", tone: "warn" },
        { label: "Fault", value: c.fault, sub: b.moved ? "BIA-07 off road, WS-2291" : "BIA-07 hydraulic", tone: "bad" },
        { label: "Utilisation", value: TODAY.utilisation + "%", sub: "30-day average", tone: "accent" },
      ]} />

      <Grid>
        <Card span={7} tone="bad" title={<span style={{ display: "flex", alignItems: "center", gap: 10 }}>BIA-07 fault <Pill tone="bad">{statusLabel(bia07, s).label}</Pill></span>} sub={`${bia07.reg} · Artic Curtainsider · ${bia07.location}`}
          right={<Btn small onClick={() => setOpen("BIA-07")}>Vehicle detail</Btn>}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 600 }}>Hydraulic pressure warning on tail-lift ram, 12:34</div>
              <div style={{ fontSize: 12.5, color: "var(--body)", marginTop: 6, lineHeight: 1.55 }}>
                {b.moved ? "Off road, workshop ticket WS-2291. Recovery booked for 15:00." : "Pressure fell from 180 to 112 bar under load. Removed from service. Route BULK-204 for FreshFields Foods, 18.6 t, is affected with 3 collections potentially delayed."}
              </div>
              <div style={{ marginTop: 12 }}>
                <KV cols={2} rows={[["Driver", "Marek Kowalski"], ["Route", b.moved ? "Off road" : "BULK-204 Naas"], ["Mileage", bia07.mileage.toLocaleString("en-IE") + " km"], ["Last hose check", "3 Sep, advisory"]]} />
              </div>
            </div>
            <AgentNote agent="Fleet Agent" state={s.approvals.reassign204} actions={<Bia07Actions onReview={() => setOpen("BIA-07")} />}>
              Route BULK-204 can be reassigned to BIA-14 with an estimated 27-minute delay.
              {b.moved && <div style={{ marginTop: 6, color: "var(--dim)" }}>BIA-14 active on BULK-204, ETA 14:37.</div>}
            </AgentNote>
          </div>
        </Card>

        <Card span={5} title="Fleet by type" sub="Count and status">
          <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <Donut parts={TYPES.map((t) => ({ v: VEHICLES.filter((v) => v.type === t.type).length, c: t.c }))} label={c.total} sub="vehicles" />
            <Legend items={TYPES.map((t) => ({ label: t.label, value: VEHICLES.filter((v) => v.type === t.type).length, c: t.c }))} />
          </div>
          <div style={{ marginTop: 12 }}>
            {TYPES.map((t) => {
              const g = vs.filter((v) => v.type === t.type);
              const util = Math.round(g.reduce((a, v) => a + v.utilisation, 0) / g.length);
              return <Meter key={t.type} label={`${t.label}, ${g.filter((v) => v.status === "Active").length} of ${g.length} active`} value={util} note="util." />;
            })}
          </div>
        </Card>

        <Card span={7} title="Status board" sub="Click a vehicle for detail">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 8 }}>
            {vs.map((v) => {
              const st = statusLabel(v, s);
              return (
                <button key={v.id} onClick={() => setOpen(v.id)} className="bia-row" style={{ textAlign: "left", padding: "10px 12px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface-2)", cursor: "pointer", fontFamily: "inherit", color: "inherit" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 3, background: toneColor[st.tone] }} />
                    <b style={{ fontSize: 13, color: "var(--ink)" }}>{v.id}</b>
                    <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--faint)" }}>{v.fuel}%</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--dim)", marginTop: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.route}</div>
                  <div style={{ fontSize: 11, color: toneColor[st.tone], marginTop: 3, fontWeight: 600 }}>{st.label}</div>
                </button>
              );
            })}
          </div>
        </Card>

        <div style={{ gridColumn: "span 5", display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          <Card title="BIA-12 inspection due in 3 days" sub="Support vehicle · 221-D-6045" tone={booked ? undefined : "warn"} right={<Pill tone={booked ? "ok" : "warn"}>{booked ? "Booked" : "Due 2 Oct"}</Pill>}>
            <div style={{ fontSize: 12.5, color: "var(--body)", lineHeight: 1.55 }}>
              {booked ? "Roadworthiness test booked Thursday 08:00 at Huntstown workshop. Bin swaps in Dublin 15 moved to the afternoon." : "Annual roadworthiness test. BIA-12 is unavailable from Friday if it is not completed."}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {booked ? <WriteBackBadge system="Calendar" /> : <Btn small kind="primary" onClick={() => decide("bia12", "approved", "BIA-12 roadworthiness test booked Thu 08:00.")}>Book inspection</Btn>}
              <Btn small onClick={() => setTab("Inspections")}>All inspections</Btn>
            </div>
          </Card>
          <Card title="Fleet events today">
            <Timeline items={events} />
            <Btn small onClick={() => go("Collections", "Overview")}>Collections impact</Btn>
          </Card>
        </div>
      </Grid>
      <VehicleDrawer id={open} onClose={() => setOpen(null)} go={go} />
    </>
  );
}
