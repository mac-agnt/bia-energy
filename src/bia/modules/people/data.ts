import { EXPIRIES, MANAGEMENT, TIMESHEETS, VEHICLES, type Sheet, type Tone } from "../../story";

/* People data. Real managers (MANAGEMENT) carry role, responsibilities and reports only,
   never metrics. Operational staff are fictional; productivity attaches only to them. */

export const NOW = "13:05";
export const DAYS = [
  { d: "Mon", n: "28" }, { d: "Tue", n: "29" }, { d: "Wed", n: "30" }, { d: "Thu", n: "1" }, { d: "Fri", n: "2" }, { d: "Sat", n: "3" }, { d: "Sun", n: "4" },
];
export const TODAY_IDX = 1;

export type Code = "E" | "D" | "L" | "O" | "A" | "S" | "T";
export type Staff = {
  name: string; role: string; dept: "Logistics" | "Plant"; crew: string; roster: string;
  start: string; end: string; reportsTo: string; certs: { name: string; note: string; tone?: Tone }[]; sheet?: Sheet; vehicle?: string;
};

const CPC = EXPIRIES.find((e) => e.item.includes("Paul Doyle"));

const sheet = (n: string) => TIMESHEETS.find((t) => t.name === n);
const times = (n: string, fallback: [string, string]): [string, string] => {
  const s = sheet(n); if (!s) return fallback;
  const [a, b] = s.shift.split("–"); return [a, b];
};
const drv = ["Driver CPC"];
function mk(name: string, role: string, dept: Staff["dept"], crew: string, roster: string, fb: [string, string], certs: Staff["certs"], reportsTo?: string): Staff {
  const [start, end] = times(name, fb);
  const veh = VEHICLES.filter((v) => v.driver === name).map((v) => v.id);
  return { name, role, dept, crew, roster, start, end, certs, sheet: sheet(name), vehicle: veh.length ? veh.join(", now ") : undefined,
    reportsTo: reportsTo || (dept === "Logistics" ? "Dragos Busuioc" : "Gytis Meskauskas") };
}
const c = (name: string, note: string, tone?: Tone) => ({ name, note, tone });

export const STAFF: Staff[] = [
  mk("Sean Kelly", "Driver", "Logistics", "MacPac North", "EEEEEOO", ["06:00", "14:00"], [c(drv[0], "Valid to Mar 2028"), c("C licence", "Valid")]),
  mk("Ciarán Walsh", "Driver", "Logistics", "MacPac North", "EEEEEOO", ["06:00", "14:00"], [c(drv[0], "Valid to Jun 2027"), c("C licence", "Valid")]),
  mk("Stephen Murphy", "Driver", "Logistics", "MacPac North", "EEEEEOO", ["06:00", "14:30"], [c(drv[0], "Valid to Jan 2028"), c("C licence", "Valid")]),
  mk("Lukas Petrauskas", "Driver", "Logistics", "MacPac North", "EEEEEOO", ["06:00", "14:30"], [c(drv[0], "Valid to Sep 2027"), c("C licence", "Valid")]),
  mk("Aidan Byrne", "Driver", "Logistics", "MacPac North", "DDDDDOO", ["08:00", "16:30"], [c(drv[0], "Valid to Nov 2028"), c("C licence", "Valid")]),
  mk("Darragh Quinn", "Driver", "Logistics", "MacPac City", "EEEEEOO", ["06:00", "15:30"], [c(drv[0], "Valid to Apr 2027"), c("C licence", "Valid")]),
  mk("Jakub Zielinski", "Driver", "Logistics", "MacPac South", "EEEEEOO", ["06:00", "14:30"], [c(drv[0], "Valid to Feb 2029"), c("C licence", "Valid")]),
  mk("Eoin Farrell", "Driver", "Logistics", "MacPac South", "OEEEEEO", ["06:00", "14:30"], [c(drv[0], "Valid to Aug 2028"), c("C licence", "Valid")]),
  mk("Marek Nowak", "Driver", "Logistics", "Artic and bulk", "EEOEEEO", ["05:30", "14:30"], [c(drv[0], "Valid to May 2028"), c("C+E licence", "Valid")]),
  mk("Marek Kowalski", "Driver", "Logistics", "Artic and bulk", "EEEEOEO", ["05:00", "15:00"], [c(drv[0], "Valid to Oct 2027"), c("C+E licence", "Valid")]),
  mk("Tomasz Wiśniewski", "Driver", "Logistics", "Artic and bulk", "EEEOEEO", ["05:00", "15:00"], [c(drv[0], "Valid to Dec 2027"), c("C+E licence", "Valid")]),
  mk("Kevin Moran", "Driver", "Logistics", "Artic and bulk", "AAAAAOO", ["05:30", "14:30"], [c(drv[0], "Valid to Jul 2028"), c("C+E licence", "Valid")]),
  mk("Paul Doyle", "Tanker Driver", "Logistics", "Tanker", "EEEEEOO", ["06:00", "15:30"], [c(drv[0], `Renewal due in ${CPC?.days ?? 19} days, course not booked`, "warn"), c("C+E licence", "Valid"), c("Tanker loading", "Valid")]),
  mk("Gary Nolan", "Tanker Driver", "Logistics", "Tanker", "EEEEOEE", ["06:00", "15:30"], [c(drv[0], "Valid to Mar 2027"), c("C+E licence", "Valid"), c("Tanker loading", "Valid")]),
  mk("Ronan Hayes", "Support Driver", "Logistics", "Support", "DDDDDOO", ["08:00", "16:30"], [c(drv[0], "Valid to Sep 2028"), c("C1 licence", "Valid")]),
  mk("Aoife Brennan", "Weighbridge Operator", "Plant", "Weighbridge and reception", "DDDDDOO", ["07:00", "15:00"], [c("Weighbridge operator", "Valid"), c("Manual handling", "Valid")], "Natalia Biancha"),
  mk("Niall Gorman", "Yard Operative", "Plant", "Weighbridge and reception", "EEETEOO", ["06:00", "14:00"], [c("Forklift", "Refresher booked Thu", "info"), c("Banksman", "Valid")]),
  mk("Adam Doyle", "Plant Operator", "Plant", "Plant process", "DDDDDOO", ["08:00", "17:00"], [c("Confined space entry", "Valid"), c("Gas safety awareness", "Valid")]),
  mk("Viktor Horvat", "Depackaging Operator", "Plant", "Plant process", "DDDDODO", ["07:00", "15:00"], [c("Machine guarding", "Valid"), c("Forklift", "Valid")]),
  mk("Sorcha Daly", "Plant Operator", "Plant", "Plant process", "DSDDDOO", ["08:00", "17:00"], [c("Confined space entry", "Valid"), c("Gas safety awareness", "Valid")]),
  mk("Ultan Reid", "Plant Operator", "Plant", "Plant late", "LLLLLOL", ["14:00", "22:00"], [c("Confined space entry", "Valid"), c("Gas safety awareness", "Valid")]),
  mk("Ionut Radu", "Depackaging Operator", "Plant", "Plant late", "LLOLLLL", ["14:00", "22:00"], [c("Machine guarding", "Valid"), c("Forklift", "Valid")]),
];

/* Required cover per day. Wed drivers includes BULK-211 at 06:00 on BIA-09. */
export const REQUIRED = { Logistics: [13, 14, 14, 13, 12, 5, 1], Plant: [6, 6, 6, 6, 6, 3, 2] };

/* The roster with any accepted cover changes applied. */
export function rosterOf(p: Staff, done: Record<string, boolean>): string {
  if (p.name === "Marek Nowak" && done.bulk211cover) return p.roster.slice(0, 2) + "E" + p.roster.slice(3);
  if (p.name === "Ultan Reid" && done.satplant) return p.roster.slice(0, 5) + "L" + p.roster.slice(6);
  return p.roster;
}
export const working = (c: string) => c === "E" || c === "D" || c === "L";
export function coverage(dept: "Logistics" | "Plant", done: Record<string, boolean>) {
  return DAYS.map((_, d) => STAFF.filter((p) => p.dept === dept && working(rosterOf(p, done)[d])).length);
}

export const CODE: Record<Code, { label: string; tone: Tone }> = {
  E: { label: "Early", tone: "accent" }, D: { label: "Day", tone: "info" }, L: { label: "Late", tone: "neutral" },
  O: { label: "Off", tone: "neutral" }, A: { label: "Annual leave", tone: "warn" }, S: { label: "Sick", tone: "bad" }, T: { label: "Training", tone: "info" },
};
export const shiftTime = (p: Staff, code: string) => (code === "L" ? "14:00" : code === "E" || code === "D" ? p.start : "");

/* ---------- Management: role only, never metrics ---------- */
export const MGMT_INFO: Record<string, { resp: string[]; reports: string[]; reportsTo?: string }> = {
  "Pat Loughman": { resp: ["Group operations across collection, fleet and Huntstown", "Operating plan and capital spend", "Sign-off on the productivity model"], reports: ["Dragos Busuioc", "Gytis Meskauskas", "Ricarte Nazerenco"] },
  "Dragos Busuioc": { resp: ["Collections scheduling and dispatch", "Fleet allocation and driver rostering", "Logistics timesheets and overtime approval"], reports: STAFF.filter((s) => s.dept === "Logistics").map((s) => s.name), reportsTo: "Pat Loughman" },
  "Gytis Meskauskas": { resp: ["Intake, depackaging and digestion", "Plant availability and throughput", "Plant crew rostering"], reports: ["Natalia Biancha", ...STAFF.filter((s) => s.dept === "Plant" && s.reportsTo === "Gytis Meskauskas").map((s) => s.name)], reportsTo: "Pat Loughman" },
  "Natalia Biancha": { resp: ["Weighbridge operations and tickets", "Intake acceptance and variance review", "Weighbridge calibration"], reports: ["Aoife Brennan"], reportsTo: "Gytis Meskauskas" },
  "Ricarte Nazerenco": { resp: ["Health and safety management", "Incident reporting and investigation", "Site audits"], reports: ["Larissa Franca"], reportsTo: "Pat Loughman" },
  "Larissa Franca": { resp: ["Waste permits and transfer documentation", "Driver and vehicle compliance records", "Environmental reporting"], reports: [], reportsTo: "Ricarte Nazerenco" },
  "Garreth Ritchie": { resp: ["Customer contracts and pricing", "New customer onboarding", "Commercial reporting"], reports: [] },
  "Shane O'Brien": { resp: ["Digestate and biofertiliser offtake", "Agri customer relationships", "Seasonal dispatch planning"], reports: [] },
};
export { MANAGEMENT };

/* Whole-organisation headcount (demo). Sums to 61 heads, 38 on shift now. */
export const DEPTS = [
  { dept: "Logistics", head: 24, onShift: 15 }, { dept: "Plant", head: 19, onShift: 11 }, { dept: "Workshop", head: 5, onShift: 3 },
  { dept: "Operations", head: 4, onShift: 3 }, { dept: "Commercial", head: 4, onShift: 3 }, { dept: "Compliance", head: 3, onShift: 2 }, { dept: "Agri", head: 2, onShift: 1 },
];

export const initials = (n: string) => n.split(" ").map((w) => w[0]).slice(0, 2).join("");
export const jobName = (n: string) => { const [f, ...r] = n.split(" "); return f[0] + ". " + r.join(" "); };

/* ---------- Productivity model ---------- */
export type InputKey = "paid" | "productive" | "jobs" | "tonnesC" | "tonnesP" | "stops" | "route" | "throughput" | "downtime" | "overtime";
export type Model = Record<InputKey, { on: boolean; w: number }>;
export const INPUTS: { key: InputKey; label: string; source: string; measure: string; applies: "Logistics" | "Plant" | "All" }[] = [
  { key: "paid", label: "Paid hours", source: "Timesheets / HR", measure: "Attended against rostered hours", applies: "All" },
  { key: "productive", label: "Productive hours", source: "Fleet / telematics", measure: "Engine-on and task time over paid time", applies: "All" },
  { key: "jobs", label: "Jobs completed", source: "Pulse collections", measure: "Completed against allocated jobs", applies: "Logistics" },
  { key: "tonnesC", label: "Tonnes collected", source: "Weighbridge", measure: "Weighed net against expected", applies: "Logistics" },
  { key: "tonnesP", label: "Tonnes processed", source: "Plant / SCADA data", measure: "Tonnes fed against plan", applies: "Plant" },
  { key: "stops", label: "Stops completed", source: "Fleet / telematics", measure: "Stops made against planned", applies: "Logistics" },
  { key: "route", label: "Planned vs actual route time", source: "Fleet / telematics", measure: "Planned duration over actual", applies: "Logistics" },
  { key: "throughput", label: "Plant throughput", source: "Plant / SCADA data", measure: "Shift throughput against plan", applies: "Plant" },
  { key: "downtime", label: "Downtime", source: "Plant / SCADA data", measure: "Time without a fault stop", applies: "All" },
  { key: "overtime", label: "Overtime", source: "Timesheets / HR", measure: "Hours inside rostered shift", applies: "All" },
];
export const DEFAULT_MODEL: Model = {
  paid: { on: true, w: 15 }, productive: { on: true, w: 30 }, jobs: { on: true, w: 15 }, tonnesC: { on: true, w: 10 }, tonnesP: { on: false, w: 10 },
  stops: { on: true, w: 10 }, route: { on: true, w: 10 }, throughput: { on: true, w: 10 }, downtime: { on: false, w: 10 }, overtime: { on: false, w: 10 },
};
export const PRESETS: Record<string, Model> = {
  "Current draft": DEFAULT_MODEL,
  "Hours only": { ...Object.fromEntries(INPUTS.map((i) => [i.key, { on: false, w: 10 }])), paid: { on: true, w: 40 }, productive: { on: true, w: 60 } } as Model,
  "Output-led": { ...Object.fromEntries(INPUTS.map((i) => [i.key, { on: false, w: 10 }])), jobs: { on: true, w: 25 }, tonnesC: { on: true, w: 20 }, stops: { on: true, w: 20 }, tonnesP: { on: true, w: 15 }, throughput: { on: true, w: 20 } } as Model,
  "Fair to breakdowns": { ...DEFAULT_MODEL, downtime: { on: true, w: 15 }, route: { on: true, w: 5 } },
};

/* Component scores, 0–100. Drivers: jobs, tonnes, stops, route. Plant: processed, throughput. */
const BASE: Record<string, { paid: number; jobs?: number; tonnesC?: number; stops?: number; route?: number; tonnesP?: number; throughput?: number; downtime: number }> = {
  "Sean Kelly": { paid: 100, jobs: 100, tonnesC: 98, stops: 100, route: 96, downtime: 100 },
  "Marek Nowak": { paid: 98, jobs: 100, tonnesC: 99, stops: 100, route: 91, downtime: 100 },
  "Stephen Murphy": { paid: 100, jobs: 100, tonnesC: 97, stops: 97, route: 94, downtime: 100 },
  "Marek Kowalski": { paid: 100, jobs: 50, tonnesC: 100, stops: 100, route: 72, downtime: 62 },
  "Darragh Quinn": { paid: 99, jobs: 100, tonnesC: 96, stops: 94, route: 88, downtime: 100 },
  "Tomasz Wiśniewski": { paid: 100, jobs: 100, tonnesC: 100, stops: 100, route: 90, downtime: 100 },
  "Ciarán Walsh": { paid: 100, jobs: 100, tonnesC: 100, stops: 100, route: 97, downtime: 100 },
  "Paul Doyle": { paid: 100, jobs: 100, tonnesC: 99, stops: 100, route: 93, downtime: 100 },
  "Adam Doyle": { paid: 100, tonnesP: 95, throughput: 94, downtime: 96 },
  "Aoife Brennan": { paid: 100, tonnesP: 95, throughput: 94, downtime: 100 },
  "Viktor Horvat": { paid: 98, tonnesP: 92, throughput: 92, downtime: 88 },
  "Niall Gorman": { paid: 100, tonnesP: 95, throughput: 94, downtime: 100 },
};
export const FAULT_HOURS = 1.3; // Marek Kowalski waiting on BIA-07 recovery

export function components(s: Sheet, excludeFault: boolean): Partial<Record<InputKey, number>> {
  const b = BASE[s.name];
  const fault = excludeFault && s.name === "Marek Kowalski";
  const paidBase = fault ? s.worked - FAULT_HOURS : s.worked;
  return {
    paid: b?.paid ?? 100,
    productive: Math.min(100, (s.productive / paidBase) * 100),
    jobs: b?.jobs, tonnesC: b?.tonnesC, stops: b?.stops, route: fault ? 90 : b?.route, tonnesP: b?.tonnesP, throughput: b?.throughput,
    downtime: fault ? 100 : b?.downtime ?? 100,
    overtime: Math.max(0, 100 - (s.overtime / s.worked) * 100),
  };
}
function wavg(c: Partial<Record<InputKey, number>>, m: Model): number | null {
  let sw = 0, sv = 0;
  for (const i of INPUTS) { const v = c[i.key]; const q = m[i.key]; if (q.on && q.w > 0 && v != null) { sw += q.w; sv += q.w * v; } }
  return sw ? sv / sw : null;
}
/* Live index: today's index moved by how much the model changes the weighted score.
   With the current draft model it equals the recorded index exactly. */
export function liveIndex(s: Sheet, m: Model, excludeFault: boolean): number | null {
  const now = wavg(components(s, excludeFault), m), base = wavg(components(s, false), DEFAULT_MODEL);
  if (now == null || base == null) return null;
  return Math.max(0, Math.min(100, s.index + now - base));
}
export const OVERALL = 91;
export function overall(m: Model, excludeFault: boolean): number | null {
  const d = TIMESHEETS.map((s) => { const v = liveIndex(s, m, excludeFault); return v == null ? null : v - s.index; }).filter((x): x is number => x != null);
  return d.length ? OVERALL + d.reduce((a, b) => a + b, 0) / d.length : null;
}
export function contributions(s: Sheet, m: Model, excludeFault: boolean) {
  const c = components(s, excludeFault);
  const rows = INPUTS.filter((i) => m[i.key].on && m[i.key].w > 0 && c[i.key] != null).map((i) => ({ ...i, score: c[i.key] as number, w: m[i.key].w }));
  const sw = rows.reduce((a, r) => a + r.w, 0);
  return rows.map((r) => ({ ...r, share: sw ? r.w / sw : 0 }));
}

/* ---------- Route, day and week views ---------- */
export type RouteRow = { id: string; route: string; vehicle: string; driver: string; planned: number; actual: number; stops: number; tonnes: number; delay: number; util: number; note?: string };
export const ROUTES: RouteRow[] = [
  { id: "r1", route: "Finglas and Clonsilla", vehicle: "BIA-01", driver: "Sean Kelly", planned: 460, actual: 472, stops: 26, tonnes: 11.5, delay: 12, util: 91 },
  { id: "r2", route: "Swords loop B", vehicle: "BIA-02", driver: "Ciarán Walsh", planned: 465, actual: 470, stops: 29, tonnes: 30.5, delay: 5, util: 88 },
  { id: "r3", route: "Blanchardstown and Lucan", vehicle: "BIA-03", driver: "Stephen Murphy", planned: 480, actual: 500, stops: 31, tonnes: 7.3, delay: 20, util: 93 },
  { id: "r4", route: "City centre loop", vehicle: "BIA-04", driver: "Darragh Quinn", planned: 490, actual: 528, stops: 34, tonnes: 5.9, delay: 38, util: 90, note: "COL-1846 break window" },
  { id: "r5", route: "Tallaght loop", vehicle: "BIA-05", driver: "Jakub Zielinski", planned: 470, actual: 485, stops: 24, tonnes: 6.8, delay: 15, util: 86, note: "COL-1858 sequence clash" },
  { id: "r6", route: "Dún Laoghaire loop", vehicle: "BIA-06", driver: "Eoin Farrell", planned: 450, actual: 456, stops: 22, tonnes: 5.2, delay: 6, util: 84 },
  { id: "r7", route: "BULK-204 Naas", vehicle: "BIA-07", driver: "Marek Kowalski", planned: 250, actual: 292, stops: 1, tonnes: 18.6, delay: 42, util: 79, note: "BIA-07 hydraulic fault" },
  { id: "r8", route: "BULK-209 Carlow", vehicle: "BIA-08", driver: "Tomasz Wiśniewski", planned: 500, actual: 530, stops: 6, tonnes: 21.4, delay: 30, util: 89 },
  { id: "r9", route: "Navan loop", vehicle: "BIA-13", driver: "Lukas Petrauskas", planned: 440, actual: 448, stops: 18, tonnes: 12.1, delay: 8, util: 87 },
  { id: "r10", route: "TNK-039 / 041 Ballymount", vehicle: "BIA-15", driver: "Paul Doyle", planned: 510, actual: 550, stops: 2, tonnes: 21.3, delay: 40, util: 90, note: "TNK-041 slow loading" },
  { id: "r11", route: "TNK-040 / 043 Drogheda", vehicle: "BIA-16", driver: "Gary Nolan", planned: 520, actual: 525, stops: 2, tonnes: 19.9, delay: 5, util: 88 },
];
export const hm = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;

export const DAY_VIEW = [
  { day: "Wed 23", index: 89, hours: 486, ot: 14.2, tonnes: 356 }, { day: "Thu 24", index: 92, hours: 478, ot: 9.6, tonnes: 371 },
  { day: "Fri 25", index: 90, hours: 492, ot: 12.8, tonnes: 384 }, { day: "Sat 26", index: 93, hours: 212, ot: 3.1, tonnes: 158 },
  { day: "Sun 27", index: 94, hours: 64, ot: 0.8, tonnes: 62 }, { day: "Mon 28", index: 90, hours: 488, ot: 11.4, tonnes: 468.2 },
  { day: "Today", index: 91, hours: 318, ot: 7.5, tonnes: 146.8 },
];
export const WEEK_VIEW = [
  { wk: "W33", index: 88, hours: 2410, ot: 58 }, { wk: "W34", index: 89, hours: 2386, ot: 52 }, { wk: "W35", index: 90, hours: 2452, ot: 61 },
  { wk: "W36", index: 89, hours: 2398, ot: 49 }, { wk: "W37", index: 91, hours: 2440, ot: 44 }, { wk: "W38", index: 90, hours: 2425, ot: 47 },
  { wk: "W39", index: 92, hours: 2466, ot: 41 }, { wk: "W40", index: 91, hours: 806, ot: 18.9 },
];
export const PLANT_TPH = [2.21, 2.28, 2.3, 2.35, 2.26, 2.31, 2.33];
