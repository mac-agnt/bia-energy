import { VEHICLES, type Tone, type Vehicle } from "../../story";
import { bulk204, useBia } from "../../store";
import type { BiaState } from "../collections/derive";

/* Fleet view of the shared state. Approving the BULK-204 reassignment takes
   BIA-07 off road and puts BIA-14 on the Naas run everywhere. */

export function liveVehicles(s: BiaState): Vehicle[] {
  const b = bulk204(s);
  if (!b.moved) return VEHICLES;
  return VEHICLES.map((v) => {
    if (v.id === "BIA-07") return { ...v, driver: "Workshop", route: "Off road", next: "Workshop ticket WS-2291", note: "Off road, workshop ticket WS-2291. Tail-lift ram hydraulic pressure warning 12:34." };
    if (v.id === "BIA-14") return { ...v, status: "Active" as const, route: "BULK-204 Naas", next: "Naas ETA 14:37 (+27 min)", location: "N7, Kingswood", x: 36, y: 64 };
    return v;
  });
}
export function useVehicles(): Vehicle[] {
  return liveVehicles(useBia());
}

export function fleetCounts(vs: Vehicle[]) {
  const maintenance = vs.filter((v) => v.status === "Maintenance").length;
  const fault = vs.filter((v) => v.status === "Fault").length;
  return { total: vs.length, active: vs.filter((v) => v.status === "Active").length, standby: vs.filter((v) => v.status === "Standby").length, maintenance, fault, available: vs.length - maintenance - fault };
}

/* Label shown for a vehicle's status, including the BIA-07 story. */
export function statusLabel(v: Vehicle, s: BiaState): { label: string; tone: Tone } {
  if (v.id === "BIA-07") return bulk204(s).moved ? { label: "Off road, WS-2291", tone: "bad" } : { label: "Maintenance Required", tone: "bad" };
  if (v.id === "BIA-12") return s.approvals.bia12 === "approved" ? { label: "Inspection booked", tone: "ok" } : { label: "Inspection due", tone: "warn" };
  const t: Record<Vehicle["status"], Tone> = { Active: "ok", Standby: "neutral", Maintenance: "warn", Fault: "bad" };
  return { label: v.status, tone: t[v.status] };
}

export const TYPES: { type: Vehicle["type"]; label: string; c: string }[] = [
  { type: "MacPac Bin Truck", label: "MacPac Bin Trucks", c: "var(--accent)" },
  { type: "Artic Curtainsider", label: "Artic Curtainsiders", c: "#6fb6d9" },
  { type: "Tanker", label: "Tankers", c: "#e6c78a" },
  { type: "Support Vehicle", label: "Support vehicles", c: "#b9a6ee" },
];

/* Days from Tue 29 Sep to a "D Mon" date. */
const MON: Record<string, number> = { Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
export function daysUntil(d: string): number {
  const [day, mon] = d.split(" ");
  const t = Date.UTC(2026, MON[mon] ?? 9, Number(day));
  return Math.round((t - Date.UTC(2026, 8, 29)) / 86400000);
}

const idn = (id: string) => Number(id.slice(4));

/* Live telematics, deterministic per vehicle. */
export function telemetry(v: Vehicle) {
  const n = idn(v.id);
  const moving = v.status === "Active" && !/yard|weighbridge/i.test(v.location);
  return {
    speed: v.id === "BIA-15" || v.id === "BIA-13" ? 0 : moving ? 34 + ((n * 17) % 46) : 0,
    heading: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][n % 8],
    ping: `${4 + ((n * 7) % 26)} s ago`,
    ignition: v.status === "Active" ? "On" : v.status === "Fault" ? "On, hazards" : "Off",
    kmToday: v.status === "Active" ? 88 + ((n * 23) % 140) : v.status === "Fault" ? 71 : 0,
    idle: `${6 + ((n * 5) % 22)} min`,
  };
}

/* ---------- Work orders ---------- */
export type WorkOrder = { id: string; vehicle: string; title: string; kind: string; opened: string; due: string; status: string; tone: Tone; cost: number; downtime: string; owner: string };
export function workOrders(s: BiaState): WorkOrder[] {
  const moved = bulk204(s).moved;
  const bia12 = s.approvals.bia12 === "approved";
  return [
    { id: "WS-2291", vehicle: "BIA-07", title: "Tail-lift ram hydraulic pressure loss", kind: "Breakdown", opened: moved ? "Today 12:58" : "Draft", due: "Thu 1 Oct", status: moved ? "In workshop" : "Awaiting approval", tone: moved ? "warn" : "bad", cost: 2840, downtime: "2 days", owner: "Huntstown workshop" },
    { id: "WS-2284", vehicle: "BIA-10", title: "Scheduled service B, brakes and filters", kind: "Planned", opened: "Mon 28 Sep", due: "Thu 1 Oct", status: "In progress", tone: "info", cost: 1960, downtime: "3 days", owner: "Huntstown workshop" },
    { id: "WS-2288", vehicle: "BIA-15", title: "Drive axle tyres at 3 mm, replace pair", kind: "Planned", opened: "Fri 25 Sep", due: "Fri 2 Oct", status: "Parts ordered", tone: "warn", cost: 1180, downtime: "3 h", owner: "Mobile tyre service" },
    { id: "WS-2293", vehicle: "BIA-12", title: "Pre-test check before roadworthiness test", kind: "Inspection", opened: "Today 09:10", due: "Thu 1 Oct", status: bia12 ? "Booked Thu 08:00" : "Needs booking", tone: bia12 ? "ok" : "warn", cost: 240, downtime: "2 h", owner: "Huntstown workshop" },
    { id: "WS-2286", vehicle: "BIA-04", title: "Bin lift weigh cell recalibration", kind: "Defect", opened: "Sat 26 Sep", due: "Sat 3 Oct", status: "Scheduled", tone: "info", cost: 320, downtime: "1.5 h", owner: "Huntstown workshop" },
    { id: "WS-2279", vehicle: "BIA-08", title: "Curtain strap and buckle replacement, nearside", kind: "Defect", opened: "Wed 23 Sep", due: "Wed 7 Oct", status: "Parts ordered", tone: "warn", cost: 410, downtime: "2 h", owner: "Huntstown workshop" },
    { id: "WS-2290", vehicle: "BIA-16", title: "Tank outlet valve seal weep", kind: "Defect", opened: "Mon 28 Sep", due: "Mon 5 Oct", status: "Scheduled", tone: "info", cost: 260, downtime: "1 h", owner: "Huntstown workshop" },
  ];
}

export const WO_HISTORY = [
  { id: "WS-2277", vehicle: "BIA-03", title: "Service A, oil and filters", closed: "22 Sep", cost: 690, days: 0.5 },
  { id: "WS-2272", vehicle: "BIA-13", title: "Bin lift chain adjustment", closed: "18 Sep", cost: 210, days: 0.2 },
  { id: "WS-2268", vehicle: "BIA-08", title: "Air suspension bag, trailer axle 2", closed: "15 Sep", cost: 940, days: 1 },
  { id: "WS-2265", vehicle: "BIA-15", title: "Pump PTO coupling replaced", closed: "11 Sep", cost: 1320, days: 1.5 },
  { id: "WS-2261", vehicle: "BIA-01", title: "Reversing camera replaced", closed: "8 Sep", cost: 380, days: 0.2 },
  { id: "WS-2257", vehicle: "BIA-07", title: "Tail-lift hose inspection, advisory", closed: "3 Sep", cost: 180, days: 0.2 },
  { id: "WS-2252", vehicle: "BIA-16", title: "Service B and tacho download", closed: "1 Sep", cost: 1740, days: 2 },
];

export const DOWNTIME = [
  { vehicle: "BIA-10", what: "Service B", from: 0, to: 3, tone: "warn" as Tone },
  { vehicle: "BIA-07", what: "WS-2291 hydraulic ram", from: 0, to: 2, tone: "bad" as Tone },
  { vehicle: "BIA-12", what: "Roadworthiness test", from: 2, to: 2.3, tone: "warn" as Tone },
  { vehicle: "BIA-15", what: "Tyres", from: 3, to: 3.2, tone: "info" as Tone },
  { vehicle: "BIA-04", what: "Weigh cell", from: 4, to: 4.2, tone: "info" as Tone },
  { vehicle: "BIA-16", what: "Valve seal", from: 6, to: 6.15, tone: "info" as Tone },
];

/* Per-vehicle maintenance history for the drawer. */
const HIST_POOL = ["Service A, oil and filters", "Brake pads, front axle", "Tyre replacement, steer axle", "Bin lift hydraulic hose", "Tachograph download and check", "AdBlue sensor replaced", "Wiper and lamp defects cleared", "Service B, full"];
export function vehicleHistory(v: Vehicle) {
  const n = idn(v.id);
  const base = v.id === "BIA-07" ? [{ date: "3 Sep", what: "Tail-lift hose inspection, advisory noted", cost: 180 }] : [];
  return [...base, ...[0, 1, 2].map((i) => ({ date: `${28 - ((n * 3 + i * 9) % 26)} ${["Aug", "Jul", "Jun"][i]}`, what: HIST_POOL[(n + i * 3) % HIST_POOL.length], cost: 180 + ((n * 97 + i * 211) % 1400) }))];
}

export function vehicleDocs(v: Vehicle) {
  const docs = ["Vehicle registration certificate", "Motor insurance certificate 2026", "Roadworthiness (CVRT) certificate"];
  if (v.type !== "Support Vehicle") docs.push("Tachograph calibration certificate");
  if (v.type === "MacPac Bin Truck" || v.type === "Artic Curtainsider") docs.push("LOLER tail-lift / bin lift certificate");
  if (v.type === "Tanker") docs.push("Tank cleaning and seal log");
  docs.push("Operator licence disc");
  return docs;
}

/* ---------- Inspections ---------- */
export type Insp = { key: string; vehicle: string; type: Vehicle["type"]; check: string; last: string; due: string; days: number; provider: string };
export function inspections(vs: Vehicle[]): Insp[] {
  const rows: Insp[] = [];
  vs.forEach((v) => {
    const n = idn(v.id);
    rows.push({ key: v.id + "-cvrt", vehicle: v.id, type: v.type, check: "Roadworthiness (CVRT)", last: v.lastInspection, due: v.nextInspection, days: daysUntil(v.nextInspection), provider: "Test centre, Blanchardstown" });
    if (v.type !== "Support Vehicle") {
      const d = 18 + ((n * 37) % 300);
      rows.push({ key: v.id + "-tacho", vehicle: v.id, type: v.type, check: "Tachograph calibration", last: "2024", due: dayLabel(d), days: d, provider: "Approved tacho centre" });
    }
    if (v.type === "MacPac Bin Truck" || v.type === "Artic Curtainsider") {
      const d = 9 + ((n * 23) % 170);
      rows.push({ key: v.id + "-loler", vehicle: v.id, type: v.type, check: "Tail-lift LOLER (6-monthly)", last: "Apr", due: dayLabel(d), days: d, provider: "Lifting equipment inspector" });
    }
  });
  return rows.sort((a, b) => a.days - b.days);
}
function dayLabel(days: number) {
  const d = new Date(Date.UTC(2026, 8, 29 + days));
  return `${d.getUTCDate()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getUTCMonth()]}`;
}

/* ---------- Costs ---------- */
export const CPK: Record<Vehicle["type"], number> = { "MacPac Bin Truck": 0.71, "Artic Curtainsider": 0.58, Tanker: 0.62, "Support Vehicle": 0.44 };
export const TPK: Record<Vehicle["type"], number> = { "MacPac Bin Truck": 0.052, "Artic Curtainsider": 0.061, Tanker: 0.066, "Support Vehicle": 0.004 };
export function vehicleCost(v: Vehicle) {
  const km = Math.round(v.costYtd / CPK[v.type]);
  const t = Math.round(km * TPK[v.type]);
  return { km, t, cpk: v.costYtd / km, cpt: t ? v.costYtd / t : 0 };
}
/* YTD split of the €336,850 total. */
export const COST_SPLIT = [
  { label: "Fuel and AdBlue", v: 158320 },
  { label: "Maintenance and parts", v: 84210 },
  { label: "Tyres", v: 30320 },
  { label: "Insurance and tax", v: 43790 },
  { label: "Telematics and other", v: 20210 },
];
export const MONTHLY: [string, number][] = [["Jan", 35180], ["Feb", 33920], ["Mar", 37460], ["Apr", 36110], ["May", 38240], ["Jun", 37870], ["Jul", 39420], ["Aug", 38010], ["Sep", 40640]];
