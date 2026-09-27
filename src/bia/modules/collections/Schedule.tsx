import { useState } from "react";
import type { ModProps } from "../../Module";
import { CUSTOMERS, type Tone } from "../../story";
import { bulk204, toast, useBia } from "../../store";
import { Btn, Card, Grid, Head, Kpis, Pill, Segmented, Table, statusTone, toneColor, type Col } from "../../ui";
import { liveVehicles } from "../fleet/derive";
import JobDrawer from "./JobDrawer";
import { JOB_DUR, NOW, ROUTES, TOMORROW, WEEKDAYS, freqDays, fromMin, liveJobs, routeOfVehicle, toMin, type Block, type RouteDef } from "./derive";

const START = 5 * 60, END = 18 * 60, SPAN = END - START;
const pct = (m: number) => `${((Math.max(START, Math.min(END, m)) - START) / SPAN) * 100}%`;
const HOURS = Array.from({ length: 14 }, (_, i) => 5 + i);

type Cust = (typeof CUSTOMERS)[number];
/* Planned shift per vehicle on a route (bulk runs count as one artic shift). */
const shift = (r: RouteDef) => r.plannedMin / Math.max(1, r.vehicles.filter((x) => x !== "BIA-07" && x !== "BIA-14").length);

export default function Schedule({ go }: ModProps) {
  const s = useBia();
  const b = bulk204(s);
  const jobs = liveJobs(s);
  const vs = liveVehicles(s);
  const [day, setDay] = useState("Today");
  const [open, setOpen] = useState<string | null>(null);

  const today: Block[] = jobs.filter((j) => j.vehicle.startsWith("BIA")).map((j) => {
    const end = toMin(j.eta);
    const t: Tone = j.status === "At risk" ? "bad" : j.status === "Complete" ? "ok" : "info";
    return { vehicle: j.vehicle, id: j.id, label: j.customer + ", " + j.site, start: fromMin(end - JOB_DUR[j.type]), dur: JOB_DUR[j.type], tone: t };
  });
  if (!b.moved) today.push({ vehicle: "BIA-07", id: "FAULT", label: "Hydraulic fault 12:34", start: "12:34", dur: 330, tone: "bad" });
  else today.push({ vehicle: "BIA-07", id: "WS-2291", label: "Off road, WS-2291", start: "12:34", dur: 330, tone: "bad" });
  today.push({ vehicle: "BIA-10", id: "WS-2284", label: "Service B, workshop", start: "07:00", dur: 600, tone: "warn" });

  const tomorrow: Block[] = [...TOMORROW,
    { vehicle: "BIA-07", id: "WS-2291", label: b.moved ? "Workshop WS-2291" : "Pending repair decision", start: "06:00", dur: 720, tone: "bad" },
    { vehicle: "BIA-10", id: "WS-2284", label: "Service B, back Thu", start: "06:00", dur: 720, tone: "warn" }];

  const blocks = day === "Today" ? today : tomorrow;
  const nowPos = pct(toMin(NOW));

  const recurring: Col<Cust>[] = [
    { key: "name", label: "Customer", render: (c) => <span style={{ fontWeight: 600, color: "var(--ink)" }}>{c.name}</span> },
    { key: "industry", label: "Sector", render: (c) => <span style={{ color: "var(--dim)" }}>{c.industry}</span> },
    { key: "sites", label: "Sites", align: "right" },
    { key: "freq", label: "Frequency" },
    { key: "days", label: "Service days", render: (c) => {
      const d = freqDays(c.freq);
      return c.freq === "Seasonal" ? <span style={{ color: "var(--faint)", fontSize: 12 }}>Spring and autumn spreading windows</span> : (
        <span style={{ display: "inline-flex", gap: 4 }}>
          {WEEKDAYS.map((w, i) => <span key={w} title={w} style={{ width: 24, height: 20, borderRadius: 6, fontSize: 10, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", background: d[i] ? "var(--accent-soft)" : "var(--surface-2)", color: d[i] ? "var(--accent)" : "var(--faint)" }}>{w[0]}</span>)}
        </span>
      );
    } },
    { key: "ytd", label: "YTD tonnes", align: "right", render: (c) => c.ytd.toLocaleString("en-IE") + " t" },
    { key: "status", label: "Account", render: (c) => <Pill>{c.status}</Pill> },
  ];

  return (
    <>
      <Head eyebrow="COLLECTIONS" title="Schedule" sub="Vehicle timelines for today and tomorrow, plus the recurring service pattern behind them."
        right={<Btn onClick={() => toast("Updated in Fleet System", "Tomorrow's plan published to 13 driver handhelds")}>Publish tomorrow</Btn>} />
      <Kpis min={150} items={[
        { label: "Today", value: 34, sub: "Collections across 9 routes", hero: true },
        { label: "Tomorrow", value: 38, sub: "Planned, 2 bulk and 3 tanker runs" },
        { label: "Vehicles planned tomorrow", value: 14, sub: "BIA-07 and BIA-10 in workshop" },
        { label: "Recurring customers", value: CUSTOMERS.length, sub: "Weekly service agreements" },
      ]} />

      <Card title="Vehicle timeline" sub={day === "Today" ? `Blocks show time on site. Now ${NOW}.` : "Wednesday 30 September, draft plan"} pad={false}
        right={<Segmented options={["Today", "Tomorrow"]} value={day} onChange={setDay} />}>
        <div style={{ overflowX: "auto", padding: "4px 18px 14px" }}>
          <div style={{ minWidth: 880 }}>
            <div style={{ display: "flex", marginLeft: 150, position: "relative", height: 22 }}>
              {HOURS.map((h) => <span key={h} style={{ position: "absolute", left: pct(h * 60), transform: "translateX(-50%)", fontSize: 10.5, color: "var(--faint)" }}>{String(h).padStart(2, "0")}:00</span>)}
            </div>
            {vs.map((v) => {
              const r = routeOfVehicle(v.id);
              const vb = blocks.filter((x) => x.vehicle === v.id);
              return (
                <div key={v.id} style={{ display: "flex", alignItems: "center", borderTop: "1px solid var(--border)", minHeight: 40 }}>
                  <div style={{ width: 150, flex: "none", paddingRight: 10 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>{v.id}</div>
                    <div style={{ fontSize: 11, color: "var(--faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r ? r.name : v.type}</div>
                  </div>
                  <div style={{ flex: 1, position: "relative", height: 40 }}>
                    {HOURS.map((h) => <span key={h} style={{ position: "absolute", left: pct(h * 60), top: 0, bottom: 0, width: 1, background: "var(--grid)" }} />)}
                    {r && day === "Today" && <span style={{ position: "absolute", left: pct(toMin(r.start)), width: `calc(${pct(toMin(r.start) + shift(r))} - ${pct(toMin(r.start))})`, top: 17, height: 6, borderRadius: 6, background: "var(--track)" }} />}
                    {vb.map((x) => {
                      const st = toMin(x.start);
                      return (
                        <button key={x.id + x.start} title={`${x.id} · ${x.label} · ${x.start}`} onClick={() => day === "Today" && x.id.match(/^(COL|BULK|TNK)/) ? setOpen(x.id) : toast(x.id, x.label + ", " + x.start)}
                          style={{ position: "absolute", left: pct(st), width: `calc(${pct(st + x.dur)} - ${pct(st)})`, minWidth: 8, top: 7, height: 26, borderRadius: 8, border: "1px solid " + toneColor[x.tone], cursor: "pointer",
                            background: `color-mix(in srgb, ${toneColor[x.tone]} 22%, var(--surface))`, color: "var(--ink)", fontFamily: "inherit", fontSize: 10.5, fontWeight: 600, padding: "0 6px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: "left" }}>
                          {x.id.startsWith("INSP") ? x.label : x.dur >= 50 ? `${x.id} ${x.label}` : x.id}
                        </button>
                      );
                    })}
                    {day === "Today" && <span style={{ position: "absolute", left: nowPos, top: -2, bottom: -2, width: 2, background: "var(--accent)", borderRadius: 2 }} />}
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 16, marginTop: 12, marginLeft: 150, flexWrap: "wrap", fontSize: 11.5, color: "var(--dim)" }}>
              {([["Complete", "ok"], ["Live / planned", "info"], ["Bulk or tanker", "accent"], ["Workshop / inspection", "warn"], ["At risk / fault", "bad"]] as [string, Tone][]).map(([l, t]) => (
                <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: toneColor[t] }} />{l}</span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Grid style={{ marginTop: 14 }}>
        <Card span={8} pad={false} title="Recurring collections" sub="Service agreements by customer frequency">
          <Table cols={recurring} rows={CUSTOMERS} rowKey="name" dense onRow={(c) => toast(c.name, `${c.freq}, ${c.sites} sites. Contact ${c.contact}.`)} />
        </Card>
        <Card span={4} title="Route start times" sub="Planned shift length">
          <div style={{ display: "flex", flexDirection: "column" }}>
            {ROUTES.map((r) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ width: 44, fontSize: 12.5, fontWeight: 600, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{r.start}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: "var(--ink)" }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "var(--faint)" }}>{r.vehicles.filter((x) => x !== (b.moved ? "BIA-07" : "BIA-14")).join(", ")}</div>
                </div>
                <Pill tone={statusTone("scheduled")}>{(shift(r) / 60).toFixed(1)} h</Pill>
              </div>
            ))}
          </div>
        </Card>
      </Grid>
      <JobDrawer id={open} onClose={() => setOpen(null)} go={go} />
    </>
  );
}
