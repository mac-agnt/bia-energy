import { useState } from "react";
import type { ModProps } from "../../Module";
import type { Job } from "../../story";
import { bulk204, useBia } from "../../store";
import { Btn, Card, Empty, Head, Kpis, Pill, SearchBox, Segmented, Table, type Col } from "../../ui";
import JobDrawer from "./JobDrawer";
import { liveJobs, toMin } from "./derive";

const FILTERS = ["All", "Active", "At risk", "Complete"];

export default function LiveJobs({ go }: ModProps) {
  const s = useBia();
  const b = bulk204(s);
  const jobs = liveJobs(s);
  const [f, setF] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const match = (j: Job) =>
    (f === "All" || (f === "Active" && j.status !== "Complete" && j.status !== "At risk") || (f === "At risk" && j.status === "At risk") || (f === "Complete" && j.status === "Complete")) &&
    (!q || [j.id, j.customer, j.site, j.vehicle, j.driver, j.type].join(" ").toLowerCase().includes(q.toLowerCase()));
  const order = (j: Job) => (j.status === "At risk" ? 0 : j.status === "Complete" ? 2 : 1);
  const rows = jobs.filter(match).sort((a, c) => order(a) - order(c) || toMin(a.eta) - toMin(c.eta));

  const cols: Col<Job>[] = [
    { key: "id", label: "Job", render: (j) => <span style={{ fontWeight: 600, color: "var(--ink)" }}>{j.id}</span> },
    { key: "customer", label: "Customer" },
    { key: "site", label: "Site" },
    { key: "type", label: "Type", render: (j) => <span style={{ color: "var(--dim)" }}>{j.type}</span> },
    { key: "vehicle", label: "Vehicle", render: (j) => j.id === "BULK-204" && b.moved ? <span>BIA-14 <span style={{ color: "var(--faint)", fontSize: 11 }}>was BIA-07</span></span> : j.vehicle },
    { key: "driver", label: "Driver" },
    { key: "eta", label: "ETA", render: (j) => j.id === "BULK-204" ? <span>{b.eta} <span style={{ color: b.moved ? "var(--warn)" : "var(--bad)", fontSize: 11.5 }}>{b.delay}</span></span> : j.eta },
    { key: "expected", label: "Expected", align: "right", render: (j) => (
      <span>{j.expected.toFixed(1)} t{j.actual != null && <span style={{ color: Math.abs(j.actual - j.expected) > 1 ? "var(--warn)" : "var(--faint)", fontSize: 11.5 }}> / {j.actual.toFixed(2)}</span>}</span>
    ) },
    { key: "status", label: "Status", render: (j) => <Pill>{j.status}</Pill> },
  ];

  const comp = jobs.filter((j) => j.status === "Complete");
  const varPct = (comp.reduce((a, j) => a + (j.actual || 0), 0) / comp.reduce((a, j) => a + j.expected, 0) - 1) * 100;
  const n = (k: string) => jobs.filter((j) => (k === "Active" ? j.status !== "Complete" && j.status !== "At risk" : j.status === k)).length;

  return (
    <>
      <Head eyebrow="COLLECTIONS" title="Live jobs" sub="All 34 collections today. Click any row for docket, contacts, emails and the AI summary."
        right={<Btn onClick={() => setOpen("BULK-204")}>Open BULK-204</Btn>} />
      <Kpis min={140} items={[
        { label: "Active", value: n("Active"), sub: "Scheduled to returning" },
        { label: "At risk", value: n("At risk"), tone: "bad", sub: b.moved ? "BULK-204 back on track" : "BULK-204 slipping 42 min" },
        { label: "Complete", value: n("Complete"), tone: "ok", sub: "146.8 t net" },
        { label: "Weight variance", value: "+" + varPct.toFixed(1) + "%", sub: "Complete jobs, actual vs expected", tone: "warn" },
      ]} />
      <Card pad={false} title={`${rows.length} collections`} sub="Sorted by risk, then ETA"
        right={<div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}><Segmented options={FILTERS} value={f} onChange={setF} /><SearchBox value={q} onChange={setQ} placeholder="Search job, customer, vehicle" /></div>}>
        {rows.length ? <Table cols={cols} rows={rows} onRow={(j) => setOpen(j.id)} selected={open} dense /> : <Empty>No collections match. Clear the search or pick another filter.</Empty>}
      </Card>
      <JobDrawer id={open} onClose={() => setOpen(null)} go={go} />
    </>
  );
}
