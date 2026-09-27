import { useEffect, useState, type ReactNode } from "react";
import { bulk204, decide, useBia } from "./store";
import { COLLECTION_TYPES, FEEDSTOCK_MIX, HEALTH, JOBS, PLANT_ALERTS, TIMESHEETS, TODAY, VEHICLES, WEEK, type Tone } from "./story";
import { Bar, Bars, Btn, Card, Donut, Grid, Kpis, Legend, Meter, Pill, SERIES, Toast, WriteBackBadge, toneColor } from "./ui";

/* Per-aspect Bia content that sits above the generic Pulse dashboard body.
   Every figure comes from story.ts or is derived from it. */

type Go = (page: string, tab?: string) => void;

function reducedMotion() {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
}

/* Counts a number in from zero once, on mount. Instant under reduced motion. */
function useCount(target: number, ms = 900) {
  const [v, setV] = useState(() => (reducedMotion() ? target : 0));
  useEffect(() => {
    if (reducedMotion()) { setV(target); return; }
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function Num({ value, dec = 0, suffix = "" }: { value: number; dec?: number; suffix?: string }) {
  const v = useCount(value);
  return <>{v.toLocaleString("en-IE", { minimumFractionDigits: dec, maximumFractionDigits: dec })}{suffix}</>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".14em", color: "var(--faint)", textTransform: "uppercase" }}>{children}</div>;
}

/* ---------------- Executive ---------------- */

function Connector({ delay }: { delay: number }) {
  return (
    <div aria-hidden style={{ flex: "1 1 28px", minWidth: 20, alignSelf: "center", position: "relative", height: 2, borderRadius: 2, background: "var(--accent-line)", overflow: "hidden" }}>
      <span style={{ position: "absolute", inset: 0, width: "30%", background: "linear-gradient(90deg,transparent,var(--accent),transparent)", animation: `biaFlow 1.9s linear ${delay}ms infinite` }} />
    </div>
  );
}

function Executive({ go }: { go?: Go }) {
  const stages: { label: string; value: number; unit: string; dec: number; sub: string; pct: number; page: string; tab: string }[] = [
    { label: "Collections", value: TODAY.collectedT, unit: " t", dec: 1, sub: `${TODAY.complete} of ${TODAY.collections} jobs complete`, pct: (TODAY.complete / TODAY.collections) * 100, page: "Collections", tab: "Live Jobs" },
    { label: "Intake", value: TODAY.intakeT, unit: " t", dec: 1, sub: `${TODAY.plantThroughput}% of ${TODAY.intakePlanT} t plan`, pct: TODAY.plantThroughput, page: "Plant", tab: "Intake" },
    { label: "Processing", value: TODAY.processedT, unit: " t", dec: 1, sub: `${TODAY.processingRate}, ${TODAY.queueT} t queued`, pct: (TODAY.processedT / TODAY.acceptedT) * 100, page: "Plant", tab: "Processing" },
    { label: "Biomethane", value: TODAY.biomethaneMWh, unit: " MWh", dec: 1, sub: `${TODAY.biomethaneRate} to grid`, pct: TODAY.plantThroughput, page: "Plant", tab: "Output" },
  ];
  const avg = HEALTH.reduce((a, h) => a + h.score, 0) / HEALTH.length;
  return (
    <Grid>
      <Card span={8} title="Operational flow, today" sub="Waste moving through the chain, from customer bin to renewable gas" right={<Pill tone="ok">Live</Pill>}>
        <div style={{ display: "flex", alignItems: "stretch", gap: 8, flexWrap: "wrap" }}>
          {stages.map((s, i) => (
            <div key={s.label} style={{ display: "contents" }}>
              <button onClick={go ? () => go(s.page, s.tab) : undefined}
                style={{ flex: "1 1 150px", minWidth: 140, textAlign: "left", padding: "14px 14px 12px", borderRadius: 16, cursor: go ? "pointer" : "default", fontFamily: "inherit",
                  background: i === stages.length - 1 ? "var(--accent-faint)" : "var(--surface-2)", border: "1px solid " + (i === stages.length - 1 ? "var(--accent-line)" : "var(--border)"),
                  animation: `pageIn .5s var(--ease) ${i * 90}ms both` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, color: "var(--dim)", fontWeight: 500 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 6, background: "var(--accent-soft)", color: "var(--accent)", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                  {s.label}
                </div>
                <div style={{ marginTop: 10, fontSize: 24, fontWeight: 600, letterSpacing: "-.7px", color: i === stages.length - 1 ? "var(--accent)" : "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                  <Num value={s.value} dec={s.dec} suffix={s.unit} />
                </div>
                <div style={{ marginTop: 3, fontSize: 11.5, color: "var(--faint)", minHeight: 16 }}>{s.sub}</div>
                <div style={{ marginTop: 10 }}><Bar value={s.pct} h={4} /></div>
              </button>
              {i < stages.length - 1 && <Connector delay={i * 300} />}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 22px", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)", fontSize: 12.5, color: "var(--dim)" }}>
          <span>Accepted at weighbridge <b style={{ color: "var(--ink)" }}>{TODAY.acceptedT} t</b></span>
          <span>Digestate out <b style={{ color: "var(--ink)" }}>{TODAY.digestateT} t</b></span>
          <span>Fleet active <b style={{ color: "var(--ink)" }}>{TODAY.fleetActive} of {TODAY.fleet}</b></span>
          <span>Collections at risk <b style={{ color: "var(--warn)" }}>{TODAY.atRisk}</b></span>
        </div>
      </Card>
      <Card span={4} title="Business health" sub="Scored across live data from every connected system" right={<span style={{ fontSize: 22, fontWeight: 600, color: "var(--accent)", letterSpacing: "-.6px" }}><Num value={avg} dec={1} /></span>}>
        {HEALTH.map((h) => <Meter key={h.label} label={h.label} value={h.score} suffix="" tone={h.score >= 90 ? "accent" : "warn"} note="/ 100" />)}
      </Card>
    </Grid>
  );
}

/* ---------------- Logistics ---------------- */

function Logistics({ go }: { go?: Go }) {
  const s = useBia();
  const b = bulk204(s);
  const jobs = JOBS.map((j) => (j.id === "BULK-204" ? { ...j, vehicle: b.vehicle, status: b.status } : j));
  const rows = VEHICLES.map((v) => {
    const mine = jobs.filter((j) => j.vehicle === v.id);
    return {
      id: v.id, driver: v.driver, status: v.status,
      complete: mine.filter((j) => j.status === "Complete").length,
      risk: mine.filter((j) => j.status === "At risk").length,
      active: mine.filter((j) => j.status !== "Complete" && j.status !== "At risk").length,
      tonnes: mine.reduce((a, j) => a + (j.actual || 0), 0),
    };
  }).filter((r) => r.complete + r.active + r.risk > 0).sort((a, z) => (z.complete + z.active + z.risk) - (a.complete + a.active + a.risk));
  const maxJobs = Math.max(...rows.map((r) => r.complete + r.active + r.risk));
  const typeTotal = COLLECTION_TYPES.reduce((a, t) => a + t.tonnes, 0);
  const onTime = TODAY.onTime;
  return (
    <>
      <Kpis min={150} items={[
        { label: "Collections today", value: <Num value={TODAY.collections} />, sub: `${TODAY.complete} complete, ${TODAY.active} active`, hero: true },
        { label: "Stops remaining", value: <Num value={TODAY.stopsRemaining} />, sub: `across ${TODAY.fleetActive} active routes` },
        { label: "On-time", value: <Num value={onTime} suffix="%" />, sub: `${b.atRisk} collections at risk`, tone: "ok" },
        { label: "Tonnes collected", value: <Num value={TODAY.collectedT} dec={1} suffix=" t" />, sub: "today, weighed at Huntstown" },
        { label: "Avg tonnes / route", value: <Num value={TODAY.collectedT / TODAY.fleetActive} dec={1} suffix=" t" />, sub: `${TODAY.fleetActive} routes running` },
        { label: "Vehicle utilisation", value: <Num value={TODAY.utilisation} suffix="%" />, sub: `${TODAY.fleetAvailable} of ${TODAY.fleet} available` },
      ]} />
      <Grid>
        <Card span={7} title="Route completion today" sub="Jobs per vehicle: complete, in progress and at risk" right={go && <Btn small onClick={() => go("Collections", "Routes")}>Open routes</Btn>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {rows.map((r) => {
              const tot = r.complete + r.active + r.risk;
              return (
                <div key={r.id} style={{ display: "grid", gridTemplateColumns: "62px minmax(0,1fr) 44px 58px", alignItems: "center", gap: 10, fontSize: 12.5 }}>
                  <span style={{ fontWeight: 600, color: r.status === "Fault" ? "var(--bad)" : "var(--ink)" }}>{r.id}</span>
                  <div style={{ display: "flex", height: 10, width: `${(tot / maxJobs) * 100}%`, minWidth: 24, borderRadius: 6, overflow: "hidden", gap: 2 }}>
                    {r.complete > 0 && <span style={{ flex: r.complete, background: "var(--accent)" }} />}
                    {r.active > 0 && <span style={{ flex: r.active, background: toneColor.info }} />}
                    {r.risk > 0 && <span style={{ flex: r.risk, background: "var(--bad)" }} />}
                  </div>
                  <span style={{ color: "var(--dim)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{r.complete}/{tot}</span>
                  <span style={{ color: "var(--faint)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{r.tonnes ? r.tonnes.toFixed(1) + " t" : "0 t"}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 11.5, color: "var(--dim)", flexWrap: "wrap" }}>
            {([["Complete", "var(--accent)"], ["In progress", toneColor.info], ["At risk", "var(--bad)"]] as const).map(([l, c]) => (
              <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: c }} />{l}</span>
            ))}
            {b.moved && <span style={{ marginLeft: "auto" }}><WriteBackBadge system="Fleet System" /></span>}
          </div>
        </Card>
        <Card span={5} title="Collection type breakdown" sub="Today's jobs by service type">
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <Donut size={138} parts={COLLECTION_TYPES.map((t, i) => ({ v: t.tonnes, c: SERIES[i % SERIES.length] }))} label={String(COLLECTION_TYPES.reduce((a, t) => a + t.count, 0))} sub="jobs" />
            <Legend items={COLLECTION_TYPES.map((t, i) => ({ label: `${t.type} · ${t.count}`, value: `${t.tonnes.toFixed(1)} t`, c: SERIES[i % SERIES.length] }))} />
          </div>
          <div style={{ marginTop: 12, fontSize: 11.5, color: "var(--faint)" }}>{typeTotal.toFixed(1)} t booked across all types, including outbound digestate delivery.</div>
        </Card>
      </Grid>
    </>
  );
}

/* ---------------- Plant ---------------- */

const INTAKE_BY_HOUR: [string, number][] = [["06", 8.2], ["07", 14.6], ["08", 18.9], ["09", 21.4], ["10", 26.8], ["11", 24.1], ["12", 31.6], ["13", 7.8]];

function Plant({ go }: { go?: Go }) {
  const s = useBia();
  const int = s.approvals.int1048;
  return (
    <>
      <Kpis min={132} items={[
        { label: "Intake", value: <Num value={TODAY.intakeT} dec={1} suffix=" t" />, sub: `plan ${TODAY.intakePlanT} t`, hero: true },
        { label: "Processed", value: <Num value={TODAY.processedT} dec={1} suffix=" t" />, sub: TODAY.processingRate },
        { label: "Feedstock queue", value: <Num value={TODAY.queueT} dec={1} suffix=" t" />, sub: "INT-1049 awaiting tip" },
        { label: "Biomethane", value: <Num value={TODAY.biomethaneMWh} dec={1} suffix=" MWh" />, sub: TODAY.biomethaneRate, tone: "accent" },
        { label: "Digestate", value: <Num value={TODAY.digestateT} dec={1} suffix=" t" />, sub: "to storage" },
        { label: "Availability", value: <Num value={WEEK.plantAvailability} dec={1} suffix="%" />, sub: "this week", tone: "ok" },
        { label: "Downtime", value: <Num value={TODAY.downtimeMin} suffix=" min" />, sub: "Digester 2 feed, restored 11:58" },
      ]} />
      <Grid>
        <Card span={7} title="Intake by hour vs plan" sub="Net tonnes over the weighbridge. Dashed line is the hourly plan." right={go && <Btn small onClick={() => go("Plant", "Weighbridge")}>Weighbridge</Btn>}>
          <Bars data={INTAKE_BY_HOUR} unit=" t" h={150} plan={INTAKE_BY_HOUR.map(() => TODAY.intakePlanT / 8)} />
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", height: 8, borderRadius: 6, overflow: "hidden", gap: 2 }}>
              {FEEDSTOCK_MIX.map((f, i) => <span key={f.label} title={`${f.label} ${f.pct}%`} style={{ flex: f.pct, background: SERIES[i] }} />)}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginTop: 8, fontSize: 11.5, color: "var(--dim)" }}>
              {FEEDSTOCK_MIX.map((f, i) => <span key={f.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: SERIES[i] }} />{f.label} {f.pct}%</span>)}
            </div>
          </div>
        </Card>
        <Card span={5} title="Current alerts" sub="From the plant data feed and weighbridge">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ padding: "11px 13px", borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                INT-1048 weight variance
                <span style={{ marginLeft: "auto" }}><Pill tone={int === "approved" ? "ok" : int === "rejected" ? "bad" : "warn"}>{int === "approved" ? "Accepted" : int === "rejected" ? "Rejected" : "Review"}</Pill></span>
              </div>
              <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>FreshFields Foods, BIA-14. Net 19.27 t against 17.57 t expected, +1.70 t.</div>
              {int === "pending"
                ? <div style={{ display: "flex", gap: 8, marginTop: 10 }}><Btn small kind="primary" onClick={() => decide("int1048", "approved", "INT-1048 accepted at 19.27 t net")}>Accept 19.27 t</Btn>{go && <Btn small onClick={() => go("Plant", "Weighbridge")}>Review ticket</Btn>}</div>
                : int === "approved" && <div style={{ marginTop: 10 }}><WriteBackBadge system="Weighbridge" /></div>}
            </div>
            {PLANT_ALERTS.map((a) => (
              <div key={a.title} style={{ display: "flex", gap: 10, padding: "2px 2px" }}>
                <span style={{ width: 8, height: 8, borderRadius: 8, marginTop: 5, flex: "none", background: toneColor[a.tone as Tone] }} />
                <div>
                  <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "var(--faint)", marginTop: 2 }}>{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Grid>
    </>
  );
}

/* ---------------- Productivity ---------------- */

function Productivity({ go }: { go?: Go }) {
  const s = useBia();
  const ot = s.approvals.overtime;
  const teams = [
    { label: "Drivers", match: (r: string) => /Driver/.test(r) },
    { label: "Plant operators", match: (r: string) => /Plant|Depackaging/.test(r) },
    { label: "Weighbridge", match: (r: string) => /Weighbridge/.test(r) },
    { label: "Yard", match: (r: string) => /Yard/.test(r) },
  ].map((t) => {
    const m = TIMESHEETS.filter((x) => t.match(x.role));
    const worked = m.reduce((a, x) => a + x.worked, 0);
    const planned = m.reduce((a, x) => a + x.worked - x.overtime, 0);
    const productive = m.reduce((a, x) => a + x.productive, 0);
    return { label: t.label, people: m.length, worked, planned, productive, pct: Math.round((productive / worked) * 100) };
  });
  const worked = TIMESHEETS.reduce((a, x) => a + x.worked, 0);
  const productive = TIMESHEETS.reduce((a, x) => a + x.productive, 0);
  const maxH = Math.max(...teams.map((t) => t.worked));
  const pending = TIMESHEETS.filter((x) => x.status === "Review" && x.dept === "Logistics");
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, background: "var(--accent-faint)", border: "1px solid var(--accent-line)", fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>
          Productivity Model — configurable during onboarding
        </span>
        <span style={{ fontSize: 12, color: "var(--faint)" }}>Weights, targets and what counts as productive time are agreed with Bia before go-live. Team level only.</span>
      </div>
      <Kpis min={150} items={[
        { label: "Workforce productivity", value: <Num value={TODAY.productivity} suffix="%" />, sub: "productive share of paid hours", hero: true },
        { label: "Route productivity", value: <Num value={TODAY.collectedT / TIMESHEETS.filter((x) => /Driver/.test(x.role)).reduce((a, x) => a + x.productive, 0)} dec={2} suffix=" t/h" />, sub: "tonnes per driver hour today" },
        { label: "Plant productivity", value: <Num value={parseFloat(TODAY.processingRate)} dec={1} suffix=" t/h" />, sub: "processing rate, target 12 t/h" },
        { label: "Overtime", value: <Num value={TODAY.overtimePending} dec={1} suffix=" h" />, sub: ot === "approved" ? "approved, posted to payroll" : "pending approval, Logistics", tone: ot === "approved" ? "ok" : "warn" },
        { label: "Productive hours", value: <Num value={productive} dec={1} suffix=" h" />, sub: `of ${worked.toFixed(1)} h worked today` },
        { label: "Cost / productive hour", value: "€38.40", sub: "blended, this week" },
      ]} />
      <Grid>
        <Card span={7} title="Planned vs actual hours by team" sub="Today, from timesheets. Solid is worked, the marker is planned, green is productive.">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {teams.map((t) => (
              <div key={t.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
                  <span style={{ color: "var(--body)" }}>{t.label} <span style={{ color: "var(--faint)" }}>· {t.people} people</span></span>
                  <span style={{ color: "var(--ink)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{t.worked.toFixed(1)} h <span style={{ color: "var(--faint)", fontWeight: 400 }}>vs {t.planned.toFixed(1)} h planned · {t.pct}%</span></span>
                </div>
                <div style={{ position: "relative", height: 12, borderRadius: 7, background: "var(--track)", overflow: "hidden" }}>
                  <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(t.worked / maxH) * 100}%`, background: "var(--accent-soft)", borderRadius: 7 }} />
                  <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(t.productive / maxH) * 100}%`, background: "var(--accent)", borderRadius: 7 }} />
                  <span style={{ position: "absolute", top: -2, bottom: -2, left: `${(t.planned / maxH) * 100}%`, width: 2, background: "var(--ink)", opacity: 0.7 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card span={5} title="Overtime awaiting approval" sub="Logistics, current payroll period" right={<Pill tone={ot === "approved" ? "ok" : "warn"}>{ot === "approved" ? "Approved" : `${TODAY.overtimePending} h pending`}</Pill>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pending.map((p) => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5 }}>
                <span style={{ flex: 1, color: "var(--body)" }}>{p.name} <span style={{ color: "var(--faint)" }}>· {p.role}</span></span>
                <span style={{ color: "var(--ink)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{p.overtime.toFixed(1)} h</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14, alignItems: "center", flexWrap: "wrap" }}>
            {ot === "pending"
              ? <><Btn small kind="primary" onClick={() => decide("overtime", "approved", "6.5 h Logistics overtime approved")}>Approve 6.5 h</Btn>{go && <Btn small onClick={() => go("People", "Timesheets")}>Open timesheets</Btn>}</>
              : ot === "approved" ? <WriteBackBadge system="Timesheets / HR" /> : <Pill tone="bad">Rejected</Pill>}
          </div>
        </Card>
      </Grid>
    </>
  );
}

/* ---------------- Sustainability ---------------- */

const YTD = { divertedT: 73480, gasMWh: 82640, homes: 10400, co2T: 38100, digestateT: 62310, fertT: 1310 };
const GAS_BY_MONTH: [string, number][] = [["Jan", 8720], ["Feb", 8110], ["Mar", 9050], ["Apr", 9180], ["May", 9420], ["Jun", 9310], ["Jul", 9640], ["Aug", 9580], ["Sep", 9630]];

function Tile({ label, value, unit, note, i, big }: { label: string; value: number; unit: string; note: string; i: number; big?: boolean }) {
  return (
    <div style={{ padding: big ? "18px 18px 16px" : "14px 16px", borderRadius: 18, background: "var(--surface)", border: "1px solid var(--border)", animation: `pageIn .55s var(--ease) ${i * 70}ms both`, minWidth: 0 }}>
      <div style={{ fontSize: 11.5, color: "var(--dim)", fontWeight: 500 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: big ? 30 : 24, fontWeight: 600, letterSpacing: "-.9px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
        <Num value={value} /><span style={{ fontSize: big ? 15 : 13, color: "var(--dim)", fontWeight: 500, letterSpacing: 0 }}>{unit}</span>
      </div>
      <div style={{ marginTop: 4, fontSize: 11, color: "var(--faint)" }}>{note}</div>
    </div>
  );
}

function Sustainability() {
  const co2 = [{ label: "Waste kept out of landfill", v: 48, c: SERIES[0] }, { label: "Fossil gas displaced", v: 43, c: SERIES[1] }, { label: "Chemical fertiliser displaced", v: 9, c: SERIES[2] }];
  const loop = ["Food waste", "Depackaging", "Anaerobic digestion", "Renewable gas", "Biofertiliser", "Farmland"];
  return (
    <>
      <section style={{ position: "relative", overflow: "hidden", borderRadius: 26, padding: "26px 26px 24px", marginBottom: 14, border: "1px solid var(--accent-line)",
        background: "radial-gradient(70% 90% at 0% 0%, var(--accent-soft), transparent 60%), radial-gradient(50% 70% at 100% 100%, var(--accent-faint), transparent 70%), var(--surface-2)" }}>
        <div className="bia-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.5fr)", gap: 24, alignItems: "center" }}>
          <div style={{ minWidth: 0 }}>
            <Eyebrow>Year to date, 2026</Eyebrow>
            <div style={{ marginTop: 12, fontSize: 52, fontWeight: 600, letterSpacing: "-2px", lineHeight: 1, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>
              <Num value={YTD.divertedT} /><span style={{ fontSize: 22, letterSpacing: "-.4px" }}> t</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 15, color: "var(--ink)", fontWeight: 500 }}>of food waste diverted from landfill and turned into energy</div>
            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
              {loop.map((l, i) => (
                <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11.5, padding: "4px 9px", borderRadius: 999, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--body)" }}>{l}</span>
                  {i < loop.length - 1 && <span style={{ color: "var(--accent)", fontSize: 12 }}>→</span>}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 11.5, color: "var(--faint)", lineHeight: 1.5 }}>Weights are from weighbridge tickets. Items marked estimate use standard emission and fertiliser factors and are not audited figures.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10 }}>
            <Tile i={0} label="Renewable gas generated" value={YTD.gasMWh} unit=" MWh" note="biomethane injected to grid" />
            <Tile i={1} label="Homes supplied, equivalent" value={YTD.homes} unit=" homes" note="estimate, annualised gas use" />
            <Tile i={2} label="CO₂e avoided" value={YTD.co2T} unit=" t" note="estimate, standard factors" />
            <Tile i={3} label="Digestate produced" value={YTD.digestateT} unit=" t" note="biofertiliser to Irish farms" />
            <Tile i={4} label="Chemical fertiliser displaced" value={YTD.fertT} unit=" t" note="estimate, N-P-K equivalent" />
            <Tile i={5} label="This week" value={WEEK.biomethaneMWh} unit=" MWh" note={`from ${WEEK.processedT.toLocaleString("en-IE")} t processed`} />
          </div>
        </div>
      </section>
      <Grid>
        <Card span={7} title="Renewable gas by month" sub="MWh of biomethane, 2026 to date">
          <Bars data={GAS_BY_MONTH} unit=" MWh" h={160} />
        </Card>
        <Card span={5} title="Where the CO₂e saving comes from" sub="Share of estimated CO₂e avoided, year to date">
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <Donut size={138} parts={co2.map((c) => ({ v: c.v, c: c.c }))} label={<Num value={YTD.co2T / 1000} dec={1} suffix="k" />} sub="t CO₂e" />
            <Legend items={co2.map((c) => ({ label: c.label, value: c.v + "%", c: c.c }))} />
          </div>
        </Card>
      </Grid>
    </>
  );
}

export default function DashExtras({ aspect, go }: { aspect: string; go?: Go }) {
  let body: ReactNode = null;
  if (aspect === "executive") body = <Executive go={go} />;
  else if (aspect === "logistics") body = <Logistics go={go} />;
  else if (aspect === "plant") body = <Plant go={go} />;
  else if (aspect === "productivity") body = <Productivity go={go} />;
  else if (aspect === "sustainability") body = <Sustainability />;
  if (!body) return null;
  return (
    <div key={aspect} style={{ padding: "0 4px 22px", animation: "pageIn .45s var(--ease) both" }}>
      {body}
      <Toast />
    </div>
  );
}
