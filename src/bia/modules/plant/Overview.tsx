import type { ModProps } from "../../Module";
import { useBia } from "../../store";
import { FEEDSTOCK_MIX, PLANT_ALERTS, TODAY, WEEK, type Tone } from "../../story";
import { AgentNote, Bars, Btn, Card, Donut, Grid, Head, Kpis, Legend, Page, Pill, SERIES } from "../../ui";
import Flow from "./Flow";
import { HOURLY_INTAKE, HOURLY_PLAN, ListRow, NOW, Stat, useIntake } from "./shared";

export default function PlantOverview({ setTab, go }: ModProps) {
  const s = useBia();
  const pending = s.approvals.int1048 !== "approved";
  const intake = useIntake();
  const queue = intake.filter((i) => i.status === "In queue");

  const alerts: { tone: Tone; title: string; sub: string; open: () => void; cta: string }[] = [
    ...(pending ? [{ tone: "warn" as Tone, title: "INT-1048 weight variance, +1.70 t", sub: "FreshFields Foods on BIA-14. Net 19.27 t against 17.57 t expected. Held for weighbridge review.", open: () => setTab("Weighbridge"), cta: "Review" }] : []),
    { ...PLANT_ALERTS[0], open: () => setTab("Processing"), cta: "Line status" },
    { ...PLANT_ALERTS[1], open: () => setTab("Processing"), cta: "Downtime log" },
    { ...PLANT_ALERTS[2], open: () => go("Compliance", "Expiries"), cta: "Expiries" },
  ];

  return (
    <Page>
      <Head eyebrow="Plant" title="Huntstown plant"
        sub="Material flow from weighbridge to gas grid, read from Weighbridge and Plant / SCADA data. Pulse monitors and routes decisions; plant control stays in SCADA."
        right={<><Pill tone="ok">Live, {NOW}</Pill><Btn small kind={pending ? "primary" : "ghost"} onClick={() => setTab("Weighbridge")}>{pending ? "1 weighbridge review" : "Weighbridge"}</Btn></>} />

      <Card title="Today's material flow" sub={`${TODAY.date}. Tonnes since 00:00, gas output live.`} right={<Pill tone="accent">Plant / SCADA data</Pill>} style={{ marginBottom: 14 }}>
        <Flow reviewPending={pending} />
      </Card>

      <Kpis items={[
        { label: "Plant availability", value: `${WEEK.plantAvailability}%`, sub: "This week, 5.4 h downtime", hero: true },
        { label: "Throughput vs plan", value: `${TODAY.plantThroughput}%`, sub: `${TODAY.intakeT} of ${TODAY.intakePlanT} t` },
        { label: "Feedstock queue", value: `${TODAY.queueT} t`, sub: "Accepted, not yet fed" },
        { label: "Processing rate", value: TODAY.processingRate, sub: "Target 12.0 t/h" },
        { label: "Downtime today", value: `${TODAY.downtimeMin} min`, sub: "Digester 2 feed pause", tone: "warn" },
      ]} />

      <Grid style={{ marginBottom: 14 }}>
        <Card span={7} title="Intake by hour vs plan" sub="Tonnes weighed in per hour. Dashed line is the intake plan."
          right={<div style={{ display: "flex", gap: 18 }}><Stat label="In" value={`${TODAY.intakeT} t`} /><Stat label="Gap to plan" value={`${(TODAY.intakePlanT - TODAY.intakeT).toFixed(1)} t`} tone="warn" /></div>}>
          <Bars data={HOURLY_INTAKE.map(([h, v]) => [h + ":00", v])} plan={HOURLY_PLAN} unit=" t" h={190} />
        </Card>
        <Card span={5} title="Feedstock mix" sub="Share of tonnes fed this week">
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", paddingTop: 6 }}>
            <Donut size={150} parts={FEEDSTOCK_MIX.map((f, i) => ({ v: f.pct, c: SERIES[i] }))} label={`${WEEK.processedT.toLocaleString("en-IE")} t`} sub="fed this week" />
            <Legend items={FEEDSTOCK_MIX.map((f, i) => ({ label: f.label, value: `${f.pct}%`, c: SERIES[i] }))} />
          </div>
        </Card>
      </Grid>

      <Grid>
        <Card span={7} title="Current alerts" sub="From Plant / SCADA data and weighbridge records" right={<Pill tone={pending ? "warn" : "ok"}>{alerts.length} open</Pill>} pad={false}>
          <div style={{ padding: "0 6px 6px" }}>
            {alerts.map((a) => (
              <ListRow key={a.title} tone={a.tone} title={a.title} sub={a.sub} onClick={a.open} right={<Btn small onClick={a.open}>{a.cta}</Btn>} />
            ))}
          </div>
        </Card>
        <Card span={5} title="Plant agent" sub="Summary at 13:05">
          <AgentNote agent="Plant Agent" state={pending ? undefined : "approved"}
            actions={<><Btn small kind="primary" onClick={() => setTab("Processing")}>Open processing</Btn><Btn small onClick={() => setTab("Intake")}>Intake log</Btn></>}>
            Huntstown is 6.6 t short of the intake plan, mostly because BULK-204 slipped after the BIA-07 fault. Digesters are fed at 11.9 t/h and the queue is small, so gas output is unaffected.
            {pending ? " Depackaging line 1 is carrying the INT-1048 pallets and should clear in about 25 minutes." : " INT-1048 is accepted and line 1 is working through the pallets."}
          </AgentNote>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
            <Stat label="At the weighbridge" value={queue.length ? `${queue.length} in queue` : "Clear"} sub={queue[0] ? `${queue[0].id}, ${queue[0].vehicle}` : undefined} />
            <Stat label="Biomethane this week" value={`${WEEK.biomethaneMWh.toLocaleString("en-IE")} MWh`} sub="Injected to gas grid" />
          </div>
        </Card>
      </Grid>
    </Page>
  );
}
