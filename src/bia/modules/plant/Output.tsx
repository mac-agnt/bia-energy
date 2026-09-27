import type { ModProps } from "../../Module";
import { TODAY, WEEK } from "../../story";
import { Bars, Btn, Card, Grid, Head, Kpis, Meter, Page, Pill, Table, type Col } from "../../ui";
import { Mono, Stat } from "./shared";

/* Rolling 7 days, today partial to 13:05. Biomethane sums to 2,214 MWh, digestate to 1,642 t. */
const DAYS = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Today"];
const GAS = [334.2, 338.5, 329.1, 342.8, 351.6, 345.4, TODAY.biomethaneMWh];
const DIGESTATE = [266.3, 261.8, 253.2, 244.5, 239.1, 258.5, TODAY.digestateT];

type Dispatch = { id: string; when: string; customer: string; site: string; tonnes: number; haulier: string; status: string };
const DISPATCH: Dispatch[] = [
  { id: "DEL-311", when: "Today 16:00", customer: "Kildare Tillage Partners", site: "Kilcock", tonnes: 22, haulier: "Contract haulier", status: "Scheduled" },
  { id: "DEL-312", when: "Thu 09:00", customer: "Kildare Tillage Partners", site: "Rathcoffey", tonnes: 24, haulier: "Contract haulier", status: "Scheduled" },
  { id: "DEL-313", when: "Fri 08:30", customer: "Kildare Tillage Partners", site: "Timahoe", tonnes: 24, haulier: "Contract haulier", status: "Scheduled" },
  { id: "DEL-310", when: "Mon 11:20", customer: "Kildare Tillage Partners", site: "Donadea", tonnes: 22, haulier: "Contract haulier", status: "Complete" },
  { id: "DEL-309", when: "Mon 07:45", customer: "Kildare Tillage Partners", site: "Kilcock", tonnes: 23.5, haulier: "Contract haulier", status: "Complete" },
];

export default function Output({ go }: ModProps) {
  const cols: Col<Dispatch>[] = [
    { key: "id", label: "Delivery", render: (r) => <Mono>{r.id}</Mono> },
    { key: "when", label: "When" },
    { key: "site", label: "Customer site", render: (r) => <span><span style={{ color: "var(--ink)" }}>{r.customer}</span><span style={{ color: "var(--faint)" }}>, {r.site}</span></span> },
    { key: "tonnes", label: "Tonnes", align: "right", render: (r) => r.tonnes.toFixed(1) + " t" },
    { key: "status", label: "Status", render: (r) => <Pill>{r.status}</Pill> },
  ];
  const homes = Math.round(WEEK.biomethaneMWh / 11);
  const co2 = Math.round(WEEK.biomethaneMWh * 0.2);

  return (
    <Page>
      <Head eyebrow="Plant" title="Output" sub="Renewable gas injected to the grid and biofertiliser produced and dispatched. Figures feed customer and environmental reporting."
        right={<Btn small onClick={() => go("Customers", "Overview")}>Customer reporting</Btn>} />

      <Kpis items={[
        { label: "Biomethane today", value: `${TODAY.biomethaneMWh} MWh`, sub: "To 13:05", hero: true },
        { label: "Biomethane, 7 days", value: `${WEEK.biomethaneMWh.toLocaleString("en-IE")} MWh`, sub: "About 316 MWh a day" },
        { label: "Current output", value: TODAY.biomethaneRate, sub: "Methane 97.6%" },
        { label: "Digestate today", value: `${TODAY.digestateT} t`, sub: "Biofertiliser" },
        { label: "Digestate, 7 days", value: `${WEEK.digestateT.toLocaleString("en-IE")} t`, sub: "91.5 t dispatched" },
      ]} />

      <Grid style={{ marginBottom: 14 }}>
        <Card span={8} title="Biomethane injected, last 7 days" sub="MWh per day. Today is partial.">
          <Bars data={DAYS.map((d, i) => [d, GAS[i]])} unit=" MWh" h={190} />
        </Card>
        <Card span={4} title="Grid injection" sub="Read from Plant / SCADA data" right={<Pill tone="ok">In spec</Pill>}>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-1px", color: "var(--ink)" }}>171.1 <span style={{ fontSize: 13, color: "var(--dim)", fontWeight: 500 }}>MWh injected</span></div>
          <div style={{ fontSize: 12, color: "var(--faint)", marginBottom: 10 }}>99.2% of today's production. 1.3 MWh used on site.</div>
          <Meter label="Entry point availability, week" value={100} />
          <Meter label="Gas quality in spec, week" value={99.8} />
          <Meter label="Output vs nameplate" value={96} note="1,340 of 1,400 Nm³/h" />
        </Card>
      </Grid>

      <Grid style={{ marginBottom: 14 }}>
        <Card span={5} title="Digestate produced" sub="Tonnes per day, last 7 days">
          <Bars data={DAYS.map((d, i) => [d, DIGESTATE[i]])} unit=" t" h={170} />
        </Card>
        <Card span={3} title="Storage" sub="Digestate lagoon and tanks">
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-1px", color: "var(--ink)" }}>68%</div>
          <div style={{ fontSize: 12, color: "var(--faint)", marginBottom: 8 }}>About 5 weeks of headroom at current rate</div>
          <Meter label="Lagoon" value={68} tone="warn" />
          <Meter label="Separated fibre bay" value={44} />
          <div style={{ fontSize: 12, color: "var(--dim)", lineHeight: 1.45, marginTop: 8 }}>Autumn spreading window is closing. Dispatches are front-loaded this fortnight.</div>
        </Card>
        <Card span={4} title="Digestate dispatch" sub="Biofertiliser out to agri customers" pad={false}>
          <Table cols={cols} rows={DISPATCH} dense />
        </Card>
      </Grid>

      <Card title="What this week's output is worth" sub="Indicative factors for customer and environmental reporting. Final factors are set during onboarding.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 18 }}>
          <Stat label="Renewable gas" value={`${WEEK.biomethaneMWh.toLocaleString("en-IE")} MWh`} sub="Injected to the national gas grid" />
          <Stat label="Homes heated for a year" value={`About ${homes}`} sub="At 11 MWh gas per home" />
          <Stat label="Emissions displaced" value={`About ${co2} t CO₂e`} sub="Against fossil natural gas" tone="ok" />
          <Stat label="Food waste treated" value={`${WEEK.processedT.toLocaleString("en-IE")} t`} sub="Kept out of landfill and incineration" />
          <Stat label="Biofertiliser" value={`${WEEK.digestateT.toLocaleString("en-IE")} t`} sub="Replaces synthetic fertiliser on tillage" />
        </div>
      </Card>
    </Page>
  );
}
