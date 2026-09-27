/* Canonical Bia Energy demo facts. Every screen reads from here so the
   operational story stays identical across Home, modules, Work and Records.
   All figures are demo mock values, not audited Bia Energy data. */

export const TODAY = {
  date: "Tuesday 29 September",
  collections: 34, complete: 19, active: 11, atRisk: 4,
  collectedT: 146.8, intakeT: 153.4, intakePlanT: 160, acceptedT: 149.7, processedT: 143.1,
  fleet: 16, fleetAvailable: 14, fleetActive: 11, fleetMaintenance: 1, fleetFault: 1,
  productivity: 91, onTime: 94, plantThroughput: 94, utilisation: 87,
  stopsRemaining: 58, overtimePending: 6.5,
  biomethaneMWh: 172.4, biomethaneRate: "1,340 Nm³/h", digestateT: 118.6,
  queueT: 6.6, processingRate: "11.9 t/h", downtimeMin: 22,
};

export const WEEK = {
  collections: 186, collectedT: 1946, processedT: 1872, plantAvailability: 96.8, sla: 95.1,
  biomethaneMWh: 2214, digestateT: 1642, fleetUtilisation: 87, openIssues: 9,
};

export const HEALTH = [
  { label: "Logistics", score: 92 }, { label: "Plant", score: 94 }, { label: "Fleet", score: 87 },
  { label: "People", score: 91 }, { label: "Compliance", score: 98 },
];

export type Tone = "ok" | "warn" | "bad" | "accent" | "neutral" | "info";

/* ---------- Fleet: 16 vehicles. 11 active, 3 standby, 1 maintenance, 1 fault ---------- */
export type Vehicle = {
  id: string; reg: string; type: "MacPac Bin Truck" | "Artic Curtainsider" | "Tanker" | "Support Vehicle";
  status: "Active" | "Standby" | "Maintenance" | "Fault"; driver: string; route: string; next: string;
  location: string; x: number; y: number; fuel: number; mileage: number; utilisation: number;
  lastInspection: string; nextInspection: string; costYtd: number; note?: string;
};
export const VEHICLES: Vehicle[] = [
  { id: "BIA-01", reg: "231-D-4418", type: "MacPac Bin Truck", status: "Active", driver: "Sean Kelly", route: "COL-1860 Finglas", next: "Return Huntstown 14:40", location: "Finglas", x: 49, y: 44, fuel: 62, mileage: 84210, utilisation: 91, lastInspection: "14 Aug", nextInspection: "14 Nov", costYtd: 18420 },
  { id: "BIA-02", reg: "231-D-4419", type: "MacPac Bin Truck", status: "Active", driver: "Ciarán Walsh", route: "Swords loop B", next: "COL-1857 Malahide", location: "Swords", x: 60, y: 30, fuel: 48, mileage: 79880, utilisation: 88, lastInspection: "21 Aug", nextInspection: "21 Nov", costYtd: 17110 },
  { id: "BIA-03", reg: "222-D-9031", type: "MacPac Bin Truck", status: "Active", driver: "Stephen Murphy", route: "COL-1842 Blanchardstown", next: "Return Huntstown 13:20", location: "Blanchardstown", x: 40, y: 45, fuel: 55, mileage: 112640, utilisation: 93, lastInspection: "2 Sep", nextInspection: "2 Dec", costYtd: 21980 },
  { id: "BIA-04", reg: "222-D-9032", type: "MacPac Bin Truck", status: "Active", driver: "Darragh Quinn", route: "City centre loop", next: "COL-1854 Smithfield", location: "Dublin 7", x: 53, y: 55, fuel: 41, mileage: 108300, utilisation: 90, lastInspection: "9 Sep", nextInspection: "9 Dec", costYtd: 20460 },
  { id: "BIA-05", reg: "241-D-1207", type: "MacPac Bin Truck", status: "Active", driver: "Jakub Zielinski", route: "Tallaght loop", next: "COL-1858 Tallaght", location: "Tallaght", x: 44, y: 70, fuel: 70, mileage: 41120, utilisation: 86, lastInspection: "28 Aug", nextInspection: "28 Nov", costYtd: 9870 },
  { id: "BIA-06", reg: "241-D-1208", type: "MacPac Bin Truck", status: "Active", driver: "Eoin Farrell", route: "Dún Laoghaire loop", next: "COL-1861 Sandyford", location: "Sandyford", x: 60, y: 72, fuel: 58, mileage: 39650, utilisation: 84, lastInspection: "4 Sep", nextInspection: "4 Dec", costYtd: 9210 },
  { id: "BIA-07", reg: "201-KE-3390", type: "Artic Curtainsider", status: "Fault", driver: "Marek Kowalski", route: "BULK-204 Naas", next: "Off road, workshop", location: "Johnstown, N7", x: 30, y: 76, fuel: 37, mileage: 318450, utilisation: 79, lastInspection: "19 Jun", nextInspection: "19 Dec", costYtd: 41260, note: "Hydraulic pressure warning on tail-lift ram, 12:34. Removed from service." },
  { id: "BIA-08", reg: "211-KE-5521", type: "Artic Curtainsider", status: "Active", driver: "Tomasz Wiśniewski", route: "BULK-209 Carlow", next: "Return Huntstown 16:10", location: "Castledermot, M9", x: 22, y: 92, fuel: 51, mileage: 244900, utilisation: 89, lastInspection: "30 Jul", nextInspection: "30 Oct", costYtd: 33140 },
  { id: "BIA-09", reg: "211-KE-5522", type: "Artic Curtainsider", status: "Standby", driver: "Unassigned", route: "Yard, Huntstown", next: "BULK-211 tomorrow 06:00", location: "Huntstown yard", x: 45, y: 38, fuel: 88, mileage: 231070, utilisation: 74, lastInspection: "12 Aug", nextInspection: "12 Nov", costYtd: 28650 },
  { id: "BIA-10", reg: "191-D-7702", type: "Support Vehicle", status: "Maintenance", driver: "Workshop", route: "Scheduled service", next: "Back in service Thu", location: "Workshop, Huntstown", x: 45, y: 38, fuel: 30, mileage: 152300, utilisation: 61, lastInspection: "3 Jul", nextInspection: "3 Oct", costYtd: 11380 },
  { id: "BIA-11", reg: "232-D-2260", type: "MacPac Bin Truck", status: "Active", driver: "Aidan Byrne", route: "COL-1851 Swords", next: "Depart 14:05", location: "Huntstown yard", x: 45, y: 38, fuel: 92, mileage: 22480, utilisation: 82, lastInspection: "10 Sep", nextInspection: "10 Dec", costYtd: 6120 },
  { id: "BIA-12", reg: "221-D-6045", type: "Support Vehicle", status: "Standby", driver: "Ronan Hayes", route: "Bin swaps, Dublin 15", next: "Inspection due in 3 days", location: "Huntstown yard", x: 45, y: 38, fuel: 66, mileage: 98760, utilisation: 72, lastInspection: "2 Oct 2025", nextInspection: "2 Oct", costYtd: 12940, note: "Annual roadworthiness test due in 3 days. Off road if missed." },
  { id: "BIA-13", reg: "212-MH-4471", type: "MacPac Bin Truck", status: "Active", driver: "Lukas Petrauskas", route: "Navan loop", next: "COL-1863 Navan", location: "Dunshaughlin, N3", x: 34, y: 26, fuel: 45, mileage: 133900, utilisation: 87, lastInspection: "18 Aug", nextInspection: "18 Nov", costYtd: 19730 },
  { id: "BIA-14", reg: "231-KE-8814", type: "Artic Curtainsider", status: "Standby", driver: "Marek Kowalski", route: "Tipped INT-1048 at 12:46", next: "Proposed: BULK-204 Naas", location: "Huntstown weighbridge", x: 45, y: 38, fuel: 74, mileage: 96340, utilisation: 85, lastInspection: "5 Sep", nextInspection: "5 Dec", costYtd: 16820 },
  { id: "BIA-15", reg: "202-D-5518", type: "Tanker", status: "Active", driver: "Paul Doyle", route: "TNK-041 Ballymount", next: "Return Huntstown 15:50", location: "Ballymount", x: 42, y: 62, fuel: 57, mileage: 276110, utilisation: 90, lastInspection: "26 Aug", nextInspection: "26 Nov", costYtd: 38470 },
  { id: "BIA-16", reg: "212-D-9904", type: "Tanker", status: "Active", driver: "Gary Nolan", route: "TNK-043 Drogheda", next: "Return Huntstown 15:20", location: "Balbriggan, M1", x: 62, y: 12, fuel: 49, mileage: 201480, utilisation: 88, lastInspection: "11 Sep", nextInspection: "11 Dec", costYtd: 31290 },
];
export const HUNTSTOWN = { x: 45, y: 38 };

/* ---------- Collections: 34 today = 19 complete + 11 active + 4 at risk ---------- */
export type JobStatus = "Complete" | "Scheduled" | "En route" | "On site" | "Loading" | "Returning" | "At risk";
export type Job = {
  id: string; customer: string; site: string; type: "Wheelie Bin" | "Bulk Pallet" | "Dolav" | "Curtainsider" | "Tanker" | "Customer Delivery";
  vehicle: string; driver: string; eta: string; expected: number; actual?: number; status: JobStatus; note?: string;
};
export const JOBS: Job[] = [
  // at risk (4)
  { id: "BULK-204", customer: "FreshFields Foods", site: "Naas", type: "Bulk Pallet", vehicle: "BIA-07", driver: "M. Kowalski", eta: "14:10", expected: 18.6, status: "At risk", note: "BIA-07 hydraulic fault. ETA slipping 42 min. Reassign to BIA-14 recovers to +27 min." },
  { id: "COL-1858", customer: "GreenMart", site: "Tallaght", type: "Wheelie Bin", vehicle: "BIA-05", driver: "J. Zielinski", eta: "14:45", expected: 2.2, status: "At risk", note: "Sequence clash. Move behind COL-1861." },
  { id: "COL-1846", customer: "Liffey Hospitality Group", site: "Temple Bar", type: "Wheelie Bin", vehicle: "BIA-04", driver: "D. Quinn", eta: "15:30", expected: 1.4, status: "At risk", note: "Driver break window. Delay break 18 min within permitted limits." },
  { id: "TNK-044", customer: "Boyne Valley Dairies", site: "Drogheda", type: "Tanker", vehicle: "Unassigned", driver: "Unassigned", eta: "16:30", expected: 19.8, status: "At risk", note: "No compatible tanker free. Manual review." },
  // active (11): 3 scheduled, 3 en route, 1 on site, 2 loading, 2 returning
  { id: "COL-1842", customer: "GreenMart", site: "Blanchardstown", type: "Wheelie Bin", vehicle: "BIA-03", driver: "S. Murphy", eta: "13:20", expected: 2.4, status: "En route" },
  { id: "COL-1851", customer: "CityFresh", site: "Swords", type: "Wheelie Bin", vehicle: "BIA-11", driver: "A. Byrne", eta: "14:35", expected: 3.1, status: "Scheduled" },
  { id: "TNK-041", customer: "Dublin Foods", site: "Ballymount", type: "Tanker", vehicle: "BIA-15", driver: "P. Doyle", eta: "15:05", expected: 21.5, status: "Loading" },
  { id: "COL-1854", customer: "Northside Distribution", site: "Smithfield", type: "Dolav", vehicle: "BIA-04", driver: "D. Quinn", eta: "13:55", expected: 3.6, status: "On site" },
  { id: "COL-1857", customer: "CityFresh", site: "Malahide", type: "Wheelie Bin", vehicle: "BIA-02", driver: "C. Walsh", eta: "14:20", expected: 1.9, status: "En route" },
  { id: "COL-1860", customer: "Northside Distribution", site: "Finglas", type: "Dolav", vehicle: "BIA-01", driver: "S. Kelly", eta: "14:40", expected: 4.2, status: "Returning" },
  { id: "COL-1861", customer: "GreenMart", site: "Sandyford", type: "Wheelie Bin", vehicle: "BIA-06", driver: "E. Farrell", eta: "14:25", expected: 2.0, status: "En route" },
  { id: "COL-1863", customer: "Meath Fresh Produce", site: "Navan", type: "Bulk Pallet", vehicle: "BIA-13", driver: "L. Petrauskas", eta: "15:15", expected: 5.8, status: "Loading" },
  { id: "BULK-209", customer: "Leinster Bakeries", site: "Carlow", type: "Curtainsider", vehicle: "BIA-08", driver: "T. Wiśniewski", eta: "16:10", expected: 16.4, status: "Returning" },
  { id: "TNK-043", customer: "Boyne Valley Dairies", site: "Drogheda", type: "Tanker", vehicle: "BIA-16", driver: "G. Nolan", eta: "15:20", expected: 20.1, status: "Scheduled" },
  { id: "DEL-311", customer: "Kildare Tillage Partners", site: "Kilcock", type: "Customer Delivery", vehicle: "Haulier", driver: "Contract haulier", eta: "16:00", expected: 22.0, status: "Scheduled", note: "Digestate delivery out." },
  // complete (19) sum actual = 146.8 t
  { id: "BULK-201", customer: "FreshFields Foods", site: "Naas", type: "Bulk Pallet", vehicle: "BIA-14", driver: "M. Kowalski", eta: "12:46", expected: 17.57, actual: 19.27, status: "Complete", note: "Weighed as INT-1048. +1.70 t variance under review." },
  { id: "TNK-039", customer: "Dublin Foods", site: "Ballymount", type: "Tanker", vehicle: "BIA-15", driver: "P. Doyle", eta: "09:40", expected: 21.0, actual: 21.3, status: "Complete" },
  { id: "BULK-202", customer: "Leinster Bakeries", site: "Carlow", type: "Curtainsider", vehicle: "BIA-08", driver: "T. Wiśniewski", eta: "09:05", expected: 21.0, actual: 21.43, status: "Complete" },
  { id: "TNK-040", customer: "Boyne Valley Dairies", site: "Drogheda", type: "Tanker", vehicle: "BIA-16", driver: "G. Nolan", eta: "10:15", expected: 19.5, actual: 19.9, status: "Complete" },
  { id: "COL-1838", customer: "GreenMart", site: "Clonsilla", type: "Wheelie Bin", vehicle: "BIA-01", driver: "S. Kelly", eta: "12:41", expected: 2.6, actual: 2.7, status: "Complete" },
  { id: "COL-1833", customer: "CityFresh", site: "Swords", type: "Wheelie Bin", vehicle: "BIA-02", driver: "C. Walsh", eta: "08:20", expected: 3.0, actual: 2.9, status: "Complete" },
  { id: "COL-1834", customer: "Liffey Hospitality Group", site: "Docklands", type: "Wheelie Bin", vehicle: "BIA-04", driver: "D. Quinn", eta: "08:45", expected: 1.8, actual: 1.9, status: "Complete" },
  { id: "COL-1835", customer: "Northside Distribution", site: "Finglas", type: "Dolav", vehicle: "BIA-01", driver: "S. Kelly", eta: "09:10", expected: 4.4, actual: 4.6, status: "Complete" },
  { id: "COL-1836", customer: "GreenMart", site: "Blanchardstown", type: "Wheelie Bin", vehicle: "BIA-03", driver: "S. Murphy", eta: "09:30", expected: 2.5, actual: 2.4, status: "Complete" },
  { id: "COL-1837", customer: "Riverbank Healthcare Campus", site: "Beaumont", type: "Wheelie Bin", vehicle: "BIA-02", driver: "C. Walsh", eta: "10:05", expected: 1.6, actual: 1.5, status: "Complete" },
  { id: "COL-1839", customer: "Hibernia College Catering", site: "Belfield", type: "Wheelie Bin", vehicle: "BIA-06", driver: "E. Farrell", eta: "10:25", expected: 1.9, actual: 2.0, status: "Complete" },
  { id: "COL-1840", customer: "GreenMart", site: "Tallaght", type: "Wheelie Bin", vehicle: "BIA-05", driver: "J. Zielinski", eta: "10:50", expected: 2.3, actual: 2.2, status: "Complete" },
  { id: "COL-1841", customer: "Meath Fresh Produce", site: "Navan", type: "Bulk Pallet", vehicle: "BIA-13", driver: "L. Petrauskas", eta: "11:05", expected: 6.1, actual: 6.3, status: "Complete" },
  { id: "COL-1843", customer: "CityFresh", site: "Santry", type: "Wheelie Bin", vehicle: "BIA-11", driver: "A. Byrne", eta: "11:20", expected: 2.8, actual: 2.8, status: "Complete" },
  { id: "COL-1844", customer: "Liffey Hospitality Group", site: "Ballsbridge", type: "Wheelie Bin", vehicle: "BIA-06", driver: "E. Farrell", eta: "11:40", expected: 1.7, actual: 1.6, status: "Complete" },
  { id: "COL-1845", customer: "Northside Distribution", site: "Coolock", type: "Dolav", vehicle: "BIA-04", driver: "D. Quinn", eta: "11:55", expected: 3.9, actual: 4.0, status: "Complete" },
  { id: "COL-1847", customer: "GreenMart", site: "Lucan", type: "Wheelie Bin", vehicle: "BIA-03", driver: "S. Murphy", eta: "12:10", expected: 2.4, actual: 2.5, status: "Complete" },
  { id: "COL-1848", customer: "Riverbank Healthcare Campus", site: "Beaumont", type: "Wheelie Bin", vehicle: "BIA-11", driver: "A. Byrne", eta: "12:20", expected: 1.5, actual: 1.4, status: "Complete" },
  { id: "COL-1849", customer: "CityFresh", site: "Swords", type: "Dolav", vehicle: "BIA-02", driver: "C. Walsh", eta: "12:30", expected: 26.0, actual: 26.1, status: "Complete", note: "Consolidated depot clear-out, multiple Dolavs." },
];

export const COLLECTION_TYPES = [
  { type: "Wheelie Bin", count: 18, tonnes: 29.6 }, { type: "Bulk Pallet", count: 4, tonnes: 47.9 },
  { type: "Dolav", count: 5, tonnes: 42.4 }, { type: "Curtainsider", count: 2, tonnes: 31.8 },
  { type: "Tanker", count: 4, tonnes: 82.6 }, { type: "Customer Delivery", count: 1, tonnes: 22.0 },
];

/* ---------- Plant intake / weighbridge ---------- */
export type Intake = { id: string; arrival: string; customer: string; vehicle: string; material: string; gross: number; tare: number; net: number; expected: number; status: "Accepted" | "Review" | "Rejected" | "In queue"; destination: string; docket: string };
export const INTAKE: Intake[] = [
  { id: "INT-1048", arrival: "12:46", customer: "FreshFields Foods", vehicle: "BIA-14", material: "Packaged food, pallets", gross: 37.42, tare: 18.15, net: 19.27, expected: 17.57, status: "Review", destination: "Depackaging line 1", docket: "WTD-58812" },
  { id: "INT-1047", arrival: "12:41", customer: "GreenMart", vehicle: "BIA-01", material: "Unpackaged food waste", gross: 16.04, tare: 13.34, net: 2.70, expected: 2.60, status: "Accepted", destination: "Reception pit A", docket: "WTD-58811" },
  { id: "INT-1046", arrival: "12:32", customer: "CityFresh", vehicle: "BIA-02", material: "Packaged food, Dolavs", gross: 39.46, tare: 13.36, net: 26.10, expected: 26.00, status: "Accepted", destination: "Depackaging line 2", docket: "WTD-58810" },
  { id: "INT-1045", arrival: "12:14", customer: "GreenMart", vehicle: "BIA-03", material: "Unpackaged food waste", gross: 15.88, tare: 13.38, net: 2.50, expected: 2.40, status: "Accepted", destination: "Reception pit A", docket: "WTD-58809" },
  { id: "INT-1044", arrival: "11:58", customer: "Third-party haulier", vehicle: "07-LH-2291", material: "Packaged food, mixed", gross: 30.10, tare: 16.40, net: 13.70, expected: 14.00, status: "Accepted", destination: "Depackaging line 1", docket: "WTD-58808" },
  { id: "INT-1043", arrival: "11:36", customer: "Northside Distribution", vehicle: "BIA-04", material: "Packaged food, Dolavs", gross: 17.40, tare: 13.40, net: 4.00, expected: 3.90, status: "Accepted", destination: "Depackaging line 2", docket: "WTD-58807" },
  { id: "INT-1042", arrival: "11:22", customer: "Meath Fresh Produce", vehicle: "BIA-13", material: "Fruit and veg, loose", gross: 19.70, tare: 13.40, net: 6.30, expected: 6.10, status: "Accepted", destination: "Reception pit B", docket: "WTD-58806" },
  { id: "INT-1041", arrival: "10:52", customer: "Third-party haulier", vehicle: "11-MN-804", material: "Packaged food, contaminated", gross: 24.60, tare: 16.90, net: 3.70, expected: 7.70, status: "Rejected", destination: "Returned to sender", docket: "WTD-58805" },
  { id: "INT-1040", arrival: "10:31", customer: "Boyne Valley Dairies", vehicle: "BIA-16", material: "Liquid dairy by-product", gross: 34.10, tare: 14.20, net: 19.90, expected: 19.50, status: "Accepted", destination: "Liquid buffer tank", docket: "WTD-58804" },
  { id: "INT-1039", arrival: "09:58", customer: "Dublin Foods", vehicle: "BIA-15", material: "Liquid food waste", gross: 35.60, tare: 14.30, net: 21.30, expected: 21.00, status: "Accepted", destination: "Liquid buffer tank", docket: "WTD-58803" },
  { id: "INT-1049", arrival: "13:02", customer: "Third-party haulier", vehicle: "08-D-55120", material: "Packaged food, pallets", gross: 26.20, tare: 16.60, net: 9.60, expected: 9.80, status: "In queue", destination: "Awaiting tip", docket: "WTD-58813" },
];

export const FEEDSTOCK_MIX = [
  { label: "Packaged food (depackaged)", pct: 46 }, { label: "Liquid food waste", pct: 27 },
  { label: "Unpackaged food waste", pct: 17 }, { label: "Fruit and veg", pct: 10 },
];

export const PLANT_ALERTS = [
  { tone: "warn" as Tone, title: "Depackaging line 1 throughput down 8%", sub: "Pallet backlog from INT-1048. Clears in about 25 min." },
  { tone: "neutral" as Tone, title: "Processing rate back to target", sub: "11:58. Digester 2 feed restored after 22 min pause." },
  { tone: "info" as Tone, title: "Weighbridge calibration certificate due in 41 days", sub: "Book the calibration contractor before 9 Nov." },
];

/* ---------- People ---------- */
export const MANAGEMENT = [
  { name: "Pat Loughman", role: "Group Operations Director", dept: "Operations" },
  { name: "Dragos Busuioc", role: "Group Logistics Manager", dept: "Logistics" },
  { name: "Gytis Meskauskas", role: "Plant Manager", dept: "Plant" },
  { name: "Natalia Biancha", role: "Weighbridge Manager", dept: "Plant" },
  { name: "Ricarte Nazerenco", role: "H&S and Compliance", dept: "Compliance" },
  { name: "Larissa Franca", role: "Compliance", dept: "Compliance" },
  { name: "Garreth Ritchie", role: "Group Commercial Director", dept: "Commercial" },
  { name: "Shane O'Brien", role: "Agri Lead", dept: "Agri" },
];

/* Fictional operational staff. Productivity metrics only attach to these. */
export type Sheet = { name: string; role: string; dept: string; shift: string; worked: number; productive: number; overtime: number; status: "Approved" | "Review" | "Submitted"; jobs?: number; tonnes?: number; stops?: number; index: number };
export const TIMESHEETS: Sheet[] = [
  { name: "Sean Kelly", role: "Driver", dept: "Logistics", shift: "06:00–14:00", worked: 8.2, productive: 7.4, overtime: 0.2, status: "Approved", jobs: 3, tonnes: 11.5, stops: 26, index: 94 },
  { name: "Marek Nowak", role: "Driver", dept: "Logistics", shift: "05:30–14:30", worked: 9.1, productive: 8.0, overtime: 1.1, status: "Review", jobs: 2, tonnes: 34.8, stops: 9, index: 92 },
  { name: "Adam Doyle", role: "Plant Operator", dept: "Plant", shift: "08:00–17:00", worked: 8.0, productive: 7.6, overtime: 0, status: "Approved", index: 95 },
  { name: "Stephen Murphy", role: "Driver", dept: "Logistics", shift: "06:00–14:30", worked: 8.4, productive: 7.6, overtime: 0.4, status: "Submitted", jobs: 3, tonnes: 7.3, stops: 31, index: 93 },
  { name: "Marek Kowalski", role: "Driver", dept: "Logistics", shift: "05:00–15:00", worked: 9.8, productive: 7.9, overtime: 1.8, status: "Review", jobs: 1, tonnes: 19.3, stops: 4, index: 84 },
  { name: "Darragh Quinn", role: "Driver", dept: "Logistics", shift: "06:00–15:30", worked: 9.3, productive: 8.1, overtime: 1.3, status: "Review", jobs: 3, tonnes: 5.9, stops: 34, index: 90 },
  { name: "Tomasz Wiśniewski", role: "Driver", dept: "Logistics", shift: "05:00–15:00", worked: 9.6, productive: 8.6, overtime: 1.6, status: "Review", jobs: 2, tonnes: 21.4, stops: 6, index: 91 },
  { name: "Ciarán Walsh", role: "Driver", dept: "Logistics", shift: "06:00–14:00", worked: 8.3, productive: 7.7, overtime: 0.3, status: "Submitted", jobs: 4, tonnes: 30.5, stops: 29, index: 96 },
  { name: "Paul Doyle", role: "Tanker Driver", dept: "Logistics", shift: "06:00–15:30", worked: 9.2, productive: 8.3, overtime: 0.7, status: "Review", jobs: 2, tonnes: 21.3, stops: 2, index: 93 },
  { name: "Aoife Brennan", role: "Weighbridge Operator", dept: "Plant", shift: "07:00–15:00", worked: 8.0, productive: 7.5, overtime: 0, status: "Approved", index: 94 },
  { name: "Viktor Horvat", role: "Depackaging Operator", dept: "Plant", shift: "07:00–15:00", worked: 8.1, productive: 7.1, overtime: 0.1, status: "Approved", index: 88 },
  { name: "Niall Gorman", role: "Yard Operative", dept: "Plant", shift: "06:00–14:00", worked: 8.0, productive: 7.2, overtime: 0, status: "Approved", index: 90 },
];
/* Logistics overtime awaiting approval (status Review): 1.1 + 1.8 + 1.3 + 1.6 + 0.7 = 6.5 h */

/* ---------- Customers (fictional; no real Bia customer relationships implied) ---------- */
export type Customer = { name: string; industry: string; status: "Active" | "Watch" | "Onboarding"; sites: number; freq: string; ytd: number; issue?: string; contact: string; town: string };
export const CUSTOMERS: Customer[] = [
  { name: "FreshFields Foods", industry: "Food Manufacturing", status: "Watch", sites: 3, freq: "5 / week", ytd: 486, issue: "BULK-204 delay", contact: "Orla Keane", town: "Naas" },
  { name: "GreenMart", industry: "Large Retail", status: "Active", sites: 14, freq: "Daily", ytd: 612, contact: "Declan Moran", town: "Dublin" },
  { name: "CityFresh", industry: "Distribution", status: "Active", sites: 4, freq: "4 / week", ytd: 538, contact: "Hannah Lyons", town: "Swords" },
  { name: "Dublin Foods", industry: "Food Manufacturing", status: "Active", sites: 1, freq: "3 / week", ytd: 1174, contact: "Kieran Fox", town: "Ballymount" },
  { name: "Boyne Valley Dairies", industry: "Food Manufacturing", status: "Watch", sites: 2, freq: "4 / week", ytd: 1320, issue: "TNK-044 no tanker", contact: "Sinéad Kerr", town: "Drogheda" },
  { name: "Northside Distribution", industry: "Distribution", status: "Active", sites: 3, freq: "5 / week", ytd: 402, contact: "Rob Carey", town: "Finglas" },
  { name: "Liffey Hospitality Group", industry: "Hospitality", status: "Active", sites: 9, freq: "6 / week", ytd: 188, contact: "Clare Dunphy", town: "Dublin 2" },
  { name: "Leinster Bakeries", industry: "Food Manufacturing", status: "Active", sites: 1, freq: "2 / week", ytd: 694, contact: "Eamon Reddy", town: "Carlow" },
  { name: "Meath Fresh Produce", industry: "Food Manufacturing", status: "Active", sites: 2, freq: "3 / week", ytd: 311, contact: "Fiona Tighe", town: "Navan" },
  { name: "Riverbank Healthcare Campus", industry: "Healthcare", status: "Active", sites: 2, freq: "3 / week", ytd: 74, contact: "Mark Hession", town: "Beaumont" },
  { name: "Hibernia College Catering", industry: "Campuses", status: "Onboarding", sites: 3, freq: "3 / week", ytd: 21, contact: "Aisling Rowe", town: "Belfield" },
  { name: "Kildare Tillage Partners", industry: "Agriculture", status: "Active", sites: 4, freq: "Seasonal", ytd: 0, contact: "Joe Brophy", town: "Kilcock" },
];

/* ---------- Compliance ---------- */
export const EXPIRIES = [
  { item: "BIA-12 roadworthiness test", owner: "Fleet", days: 3, tone: "bad" as Tone },
  { item: "Driver CPC, Paul Doyle", owner: "People", days: 19, tone: "warn" as Tone },
  { item: "Supplier insurance, Midland Hydraulics", owner: "Procurement", days: 27, tone: "warn" as Tone },
  { item: "Weighbridge calibration certificate", owner: "Plant", days: 41, tone: "neutral" as Tone },
];

/* ---------- Needs attention (the five Home items) ---------- */
export const ATTENTION = [
  { key: "bia07", tone: "bad" as Tone, title: "BIA-07 fault", sub: "Artic Curtainsider. Hydraulic warning. Route BULK-204 affected, 3 collections potentially delayed.", module: "Fleet", tab: "Overview" },
  { key: "bulk204", tone: "warn" as Tone, title: "FreshFields Foods, BULK-204", sub: "18.6 t bulk collection. ETA slipping by 42 minutes. Customer notified automatically.", module: "Collections", tab: "Live Jobs" },
  { key: "int1048", tone: "warn" as Tone, title: "INT-1048 weight variance", sub: "Net weight differs from expected by 1.70 t. Requires weighbridge review.", module: "Plant", tab: "Weighbridge" },
  { key: "bia12", tone: "warn" as Tone, title: "BIA-12 inspection", sub: "Inspection due in 3 days. Unavailable if not completed.", module: "Compliance", tab: "Expiries" },
  { key: "overtime", tone: "neutral" as Tone, title: "Timesheet approval", sub: "6.5 overtime hours awaiting approval in Logistics.", module: "People", tab: "Timesheets" },
];

export const BRIEFING = [
  "34 collections are scheduled today. 19 are complete and 4 require attention.",
  "BIA-07 has been removed from service following a hydraulic warning. I have prepared a reassignment of Route BULK-204 to BIA-14, which cuts the expected delay from 42 to 27 minutes.",
  "Huntstown has received 153.4 tonnes today against a planned 160 tonnes, running at 94% of planned throughput.",
  "INT-1048 has a 1.70 t weight discrepancy and needs review.",
];

export const fmtT = (n: number) => n.toFixed(1) + " t";
export const fmtEur = (n: number) => "€" + Math.round(n).toLocaleString("en-IE");
