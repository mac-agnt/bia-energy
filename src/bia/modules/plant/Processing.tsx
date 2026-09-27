import type { ModProps } from "../../Module";
import { useBia } from "../../store";
import { TODAY, type Tone } from "../../story";
import { AgentNote, Bars, Btn, Card, Grid, Head, KV, Kpis, Meter, Page, Pill, Spark, Table, type Col } from "../../ui";
import { NOW, RATE_TARGET, RATE_TREND, Stat } from "./shared";

type Unit = { name: string; status: string; tone: Tone; headline: string; headlineSub: string; rows: [string, string][]; note?: string; fill?: number; level?: number };

const LINES: Unit[] = [
  { name: "Depackaging line 1", status: "Watch", tone: "warn", headline: "92%", headlineSub: "of rated throughput, down 8%", level: 92,
    rows: [["Throughput", "5.5 t/h"], ["Backlog", "4.2 t pallets"], ["Packaging removed today", "2.1 t"], ["Clears in", "about 25 min"]], note: "Pallet backlog from INT-1048." },
  { name: "Depackaging line 2", status: "Normal", tone: "ok", headline: "101%", headlineSub: "of rated throughput", level: 100,
    rows: [["Throughput", "6.1 t/h"], ["Backlog", "0.0 t"], ["Packaging removed today", "2.6 t"], ["Last screen change", "Mon 14:10"]] },
];
const DIGESTERS: Unit[] = [
  { name: "Digester 1", status: "Normal", tone: "ok", headline: "34 days", headlineSub: "hydraulic retention", fill: 88, rows: [["Feed", "4.1 t/h"], ["Temperature", "38.4 °C"], ["Mixer", "Running"]] },
  { name: "Digester 2", status: "Normal", tone: "ok", headline: "33 days", headlineSub: "hydraulic retention", fill: 84, rows: [["Feed", "3.6 t/h"], ["Temperature", "38.1 °C"], ["Mixer", "Running"]], note: "Feed restored 11:58 after 22 min pause." },
  { name: "Digester 3", status: "Normal", tone: "ok", headline: "36 days", headlineSub: "hydraulic retention", fill: 91, rows: [["Feed", "4.2 t/h"], ["Temperature", "38.6 °C"], ["Mixer", "Running"]] },
];

type Down = { id: string; when: string; asset: string; dur: string; mins: number; cause: string; kind: string; status: string };
const DOWNTIME: Down[] = [
  { id: "DT-0931", when: "Today 11:36", asset: "Digester 2 feed", dur: "22 min", mins: 22, cause: "Feed pump blockage, cleared by plant crew", kind: "Unplanned", status: "Resolved" },
  { id: "DT-0930", when: "Mon 14:10", asset: "Depackaging line 2", dur: "35 min", mins: 35, cause: "Screen change", kind: "Planned", status: "Complete" },
  { id: "DT-0929", when: "Sun 03:20", asset: "Gas upgrading unit", dur: "18 min", mins: 18, cause: "Compressor trip, automatic restart", kind: "Unplanned", status: "Resolved" },
  { id: "DT-0928", when: "Fri 09:45", asset: "Weighbridge 2", dur: "15 min", mins: 15, cause: "Load cell check", kind: "Planned", status: "Complete" },
  { id: "DT-0927", when: "Thu 16:05", asset: "Depackaging line 1", dur: "41 min", mins: 41, cause: "Conveyor belt tracking", kind: "Unplanned", status: "Resolved" },
  { id: "DT-0926", when: "Wed 07:10", asset: "Digester 1 mixer", dur: "3 h 12 min", mins: 192, cause: "Gearbox replacement", kind: "Planned", status: "Complete" },
];

function Tank({ fill }: { fill: number }) {
  return (
    <div aria-label={`Fill level ${fill}%`} style={{ position: "relative", width: 58, height: 96, borderRadius: "16px 16px 12px 12px", border: "1.5px solid var(--border-strong)", background: "var(--track)", overflow: "hidden", flex: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "100%", transformOrigin: "bottom", transform: `scaleY(${fill / 100})`, background: "linear-gradient(180deg,var(--accent),var(--accent-soft))", opacity: 0.85, transition: "transform .9s var(--ease)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--ink)", textShadow: "0 1px 6px var(--surface)" }}>{fill}%</div>
    </div>
  );
}

function UnitCard({ u, delay }: { u: Unit; delay: number }) {
  return (
    <Card span={4} title={u.name} right={<Pill tone={u.tone}>{u.status}</Pill>} tone={u.tone === "warn" ? "warn" : undefined} style={{ animation: `pageIn .5s var(--ease) ${delay}ms both` }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {u.fill != null && <Tank fill={u.fill} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.8px", color: u.tone === "warn" ? "var(--warn)" : "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{u.headline}</div>
          <div style={{ fontSize: 12, color: "var(--faint)", marginBottom: 10 }}>{u.headlineSub}</div>
          {u.level != null && <Meter label="Rated throughput" value={u.level} tone={u.tone === "warn" ? "warn" : "accent"} />}
        </div>
      </div>
      <div style={{ marginTop: 12 }}><KV cols={2} rows={u.rows} /></div>
      {u.note && <div style={{ marginTop: 12, fontSize: 12, color: u.tone === "warn" ? "var(--warn)" : "var(--dim)" }}>{u.note}</div>}
    </Card>
  );
}

export default function Processing({ setTab }: ModProps) {
  const s = useBia();
  const resolved = s.approvals.int1048 === "approved";
  const cols: Col<Down>[] = [
    { key: "when", label: "Started" },
    { key: "asset", label: "Asset", render: (r) => <span style={{ color: "var(--ink)", fontWeight: 500 }}>{r.asset}</span> },
    { key: "dur", label: "Duration", align: "right" },
    { key: "cause", label: "Cause" },
    { key: "kind", label: "Type", render: (r) => <Pill tone={r.kind === "Planned" ? "info" : "warn"}>{r.kind}</Pill> },
    { key: "status", label: "Status", render: (r) => <Pill>{r.status}</Pill> },
  ];
  const weekMin = DOWNTIME.reduce((a, d) => a + d.mins, 0);

  return (
    <Page>
      <Head eyebrow="Plant" title="Processing" sub="Depackaging, digestion and gas upgrading, read every 60 seconds from Plant / SCADA data. Read-only: Pulse sends no commands to plant equipment."
        right={<Pill tone="ok">SCADA feed live, {NOW}</Pill>} />

      <Kpis items={[
        { label: "Processed today", value: `${TODAY.processedT} t`, sub: "Fed to digesters since 00:00", hero: true },
        { label: "Processing rate", value: TODAY.processingRate, sub: `Target ${RATE_TARGET.toFixed(1)} t/h` },
        { label: "Feedstock queue", value: `${TODAY.queueT} t`, sub: "Reception pits and buffer" },
        { label: "Downtime today", value: `${TODAY.downtimeMin} min`, sub: "Digester 2 feed", tone: "warn" },
        { label: "Gas upgrading availability", value: "99.1%", sub: "This week" },
      ]} />

      <Grid style={{ marginBottom: 14 }}>
        {LINES.map((u, i) => <UnitCard key={u.name} u={u} delay={i * 50} />)}
        <Card span={4} title="Gas upgrading unit" right={<Pill tone="ok">Normal</Pill>}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.8px", color: "var(--ink)" }}>1,340 <span style={{ fontSize: 13, color: "var(--dim)", fontWeight: 500 }}>Nm³/h out</span></div>
          <div style={{ fontSize: 12, color: "var(--faint)", marginBottom: 10 }}>Biomethane to grid entry point</div>
          <Meter label="Methane purity" value={97.6} note="spec ≥ 97%" />
          <div style={{ marginTop: 10 }}><KV rows={[["Raw biogas in", "2,390 Nm³/h"], ["Availability, week", "99.1%"], ["Last trip", "Sun 03:20, 18 min"], ["Gas quality", "In spec"]]} /></div>
        </Card>
        {DIGESTERS.map((u, i) => <UnitCard key={u.name} u={u} delay={150 + i * 50} />)}
      </Grid>

      <Grid style={{ marginBottom: 14 }}>
        <Card span={7} title="Digester feed rate" sub="t/h per hour today. Dashed line is the 12.0 t/h target."
          right={<div style={{ display: "flex", alignItems: "center", gap: 14 }}><Spark data={RATE_TREND.map((r) => r[1])} w={110} h={30} /><Stat label="Now" value={TODAY.processingRate} /></div>}>
          <Bars data={RATE_TREND.map(([h, v]) => [h + ":00", v])} plan={RATE_TREND.map(() => RATE_TARGET)} unit=" t/h" h={180} />
        </Card>
        <Card span={5} title="Processing agent">
          <AgentNote agent="Processing Agent" actions={<><Btn small kind="primary" onClick={() => setTab(resolved ? "Output" : "Weighbridge")}>{resolved ? "See output" : "Review INT-1048"}</Btn><Btn small onClick={() => setTab("Exceptions")}>Exceptions</Btn></>}>
            The 11:00 dip is the Digester 2 feed pause: a blocked feed pump, cleared in 22 minutes. Digesters 1 and 3 took extra feed, so gas output held at 1,340 Nm³/h.
            Line 1 is down 8% while it works through {resolved ? "the INT-1048 pallets." : "pallets from INT-1048. Accepting the load does not change the line; it clears in about 25 minutes either way."}
          </AgentNote>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
            <Stat label="Depackaged today" value="61.4 t" />
            <Stat label="Packaging out" value="4.7 t" sub="to recycling" />
            <Stat label="Liquid buffer" value="71%" />
          </div>
        </Card>
      </Grid>

      <Card title="Downtime log" sub={`Last 7 days: ${Math.floor(weekMin / 60)} h ${weekMin % 60} min across ${DOWNTIME.length} events. Plant availability 96.8%.`} pad={false}>
        <Table cols={cols} rows={DOWNTIME} dense />
      </Card>
    </Page>
  );
}
