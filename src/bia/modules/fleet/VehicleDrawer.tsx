import type { ReactNode } from "react";
import { fmtEur } from "../../story";
import { bulk204, decide, markDone, toast, useBia } from "../../store";
import { AgentNote, Bar, Btn, Drawer, KV, Pill, Section, WriteBackBadge } from "../../ui";
import { liveJobs } from "../collections/derive";
import { daysUntil, liveVehicles, statusLabel, vehicleDocs, vehicleHistory, workOrders } from "./derive";

function Row({ left, sub, right }: { left: ReactNode; sub?: ReactNode; right?: ReactNode }) {
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

/* Actions for the BIA-07 fault, used in the drawer and the Overview spotlight. */
export function Bia07Actions({ onReview }: { onReview?: () => void }) {
  const s = useBia();
  const b = bulk204(s);
  const task = !!s.done.bia07task;
  if (b.moved) return <><WriteBackBadge system="Fleet System" />{task ? <WriteBackBadge system="Work" /> : <Btn small onClick={() => markDone("bia07task", "Task created in Work")}>Create maintenance task</Btn>}</>;
  return (
    <>
      {onReview
        ? <Btn small kind="primary" onClick={onReview}>Review reassignment</Btn>
        : <Btn small kind="primary" onClick={() => decide("reassign204", "approved", "BULK-204 reassigned to BIA-14. BIA-07 off road, WS-2291.")}>Approve reassignment</Btn>}
      {!onReview && s.approvals.reassign204 !== "rejected" && <Btn small kind="danger" onClick={() => decide("reassign204", "rejected")}>Reject</Btn>}
      {task ? <WriteBackBadge system="Work" /> : <Btn small onClick={() => markDone("bia07task", "Task created in Work")}>Create maintenance task</Btn>}
    </>
  );
}

export default function VehicleDrawer({ id, onClose, go }: { id: string | null; onClose: () => void; go: (page: string, tab?: string) => void }) {
  const s = useBia();
  const b = bulk204(s);
  const v = liveVehicles(s).find((x) => x.id === id);
  if (!v) return null;
  const st = statusLabel(v, s);
  const jobs = liveJobs(s).filter((j) => j.vehicle === v.id);
  const wos = workOrders(s).filter((w) => w.vehicle === v.id);
  const hist = vehicleHistory(v);
  const dNext = daysUntil(v.nextInspection);

  return (
    <Drawer open onClose={onClose} width={560} title={<span style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>{v.id}<Pill tone={st.tone}>{st.label}</Pill></span>} sub={`${v.reg} · ${v.type} · ${v.location}`}>
      {v.id === "BIA-07" && (
        <>
          <div style={{ padding: "12px 14px", borderRadius: 16, background: "var(--bad-soft)", border: "1px solid color-mix(in srgb, var(--bad) 40%, transparent)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--bad)" }}>Hydraulic pressure warning, tail-lift ram, 12:34</div>
            <div style={{ fontSize: 12.5, color: "var(--body)", marginTop: 4, lineHeight: 1.5 }}>
              {b.moved ? "Off road, workshop ticket WS-2291. Recovery to Huntstown workshop booked for 15:00." : "Pressure dropped from 180 to 112 bar under load. Driver stopped safely at Johnstown, N7. Not safe to load pallets."}
            </div>
          </div>
          <AgentNote agent="Fleet Agent" state={s.approvals.reassign204} actions={<Bia07Actions />}>
            Route BULK-204 can be reassigned to BIA-14 with an estimated 27-minute delay.
            {b.moved ? " Done. BIA-14 is on the N7 with Marek Kowalski, ETA Naas 14:37." : " BIA-14 is empty at Huntstown after tipping INT-1048 at 12:46, 74% fuel, same driver. Staying on BIA-07 means a recovery truck and a 42-minute slip at best."}
          </AgentNote>
        </>
      )}
      {v.id === "BIA-12" && (
        <AgentNote agent="Compliance Agent" state={s.approvals.bia12}
          actions={s.approvals.bia12 === "approved" ? <WriteBackBadge system="Calendar" /> : <><Btn small kind="primary" onClick={() => decide("bia12", "approved", "BIA-12 roadworthiness test booked Thu 08:00.")}>Book inspection</Btn><Btn small onClick={() => { onClose(); go("Compliance", "Expiries"); }}>Open in Compliance</Btn></>}>
          Roadworthiness test due in 3 days, on 2 Oct. BIA-12 is off road if it is missed. {s.approvals.bia12 === "approved" ? "Booked Thu 08:00, Huntstown workshop pre-test check first." : "Thursday 08:00 is free and BIA-12 has no bin swaps booked that morning."}
        </AgentNote>
      )}
      {v.id === "BIA-14" && b.moved && (
        <AgentNote agent="Dispatch Agent" state="approved" actions={<WriteBackBadge system="Fleet System" />}>
          Active on BULK-204 for FreshFields Foods, Naas. ETA 14:37, +27 min against plan. Took over from BIA-07.
        </AgentNote>
      )}

      <Section title="Vehicle">
        <KV rows={[
          ["Registration", v.reg],
          ["Type", v.type],
          ["Mileage", v.mileage.toLocaleString("en-IE") + " km"],
          ["Current driver", v.driver],
          ["Current route", v.route],
          ["Next", v.next],
          ["Last inspection", v.lastInspection],
          ["Next inspection", <span style={{ color: dNext <= 7 ? "var(--warn)" : undefined }}>{v.nextInspection} ({dNext} days)</span>],
          ["Cost YTD", fmtEur(v.costYtd)],
          ["Status", st.label],
        ]} />
      </Section>

      <Section title="Fuel and utilisation">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 7 }}><span style={{ color: "var(--body)" }}>Fuel</span><b style={{ color: "var(--ink)" }}>{v.fuel}%</b></div>
            <Bar value={v.fuel} tone={v.fuel < 40 ? "warn" : "accent"} />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 7 }}><span style={{ color: "var(--body)" }}>Utilisation, 30 days</span><b style={{ color: "var(--ink)" }}>{v.utilisation}%</b></div>
            <Bar value={v.utilisation} />
          </div>
        </div>
      </Section>

      <Section title="Today's jobs">
        {jobs.length ? jobs.map((j) => <Row key={j.id} left={`${j.id} · ${j.customer}`} sub={`${j.site}, ${j.type}, ETA ${j.eta}`} right={<Pill>{j.status}</Pill>} />)
          : <div style={{ fontSize: 12.5, color: "var(--faint)" }}>{v.id === "BIA-07" && b.moved ? "BULK-204 moved to BIA-14." : v.status === "Maintenance" ? "In workshop today." : "No collections assigned today."}</div>}
        {jobs.length > 0 && <div style={{ marginTop: 10 }}><Btn small onClick={() => { onClose(); go("Collections", "Live Jobs"); }}>Open in Collections</Btn></div>}
      </Section>

      <Section title="Current fault">
        <div style={{ fontSize: 13, color: v.note ? "var(--body)" : "var(--faint)", lineHeight: 1.5 }}>{v.note || "No open faults. Last walkaround check passed this morning."}</div>
      </Section>

      <Section title="Maintenance">
        {wos.map((w) => <Row key={w.id} left={`${w.id} · ${w.title}`} sub={`${w.kind}, due ${w.due}, est. ${fmtEur(w.cost)}`} right={<Pill tone={w.tone}>{w.status}</Pill>} />)}
        {hist.map((h) => <Row key={h.date + h.what} left={h.what} sub={h.date} right={<span style={{ fontSize: 12.5, color: "var(--dim)" }}>{fmtEur(h.cost)}</span>} />)}
      </Section>

      <Section title="Documents">
        {vehicleDocs(v).map((d) => (
          <Row key={d} left={d} sub="Documents" right={<Btn small onClick={() => toast("Opened from Documents", `${v.id}, ${d}`)}>View</Btn>} />
        ))}
      </Section>
    </Drawer>
  );
}
