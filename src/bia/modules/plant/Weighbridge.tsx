import { useState } from "react";
import type { ModProps } from "../../Module";
import { decide, markDone, toast, useBia } from "../../store";
import { INTAKE } from "../../story";
import { AgentNote, Btn, Card, Grid, Head, KV, Kpis, Page, Pill, Section, Table, WriteBackBadge, type Col } from "../../ui";
import { DocRow, ListRow, Mono, VarianceGauge, WeighBars, fmt2, inbound, pctDiff, useIntake } from "./shared";
import type { Intake } from "../../story";

const REF = INTAKE.find((i) => i.id === "INT-1048")!;

export default function Weighbridge({ setTab }: ModProps) {
  const s = useBia();
  const state = s.approvals.int1048;
  const approved = state === "approved";
  const reweigh = !!s.done.int1048reweigh;
  const emailed = !!s.done.int1048email;
  const [draft, setDraft] = useState(false);
  const rows = useIntake();
  const i = rows.find((r) => r.id === "INT-1048") || REF;
  const diff = i.net - i.expected;
  const queue = rows.filter((r) => r.status === "In queue");
  const next = inbound();

  const cols: Col<Intake>[] = [
    { key: "id", label: "Ticket", render: (r) => <Mono>{r.id}</Mono> },
    { key: "arrival", label: "In" },
    { key: "vehicle", label: "Vehicle" },
    { key: "customer", label: "Customer" },
    { key: "net", label: "Net", align: "right", render: (r) => r.status === "In queue" ? <span style={{ color: "var(--faint)" }}>pending</span> : <Mono>{r.net.toFixed(2)}</Mono> },
    { key: "d", label: "vs expected", align: "right", render: (r) => { const d = pctDiff(r); return <span style={{ color: Math.abs(d) > 5 ? "var(--warn)" : "var(--dim)" }}>{d >= 0 ? "+" : ""}{d.toFixed(1)}%</span>; } },
    { key: "status", label: "Status", render: (r) => <Pill>{r.status}</Pill> },
  ];

  return (
    <Page>
      <Head eyebrow="Plant" title="Weighbridge" sub="Tickets, variances and documents for every load across the Huntstown weighbridge. Decisions write back to Weighbridge and Accounting."
        right={<Btn small onClick={() => setTab("Intake")}>Full intake log</Btn>} />

      <Kpis items={[
        { label: "Weighed in today", value: "153.4 t", sub: "Plan 160 t", hero: true },
        { label: "Open variances", value: approved ? "0" : "1", sub: approved ? "All tickets settled" : "INT-1048, +1.70 t", tone: approved ? "ok" : "warn" },
        { label: "In queue", value: String(queue.length), sub: queue[0] ? `${queue[0].id}, waiting 3 min` : "Bridge clear" },
        { label: "Average time on site", value: "14 min", sub: "Gate to gate, today" },
        { label: "Calibration certificate", value: "41 days", sub: "Due 9 Nov" },
      ]} />

      <Grid style={{ marginBottom: 14 }}>
        <Card span={8} tone={approved ? undefined : "warn"} title={<span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>INT-1048 <Pill>{i.status}</Pill></span>}
          sub="FreshFields Foods, bulk packaged food on pallets. Collected as BULK-201 from Naas."
          right={approved ? <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><WriteBackBadge system="Weighbridge" /><WriteBackBadge system="Accounting" /></div> : undefined}>
          <KV cols={4} rows={[
            ["Customer", i.customer], ["Vehicle", `${i.vehicle}, M. Kowalski`], ["Arrival", i.arrival], ["Destination", i.destination],
            ["Gross", fmt2(i.gross)], ["Tare", fmt2(i.tare)], ["Net", <span style={{ color: "var(--accent)" }}>{fmt2(i.net)}</span>], ["Expected", fmt2(i.expected)],
          ]} />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.35fr) minmax(0,1fr)", gap: 22, marginTop: 20, alignItems: "center" }} className="bia-grid">
            <WeighBars i={i} />
            <div style={{ padding: "12px 10px 14px", borderRadius: 18, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11.5, color: "var(--dim)", fontWeight: 600, textAlign: "center", marginBottom: 2 }}>Difference</div>
              <div style={{ fontSize: 20, fontWeight: 600, textAlign: "center", color: approved ? "var(--ok)" : "var(--warn)" }}>+{diff.toFixed(2)} t</div>
              <VarianceGauge pct={pctDiff(i)} label={approved ? "Accepted outside tolerance, reason recorded" : "Tolerance ±5%. Outside tolerance needs review."} />
            </div>
          </div>
        </Card>

        <Card span={4} title="Documents" sub="Matched to the ticket automatically">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <DocRow name="Waste transfer docket" value={approved ? "WTD-58812, variance note added" : "WTD-58812"} state="ok" />
            <DocRow name="Customer reference" value="FF-PO-77120, 17.57 t ordered" state="ok" />
            <DocRow name="Driver sign-off" value="M. Kowalski, 12:48, 26 pallets declared" state="ok" />
            <DocRow name="Weighbridge ticket" value={approved ? "WB-1048, accepted 19.27 t" : "WB-1048, held for review"} state={approved ? "ok" : "warn"} />
          </div>
          <div style={{ marginTop: 14 }}>
            <Section title="Tare check">
              <div style={{ fontSize: 12.5, color: "var(--dim)", lineHeight: 1.5 }}>BIA-14 last three tares: 18.12 t, 18.17 t, 18.14 t. Today 18.15 t, in line.</div>
              {reweigh && <div style={{ marginTop: 8 }}><Pill tone="info">Re-weigh requested, Aoife Brennan</Pill></div>}
            </Section>
          </div>
        </Card>
      </Grid>

      <div style={{ marginBottom: 14 }}>
        <AgentNote agent="Intake Agent" state={state}
          actions={approved ? (
            <><WriteBackBadge system="Weighbridge" /><WriteBackBadge system="Accounting" />{emailed && <WriteBackBadge system="Email" />}</>
          ) : state === "rejected" ? (
            <Btn small onClick={() => decide("int1048", "pending")}>Reopen review</Btn>
          ) : (
            <>
              <Btn kind="primary" onClick={() => decide("int1048", "approved", "INT-1048 accepted at 19.27 t. FreshFields Foods invoice line updated.")}>Accept at 19.27 t and update invoice</Btn>
              <Btn disabled={reweigh} onClick={() => markDone("int1048reweigh", "Re-weigh requested. Aoife Brennan will re-check BIA-14's tare before it leaves the yard.")}>{reweigh ? "Re-weigh requested" : "Request re-weigh"}</Btn>
              <Btn disabled={emailed} onClick={() => setDraft(true)}>{emailed ? "FreshFields emailed" : "Email FreshFields"}</Btn>
              <Btn kind="danger" small onClick={() => decide("int1048", "rejected")}>Dispute</Btn>
            </>
          )}>
          The extra 1.70 t is most likely extra pallets loaded at Naas. Marek's sign-off declares 26 pallets; FreshFields' order was for 23. Their expected figure of 17.57 t came from the purchase order, not from a scale, and BIA-14's tare is in line with its last three weighings.
          {approved ? " Accepted at 19.27 t. The docket carries the variance note and the invoice line now reads 19.27 t." : " I recommend accepting at the weighed 19.27 t and updating the invoice. FreshFields gets a copy of the ticket and sign-off."}
        </AgentNote>
        {draft && !emailed && (
          <div style={{ marginTop: 10, padding: "14px 16px", borderRadius: 18, border: "1px solid var(--border-strong)", background: "var(--surface)", animation: "biaFade .3s var(--ease) both" }}>
            <KV cols={2} rows={[["To", "Orla Keane, FreshFields Foods"], ["Subject", "INT-1048: weighed 19.27 t against 17.57 t ordered"]]} />
            <div style={{ marginTop: 12, fontSize: 13, color: "var(--body)", lineHeight: 1.55, whiteSpace: "pre-line" }}>
              {"Hi Orla,\nToday's collection from Naas weighed in at 19.27 t net against 17.57 t on PO FF-PO-77120. Our driver's sign-off shows 26 pallets loaded against 23 on the order. The weighbridge ticket WB-1048 and signed docket WTD-58812 are attached.\nWe'll invoice at the weighed figure unless you tell us otherwise by Thursday.\nDragos"}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Btn small kind="primary" onClick={() => { setDraft(false); markDone("int1048email"); toast("Updated in Email", "Sent to Orla Keane with WB-1048 and WTD-58812 attached."); }}>Send</Btn>
              <Btn small onClick={() => setDraft(false)}>Discard</Btn>
            </div>
          </div>
        )}
      </div>

      <Grid>
        <Card span={5} title="At the weighbridge now" sub="Queue and trucks due back in the next few hours" pad={false}>
          <div style={{ padding: "0 6px 6px" }}>
            <ListRow tone="ok" title="Bridge 1, inbound" sub="Clear. Last ticket INT-1048 at 12:46." right={<Pill tone="ok">Clear</Pill>} />
            {queue.map((r) => (
              <ListRow key={r.id} tone="warn" title={`${r.id}, ${r.vehicle}`} sub={`${r.customer}. ${r.material}. Arrived ${r.arrival}, tips to Depackaging line 1 behind INT-1048.`} right={<Pill tone="warn">In queue</Pill>} />
            ))}
            {next.map((n) => (
              <ListRow key={n.id} tone="info" title={`${n.id}, due ${n.time}`} sub={`${n.route}. ${n.driver}.`} right={<Pill tone="info">Inbound</Pill>} />
            ))}
          </div>
        </Card>
        <Card span={7} title="Today's tickets" sub={`${rows.length} loads since 09:58`} pad={false}>
          <Table cols={cols} rows={rows} dense selected="INT-1048" />
        </Card>
      </Grid>
    </Page>
  );
}
