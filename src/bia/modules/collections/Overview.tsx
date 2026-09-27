import { useState } from "react";
import type { ModProps } from "../../Module";
import { COLLECTION_TYPES, JOBS, TODAY, type Tone } from "../../story";
import { bulk204, decide, useBia } from "../../store";
import { AgentNote, Bar, Btn, Card, Grid, Head, Kpis, Pill, RouteMap, WriteBackBadge, toneColor } from "../../ui";
import { liveVehicles } from "../fleet/derive";
import JobDrawer from "./JobDrawer";
import { ARRIVALS, STAGES, liveJobs, stageOf, type Stage } from "./derive";

const STAGE_TONE: Record<Stage, Tone> = { Scheduled: "neutral", "En route": "info", "On site": "info", Loading: "info", Returning: "accent", Complete: "ok", Exception: "bad" };
const AT_RISK_IDS = ["BULK-204", "COL-1858", "COL-1846", "TNK-044"];

export default function Overview({ go, setTab }: ModProps) {
  const s = useBia();
  const b = bulk204(s);
  const jobs = liveJobs(s);
  const vs = liveVehicles(s);
  const [sel, setSel] = useState<string | null>("BIA-07");
  const [open, setOpen] = useState<string | null>(null);
  const [fix, setFix] = useState(false);

  const active = jobs.filter((j) => j.status !== "Complete" && j.status !== "At risk").length;
  const counts = STAGES.map((st) => [st, jobs.filter((j) => stageOf(j) === st).length] as const);
  const v = vs.find((x) => x.id === sel);
  const vJobs = v ? jobs.filter((j) => j.vehicle === v.id || (v.id === "BIA-07" && j.id === "BULK-204" && !b.moved)) : [];
  const plan = s.approvals.dispatchPlan;

  return (
    <>
      <Head eyebrow="COLLECTIONS" title="Today's collections" sub={`${TODAY.date}. Every collection from customer schedule to Huntstown weighbridge, live from Fleet / telematics.`}
        right={<><Btn onClick={() => setTab("Live Jobs")}>All live jobs</Btn><Btn kind="primary" onClick={() => setFix(true)}>Fix with Dispatch Agent</Btn></>} />

      <Kpis items={[
        { label: "Collections today", value: TODAY.collections, sub: "Scheduled across 9 routes", hero: true },
        { label: "Completed", value: TODAY.complete, sub: "56% of today's plan", tone: "ok" },
        { label: "Active", value: active, sub: "Scheduled, en route or on site" },
        { label: "At risk", value: b.atRisk, sub: b.plan ? "TNK-044 in manual review" : b.moved ? "BULK-204 recovered" : "Dispatch plan ready", tone: b.atRisk > 1 ? "bad" : "warn" },
        { label: "Collected", value: TODAY.collectedT + " t", sub: "Net, weighed at Huntstown" },
        { label: "On-time", value: TODAY.onTime + "%", sub: "Target 95%", tone: "accent" },
      ]} />

      <Grid>
        <Card span={8} title="Live route map" sub="Click a vehicle to see its collection" right={<Pill tone="accent">{vs.filter((x) => x.status === "Active").length} vehicles moving</Pill>}>
          <RouteMap vehicles={vs} selected={sel} onPick={setSel} h={330} />
          {v && (
            <div style={{ marginTop: 12, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", padding: "12px 14px", borderRadius: 16, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <div style={{ minWidth: 150 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{v.id} <span style={{ fontSize: 12, color: "var(--faint)", fontWeight: 400 }}>{v.reg}</span></div>
                <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 2 }}>{v.type} · {v.driver}</div>
              </div>
              <div style={{ flex: 1, minWidth: 180, fontSize: 12.5, color: "var(--body)" }}>
                <div>{v.location}</div>
                <div style={{ color: "var(--faint)", marginTop: 2 }}>Next: {v.next}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {vJobs.filter((j) => j.status !== "Complete").slice(0, 2).map((j) => (
                  <button key={j.id} onClick={() => setOpen(j.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 12, border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--ink)", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 600 }}>
                    {j.id} <span style={{ fontWeight: 400, color: "var(--dim)" }}>{j.customer}</span> <Pill>{j.status}</Pill>
                  </button>
                ))}
                {vJobs.filter((j) => j.status !== "Complete").length === 0 && <span style={{ fontSize: 12.5, color: "var(--faint)" }}>{v.status === "Maintenance" ? "In workshop" : v.status === "Fault" ? "Off road" : "No live collection"}</span>}
              </div>
            </div>
          )}
        </Card>

        <Card span={4} title="Status pipeline" sub="All 34 collections by stage">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {counts.map(([st, n]) => (
              <div key={st} style={{ display: "grid", gridTemplateColumns: "92px 1fr 30px", alignItems: "center", gap: 10, padding: "7px 0" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "var(--body)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: 3, background: toneColor[STAGE_TONE[st]] }} />{st}
                </span>
                <Bar value={n} max={34} tone={STAGE_TONE[st]} h={8} />
                <span style={{ textAlign: "right", fontSize: 13, fontWeight: 600, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{n}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--dim)" }}>
            <span>Stops remaining</span><b style={{ color: "var(--ink)" }}>{TODAY.stopsRemaining}</b>
          </div>
          <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--dim)" }}>
            <span>Tonnes still to collect</span><b style={{ color: "var(--ink)" }}>{jobs.filter((j) => j.status !== "Complete" && j.type !== "Customer Delivery").reduce((a, j) => a + j.expected, 0).toFixed(1)} t</b>
          </div>
        </Card>

        <Card span={7} title="Needs attention" sub={`${b.atRisk} of 4 flagged collections still at risk`}
          right={!fix && plan === "pending" ? <Btn small kind="primary" onClick={() => setFix(true)}>Fix with Dispatch Agent</Btn> : plan === "approved" ? <WriteBackBadge system="Fleet System" /> : null}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 8 }}>
            {AT_RISK_IDS.map((id) => {
              const orig = JOBS.find((j) => j.id === id)!;
              const now = jobs.find((j) => j.id === id)!;
              const fixed = now.status !== "At risk";
              return (
                <button key={id} onClick={() => setOpen(id)} className="bia-row" style={{ textAlign: "left", padding: "12px 14px", borderRadius: 14, border: "1px solid " + (fixed ? "var(--border)" : "color-mix(in srgb, var(--bad) 45%, transparent)"), background: "var(--surface-2)", cursor: "pointer", fontFamily: "inherit", color: "inherit" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <b style={{ fontSize: 13, color: "var(--ink)" }}>{id}</b>
                    <span style={{ marginLeft: "auto" }}><Pill tone={fixed ? "ok" : "bad"}>{fixed ? "Resolved" : "At risk"}</Pill></span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>{orig.customer}, {orig.site}</div>
                  <div style={{ fontSize: 12, color: "var(--body)", marginTop: 6, lineHeight: 1.45 }}>{now.note}</div>
                </button>
              );
            })}
          </div>
          {(fix || plan !== "pending") && (
            <div style={{ marginTop: 12 }}>
              <AgentNote agent="Dispatch Agent" state={plan}
                actions={plan === "approved"
                  ? <><WriteBackBadge system="Fleet System" /><WriteBackBadge system="Timesheets / HR" /><WriteBackBadge system="Email" /></>
                  : plan === "rejected" ? <Btn small onClick={() => decide("dispatchPlan", "approved", "Dispatch plan applied. 3 of 4 collections recovered.")}>Approve after all</Btn>
                  : <><Btn small kind="primary" onClick={() => decide("dispatchPlan", "approved", "Dispatch plan applied. 3 of 4 collections recovered.")}>Approve changes</Btn><Btn small kind="danger" onClick={() => decide("dispatchPlan", "rejected")}>Reject</Btn></>}>
                <div style={{ marginBottom: 6 }}>Four changes. Three can be applied now, one needs a person.</div>
                <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
                  <li>Reassign <b style={{ color: "var(--ink)" }}>BULK-204</b> to BIA-14. ETA 14:37, +27 min instead of +42.</li>
                  <li>Move <b style={{ color: "var(--ink)" }}>COL-1858</b> behind COL-1861 on the Tallaght loop.</li>
                  <li>Delay D. Quinn's break 18 min, within permitted limits, so <b style={{ color: "var(--ink)" }}>COL-1846</b> lands on time.</li>
                  <li><b style={{ color: "var(--ink)" }}>TNK-044</b> needs manual review. No compatible tanker is free before 16:30.</li>
                </ol>
              </AgentNote>
            </div>
          )}
        </Card>

        <Card span={5} title="Next 5 arrivals at Huntstown" sub="Expected at the weighbridge" right={<Btn small onClick={() => go("Plant", "Weighbridge")}>Weighbridge</Btn>}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {ARRIVALS.map((a) => (
              <div key={a.job} className="bia-row" onClick={() => setOpen(a.job)} style={{ display: "grid", gridTemplateColumns: "50px 1fr auto", gap: 12, alignItems: "center", padding: "10px 4px", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{a.time}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.customer}</div>
                  <div style={{ fontSize: 11.5, color: "var(--faint)" }}>{a.job} · {a.vehicle} from {a.from}</div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{a.t.toFixed(1)} t</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: "var(--dim)" }}>
            64.6 t inbound before 16:15. Plant queue now {TODAY.queueT} t.
          </div>
        </Card>

        <Card span={12} title="Today by service type" sub="Collections and tonnes planned">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
            {COLLECTION_TYPES.map((c) => (
              <div key={c.type} style={{ padding: "12px 14px", borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 12, color: "var(--dim)" }}>{c.type}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
                  <span style={{ fontSize: 22, fontWeight: 600, color: "var(--ink)" }}>{c.count}</span>
                  <span style={{ fontSize: 12, color: "var(--faint)" }}>{c.tonnes.toFixed(1)} t</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Grid>

      <JobDrawer id={open} onClose={() => setOpen(null)} go={go} />
    </>
  );
}
