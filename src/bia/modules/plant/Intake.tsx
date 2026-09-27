import { useMemo, useState } from "react";
import type { ModProps } from "../../Module";
import type { Intake as IntakeRow } from "../../story";
import { TODAY } from "../../story";
import { AgentNote, Btn, Card, Drawer, Empty, Head, KV, Kpis, Page, Pill, SearchBox, Section, Segmented, Table, type Col } from "../../ui";
import { DocRow, Mono, WeighBars, fmt2, linkedJob, pctDiff, ticketNo, useIntake } from "./shared";

const FILTERS = ["All", "Accepted", "Review", "Rejected", "In queue"];

function note(i: IntakeRow): string {
  const d = pctDiff(i);
  if (i.id === "INT-1048" && i.status === "Review") return "Net is 1.70 t over FreshFields' expected figure. BIA-14's tare matches its last three tares within 0.05 t, so the scale reading looks sound. The full review is on the Weighbridge tab.";
  if (i.id === "INT-1048") return "Accepted at 19.27 t after review. Variance note added to WTD-58812 and the invoice line updated in Accounting.";
  if (i.status === "Rejected") return "Rejected at tipping. The load held treated timber and plastic strapping mixed through the food waste. Returned to sender with the docket annotated and photos attached. No invoice raised.";
  if (i.status === "In queue") return "Waiting at the bridge since 13:02. Expected to tip about 13:10 to Depackaging line 1, behind the INT-1048 pallets.";
  if (i.id === "INT-1044") return `Net within ${Math.abs(d).toFixed(1)}% of expected and accepted. The haulier's signed copy of ${i.docket} has not arrived yet, so the load is logged as an exception until it does.`;
  return `Net within ${Math.abs(d).toFixed(1)}% of expected. Docket, weighbridge ticket and driver sign-off matched automatically. Nothing to do.`;
}

export default function Intake({ setTab, go }: ModProps) {
  const rows = useIntake();
  const [f, setF] = useState("All");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);

  const shown = useMemo(() => rows.filter((r) => (f === "All" || r.status === f) &&
    (!q || [r.id, r.customer, r.vehicle, r.material, r.docket, r.destination].join(" ").toLowerCase().includes(q.toLowerCase()))), [rows, f, q]);
  const cur = rows.find((r) => r.id === sel) || null;
  const count = (st: string) => rows.filter((r) => r.status === st).length;

  const cols: Col<IntakeRow>[] = [
    { key: "id", label: "Intake ID", render: (r) => <Mono>{r.id}</Mono> },
    { key: "arrival", label: "Arrival" },
    { key: "customer", label: "Customer", render: (r) => <span style={{ color: "var(--ink)" }}>{r.customer}</span> },
    { key: "vehicle", label: "Vehicle" },
    { key: "material", label: "Material" },
    { key: "gross", label: "Gross", align: "right", render: (r) => r.gross.toFixed(2) },
    { key: "tare", label: "Tare", align: "right", render: (r) => r.tare.toFixed(2) },
    { key: "net", label: "Net", align: "right", render: (r) => <Mono>{r.net.toFixed(2)}</Mono> },
    { key: "status", label: "Status", render: (r) => <Pill>{r.status}</Pill> },
    { key: "destination", label: "Destination", render: (r) => <span style={{ color: "var(--dim)" }}>{r.destination}</span> },
  ];

  const job = cur ? linkedJob(cur) : undefined;
  const third = cur ? cur.customer === "Third-party haulier" : false;

  return (
    <Page>
      <Head eyebrow="Plant" title="Intake" sub="Every load weighed in at Huntstown today, matched to its collection job, docket and weighbridge ticket."
        right={<SearchBox value={q} onChange={setQ} placeholder="Search ID, customer, vehicle, docket" />} />

      <Kpis items={[
        { label: "Incoming today", value: `${TODAY.intakeT} t`, sub: `Plan ${TODAY.intakePlanT} t`, hero: true },
        { label: "Accepted", value: `${TODAY.acceptedT} t`, sub: `${count("Accepted")} loads in this log` },
        { label: "In review", value: count("Review") ? "19.27 t" : "0 t", sub: count("Review") ? "INT-1048" : "Nothing held", tone: count("Review") ? "warn" : undefined },
        { label: "Rejected", value: "3.7 t", sub: "INT-1041, contaminated", tone: "bad" },
        { label: "At the bridge", value: `${count("In queue")} load`, sub: "INT-1049, 9.6 t est." },
      ]} />

      <Card title="Weighbridge log" sub={`${shown.length} of ${rows.length} loads since 09:58, newest first`} pad={false}
        right={<Segmented options={FILTERS} value={f} onChange={setF} />}>
        {shown.length ? <Table cols={cols} rows={shown} onRow={(r) => setSel(r.id)} selected={sel} /> : <Empty>No loads match that filter.</Empty>}
      </Card>

      <Drawer open={!!cur} onClose={() => setSel(null)} title={cur ? `${cur.id}, ${cur.customer}` : ""} sub={cur ? `${cur.vehicle} · arrived ${cur.arrival} · ${cur.material}` : undefined}>
        {cur && (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Pill>{cur.status}</Pill><Pill tone="neutral">{cur.destination}</Pill></div>
            <Section title="Docket">
              <KV rows={[
                ["Waste transfer docket", cur.docket], ["Weighbridge ticket", ticketNo(cur)],
                ["Gross", fmt2(cur.gross)], ["Tare", fmt2(cur.tare)],
                ["Net", fmt2(cur.net)], ["Expected", fmt2(cur.expected)],
                ["Difference", `${cur.net - cur.expected >= 0 ? "+" : ""}${(cur.net - cur.expected).toFixed(2)} t (${pctDiff(cur) >= 0 ? "+" : ""}${pctDiff(cur).toFixed(1)}%)`], ["Destination", cur.destination],
              ]} />
            </Section>
            <Section title="Weights"><WeighBars i={cur} /></Section>
            <Section title="Documents">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <DocRow name="Waste transfer docket" value={cur.id === "INT-1044" ? `${cur.docket}, signed copy not received` : `${cur.docket}, received`} state={cur.id === "INT-1044" ? "warn" : "ok"} />
                <DocRow name={third ? "Haulier booking reference" : "Customer reference"} value={cur.id === "INT-1048" ? "FF-PO-77120" : third ? `HB-${cur.docket.slice(4)}` : `Order matched to ${job?.id ?? "collection"}`} state="ok" />
                <DocRow name="Driver sign-off" value={job ? job.driver : third ? "Haulier driver, signed at gate" : "Signed at gate"} state={cur.id === "INT-1044" ? "warn" : "ok"} />
                <DocRow name="Weighbridge ticket" value={ticketNo(cur) + (cur.status === "In queue" ? ", issues on tipping" : ", issued")} state={cur.status === "In queue" ? "warn" : "ok"} />
                {cur.status === "Rejected" && <DocRow name="Rejection report" value="RJ-0412 with 6 photos, sent to haulier" state="bad" />}
              </div>
            </Section>
            <Section title="Linked collection job">
              {job ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface-2)" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{job.id}, {job.customer} {job.site}</div>
                    <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 3 }}>{job.type} · {job.vehicle} · {job.driver} · expected {job.expected} t</div>
                  </div>
                  <Btn small onClick={() => go("Collections", "History")}>Open job</Btn>
                </div>
              ) : <div style={{ fontSize: 13, color: "var(--dim)" }}>Third-party delivery. No Bia collection job; booked in by the haulier.</div>}
            </Section>
            <AgentNote agent="Intake Agent" actions={cur.id === "INT-1048" ? <Btn small kind="primary" onClick={() => { setSel(null); setTab("Weighbridge"); }}>Open weighbridge review</Btn> : undefined}>
              {note(cur)}
            </AgentNote>
          </>
        )}
      </Drawer>
    </Page>
  );
}
