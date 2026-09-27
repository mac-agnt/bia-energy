import { EXPIRIES, VEHICLES, type Tone, type Vehicle } from "../../story";

/* Compliance demo data. Mock values, fictional references. Day counts are
   relative to the demo date, Tuesday 29 September 2026. */

const BASE = Date.UTC(2026, 8, 29);
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function dateIn(days: number, weekday = true) {
  const d = new Date(BASE + days * 864e5);
  return (weekday ? WD[d.getUTCDay()] + " " : "") + d.getUTCDate() + " " + MO[d.getUTCMonth()];
}
export function daysUntil(s: string) {
  const [d, m] = s.split(" ");
  const mi = MO.indexOf(m);
  if (mi < 0) return 999;
  return Math.round((Date.UTC(2026, mi, Number(d)) - BASE) / 864e5);
}
export const urgency = (days: number): Tone => (days <= 7 ? "bad" : days <= 30 ? "warn" : days <= 60 ? "info" : "neutral");

export const HEALTH_AREAS = [
  { label: "Fleet roadworthiness and inspections", v: 96 },
  { label: "Waste transfer documentation", v: 99 },
  { label: "Driver documentation", v: 97 },
  { label: "Weighbridge calibration", v: 100 },
  { label: "ISO management system", v: 100 },
  { label: "Health & Safety", v: 98 },
];

export const CATEGORIES = [
  { name: "Waste permits", count: 6, note: "Collection permit, facility licence, returns", status: "All valid", tone: "ok" as Tone },
  { name: "Vehicle inspections", count: 64, note: "Roadworthiness, periodic, LOLER, tachograph", status: "1 due in 3 days", tone: "bad" as Tone },
  { name: "Driver documentation", count: 118, note: "Licences, CPC, tachograph cards", status: "1 CPC in 19 days", tone: "warn" as Tone },
  { name: "Weighbridge calibration", count: 8, note: "Certificates, verification logs", status: "Due in 41 days", tone: "info" as Tone },
  { name: "ISO", count: 14, note: "ISO 9001, 14001, 45001 certificates and IMS", status: "3 of 3 certified", tone: "ok" as Tone },
  { name: "Health & Safety", count: 46, note: "Safety statement, risk assessments, ATEX", status: "Current", tone: "ok" as Tone },
  { name: "SOPs", count: 57, note: "Intake, depackaging, tanker, yard", status: "1 revision pending", tone: "warn" as Tone },
  { name: "Waste transfer documentation", count: 7412, note: "Dockets, 2026 to date", status: "33 of 34 today", tone: "warn" as Tone },
];

/* ---------- Vehicle compliance matrix ---------- */
export type Check = { s: string; tone: Tone; d?: string };
export type VRow = { id: string; reg: string; type: Vehicle["type"]; status: Vehicle["status"]; road: Check; tacho: Check; loler: Check; disc: Check; ins: Check; score: number };
const ok = (d: string): Check => ({ s: "Valid", tone: "ok", d });
const NA: Check = { s: "N/A", tone: "neutral" };
const TACHO: Record<string, string> = { "BIA-01": "Mar 2027", "BIA-02": "Mar 2027", "BIA-03": "Jan 2027", "BIA-04": "Jan 2027", "BIA-05": "Jun 2028", "BIA-06": "Jun 2028", "BIA-07": "Feb 2027", "BIA-09": "Aug 2027", "BIA-11": "Jul 2028", "BIA-13": "Apr 2027", "BIA-14": "Jul 2028", "BIA-15": "May 2027", "BIA-16": "Dec 2026" };
const ROAD: Record<string, string> = { "BIA-01": "Apr 2027", "BIA-02": "May 2027", "BIA-03": "Feb 2027", "BIA-04": "Mar 2027", "BIA-05": "Jul 2027", "BIA-06": "Jul 2027", "BIA-07": "Jan 2027", "BIA-08": "Nov 2026", "BIA-09": "Dec 2026", "BIA-11": "Aug 2027", "BIA-13": "Jan 2027", "BIA-14": "Jun 2027", "BIA-15": "Feb 2027", "BIA-16": "Apr 2027" };
export function vehicleRows(bia12Booked: boolean): VRow[] {
  return VEHICLES.map((v) => {
    const road: Check = v.id === "BIA-12" ? (bia12Booked ? { s: "Booked Thu 08:00", tone: "info", d: "Due 2 Oct" } : { s: "Due in 3 days", tone: "bad", d: "Due 2 Oct" })
      : v.id === "BIA-10" ? { s: "In workshop", tone: "warn", d: "Due 3 Oct, during service" } : ok(ROAD[v.id]);
    const tacho: Check = v.id === "BIA-08" ? { s: "Due 6 Nov", tone: "info", d: "38 days" } : v.type === "Support Vehicle" ? NA : ok(TACHO[v.id]);
    const loler: Check = v.id === "BIA-07" ? { s: "Re-exam after repair", tone: "bad", d: "Tail-lift ram fault 12:34" }
      : v.type === "Tanker" || v.id === "BIA-10" ? NA
      : v.type === "MacPac Bin Truck" && ["BIA-01", "BIA-02", "BIA-03", "BIA-04", "BIA-05", "BIA-06"].includes(v.id) ? { s: "Due 23 Nov", tone: "info", d: "Bin lift, 6-monthly" }
      : ok(v.type === "Artic Curtainsider" ? "Jan 2027" : "Feb 2027");
    const disc = ok("Displayed");
    const ins = ok("Fleet policy to 31 Jan 2027");
    const checks = [road, tacho, loler, disc, ins];
    const score = checks.filter((c) => c.tone === "ok" || c.tone === "neutral" || c.tone === "info").length;
    return { id: v.id, reg: v.reg, type: v.type, status: v.status, road, tacho, loler, disc, ins, score };
  });
}

/* ---------- Waste documentation ---------- */
export const EWC = [
  { code: "16 03 06", label: "Organic wastes, off-spec and packaged food", pct: 38 },
  { code: "02 05 01", label: "Dairy materials unsuitable for consumption", pct: 17 },
  { code: "20 01 08", label: "Biodegradable kitchen and canteen waste", pct: 16 },
  { code: "02 03 04", label: "Food processing materials unsuitable for consumption", pct: 13 },
  { code: "02 06 01", label: "Bakery and confectionery materials", pct: 9 },
  { code: "20 03 02", label: "Waste from markets", pct: 7 },
];
export const EWC_BY_INTAKE: Record<string, string> = {
  "INT-1049": "16 03 06", "INT-1048": "16 03 06", "INT-1047": "20 01 08", "INT-1046": "16 03 06", "INT-1045": "20 01 08", "INT-1044": "16 03 06",
  "INT-1043": "16 03 06", "INT-1042": "02 03 04", "INT-1041": "16 03 06", "INT-1040": "02 05 01", "INT-1039": "02 03 04",
};
export const PERMIT = { ytd: 72960, limit: 100000, yearElapsed: 74.5, projected: 97900 };
export const PERMIT_MONTHS: [string, number][] = [["Jan", 7780], ["Feb", 7410], ["Mar", 8190], ["Apr", 8120], ["May", 8340], ["Jun", 8210], ["Jul", 8460], ["Aug", 8390], ["Sep", 8060]];
export const REJECTED = [
  { id: "INT-1041", date: "Today 10:52", haulier: "Third-party haulier, 11-MN-804", net: 3.7, reason: "Glass and metal packaging above acceptance limit", ref: "NCR-26-231", status: "Returned to sender" },
  { id: "INT-0987", date: "Fri 18 Sep", haulier: "Third-party haulier, 06-KK-1182", net: 6.2, reason: "Load description did not match docket (non-food plastics)", ref: "NCR-26-219", status: "Closed" },
  { id: "INT-0931", date: "Wed 9 Sep", haulier: "Third-party haulier, 10-LS-3371", net: 2.9, reason: "Temperature and odour outside acceptance criteria", ref: "NCR-26-204", status: "Closed" },
];

/* ---------- Document library ---------- */
export type Doc = { id: string; title: string; cat: string; ref: string; owner: string; issued: string; expiry: string; status: string; tone: Tone; version: string; linked: string[]; summary: string };
export const DOCS: Doc[] = [
  { id: "D01", title: "Waste collection permit", cat: "Waste permits", ref: "WCP-2024-4471", owner: "Larissa Franca", issued: "15 Mar 2024", expiry: "14 Mar 2029", status: "Valid", tone: "ok", version: "v1", linked: ["All collection vehicles", "EWC schedule"], summary: "Permit to collect listed non-hazardous food and organic wastes across the permitted local authority areas. Schedule lists 14 EWC codes and 16 authorised vehicles." },
  { id: "D02", title: "Facility waste licence, Huntstown AD", cat: "Waste permits", ref: "FWL-0219-03", owner: "Larissa Franca", issued: "2 Jun 2021", expiry: "Reviewed annually", status: "Valid", tone: "ok", version: "Rev 3", linked: ["Weighbridge", "Plant / SCADA data"], summary: "Authorises acceptance and anaerobic digestion of up to 100,000 t per year of non-hazardous biodegradable waste at Huntstown, with conditions on intake records, odour and emissions monitoring." },
  { id: "D03", title: "Annual environmental report 2025", cat: "Waste permits", ref: "AER-2025", owner: "Larissa Franca", issued: "27 Mar 2026", expiry: "Next due Mar 2027", status: "Submitted", tone: "ok", version: "Final", linked: ["Weighbridge", "Plant / SCADA data"], summary: "Annual tonnage, emissions and monitoring summary for 2025. Submitted on time." },
  { id: "D04", title: "BIA-12 roadworthiness certificate", cat: "Vehicle inspections", ref: "CVRT-221D6045-25", owner: "Fleet workshop", issued: "2 Oct 2025", expiry: "2 Oct 2026", status: "Due in 3 days", tone: "bad", version: "2025", linked: ["BIA-12", "Calendar"], summary: "Annual commercial vehicle roadworthiness test for BIA-12 (221-D-6045). Vehicle must not operate after expiry without a new pass." },
  { id: "D05", title: "BIA-07 LOLER thorough examination, tail-lift", cat: "Vehicle inspections", ref: "LOLER-07-2607", owner: "Fleet workshop", issued: "14 Jul 2026", expiry: "Re-exam after repair", status: "Action required", tone: "bad", version: "2026", linked: ["BIA-07", "WS-2291"], summary: "Thorough examination of the tail-lift. Following the hydraulic ram fault at 12:34 today, a re-examination is required before the lift returns to use." },
  { id: "D06", title: "Tachograph calibration register", cat: "Vehicle inspections", ref: "TCR-2026", owner: "Fleet workshop", issued: "1 Jan 2026", expiry: "Rolling", status: "1 due in 38 days", tone: "info", version: "Live", linked: ["13 vehicles"], summary: "Two-yearly calibration record for all tachograph-fitted vehicles. BIA-08 due 6 Nov." },
  { id: "D07", title: "Driver CPC, Paul Doyle", cat: "Driver documentation", ref: "CPC-PD-2021", owner: "People", issued: "18 Oct 2021", expiry: "18 Oct 2026", status: "Due in 19 days", tone: "warn", version: "Card", linked: ["BIA-15", "Timesheets / HR"], summary: "Driver Certificate of Professional Competence. Remaining periodic training modules to complete before renewal." },
  { id: "D08", title: "Driver licence checks, Q3", cat: "Driver documentation", ref: "DLC-2026-Q3", owner: "People", issued: "4 Sep 2026", expiry: "Q4 check due Dec", status: "Complete", tone: "ok", version: "Q3", linked: ["22 drivers"], summary: "Quarterly licence and endorsement check for all drivers. No issues found." },
  { id: "D09", title: "Weighbridge calibration certificate, WB1", cat: "Weighbridge calibration", ref: "WBC-WB1-2025", owner: "Plant", issued: "9 Nov 2025", expiry: "9 Nov 2026", status: "Due in 41 days", tone: "info", version: "2025", linked: ["Weighbridge", "INT tickets"], summary: "Annual calibration of weighbridge 1 by an accredited contractor. Book before 9 Nov to avoid a gap." },
  { id: "D10", title: "Weighbridge daily verification log, September", cat: "Weighbridge calibration", ref: "WBV-2026-09", owner: "Plant", issued: "1 Sep 2026", expiry: "Monthly", status: "Current", tone: "ok", version: "Live", linked: ["Weighbridge"], summary: "Daily zero and test-weight checks. All within tolerance this month." },
  { id: "D11", title: "ISO 9001 certificate", cat: "ISO", ref: "ISO9001-BIA-2025", owner: "Larissa Franca", issued: "20 Mar 2025", expiry: "19 Mar 2028", status: "Valid", tone: "ok", version: "2025", linked: ["IMS manual"], summary: "Quality management system certification covering collection, reception and anaerobic digestion of food waste." },
  { id: "D12", title: "ISO 14001 certificate", cat: "ISO", ref: "ISO14001-BIA-2025", owner: "Larissa Franca", issued: "20 Mar 2025", expiry: "19 Mar 2028", status: "Valid", tone: "ok", version: "2025", linked: ["IMS manual", "Environmental aspects register"], summary: "Environmental management system certification." },
  { id: "D13", title: "ISO 45001 certificate", cat: "ISO", ref: "ISO45001-BIA-2024", owner: "Ricarte Nazerenco", issued: "11 Mar 2024", expiry: "10 Mar 2027", status: "Valid", tone: "ok", version: "2024", linked: ["Safety statement"], summary: "Occupational health and safety management system certification. Recertification audit scheduled March 2027." },
  { id: "D14", title: "Integrated management system manual", cat: "ISO", ref: "IMS-001", owner: "Larissa Franca", issued: "12 Jan 2026", expiry: "Review Jan 2027", status: "Current", tone: "ok", version: "v7", linked: ["All SOPs"], summary: "Combined manual for ISO 9001, 14001 and 45001." },
  { id: "D15", title: "Safety statement 2026", cat: "Health & Safety", ref: "HS-SS-2026", owner: "Ricarte Nazerenco", issued: "8 Jan 2026", expiry: "Review Jan 2027", status: "Current", tone: "ok", version: "2026", linked: ["Risk assessments"], summary: "Site safety statement covering yard, reception hall, depackaging, digesters and gas upgrading." },
  { id: "D16", title: "ATEX risk assessment, gas areas", cat: "Health & Safety", ref: "HS-ATEX-04", owner: "Ricarte Nazerenco", issued: "3 Feb 2026", expiry: "Review Feb 2027", status: "Current", tone: "ok", version: "Rev 4", linked: ["Gas upgrading unit", "Digesters 1-3"], summary: "Hazardous area classification and controls for biogas and biomethane areas." },
  { id: "D17", title: "Emergency response plan", cat: "Health & Safety", ref: "HS-ERP-02", owner: "Ricarte Nazerenco", issued: "10 Apr 2026", expiry: "Drill due Nov", status: "Current", tone: "ok", version: "Rev 2", linked: ["Site map", "Muster points"], summary: "Fire, gas release and spill response. Last drill 14 May, all staff accounted for in 6 minutes." },
  { id: "D18", title: "SOP-WB-01 Weighbridge acceptance and rejection", cat: "SOPs", ref: "SOP-WB-01", owner: "Plant", issued: "2 Mar 2026", expiry: "Review Mar 2027", status: "Current", tone: "ok", version: "v5", linked: ["Weighbridge", "INT-1041"], summary: "Acceptance criteria, variance thresholds and rejection procedure for inbound loads." },
  { id: "D19", title: "SOP-DP-03 Depackaging line changeover", cat: "SOPs", ref: "SOP-DP-03", owner: "Plant", issued: "14 Aug 2026", expiry: "Revision pending", status: "Revision pending", tone: "warn", version: "v3 draft", linked: ["Depackaging line 1", "NC-26-017"], summary: "Changeover and cleaning steps between packaged product types. Revision v4 not yet issued to night shift." },
  { id: "D20", title: "SOP-TK-02 Tanker discharge to buffer tank", cat: "SOPs", ref: "SOP-TK-02", owner: "Plant", issued: "20 May 2026", expiry: "Review May 2027", status: "Current", tone: "ok", version: "v4", linked: ["BIA-15", "BIA-16"], summary: "Coupling, sampling and discharge for liquid food waste deliveries." },
  { id: "D21", title: "SOP-FL-05 Reversing at collection points", cat: "SOPs", ref: "SOP-FL-05", owner: "Fleet workshop", issued: "9 Jun 2026", expiry: "Review Jun 2027", status: "Current", tone: "ok", version: "v2", linked: ["All drivers"], summary: "Banksman, camera and site-rule requirements when reversing at customer sites." },
  { id: "D22", title: "Waste transfer docket WTD-58812", cat: "Waste transfer documentation", ref: "WTD-58812", owner: "Weighbridge", issued: "29 Sep 2026", expiry: "Retain 5 years", status: "Complete", tone: "ok", version: "Signed", linked: ["INT-1048", "BULK-201", "FreshFields Foods"], summary: "FreshFields Foods, Naas. Packaged food on pallets, EWC 16 03 06. Customer reference, driver sign-off and weighbridge ticket attached." },
  { id: "D23", title: "Waste transfer docket WTD-58813", cat: "Waste transfer documentation", ref: "WTD-58813", owner: "Weighbridge", issued: "29 Sep 2026", expiry: "Retain 5 years", status: "Missing signature", tone: "bad", version: "Unsigned", linked: ["INT-1049", "08-D-55120"], summary: "Third-party load, packaged food on pallets. Signed docket not yet received from the haulier." },
  { id: "D24", title: "Waste transfer docket WTD-58805", cat: "Waste transfer documentation", ref: "WTD-58805", owner: "Weighbridge", issued: "29 Sep 2026", expiry: "Retain 5 years", status: "Rejected load", tone: "warn", version: "Signed", linked: ["INT-1041", "NCR-26-231"], summary: "Third-party load rejected for contamination. Rejection note and photos attached." },
];

/* ---------- Audits ---------- */
export const ISO_AUDITS = [
  { std: "ISO 9001", scope: "Quality", last: "Mar 2026 surveillance", result: "0 major, 1 minor", next: "Tue 17 Nov", type: "External surveillance", days: 49 },
  { std: "ISO 14001", scope: "Environmental", last: "Mar 2026 surveillance", result: "0 major, 1 minor", next: "Tue 17 Nov", type: "External surveillance", days: 49 },
  { std: "ISO 45001", scope: "Health and safety", last: "Mar 2026 surveillance", result: "0 major, 0 minor, 1 observation", next: "Mar 2027", type: "Recertification", days: 160 },
  { std: "IMS internal audit", scope: "All three standards", last: "Aug 2026", result: "2 minor, 3 observations", next: "Mon 26 Oct", type: "Internal", days: 27 },
];
export const NCS = [
  { id: "NC-26-014", std: "ISO 14001", grade: "Minor", title: "Spill kit inspection records incomplete, reception hall", owner: "Ricarte Nazerenco", due: "15 Oct", status: "In progress" },
  { id: "NC-26-017", std: "ISO 9001", grade: "Minor", title: "SOP-DP-03 revision not issued to night shift", owner: "Larissa Franca", due: "9 Oct", status: "In progress" },
  { id: "NC-26-019", std: "ISO 45001", grade: "Observation", title: "Pedestrian walkway marking faded at weighbridge exit", owner: "Ricarte Nazerenco", due: "30 Oct", status: "Scheduled" },
];
export const INSPECTIONS = [
  { area: "Reception hall", last: "22 Sep", score: 96, findings: "1 spill kit record gap" },
  { area: "Depackaging lines", last: "18 Sep", score: 94, findings: "Guard interlock test log late" },
  { area: "Digesters and gas upgrading", last: "15 Sep", score: 99, findings: "None" },
  { area: "Weighbridge and yard", last: "24 Sep", score: 95, findings: "Walkway marking faded" },
  { area: "Workshop", last: "10 Sep", score: 97, findings: "None" },
  { area: "Digestate storage", last: "8 Sep", score: 98, findings: "None" },
];
export const TOOLBOX = [
  { date: "Mon 28 Sep", topic: "Reversing and banksman at customer sites", group: "Drivers", attended: 21, of: 22 },
  { date: "Thu 24 Sep", topic: "Contaminated loads: what to reject at the weighbridge", group: "Plant", attended: 14, of: 15 },
  { date: "Mon 21 Sep", topic: "Tail-lift pre-use checks", group: "Drivers", attended: 20, of: 22 },
  { date: "Wed 16 Sep", topic: "Gas detection alarms and evacuation", group: "Plant", attended: 15, of: 15 },
];

/* ---------- Expiries, next 90 days ---------- */
export type Expiry = { id: string; item: string; cat: string; days: number; action: string; system: string; write: string };
const base: Expiry[] = [
  { id: "bia12", item: EXPIRIES[0].item, cat: "Fleet", days: EXPIRIES[0].days, action: "Book", system: "Calendar", write: "BIA-12 roadworthiness test booked Thu 08:00, Huntstown workshop." },
  { id: "bia10", item: "BIA-10 roadworthiness test", cat: "Fleet", days: 4, action: "Confirm", system: "Calendar", write: "BIA-10 test confirmed for Fri 2 Oct, during scheduled service." },
  { id: "gas", item: "Gas detector calibration, digester hall", cat: "Plant", days: 12, action: "Book", system: "Calendar", write: "Gas detector calibration booked Thu 8 Oct, digester hall." },
  { id: "cpc", item: EXPIRIES[1].item, cat: "People", days: EXPIRIES[1].days, action: "Request", system: "Email", write: "CPC training dates sent to Paul Doyle. Rostered off Tue 13 Oct." },
  { id: "firstaid", item: "First aid certificate, Aoife Brennan", cat: "People", days: 24, action: "Book", system: "Calendar", write: "First aid refresher booked Wed 14 Oct for Aoife Brennan." },
  { id: "supplier", item: EXPIRIES[2].item, cat: "Procurement", days: EXPIRIES[2].days, action: "Request", system: "Email", write: "Renewed insurance certificate requested from Midland Hydraulics." },
  { id: "fire", item: "Fire extinguisher annual service", cat: "Plant", days: 33, action: "Book", system: "Calendar", write: "Fire extinguisher service booked Mon 26 Oct." },
  { id: "tacho08", item: "Tachograph calibration, BIA-08", cat: "Fleet", days: 38, action: "Book", system: "Calendar", write: "BIA-08 tachograph calibration booked Mon 2 Nov." },
  { id: "wb", item: EXPIRIES[3].item, cat: "Plant", days: EXPIRIES[3].days, action: "Book", system: "Calendar", write: "Calibration contractor booked Tue 3 Nov, before the 9 Nov deadline." },
  { id: "forklift", item: "Forklift certificate, Niall Gorman", cat: "People", days: 47, action: "Book", system: "Calendar", write: "Forklift refresher booked Thu 5 Nov for Niall Gorman." },
  { id: "iso", item: "ISO 9001 and 14001 surveillance audit", cat: "Compliance", days: 49, action: "Prepare", system: "Documents", write: "Audit evidence pack started for 17 Nov, 42 records linked." },
  { id: "loler", item: "LOLER examination, bin lifts BIA-01 to BIA-06", cat: "Fleet", days: 55, action: "Book", system: "Calendar", write: "LOLER examinations booked across 23 and 24 Nov, two vehicles per half day." },
  { id: "tachocard", item: "Driver tachograph card, Aidan Byrne", cat: "People", days: 62, action: "Request", system: "Email", write: "Card renewal reminder sent to Aidan Byrne." },
  { id: "el", item: "Employer's liability insurance renewal", cat: "Finance", days: 64, action: "Renew", system: "Email", write: "Renewal quote requested from the broker." },
  { id: "pressure", item: "Pressure systems examination, gas upgrading unit", cat: "Plant", days: 70, action: "Book", system: "Calendar", write: "Pressure systems examination booked Mon 7 Dec." },
];
const periodic: Expiry[] = VEHICLES.filter((v) => v.id !== "BIA-12" && v.id !== "BIA-10")
  .map((v) => ({ id: "pi-" + v.id, item: "Periodic safety inspection, " + v.id, cat: "Fleet", days: daysUntil(v.nextInspection), action: "Book", system: "Calendar", write: v.id + " periodic inspection booked for " + v.nextInspection + ", Huntstown workshop." }))
  .filter((e) => e.days <= 90);
export const EXPIRY_LIST: Expiry[] = [...base, ...periodic].sort((a, z) => a.days - z.days);
