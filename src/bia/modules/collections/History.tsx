import { useState } from "react";
import type { ModProps } from "../../Module";
import { WEEK } from "../../story";
import { toast, useBia } from "../../store";
import { Bars, Btn, Card, Donut, Empty, Grid, Head, Kpis, Legend, SERIES, SearchBox, Segmented, Table, type Col } from "../../ui";
import JobDrawer from "./JobDrawer";
import { WEEK_DAYS, historyRows, liveJobs, type HistRow } from "./derive";

const BY_TYPE = [
  { label: "Tanker", v: 497.3 }, { label: "Bulk Pallet", v: 486.1 }, { label: "Wheelie Bin", v: 402.3 },
  { label: "Dolav", v: 311.4 }, { label: "Curtainsider", v: 248.9 },
];

export default function History({ go }: ModProps) {
  const s = useBia();
  const rows = historyRows(liveJobs(s));
  const [metric, setMetric] = useState("Collections");
  const [when, setWhen] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const data: [string, number][] = WEEK_DAYS.map((d) => [d.day + " " + d.date.split(" ")[0], metric === "Collections" ? d.n : metric === "Tonnes" ? d.t : d.sla]);
  const filtered = rows.filter((r) =>
    (when === "All" || (when === "Today" && r.date.startsWith("Tue 29")) || (when === "Yesterday" && r.date.startsWith("Mon 28")) || (when === "Earlier" && !r.date.startsWith("Tue 29") && !r.date.startsWith("Mon 28"))) &&
    (!q || [r.id, r.customer, r.site, r.vehicle, r.driver, r.docket].join(" ").toLowerCase().includes(q.toLowerCase())));

  const cols: Col<HistRow>[] = [
    { key: "id", label: "Job", render: (r) => <span style={{ fontWeight: 600, color: "var(--ink)" }}>{r.id}</span> },
    { key: "date", label: "Date", render: (r) => <span style={{ color: "var(--dim)" }}>{r.date}, {r.time}</span> },
    { key: "customer", label: "Customer" },
    { key: "site", label: "Site" },
    { key: "type", label: "Type", render: (r) => <span style={{ color: "var(--dim)" }}>{r.type}</span> },
    { key: "vehicle", label: "Vehicle" },
    { key: "expected", label: "Expected", align: "right", render: (r) => r.expected.toFixed(2) + " t" },
    { key: "actual", label: "Actual", align: "right", render: (r) => {
      const v = r.actual - r.expected;
      return <span>{r.actual.toFixed(2)} t <span style={{ fontSize: 11.5, color: Math.abs(v) > 1 ? "var(--warn)" : "var(--faint)" }}>{v >= 0 ? "+" : ""}{v.toFixed(2)}</span></span>;
    } },
    { key: "docket", label: "Docket", render: (r) => <span style={{ color: "var(--dim)" }}>{r.docket}</span> },
  ];

  return (
    <>
      <Head eyebrow="COLLECTIONS" title="History" sub="The last seven days of completed collections, weighed and docketed."
        right={<Btn onClick={() => toast("Updated in Documents", "Weekly collections report saved as PDF and CSV")}>Export week</Btn>} />
      <Kpis min={150} items={[
        { label: "Collections, 7 days", value: WEEK.collections, hero: true, sub: "Wed 23 to Tue 29 Sep" },
        { label: "Tonnes collected", value: WEEK.collectedT.toLocaleString("en-IE") + " t", sub: "Net at Huntstown weighbridge" },
        { label: "SLA met", value: WEEK.sla + "%", tone: "accent", sub: "Target 95%" },
        { label: "Average per day", value: (WEEK.collections / 7).toFixed(1), sub: "Busiest Monday, 35" },
        { label: "Tonnes per collection", value: (WEEK.collectedT / WEEK.collections).toFixed(1) + " t", sub: "Mixed bin and bulk" },
      ]} />
      <Grid>
        <Card span={8} title={metric === "SLA" ? "SLA by day" : metric + " by day"} sub={metric === "Tonnes" ? "Today is part-day, 146.8 t so far" : "Today highlighted"}
          right={<Segmented options={["Collections", "Tonnes", "SLA"]} value={metric} onChange={setMetric} />}>
          <Bars data={data} h={200} unit={metric === "Tonnes" ? " t" : metric === "SLA" ? "%" : ""} plan={metric === "SLA" ? WEEK_DAYS.map(() => 95) : undefined} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8, marginTop: 8 }}>
            {data.map(([l, v]) => <div key={l} style={{ textAlign: "center", fontSize: 11.5, fontWeight: 600, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{metric === "Tonnes" ? v.toFixed(0) : metric === "SLA" ? v.toFixed(1) + "%" : v}</div>)}
          </div>
        </Card>
        <Card span={4} title="Tonnes by service type" sub="7 days, 1,946 t">
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <Donut parts={BY_TYPE.map((b, i) => ({ v: b.v, c: SERIES[i] }))} label="1,946" sub="tonnes" />
            <Legend items={BY_TYPE.map((b, i) => ({ label: b.label, value: b.v.toFixed(0) + " t", c: SERIES[i] }))} />
          </div>
        </Card>
        <Card span={12} pad={false} title="Completed collections" sub={`${filtered.length} shown. Today in full, earlier days sampled from the archive.`}
          right={<div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}><Segmented options={["All", "Today", "Yesterday", "Earlier"]} value={when} onChange={setWhen} /><SearchBox value={q} onChange={setQ} placeholder="Search job, customer, docket" /></div>}>
          {filtered.length ? <Table cols={cols} rows={filtered} rowKey="docket" dense onRow={(r) => r.date.startsWith("Tue 29") ? setOpen(r.id) : toast(r.id + " archived", `${r.customer}, ${r.site}. Docket ${r.docket} in Documents.`)} /> : <Empty>No completed collections match that search.</Empty>}
        </Card>
      </Grid>
      <JobDrawer id={open} onClose={() => setOpen(null)} go={go} />
    </>
  );
}
