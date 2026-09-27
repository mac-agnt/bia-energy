import type { ReactNode } from "react";
import { INTAKE, type Job, type Tone } from "../../story";
import { bulk204, decide, toast, useBia } from "../../store";
import { AgentNote, Btn, Drawer, KV, Pill, Section, Timeline, WriteBackBadge, statusTone } from "../../ui";
import { MATERIAL, NOW, customerOf, fromMin, liveJobs, routeOfVehicle, toMin } from "./derive";

/* Collection detail drawer. Shared by Overview, Live Jobs and Exceptions. */

function Row({ left, right, sub }: { left: ReactNode; right?: ReactNode; sub?: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>{left}</div>
        {sub && <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

const initials = (s: string) => s.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
const num = (id: string) => Number(id.replace(/\D/g, "")) || 0;

export default function JobDrawer({ id, onClose, go }: { id: string | null; onClose: () => void; go: (page: string, tab?: string) => void }) {
  const s = useBia();
  const b = bulk204(s);
  const job: Job | undefined = liveJobs(s).find((j) => j.id === id);
  if (!job) return null;

  const cust = customerOf(job.customer);
  const route = routeOfVehicle(job.vehicle);
  const n = num(job.id);
  const done = job.status === "Complete";
  const is204 = job.id === "BULK-204";
  const is201 = job.id === "BULK-201";
  const int = is201 ? INTAKE.find((i) => i.id === "INT-1048") : undefined;
  const docket = is201 ? "WTD-58812" : "WTD-" + (58700 + (n % 100));
  const variance = job.actual != null ? job.actual - job.expected : null;
  const eta = toMin(job.eta);
  const t = (d: number) => fromMin(Math.max(300, eta + d));

  const timeline: { time: string; text: ReactNode; tone?: Tone; who?: string }[] = [
    { time: "05:40", text: "Collection released to dispatch from the customer schedule", tone: "neutral", who: "Pulse" },
    { time: t(-95), text: `Assigned to ${job.vehicle}, ${job.driver}`, tone: "info" },
  ];
  if (is204) {
    timeline.push({ time: "12:34", text: "BIA-07 hydraulic pressure warning on tail-lift ram. Vehicle stopped at Johnstown.", tone: "bad", who: "Fleet / telematics" });
    timeline.push({ time: "12:39", text: "ETA slipping 42 min. Customer notified automatically.", tone: "warn", who: "Pulse" });
    timeline.push({ time: "12:41", text: "Reassignment to BIA-14 prepared, recovers to +27 min", tone: "accent", who: "Dispatch Agent" });
    if (b.moved) timeline.push({ time: "13:02", text: "Reassignment approved. Updated in Fleet System.", tone: "ok", who: "Dragos Busuioc" });
  } else if (done) {
    timeline.push({ time: t(-40), text: `Arrived on site, ${job.site}`, tone: "info" });
    timeline.push({ time: t(-15), text: "Loaded, driver sign-off captured on handheld", tone: "info" });
    timeline.push({ time: job.eta, text: is201 ? "Weighed at Huntstown as INT-1048, +1.70 t variance flagged" : `Tipped at Huntstown, ${(job.actual || 0).toFixed(2)} t net`, tone: is201 ? "warn" : "ok", who: "Weighbridge" });
  } else {
    timeline.push({ time: t(-50), text: "Driver started loop, pre-trip walkaround passed", tone: "info" });
    if (job.status === "At risk") timeline.push({ time: "12:52", text: job.note || "Flagged at risk", tone: "bad", who: "Pulse" });
    else timeline.push({ time: NOW, text: `${job.status}. ETA ${job.eta}.`, tone: statusTone(job.status) });
  }

  const emails = [
    { subj: `${job.id} collection confirmed for today, ${job.site}`, from: "Pulse to " + (cust?.contact || "site contact"), time: "06:02" },
    is204
      ? { subj: b.moved ? "Updated ETA for your Naas collection, now 14:37" : "Your Naas collection is running late", from: "Pulse to Orla Keane", time: b.moved ? "13:02" : "12:39" }
      : done
        ? { subj: `Weight ticket and docket ${docket}`, from: "Weighbridge to " + (cust?.contact || "customer"), time: job.eta }
        : { subj: `Driver on the way, ETA ${job.eta}`, from: "Pulse to " + (cust?.contact || "site contact"), time: t(-30) },
    { subj: `RE: September collection schedule, ${job.customer}`, from: (cust?.contact || "Customer") + " to Logistics", time: "Mon" },
  ];

  const invoices = is201
    ? [{ id: "INV-24118", text: s.approvals.int1048 === "approved" ? "Adjusted to 19.27 t, ready to post" : "On hold pending INT-1048 review", tone: (s.approvals.int1048 === "approved" ? "ok" : "warn") as Tone }]
    : done
      ? [{ id: "INV-24" + (100 + (n % 90)), text: "Line added, posts at month end", tone: "ok" as Tone }]
      : [{ id: "INV-24" + (100 + (n % 90)), text: "Draft, line posts on weigh-in", tone: "neutral" as Tone }];

  const summary = is204
    ? b.moved
      ? "BULK-204 is now on BIA-14 with Marek Kowalski. Recovered ETA 14:37, 27 minutes behind plan instead of 42. FreshFields Foods has the revised time and BIA-07 is off road under WS-2291."
      : "BIA-07 reported a hydraulic warning at 12:34 and cannot safely load pallets. BIA-14 has just tipped INT-1048 and is free at Huntstown. Moving BULK-204 to BIA-14 recovers 15 minutes, landing at +27 min."
    : is201
      ? "Collected on BIA-14 and weighed as INT-1048: 19.27 t net against 17.57 t expected. The docket and customer reference match, so the likely cause is extra pallets added on site. Weighbridge review is open."
      : done
        ? `Completed on ${job.vehicle}. ${(job.actual || 0).toFixed(2)} t net against ${job.expected.toFixed(2)} t expected, within tolerance. Docket ${docket} and sign-off are filed.`
        : job.status === "At risk"
          ? (job.note || "At risk.") + " Covered by today's dispatch plan."
          : `${job.status} on ${job.vehicle}. On track for ${job.eta}. ${route ? route.name + " has " + route.remaining + " stops left." : ""}`;

  return (
    <Drawer open onClose={onClose} width={560} title={<span style={{ display: "flex", alignItems: "center", gap: 10 }}>{job.id}<Pill>{job.status}</Pill></span>} sub={`Collection detail · ${job.customer}, ${job.site}`}>
      <AgentNote agent="AI summary">{summary}</AgentNote>

      {is204 && (
        <AgentNote agent="Dispatch Agent" state={s.approvals.reassign204}
          actions={b.moved ? <WriteBackBadge system="Fleet System" /> : s.approvals.reassign204 === "rejected" ? <Btn small onClick={() => decide("reassign204", "approved")}>Approve after all</Btn> : (
            <>
              <Btn kind="primary" small onClick={() => decide("reassign204", "approved", "BULK-204 reassigned to BIA-14. ETA 14:37, +27 min.")}>Approve reassignment</Btn>
              <Btn small kind="danger" onClick={() => decide("reassign204", "rejected")}>Reject</Btn>
            </>
          )}>
          {b.moved
            ? <>Vehicle <b style={{ color: "var(--ink)" }}>BIA-14</b>, ETA <b style={{ color: "var(--ink)" }}>14:37</b>, <b style={{ color: "var(--warn)" }}>+27 min</b>. Driver M. Kowalski unchanged. BIA-07 off road, workshop ticket WS-2291.</>
            : <>Reassign BULK-204 from BIA-07 to BIA-14. Planned 14:10, current forecast 14:52 (+42 min). With BIA-14: 14:37 (+27 min). Same driver, compatible artic curtainsider, 74% fuel.</>}
        </AgentNote>
      )}

      {is201 && int && (
        <AgentNote agent="Weighbridge" state={s.approvals.int1048}
          actions={<Btn small kind="primary" onClick={() => { onClose(); go("Plant", "Weighbridge"); }}>Open INT-1048 variance</Btn>}>
          INT-1048 at {int.arrival}: gross {int.gross.toFixed(2)} t, tare {int.tare.toFixed(2)} t, net {int.net.toFixed(2)} t against {int.expected.toFixed(2)} t expected. Variance <b style={{ color: "var(--warn)" }}>+1.70 t</b>, status {s.approvals.int1048 === "approved" ? "accepted" : "Review"}.
        </AgentNote>
      )}

      <Section title="Collection">
        <KV rows={[
          ["Customer", job.customer],
          ["Site", `${job.site}${cust ? ", " + cust.industry : ""}`],
          ["Contact", cust ? cust.contact : "Site manager"],
          ["Service", cust ? `${cust.freq}, ${cust.sites} sites` : "Ad hoc"],
          ["Vehicle", is204 && b.moved ? <span>BIA-14 <span style={{ color: "var(--faint)", fontWeight: 400 }}>(was BIA-07)</span></span> : job.vehicle],
          ["Driver", job.driver],
          ["Waste type", MATERIAL[job.type]],
          ["Route", route ? route.name : "Contract haulier"],
          ["ETA", is204 ? `${b.eta} (${b.delay})` : job.eta],
          ["Container", job.type],
        ]} />
      </Section>

      <Section title="Weight">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {[["Expected", job.expected.toFixed(2) + " t", "var(--ink)"], ["Actual", job.actual != null ? job.actual.toFixed(2) + " t" : "Pending", job.actual != null ? "var(--ink)" : "var(--faint)"],
            ["Variance", variance == null ? "n/a" : (variance >= 0 ? "+" : "") + variance.toFixed(2) + " t", variance != null && Math.abs(variance) > 1 ? "var(--warn)" : "var(--ink)"]].map(([k, v, c]) => (
            <div key={k} style={{ padding: "12px 14px", borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--faint)" }}>{k}</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, color: c, fontVariantNumeric: "tabular-nums" }}>{v}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Collection documents">
        <Row left={`Waste transfer docket ${docket}`} sub="Documents" right={<Pill tone={done ? "ok" : "neutral"}>{done ? "Filed" : "Opens on collection"}</Pill>} />
        <Row left={`Customer PO ${initials(job.customer)}-${4400 + (n % 500)}`} sub="Customer reference on docket" right={<Pill tone="ok">Matched</Pill>} />
        <Row left="Driver sign-off" sub={done ? `Signed on handheld at ${t(-15)}` : "Captured at collection"} right={<Pill tone={done ? "ok" : "neutral"}>{done ? "Signed" : "Pending"}</Pill>} />
        {done && <Row left={`Weighbridge ticket ${is201 ? "INT-1048" : "WB-" + (7700 + (n % 300))}`} sub="Weighbridge" right={<Pill tone={is201 ? "warn" : "ok"}>{is201 ? "Review" : "Accepted"}</Pill>} />}
      </Section>

      <Section title="Emails">
        {emails.map((e) => <Row key={e.subj} left={e.subj} sub={e.from} right={<span style={{ fontSize: 11.5, color: "var(--faint)" }}>{e.time}</span>} />)}
      </Section>

      <Section title="Notes">
        <div style={{ fontSize: 13, color: "var(--body)", lineHeight: 1.55, padding: "10px 12px", borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          {job.note || (job.type === "Wheelie Bin" ? "Bins in rear yard, access via service lane. Driver to report any contamination with a photo." : job.type === "Tanker" ? "Connect at bay 2. Sample taken on every load for the plant lab." : "Pallets wrapped and labelled. Forklift on site for loading.")}
        </div>
      </Section>

      <Section title="Timeline"><Timeline items={timeline} /></Section>

      <Section title="Related invoices">
        {invoices.map((i) => <Row key={i.id} left={i.id} sub={i.text} right={<Pill tone={i.tone}>{i.tone === "warn" ? "On hold" : i.tone === "ok" ? "Ready" : "Draft"}</Pill>} />)}
      </Section>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Btn small onClick={() => toast("Updated in Email", `Status update sent to ${cust?.contact || "the customer"}`)}>Send customer update</Btn>
        <Btn small onClick={() => toast("Updated in Documents", `${docket} exported as PDF`)}>Export docket</Btn>
        {job.vehicle.startsWith("BIA") && <Btn small onClick={() => { onClose(); go("Fleet", "Vehicles"); }}>Open {job.vehicle} in Fleet</Btn>}
      </div>
    </Drawer>
  );
}

