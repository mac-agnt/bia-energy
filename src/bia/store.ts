import { useSyncExternalStore } from "react";

/* Shared demo state for approvals and write-back. Any screen can read it,
   so approving the BULK-204 reassignment in Work also updates Fleet,
   Collections, Home and Activity. */

export type ApprovalState = "pending" | "approved" | "rejected";
export type WriteBack = { time: string; system: string; text: string };

type State = {
  approvals: Record<string, ApprovalState>;
  writeBacks: WriteBack[];
  toast: { text: string; sub?: string; n: number } | null;
  done: Record<string, boolean>;
};

let state: State = {
  approvals: { reassign204: "pending", overtime: "pending", int1048: "pending", dispatchPlan: "pending", bia12: "pending" },
  writeBacks: [],
  toast: null,
  done: {},
};
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export function useBia(): State {
  return useSyncExternalStore(
    (f) => { subs.add(f); return () => { subs.delete(f); }; },
    () => state,
  );
}
export const getBia = () => state;

function now() {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

/* What each approval pushes back into which connected system. */
const EFFECTS: Record<string, WriteBack[]> = {
  reassign204: [
    { time: "", system: "Fleet System", text: "BULK-204 reassigned BIA-07 → BIA-14. Driver M. Kowalski unchanged." },
    { time: "", system: "Email", text: "Updated ETA sent to Orla Keane, FreshFields Foods (+27 min)." },
    { time: "", system: "Fleet System", text: "BIA-07 status set to Off road, workshop ticket WS-2291 opened." },
  ],
  dispatchPlan: [
    { time: "", system: "Fleet System", text: "BULK-204 moved to BIA-14. COL-1858 resequenced behind COL-1861." },
    { time: "", system: "Timesheets / HR", text: "D. Quinn break moved 18 min later, within permitted limits." },
    { time: "", system: "Email", text: "Updated ETAs sent to FreshFields Foods and GreenMart Tallaght." },
    { time: "", system: "Pulse", text: "TNK-044 left for manual review: no compatible tanker free." },
  ],
  overtime: [{ time: "", system: "Timesheets / HR", text: "6.5 h Logistics overtime approved and posted to payroll period 40." }],
  int1048: [{ time: "", system: "Weighbridge", text: "INT-1048 accepted at 19.27 t net. Variance note added to docket WTD-58812." },
    { time: "", system: "Accounting", text: "FreshFields Foods invoice line adjusted to 19.27 t." }],
  bia12: [{ time: "", system: "Calendar", text: "BIA-12 roadworthiness test booked Thu 08:00, Huntstown workshop." }],
};

export function decide(key: string, decision: ApprovalState, label?: string) {
  const t = now();
  const fx = decision === "approved" ? (EFFECTS[key] || []).map((w) => ({ ...w, time: t })) : [];
  if (key === "dispatchPlan" && decision === "approved") state.approvals = { ...state.approvals, reassign204: "approved" };
  state = {
    ...state,
    approvals: { ...state.approvals, [key]: decision },
    writeBacks: [...fx, ...state.writeBacks],
    toast: decision === "approved"
      ? { text: fx[0] ? "Updated in " + fx[0].system : "Approved", sub: label || fx[0]?.text, n: (state.toast?.n || 0) + 1 }
      : { text: decision === "rejected" ? "Rejected. Nothing was changed." : "Saved", n: (state.toast?.n || 0) + 1 },
  };
  emit();
}

export function markDone(key: string, toastText?: string) {
  state = { ...state, done: { ...state.done, [key]: true },
    toast: toastText ? { text: toastText, n: (state.toast?.n || 0) + 1 } : state.toast };
  emit();
}

export function toast(text: string, sub?: string) {
  state = { ...state, toast: { text, sub, n: (state.toast?.n || 0) + 1 } };
  emit();
}
export function clearToast() { state = { ...state, toast: null }; emit(); }

/* Derived view of BULK-204 and today's at-risk count, used everywhere. */
export function bulk204(s: State) {
  const moved = s.approvals.reassign204 === "approved";
  const plan = s.approvals.dispatchPlan === "approved";
  return {
    moved, plan,
    vehicle: moved ? "BIA-14" : "BIA-07",
    status: moved ? ("En route" as const) : ("At risk" as const),
    eta: moved ? "14:37" : "14:52",
    delay: moved ? "+27 min" : "+42 min",
    atRisk: plan ? 1 : moved ? 3 : 4,
  };
}
