import { CUSTOMERS, JOBS, type Job, type JobStatus, type Tone } from "../../story";
import { bulk204, useBia } from "../../store";

/* Derived Collections data. Everything starts from story.ts and is then
   adjusted by the shared approval state, so an approval anywhere in Pulse
   shows up on every Collections tab. */

export type BiaState = ReturnType<typeof useBia>;

export function liveJobs(s: BiaState): Job[] {
  const b = bulk204(s);
  return JOBS.map((j) => {
    if (j.id === "BULK-204") {
      return b.moved
        ? { ...j, vehicle: "BIA-14", status: "En route" as JobStatus, eta: b.eta, note: "Reassigned from BIA-07 to BIA-14. Recovered ETA 14:37, +27 min against plan." }
        : { ...j, eta: b.eta };
    }
    if (b.plan && j.id === "COL-1858") return { ...j, status: "Scheduled" as JobStatus, eta: "14:58", note: "Resequenced behind COL-1861 by the Dispatch Agent." };
    if (b.plan && j.id === "COL-1846") return { ...j, status: "Scheduled" as JobStatus, eta: "15:30", note: "D. Quinn break moved 18 min later, within permitted limits." };
    return j;
  });
}

export function useJobs(): Job[] {
  return liveJobs(useBia());
}

export const STAGES = ["Scheduled", "En route", "On site", "Loading", "Returning", "Complete", "Exception"] as const;
export type Stage = (typeof STAGES)[number];
export const stageOf = (j: Job): Stage => (j.status === "At risk" ? "Exception" : j.status);

export const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};
export const fromMin = (n: number) => String(Math.floor(n / 60)).padStart(2, "0") + ":" + String(n % 60).padStart(2, "0");
export const NOW = "13:05";

export const customerOf = (name: string) => CUSTOMERS.find((c) => c.name === name);

export const MATERIAL: Record<Job["type"], string> = {
  "Wheelie Bin": "Unpackaged food waste, 240 L and 1,100 L bins",
  "Bulk Pallet": "Packaged food on pallets, for depackaging",
  Dolav: "Packaged food in Dolav containers",
  Curtainsider: "Packaged bakery waste, curtainsider load",
  Tanker: "Liquid food waste and dairy by-product",
  "Customer Delivery": "Digestate biofertiliser, outbound",
};

/* ---------- Routes: remaining stops sum to TODAY.stopsRemaining (58) ---------- */
export type RouteDef = {
  id: string; name: string; area: string; vehicles: string[]; drivers: string;
  done: number; remaining: number; plannedMin: number; forecastMin: number; start: string;
};
export const ROUTES: RouteDef[] = [
  { id: "R-SWB", name: "Swords loop B", area: "Swords, Malahide, Portmarnock", vehicles: ["BIA-02"], drivers: "C. Walsh", done: 29, remaining: 8, plannedMin: 480, forecastMin: 486, start: "06:00" },
  { id: "R-CCL", name: "City centre loop", area: "Smithfield, Temple Bar, Docklands", vehicles: ["BIA-04"], drivers: "D. Quinn", done: 34, remaining: 11, plannedMin: 510, forecastMin: 538, start: "06:00" },
  { id: "R-TAL", name: "Tallaght loop", area: "Tallaght, Clondalkin, Firhouse", vehicles: ["BIA-05"], drivers: "J. Zielinski", done: 22, remaining: 9, plannedMin: 480, forecastMin: 501, start: "06:30" },
  { id: "R-DUN", name: "Dún Laoghaire loop", area: "Sandyford, Belfield, Ballsbridge", vehicles: ["BIA-06"], drivers: "E. Farrell", done: 24, remaining: 7, plannedMin: 480, forecastMin: 476, start: "06:30" },
  { id: "R-NAV", name: "Navan loop", area: "Navan, Dunshaughlin, Ratoath", vehicles: ["BIA-13"], drivers: "L. Petrauskas", done: 14, remaining: 6, plannedMin: 450, forecastMin: 458, start: "06:00" },
  { id: "R-FIN", name: "Finglas and Blanchardstown", area: "Finglas, Clonsilla, Lucan", vehicles: ["BIA-01", "BIA-03"], drivers: "S. Kelly, S. Murphy", done: 57, remaining: 5, plannedMin: 960, forecastMin: 954, start: "06:00" },
  { id: "R-SSA", name: "Swords and Santry", area: "Santry, Beaumont, Swords", vehicles: ["BIA-11"], drivers: "A. Byrne", done: 12, remaining: 6, plannedMin: 420, forecastMin: 430, start: "07:00" },
  { id: "R-BLK", name: "BULK runs", area: "Naas, Carlow", vehicles: ["BIA-07", "BIA-14", "BIA-08"], drivers: "M. Kowalski, T. Wiśniewski", done: 3, remaining: 2, plannedMin: 600, forecastMin: 642, start: "05:00" },
  { id: "R-TNK", name: "TNK runs", area: "Ballymount, Drogheda", vehicles: ["BIA-15", "BIA-16"], drivers: "P. Doyle, G. Nolan", done: 3, remaining: 4, plannedMin: 570, forecastMin: 584, start: "06:00" },
];

export function routeStatus(r: RouteDef, s: BiaState): { label: string; tone: Tone; forecastMin: number } {
  const b = bulk204(s);
  if (r.id === "R-BLK") return b.moved ? { label: "Behind 27 min", tone: "warn", forecastMin: 627 } : { label: "At risk", tone: "bad", forecastMin: r.forecastMin };
  if (r.id === "R-CCL") return b.plan ? { label: "On time", tone: "ok", forecastMin: 514 } : { label: "At risk", tone: "bad", forecastMin: r.forecastMin };
  if (r.id === "R-TAL") return b.plan ? { label: "On time", tone: "ok", forecastMin: 488 } : { label: "At risk", tone: "bad", forecastMin: r.forecastMin };
  if (r.id === "R-TNK") return { label: "TNK-044 unassigned", tone: "warn", forecastMin: r.forecastMin };
  const d = r.forecastMin - r.plannedMin;
  return d > 5 ? { label: `Behind ${d} min`, tone: "warn", forecastMin: r.forecastMin } : { label: "On time", tone: "ok", forecastMin: r.forecastMin };
}

export const routeOfVehicle = (vid: string) => ROUTES.find((r) => r.vehicles.includes(vid));
export const routeTonnes = (r: RouteDef, jobs: Job[]) =>
  jobs.filter((j) => j.status === "Complete" && r.vehicles.includes(j.vehicle)).reduce((a, j) => a + (j.actual || 0), 0);
export const hm = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;

/* ---------- Arrivals at Huntstown ---------- */
export const ARRIVALS = [
  { time: "13:20", vehicle: "BIA-03", job: "COL-1842", customer: "GreenMart", from: "Blanchardstown", t: 2.4 },
  { time: "14:40", vehicle: "BIA-01", job: "COL-1860", customer: "Northside Distribution", from: "Finglas", t: 4.2 },
  { time: "15:20", vehicle: "BIA-16", job: "TNK-043", customer: "Boyne Valley Dairies", from: "Drogheda", t: 20.1 },
  { time: "15:50", vehicle: "BIA-15", job: "TNK-041", customer: "Dublin Foods", from: "Ballymount", t: 21.5 },
  { time: "16:10", vehicle: "BIA-08", job: "BULK-209", customer: "Leinster Bakeries", from: "Carlow", t: 16.4 },
];

/* ---------- Weekly history: sums to WEEK.collections (186) and WEEK.collectedT (1,946) ---------- */
export const WEEK_DAYS = [
  { day: "Wed", date: "23 Sep", n: 28, t: 312.4, sla: 96.4 },
  { day: "Thu", date: "24 Sep", n: 29, t: 318.9, sla: 95.8 },
  { day: "Fri", date: "25 Sep", n: 31, t: 341.6, sla: 94.9 },
  { day: "Sat", date: "26 Sep", n: 21, t: 226.3, sla: 97.1 },
  { day: "Sun", date: "27 Sep", n: 8, t: 88.2, sla: 100 },
  { day: "Mon", date: "28 Sep", n: 35, t: 511.8, sla: 93.7 },
  { day: "Tue", date: "29 Sep", n: 34, t: 146.8, sla: 94 },
];

export type HistRow = { id: string; date: string; customer: string; site: string; type: Job["type"]; vehicle: string; driver: string; time: string; expected: number; actual: number; docket: string };

const TEMPLATES: Omit<HistRow, "id" | "date" | "time" | "actual" | "docket">[] = [
  { customer: "GreenMart", site: "Blanchardstown", type: "Wheelie Bin", vehicle: "BIA-03", driver: "S. Murphy", expected: 2.5 },
  { customer: "Dublin Foods", site: "Ballymount", type: "Tanker", vehicle: "BIA-15", driver: "P. Doyle", expected: 21.0 },
  { customer: "CityFresh", site: "Swords", type: "Dolav", vehicle: "BIA-02", driver: "C. Walsh", expected: 8.2 },
  { customer: "Leinster Bakeries", site: "Carlow", type: "Curtainsider", vehicle: "BIA-08", driver: "T. Wiśniewski", expected: 20.6 },
  { customer: "Liffey Hospitality Group", site: "Temple Bar", type: "Wheelie Bin", vehicle: "BIA-04", driver: "D. Quinn", expected: 1.5 },
  { customer: "Boyne Valley Dairies", site: "Drogheda", type: "Tanker", vehicle: "BIA-16", driver: "G. Nolan", expected: 19.6 },
  { customer: "FreshFields Foods", site: "Naas", type: "Bulk Pallet", vehicle: "BIA-07", driver: "M. Kowalski", expected: 18.2 },
  { customer: "Northside Distribution", site: "Finglas", type: "Dolav", vehicle: "BIA-01", driver: "S. Kelly", expected: 4.3 },
  { customer: "Meath Fresh Produce", site: "Navan", type: "Bulk Pallet", vehicle: "BIA-13", driver: "L. Petrauskas", expected: 6.0 },
  { customer: "Riverbank Healthcare Campus", site: "Beaumont", type: "Wheelie Bin", vehicle: "BIA-11", driver: "A. Byrne", expected: 1.5 },
  { customer: "GreenMart", site: "Tallaght", type: "Wheelie Bin", vehicle: "BIA-05", driver: "J. Zielinski", expected: 2.3 },
  { customer: "Hibernia College Catering", site: "Belfield", type: "Wheelie Bin", vehicle: "BIA-06", driver: "E. Farrell", expected: 1.9 },
];
const VAR = [0.04, -0.03, 0.06, 0.01, -0.05, 0.02, 0.08, -0.02, 0.03, 0];
const TIMES = ["07:40", "08:25", "09:10", "09:55", "10:30", "11:15", "12:05", "12:50", "13:40", "14:25"];

export function historyRows(jobs: Job[]): HistRow[] {
  const today: HistRow[] = jobs.filter((j) => j.status === "Complete").map((j, i) => ({
    id: j.id, date: "Tue 29 Sep", customer: j.customer, site: j.site, type: j.type, vehicle: j.vehicle, driver: j.driver,
    time: j.eta, expected: j.expected, actual: j.actual || 0, docket: j.id === "BULK-201" ? "WTD-58812" : "WTD-" + (58811 - i),
  })).sort((a, b) => toMin(b.time) - toMin(a.time));
  const prior: HistRow[] = [];
  let seq = 1831, dk = 58790;
  WEEK_DAYS.slice(0, 6).reverse().forEach((d, di) => {
    const count = d.day === "Sun" ? 3 : 6;
    for (let i = 0; i < count; i++) {
      const tp = TEMPLATES[(di * 5 + i * 7) % TEMPLATES.length];
      const v = VAR[(di + i * 3) % VAR.length];
      const prefix = tp.type === "Tanker" ? "TNK-0" + (38 - di * 2 - (i % 2)) : tp.type === "Bulk Pallet" || tp.type === "Curtainsider" ? "BULK-" + (200 - di * 3 - i) : "COL-" + (seq - i);
      prior.push({ ...tp, id: prefix, date: `${d.day} ${d.date}`, time: TIMES[(i * 2 + di) % TIMES.length], actual: +(tp.expected * (1 + v)).toFixed(2), docket: "WTD-" + (dk - i) });
    }
    seq -= 9; dk -= count + 20;
  });
  return [...today, ...prior];
}

/* ---------- Tomorrow's plan, for the Schedule tab ---------- */
export type Block = { vehicle: string; id: string; label: string; start: string; dur: number; tone: Tone };
export const TOMORROW: Block[] = [
  { vehicle: "BIA-01", id: "COL-1871", label: "Northside, Finglas", start: "06:40", dur: 45, tone: "info" },
  { vehicle: "BIA-01", id: "COL-1874", label: "GreenMart, Clonsilla", start: "09:20", dur: 30, tone: "info" },
  { vehicle: "BIA-01", id: "COL-1880", label: "Northside, Coolock", start: "12:10", dur: 45, tone: "info" },
  { vehicle: "BIA-02", id: "COL-1872", label: "CityFresh, Swords", start: "06:30", dur: 50, tone: "info" },
  { vehicle: "BIA-02", id: "COL-1877", label: "CityFresh, Malahide", start: "10:40", dur: 30, tone: "info" },
  { vehicle: "BIA-03", id: "COL-1873", label: "GreenMart, Blanchardstown", start: "07:10", dur: 30, tone: "info" },
  { vehicle: "BIA-03", id: "COL-1881", label: "GreenMart, Lucan", start: "11:30", dur: 30, tone: "info" },
  { vehicle: "BIA-04", id: "COL-1866", label: "Liffey, Ranelagh (return visit)", start: "07:40", dur: 20, tone: "warn" },
  { vehicle: "BIA-04", id: "COL-1875", label: "Liffey, Temple Bar", start: "09:00", dur: 25, tone: "info" },
  { vehicle: "BIA-04", id: "COL-1882", label: "Northside, Smithfield", start: "12:30", dur: 40, tone: "info" },
  { vehicle: "BIA-05", id: "COL-1876", label: "GreenMart, Tallaght", start: "07:30", dur: 30, tone: "info" },
  { vehicle: "BIA-05", id: "COL-1884", label: "GreenMart, Clondalkin", start: "11:00", dur: 30, tone: "info" },
  { vehicle: "BIA-06", id: "COL-1878", label: "Hibernia, Belfield", start: "08:00", dur: 30, tone: "info" },
  { vehicle: "BIA-06", id: "COL-1883", label: "GreenMart, Sandyford", start: "11:50", dur: 30, tone: "info" },
  { vehicle: "BIA-08", id: "BULK-212", label: "Leinster Bakeries, Carlow", start: "06:30", dur: 90, tone: "accent" },
  { vehicle: "BIA-09", id: "BULK-211", label: "FreshFields, Naas", start: "06:00", dur: 90, tone: "accent" },
  { vehicle: "BIA-11", id: "COL-1879", label: "Riverbank, Beaumont", start: "08:30", dur: 25, tone: "info" },
  { vehicle: "BIA-11", id: "COL-1885", label: "CityFresh, Santry", start: "12:00", dur: 35, tone: "info" },
  { vehicle: "BIA-13", id: "COL-1886", label: "Meath Fresh, Navan", start: "07:00", dur: 60, tone: "accent" },
  { vehicle: "BIA-14", id: "BULK-213", label: "FreshFields, Naas", start: "08:00", dur: 90, tone: "accent" },
  { vehicle: "BIA-15", id: "TNK-045", label: "Dublin Foods, Ballymount", start: "06:30", dur: 70, tone: "accent" },
  { vehicle: "BIA-15", id: "TNK-047", label: "Dublin Foods, Ballymount", start: "12:30", dur: 70, tone: "accent" },
  { vehicle: "BIA-16", id: "TNK-046", label: "Boyne Valley, Drogheda", start: "07:00", dur: 70, tone: "accent" },
  { vehicle: "BIA-12", id: "INSP", label: "Roadworthiness test", start: "08:00", dur: 120, tone: "warn" },
];

export const JOB_DUR: Record<Job["type"], number> = { "Wheelie Bin": 25, "Bulk Pallet": 70, Dolav: 40, Curtainsider: 80, Tanker: 60, "Customer Delivery": 60 };

/* ---------- Recurring service pattern by customer frequency ---------- */
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export function freqDays(freq: string): boolean[] {
  const on = (idx: number[]) => WEEKDAYS.map((_, i) => idx.includes(i));
  if (freq === "Daily") return on([0, 1, 2, 3, 4, 5, 6]);
  if (freq.startsWith("6")) return on([0, 1, 2, 3, 4, 5]);
  if (freq.startsWith("5")) return on([0, 1, 2, 3, 4]);
  if (freq.startsWith("4")) return on([0, 1, 3, 4]);
  if (freq.startsWith("3")) return on([0, 2, 4]);
  if (freq.startsWith("2")) return on([1, 4]);
  return on([]);
}
