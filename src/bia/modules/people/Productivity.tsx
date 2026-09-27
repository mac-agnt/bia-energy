import { useState, type ReactNode } from "react";
import type { ModProps } from "../../Module";
import { bulk204, toast, useBia } from "../../store";
import { TIMESHEETS, TODAY, type Sheet, type Tone } from "../../story";
import { AgentNote, Bar, Btn, Card, Donut, Drawer, Grid, Head, KV, Page, Pill, Section, Segmented, Spark, Table, toneColor, type Col } from "../../ui";
import { DAY_VIEW, DEFAULT_MODEL, INPUTS, OVERALL, PLANT_TPH, PRESETS, ROUTES, STAFF, WEEK_VIEW, contributions, hm, liveIndex, overall, type InputKey, type Model, type RouteRow } from "./data";
import { Toggle } from "./shared";

const VIEWS = ["Employee", "Crew", "Shift", "Route", "Department", "Day", "Week"];
const same = (a: Model, b: Model) => INPUTS.every((i) => a[i.key].on === b[i.key].on && a[i.key].w === b[i.key].w);
const idxTone = (v: number): Tone => (v >= 93 ? "ok" : v >= 88 ? "accent" : "warn");
const fmtD = (d: number) => `${d >= 0 ? "+" : ""}${d.toFixed(1)}`;

function IndexBars({ data, h = 170 }: { data: { l: string; v: number; sub?: string }[]; h?: number }) {
  const lo = 80, hi = 100;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: h, paddingTop: 18 }}>
      {data.map((d, i) => {
        const pct = Math.max(4, ((d.v - lo) / (hi - lo)) * 100);
        const last = i === data.length - 1;
        return (
          <div key={d.l} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 0 }}>
            <div style={{ flex: 1, width: "100%", maxWidth: 44, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center" }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: last ? "var(--accent)" : "var(--ink)", marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>{Math.round(d.v)}</div>
              <div style={{ width: "100%", height: `${pct}%`, borderRadius: "8px 8px 3px 3px", background: last ? "var(--accent)" : "var(--accent-soft)", transformOrigin: "bottom", animation: `biaGrow .6s var(--ease) ${i * 35}ms both`, transition: "height .5s var(--ease)" }} />
            </div>
            <div style={{ fontSize: 10.5, color: "var(--faint)", whiteSpace: "nowrap" }}>{d.l}</div>
            {d.sub && <div style={{ fontSize: 10, color: "var(--faint)", marginTop: -4 }}>{d.sub}</div>}
          </div>
        );
      })}
    </div>
  );
}

function Tile({ title, value, sub, children, hero }: { title: string; value: ReactNode; sub?: ReactNode; children?: ReactNode; hero?: boolean }) {
  return (
    <div style={{ padding: "16px 16px", borderRadius: 18, background: hero ? "linear-gradient(155deg,var(--accent-faint),transparent 70%), var(--surface-2)" : "var(--surface-2)", border: "1px solid " + (hero ? "var(--accent-line)" : "var(--border)"), display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)" }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-1px", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--faint)", lineHeight: 1.45 }}>{sub}</div>}
      {children}
    </div>
  );
}

export default function Productivity({ setTab }: ModProps) {
  const s = useBia();
  const b = bulk204(s);
  const [model, setModel] = useState<Model>(DEFAULT_MODEL);
  const [ex, setEx] = useState(false);
  const [view, setView] = useState("Employee");
  const [who, setWho] = useState<string | null>(null);

  const idx = (t: Sheet) => liveIndex(t, model, ex);
  const all = overall(model, ex);
  const delta = all == null ? 0 : all - OVERALL;
  const preset = Object.keys(PRESETS).find((k) => same(PRESETS[k], model)) ?? "Custom";
  const onKeys = INPUTS.filter((i) => model[i.key].on && model[i.key].w > 0);
  const sumW = onKeys.reduce((a, i) => a + model[i.key].w, 0);
  const set = (k: InputKey, patch: Partial<Model[InputKey]>) => setModel((m) => ({ ...m, [k]: { ...m[k], ...patch } }));
  const hw = (list: Sheet[]) => { const v = list.map((t) => ({ t, i: idx(t) })).filter((x): x is { t: Sheet; i: number } => x.i != null); const h = v.reduce((a, x) => a + x.t.worked, 0); return h ? v.reduce((a, x) => a + x.i * x.t.worked, 0) / h : null; };

  /* ---------- views ---------- */
  type ERow = Sheet & { live: number | null };
  const eRows: ERow[] = TIMESHEETS.map((t) => ({ ...t, live: idx(t) }));
  const na = <span style={{ color: "var(--faint)" }}>n/a</span>;
  const eCols: Col<ERow>[] = [
    { key: "name", label: "Employee", render: (r) => <span style={{ color: "var(--ink)", fontWeight: 600 }}>{r.name}</span> },
    { key: "role", label: "Role", render: (r) => <span style={{ color: "var(--dim)" }}>{r.role}</span> },
    { key: "worked", label: "Hours", align: "right", render: (r) => r.worked.toFixed(1) },
    { key: "productive", label: "Productive h", align: "right", render: (r) => r.productive.toFixed(1) },
    { key: "jobs", label: "Jobs", align: "right", render: (r) => r.jobs ?? na },
    { key: "tonnes", label: "Tonnes", align: "right", render: (r) => r.tonnes != null ? r.tonnes.toFixed(1) : na },
    { key: "stops", label: "Stops", align: "right", render: (r) => r.stops ?? na },
    { key: "overtime", label: "Overtime", align: "right", render: (r) => r.overtime ? r.overtime.toFixed(1) : na },
    { key: "live", label: "Productivity index", w: "200px", render: (r) => r.live == null ? na : (
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 170 }}>
        <div style={{ flex: 1 }}><Bar value={r.live - 70} max={30} tone={idxTone(r.live)} /></div>
        <span style={{ width: 34, textAlign: "right", fontWeight: 700, color: "var(--ink)" }}>{Math.round(r.live)}</span>
        <span style={{ width: 36, fontSize: 11, color: Math.abs(r.live - r.index) < 0.05 ? "var(--faint)" : r.live > r.index ? "var(--ok)" : "var(--warn)" }}>{Math.abs(r.live - r.index) < 0.05 ? "" : fmtD(r.live - r.index)}</span>
      </div>) },
  ];

  const crews = Array.from(new Set(STAFF.filter((p) => p.sheet).map((p) => p.crew))).map((crew) => {
    const members = TIMESHEETS.filter((t) => STAFF.find((p) => p.name === t.name)?.crew === crew);
    return { crew, members, i: hw(members), hours: members.reduce((a, t) => a + t.worked, 0), tonnes: members.reduce((a, t) => a + (t.tonnes ?? 0), 0), ot: members.reduce((a, t) => a + t.overtime, 0) };
  });
  const byStart = (lo: string, hi: string) => TIMESHEETS.filter((t) => { const st = t.shift.split("–")[0]; return st >= lo && st < hi; });
  const shifts = [
    { name: "Early", when: "05:00 to 06:00 starts", list: byStart("05:00", "07:00") },
    { name: "Day", when: "07:00 to 08:00 starts", list: byStart("07:00", "09:00") },
  ];
  const drivers = TIMESHEETS.filter((t) => t.dept === "Logistics"), plant = TIMESHEETS.filter((t) => t.dept === "Plant");
  const plantUtil = plant.reduce((a, t) => a + t.productive, 0) / plant.reduce((a, t) => a + t.worked, 0) * 100;

  const routes: RouteRow[] = ROUTES.map((r) => r.id === "r7" ? { ...r, vehicle: b.vehicle === "BIA-14" ? "BIA-07 → BIA-14" : "BIA-07", delay: b.moved ? 27 : 42, actual: r.planned + (b.moved ? 27 : 42) } : r);
  const rCols: Col<RouteRow>[] = [
    { key: "route", label: "Route", render: (r) => <span style={{ color: "var(--ink)", fontWeight: 600 }}>{r.route}</span> },
    { key: "vehicle", label: "Vehicle" },
    { key: "driver", label: "Driver", render: (r) => <span style={{ color: "var(--dim)" }}>{r.driver}</span> },
    { key: "planned", label: "Planned", align: "right", render: (r) => hm(r.planned) },
    { key: "actual", label: "Actual", align: "right", render: (r) => hm(r.actual) },
    { key: "stops", label: "Stops", align: "right" },
    { key: "tonnes", label: "Tonnes", align: "right", render: (r) => r.tonnes.toFixed(1) },
    { key: "delay", label: "Delay", render: (r) => <span title={r.note} style={{ color: r.delay >= 30 ? "var(--warn)" : "var(--dim)", fontWeight: r.delay >= 30 ? 600 : 400 }}>+{r.delay} min{r.note ? <span style={{ color: "var(--faint)", fontWeight: 400 }}>, {r.note}</span> : null}</span> },
    { key: "util", label: "Vehicle utilisation", w: "150px", render: (r) => <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}><div style={{ flex: 1 }}><Bar value={r.util} /></div><span style={{ width: 32, textAlign: "right" }}>{r.util}%</span></div> },
  ];

  const viewBody = () => {
    switch (view) {
      case "Crew": return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 10 }}>
          {crews.map((c) => (
            <Tile key={c.crew} title={c.crew} value={c.i == null ? "n/a" : `${Math.round(c.i)}%`} sub={`${c.members.length} people, ${c.hours.toFixed(1)} h, ${c.ot.toFixed(1)} h overtime${c.tonnes ? `, ${c.tonnes.toFixed(1)} t` : ""}`}>
              {c.i != null && <Bar value={c.i - 70} max={30} tone={idxTone(c.i)} />}
              <div style={{ fontSize: 11.5, color: "var(--dim)", marginTop: 4 }}>{c.members.map((m) => m.name.split(" ")[0] + " " + m.name.split(" ")[1][0] + ".").join(", ")}</div>
            </Tile>
          ))}
        </div>);
      case "Shift": return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 10 }}>
          {shifts.map((sh, n) => {
            const v = hw(sh.list), wk = sh.list.reduce((a, t) => a + t.worked, 0), pr = sh.list.reduce((a, t) => a + t.productive, 0);
            return (
              <Tile key={sh.name} hero={n === 0} title={`${sh.name} shift`} value={v == null ? "n/a" : `${Math.round(v)}%`} sub={`${sh.when}. ${sh.list.length} people, ${wk.toFixed(1)} h worked.`}>
                <KV cols={2} rows={[["Shift utilisation", `${Math.round((pr / wk) * 100)}%`], ["Overtime", `${sh.list.reduce((a, t) => a + t.overtime, 0).toFixed(1)} h`]]} />
              </Tile>
            );
          })}
          <Tile title="Late shift" value="90%" sub="14:00 starts. Scored after clock-out at 22:00; showing last night.">
            <KV cols={2} rows={[["Shift utilisation", "87%"], ["Rostered tonight", "2 plant"]]} />
          </Tile>
        </div>);
      case "Route": return <Table cols={rCols} rows={routes} dense />;
      case "Department": {
        const dl = hw(drivers), dp = hw(plant);
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 10 }}>
            <Tile title="Logistics" value={dl == null ? "n/a" : `${Math.round(dl)}%`} sub={`${drivers.length} drivers with timesheets today`}>
              <KV cols={2} rows={[["Tonnes collected", `${TODAY.collectedT} t`], ["Stops remaining", String(TODAY.stopsRemaining)], ["On time", `${TODAY.onTime}%`], ["Fleet utilisation", `${TODAY.utilisation}%`]]} />
            </Tile>
            <Tile hero title="Plant" value={dp == null ? "n/a" : `${Math.round(dp)}%`} sub="Huntstown crew, from Plant / SCADA data and timesheets">
              <KV cols={2} rows={[["Tonnes per person-hour", "2.33 t"], ["Downtime today", `${TODAY.downtimeMin} min`], ["Shift utilisation", `${Math.round(plantUtil)}%`], ["Throughput", `${TODAY.plantThroughput}% of plan`]]} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}><Spark data={PLANT_TPH} w={140} h={28} /><span style={{ fontSize: 11.5, color: "var(--faint)" }}>t per person-hour, 7 days</span></div>
            </Tile>
          </div>);
      }
      case "Day": return (
        <Grid>
          <div style={{ gridColumn: "span 7", minWidth: 0 }}><IndexBars data={DAY_VIEW.map((d) => ({ l: d.day, v: d.index + (d.day === "Today" ? delta : 0) }))} /></div>
          <div style={{ gridColumn: "span 5", minWidth: 0 }}>
            <Table dense rowKey="day" rows={DAY_VIEW} cols={[{ key: "day", label: "Day" }, { key: "hours", label: "Hours", align: "right" }, { key: "ot", label: "Overtime", align: "right", render: (r) => r.ot.toFixed(1) }, { key: "tonnes", label: "Tonnes in", align: "right", render: (r) => r.tonnes.toFixed(1) }]} />
          </div>
        </Grid>);
      case "Week": return (
        <Grid>
          <div style={{ gridColumn: "span 7", minWidth: 0 }}><IndexBars data={WEEK_VIEW.map((w) => ({ l: w.wk, v: w.index + (w.wk === "W40" ? delta : 0) }))} /></div>
          <div style={{ gridColumn: "span 5", minWidth: 0 }}>
            <Table dense rowKey="wk" rows={WEEK_VIEW} cols={[{ key: "wk", label: "Week" }, { key: "hours", label: "Hours", align: "right", render: (r) => r.hours.toLocaleString("en-IE") }, { key: "ot", label: "Overtime", align: "right", render: (r) => r.ot.toFixed(1) }]} />
          </div>
        </Grid>);
      default: return <Table cols={eCols} rows={eRows} rowKey="name" onRow={(r) => setWho(r.name)} selected={who} dense />;
    }
  };

  const cur = TIMESHEETS.find((t) => t.name === who);
  const contrib = cur ? contributions(cur, model, ex) : [];

  return (
    <Page>
      <Head eyebrow="People" title="Productivity" sub="How productivity is measured at Bia is not agreed yet. Build the model here from data Pulse already has, see the effect on every person, crew and route, then lock it in during onboarding."
        right={<><Pill tone="warn">Draft, not agreed</Pill><Btn small onClick={() => setTab("Timesheets")}>Timesheets</Btn></>} />

      <Grid style={{ marginBottom: 14 }}>
        <Card span={8} title="Productivity Model — configurable during onboarding" sub="Switch inputs on or off and set their weight. Every index on this page recalculates as you go."
          right={<Pill tone={preset === "Custom" ? "info" : "neutral"}>{preset}</Pill>}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "var(--faint)" }}>Start from</span>
            <div style={{ overflowX: "auto", maxWidth: "100%" }}><Segmented options={[...Object.keys(PRESETS), ...(preset === "Custom" ? ["Custom"] : [])]} value={preset} onChange={(k) => PRESETS[k] && setModel(PRESETS[k])} /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {INPUTS.map((i) => {
              const q = model[i.key]; const share = q.on && sumW ? (q.w / sumW) * 100 : 0;
              return (
                <div key={i.key} style={{ display: "grid", gridTemplateColumns: "34px minmax(150px,1.3fr) minmax(110px,1fr) 44px", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: "1px solid var(--border)", opacity: q.on ? 1 : 0.55, transition: "opacity .2s var(--ease)" }}>
                  <Toggle on={q.on} onChange={(v) => set(i.key, { on: v })} label={i.label} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{i.label} {i.applies !== "All" && <span style={{ fontSize: 10.5, fontWeight: 600, color: "var(--faint)", marginLeft: 4 }}>{i.applies} only</span>}</div>
                    <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{i.measure} · {i.source}</div>
                  </div>
                  <input type="range" min={0} max={50} step={5} value={q.w} disabled={!q.on} aria-label={`${i.label} weight`} onChange={(e) => set(i.key, { w: Number(e.target.value) })}
                    style={{ width: "100%", accentColor: "var(--accent)", cursor: q.on ? "pointer" : "default" }} />
                  <span style={{ textAlign: "right", fontSize: 13, fontWeight: 700, color: q.on ? "var(--ink)" : "var(--faint)", fontVariantNumeric: "tabular-nums" }}>{q.on ? `${Math.round(share)}%` : "off"}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 12.5, color: "var(--dim)", lineHeight: 1.7 }}>
            <span style={{ color: "var(--faint)", fontWeight: 600, marginRight: 6 }}>Index =</span>
            {onKeys.length ? onKeys.map((i, n) => (
              <span key={i.key}>{n > 0 && " + "}<b style={{ color: "var(--accent)", fontWeight: 700 }}>{(model[i.key].w / sumW).toFixed(2)}</b> × {i.label.toLowerCase()}</span>
            )) : <span style={{ color: "var(--warn)" }}>no inputs selected</span>}
            <span style={{ color: "var(--faint)" }}>. Scores run 0 to 100; inputs that don't apply to a role are left out and the rest reweighted.</span>
          </div>
        </Card>

        <Card span={4} title="Overall productivity" sub="Operational staff with timesheets today">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, paddingTop: 4 }}>
            <Donut size={184} parts={[{ v: all ?? 0, c: "var(--accent)" }, { v: 100 - (all ?? 0), c: "transparent" }]} label={all == null ? "n/a" : `${Math.round(all)}%`} sub={preset === "Current draft" && !ex ? "Current draft model" : "With your changes"} />
            <div style={{ fontSize: 13, color: Math.abs(delta) < 0.05 ? "var(--dim)" : delta > 0 ? "var(--ok)" : "var(--warn)", fontWeight: 600 }}>
              {Math.abs(delta) < 0.05 ? `Matches today's reported ${OVERALL}%` : `${fmtD(delta)} pts against today's reported ${OVERALL}%`}
            </div>
            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center", marginTop: 4 }}>
              {[["93+", eRows.filter((r) => r.live != null && r.live >= 92.5).length], ["88 to 92", eRows.filter((r) => r.live != null && r.live >= 87.5 && r.live < 92.5).length], ["Below 88", eRows.filter((r) => r.live != null && r.live < 87.5).length]].map(([l, n], k) => (
                <div key={String(l)} style={{ padding: "8px 4px", borderRadius: 12, background: "var(--surface-2)" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: [toneColor.ok, "var(--accent)", toneColor.warn][k] }}>{n}</div>
                  <div style={{ fontSize: 10.5, color: "var(--faint)" }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap", justifyContent: "center" }}>
              <Btn small kind="primary" onClick={() => toast("Draft model saved", "Shared with Pat Loughman for review before onboarding sign-off.")}>Save draft</Btn>
              <Btn small onClick={() => { setModel(DEFAULT_MODEL); setEx(false); }}>Reset</Btn>
            </div>
            <div style={{ fontSize: 11.5, color: "var(--faint)", textAlign: "center", lineHeight: 1.45 }}>Management roles are not scored.</div>
          </div>
        </Card>
      </Grid>

      <div style={{ marginBottom: 14 }}>
        <AgentNote agent="Productivity Agent" state={ex ? "approved" : undefined}
          actions={<>
            <Btn small kind={ex ? "ghost" : "primary"} onClick={() => setEx(!ex)}>{ex ? "Count fault time again" : "Exclude vehicle fault time"}</Btn>
            <Btn small onClick={() => setModel(PRESETS["Hours only"])}>Compare with hours only</Btn>
            <Btn small onClick={() => setView("Route")}>Route view</Btn>
          </>}>
          Today reads {OVERALL}%. Two things pull it down that aren't about pace. Marek Kowalski lost 1.3 h waiting on the BIA-07 recovery, which a timesheet counts as unproductive; excluding fault time moves him from 84 to {Math.round(liveIndex(TIMESHEETS.find((t) => t.name === "Marek Kowalski")!, model, true) ?? 84)}. Darragh Quinn's route ran 38 min long on city centre access and a moved break. Before this model is agreed, decide whether fleet faults and access delays should count against the driver.
        </AgentNote>
      </div>

      <Card title={`${view} view`} sub={view === "Employee" ? "Operational staff only. Click a row to see how their index is built." : view === "Route" ? "Planned against actual duration for today's routes, from Fleet / telematics" : view === "Day" || view === "Week" ? "Whole operational workforce. Current period moves with the model." : "Hours-weighted from each person's live index"}
        right={<Segmented options={VIEWS} value={view} onChange={setView} />} pad={view === "Employee" || view === "Route" ? false : true}>
        <div key={view} style={{ animation: "biaFade .3s var(--ease) both" }}>{viewBody()}</div>
      </Card>

      <Drawer open={!!cur} onClose={() => setWho(null)} title={cur?.name ?? ""} sub={cur ? `${cur.role} · ${cur.dept} · ${cur.shift}` : undefined}>
        {cur && (
          <>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-1.4px", color: "var(--ink)" }}>{Math.round(idx(cur) ?? 0)}</span>
              <span style={{ fontSize: 13, color: "var(--dim)" }}>Productivity index, reported today {cur.index}</span>
            </div>
            <Section title="How it's built">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {contrib.map((c) => (
                  <div key={c.key}>
                    <div style={{ display: "flex", fontSize: 12.5, marginBottom: 5, gap: 8 }}>
                      <span style={{ flex: 1, color: "var(--body)" }}>{c.label} <span style={{ color: "var(--faint)" }}>× {(c.share * 100).toFixed(0)}%</span></span>
                      <span style={{ color: "var(--ink)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{c.score.toFixed(0)}</span>
                    </div>
                    <Bar value={c.score} tone={c.score >= 90 ? "accent" : "warn"} />
                  </div>
                ))}
                {!contrib.length && <div style={{ fontSize: 13, color: "var(--faint)" }}>No enabled inputs apply to this role.</div>}
              </div>
            </Section>
            <Section title="Today's figures">
              <KV rows={[["Worked", `${cur.worked} h`], ["Productive", `${cur.productive} h`], ["Overtime", cur.overtime ? `${cur.overtime} h` : "None"], ["Jobs", cur.jobs != null ? String(cur.jobs) : "n/a"], ["Tonnes", cur.tonnes != null ? `${cur.tonnes} t` : "n/a"], ["Stops", cur.stops != null ? String(cur.stops) : "n/a"]]} />
            </Section>
            {cur.name === "Marek Kowalski" && <AgentNote agent="Productivity Agent">1.3 h of today's shift was waiting on the BIA-07 recovery. {ex ? "That time is excluded in this model." : "Use \"Exclude vehicle fault time\" to see the effect."}</AgentNote>}
          </>
        )}
      </Drawer>
    </Page>
  );
}
