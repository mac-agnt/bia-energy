import { CUSTOMERS, JOBS, type Customer, type Tone } from "../../story";

/* Customer-side demo data. Account-level facts (sector, sites, frequency,
   YTD tonnes, contact) come from story.ts CUSTOMERS; everything here adds
   detail around them. Fictional names only, mock values. */

export const SECTORS = ["Large Retail", "Food Manufacturing", "Distribution", "Hospitality", "Healthcare", "Campuses", "Agriculture"];

export const YTD_TOTAL = CUSTOMERS.reduce((a, c) => a + c.ytd, 0);
export const SITE_TOTAL = CUSTOMERS.reduce((a, c) => a + c.sites, 0);
export const byName = (name: string): Customer | undefined => CUSTOMERS.find((c) => c.name === name);

/* ---------- Sites (48 = sum of CUSTOMERS.sites) ---------- */
export type Site = { id: string; customer: string; name: string; count: number; containers: string; schedule: string; last: string; next: string; access: string; flag?: string; flagTone?: Tone };
const raw: [string, string, number, string, string, string, string, string, string?, Tone?][] = [
  ["FreshFields Foods", "Naas production facility", 24, "Bulk pallets, curtainsider", "Mon–Fri", "Today 12:46 · BULK-201", "Today · BULK-204", "Dock 4 only. Book slot with gatehouse. Banksman provided for reversing.", "BULK-204 delay", "warn"],
  ["FreshFields Foods", "Naas cold store", 10, "6 × 1,100 L bins, 4 Dolavs", "Mon, Wed, Fri", "Mon 28 Sep", "Wed 30 Sep", "Keycode at side gate. Hi-vis and hairnet at loading bay."],
  ["FreshFields Foods", "Newbridge distribution", 8, "Dolavs", "Wed, Fri", "Fri 25 Sep", "Wed 30 Sep", "Yard closes 18:00. Report to goods-in on arrival."],
  ["GreenMart", "Blanchardstown", 10, "10 × 240 L bins", "Mon–Sat", "Today 09:30 · COL-1836", "Today 13:20 · COL-1842", "Rear service yard. Access before 07:00 or after 10:00."],
  ["GreenMart", "Tallaght", 12, "12 × 240 L bins", "Mon–Sat", "Today 10:50 · COL-1840", "Today 14:45 · COL-1858", "Shared yard with neighbouring units. Watch for trolley bays.", "Resequenced today", "warn"],
  ["GreenMart", "Sandyford", 8, "8 × 240 L bins", "Mon–Sat", "Mon 28 Sep", "Today 14:25 · COL-1861", "Height barrier 3.6 m at car park. Use service lane."],
  ["GreenMart", "Clonsilla", 8, "8 × 240 L bins", "Mon, Wed, Fri", "Today 12:41 · COL-1838", "Wed 30 Sep", "Bins in locked compound. Code from duty manager."],
  ["GreenMart", "Lucan", 10, "10 × 240 L bins", "Mon, Wed, Fri", "Today 12:10 · COL-1847", "Wed 30 Sep", "Compound at rear. Plastics found in food bins three times this month.", "Contamination", "bad"],
  ["GreenMart", "Swords", 8, "8 × 240 L bins", "Mon, Wed, Fri", "Mon 28 Sep", "Wed 30 Sep", "Service road off roundabout. No access 12:00 to 14:00."],
  ["GreenMart", "Finglas", 6, "6 × 240 L bins", "Tue, Thu, Sat", "Sat 26 Sep", "Thu 1 Oct", "Gate opens 06:30. Ring store on arrival."],
  ["GreenMart", "Rathmines", 4, "4 × 240 L bins", "Tue, Thu, Sat", "Sat 26 Sep", "Thu 1 Oct", "On-street collection. Loading bay clearway until 07:00."],
  ["GreenMart", "Dundrum", 10, "10 × 240 L bins", "Mon–Sat", "Mon 28 Sep", "Wed 30 Sep", "Basement service level. Max vehicle height 4.0 m."],
  ["GreenMart", "Phibsborough", 4, "4 × 240 L bins", "Tue, Thu, Sat", "Sat 26 Sep", "Thu 1 Oct", "Rear lane. Narrow turn, MacPac only."],
  ["GreenMart", "Stillorgan", 6, "6 × 240 L bins", "Mon, Wed, Fri", "Mon 28 Sep", "Wed 30 Sep", "Yard shared with pharmacy deliveries before 08:00."],
  ["GreenMart", "Terenure", 4, "4 × 240 L bins", "Tue, Thu, Sat", "Sat 26 Sep", "Thu 1 Oct", "Bins behind side gate. Key held at customer service desk."],
  ["GreenMart", "Ashbourne", 6, "6 × 240 L bins", "Tue, Fri", "Fri 25 Sep", "Fri 2 Oct", "Retail park service road. Speed ramps."],
  ["GreenMart", "Maynooth", 6, "6 × 240 L bins", "Tue, Fri", "Fri 25 Sep", "Fri 2 Oct", "Compound code changed 14 Sep. Updated in driver app."],
  ["CityFresh", "Swords depot", 22, "Dolavs, 2 × 1,100 L bins", "Mon–Fri", "Today 12:30 · COL-1849", "Today 14:35 · COL-1851", "Depot clear-out today. Use bay 6, forklift support on site."],
  ["CityFresh", "Malahide", 6, "6 × 240 L bins", "Tue, Thu", "Thu 24 Sep", "Today 14:20 · COL-1857", "Rear yard. Residential street, no reversing alarm before 08:00."],
  ["CityFresh", "Santry", 8, "8 × 240 L bins", "Mon, Tue, Thu", "Today 11:20 · COL-1843", "Thu 1 Oct", "Goods-in at side of building. Sign in at security hut."],
  ["CityFresh", "Balbriggan", 5, "5 × 240 L bins", "Wed, Sat", "Sat 26 Sep", "Wed 30 Sep", "Industrial estate unit 14. Gate open 06:00 to 19:00."],
  ["Dublin Foods", "Ballymount plant", 1, "30,000 L liquid holding tank", "Mon, Tue, Thu", "Today 09:40 · TNK-039", "Today 15:05 · TNK-041", "Tanker bay B. Coupling and hose supplied by customer. Sampling point at valve 2."],
  ["Boyne Valley Dairies", "Drogheda creamery", 2, "2 × 25,000 L tanks", "Mon–Fri", "Today 10:15 · TNK-040", "Today 15:20 · TNK-043", "Wash-down required before exit. TNK-044 still needs a compatible tanker.", "TNK-044 unassigned", "bad"],
  ["Boyne Valley Dairies", "Duleek separation plant", 1, "20,000 L tank", "Thu", "Thu 24 Sep", "Thu 1 Oct", "Single lane access. Call site 20 minutes before arrival."],
  ["Northside Distribution", "Finglas", 12, "Dolavs", "Mon–Fri", "Today 09:10 · COL-1835", "Today 14:40 · COL-1860", "Yard 2. Dolav stack by door 11."],
  ["Northside Distribution", "Smithfield", 6, "Dolavs", "Tue, Thu", "Thu 24 Sep", "Today 13:55 · COL-1854", "City centre. Loading bay booking required via customer."],
  ["Northside Distribution", "Coolock", 8, "Dolavs", "Mon, Tue, Fri", "Today 11:55 · COL-1845", "Fri 2 Oct", "Industrial estate. Report to transport office."],
  ["Liffey Hospitality Group", "Temple Bar", 6, "6 × 240 L bins", "Mon–Sat", "Sat 26 Sep", "Today 15:30 · COL-1846", "Laneway access only before 11:00. Lift missed Mon 28 Sep.", "Missed lift", "bad"],
  ["Liffey Hospitality Group", "Docklands", 5, "5 × 240 L bins", "Mon–Sat", "Today 08:45 · COL-1834", "Wed 30 Sep", "Basement bin store. Fob from concierge."],
  ["Liffey Hospitality Group", "Ballsbridge", 5, "5 × 240 L bins", "Mon–Sat", "Today 11:40 · COL-1844", "Wed 30 Sep", "Rear car park. Wedding events Saturday, extra bins."],
  ["Liffey Hospitality Group", "Grafton Street", 3, "3 × 240 L bins", "Mon–Sat", "Mon 28 Sep", "Wed 30 Sep", "Pedestrian street. Collection window 06:00 to 10:30."],
  ["Liffey Hospitality Group", "Camden Street", 3, "3 × 240 L bins", "Mon, Wed, Fri", "Mon 28 Sep", "Wed 30 Sep", "Bins presented kerbside by 07:00."],
  ["Liffey Hospitality Group", "Ranelagh", 2, "2 × 240 L bins", "Tue, Fri", "Fri 25 Sep", "Fri 2 Oct", "Side passage. Gate unlocked by kitchen team."],
  ["Liffey Hospitality Group", "Portobello", 2, "2 × 240 L bins", "Tue, Fri", "Fri 25 Sep", "Fri 2 Oct", "Canal side. Narrow street, MacPac only."],
  ["Liffey Hospitality Group", "Howth", 3, "3 × 240 L bins", "Mon, Thu", "Thu 24 Sep", "Thu 1 Oct", "Harbour road. Avoid Sunday market traffic."],
  ["Liffey Hospitality Group", "Dún Laoghaire", 3, "3 × 240 L bins", "Mon, Thu", "Mon 28 Sep", "Thu 1 Oct", "Seafront hotel. Service entrance on side road."],
  ["Leinster Bakeries", "Carlow bakery", 20, "Bulk pallets, curtainsider", "Tue, Fri", "Today 09:05 · BULK-202", "Fri 2 Oct", "BULK-209 returning to Huntstown, due 16:10. Bay 3, 24 h site."],
  ["Meath Fresh Produce", "Navan packhouse", 12, "Bulk pallets, loose produce", "Mon, Tue, Thu", "Today 11:05 · COL-1841", "Today 15:15 · COL-1863", "Weigh on customer scale at gate. Tipping trailer provided."],
  ["Meath Fresh Produce", "Trim cold store", 4, "4 Dolavs", "Fri", "Fri 25 Sep", "Fri 2 Oct", "Farm lane access. 7.5 t weight limit on bridge, use N51 approach."],
  ["Riverbank Healthcare Campus", "Beaumont main kitchen", 6, "6 × 240 L bins", "Mon, Tue, Thu", "Today 12:20 · COL-1848", "Thu 1 Oct", "Facilities yard. Sign in at estates office. Ambulance route, no stopping."],
  ["Riverbank Healthcare Campus", "Beaumont staff restaurant", 4, "4 × 240 L bins", "Tue, Fri", "Today 10:05 · COL-1837", "Fri 2 Oct", "Bins at goods lift, level -1."],
  ["Hibernia College Catering", "Belfield main restaurant", 6, "6 × 240 L bins", "Mon, Tue, Thu", "Today 10:25 · COL-1839", "Thu 1 Oct", "Campus speed limit 25 km/h. Loading dock C."],
  ["Hibernia College Catering", "Belfield residences", 4, "4 × 240 L bins", "Thu", "Not started", "Thu 1 Oct (first lift)", "Onboarding. Bins delivered Mon 28 Sep.", "Onboarding", "info"],
  ["Hibernia College Catering", "Blackrock campus", 3, "3 × 240 L bins (proposed)", "Pending", "Not started", "Awaiting approval", "New site request SR-418. Site survey done 24 Sep.", "New site", "info"],
  ["Kildare Tillage Partners", "Kilcock field store", 1, "Digestate field store, 400 t", "On request", "Thu 17 Sep", "Today 16:00 · DEL-311", "Digestate delivery out. Farm track, contract haulier."],
  ["Kildare Tillage Partners", "Maynooth farm", 1, "Digestate field store, 250 t", "On request", "Tue 8 Sep", "Next season", "Digestate delivery out. Spreading plan on file."],
  ["Kildare Tillage Partners", "Clane farm", 1, "Digestate field store, 300 t", "On request", "Wed 2 Sep", "Next season", "Digestate delivery out. Soil test certificates on file."],
  ["Kildare Tillage Partners", "Prosperous farm", 1, "Digestate field store, 200 t", "On request", "Fri 21 Aug", "Next season", "Digestate delivery out. Gate code with Joe Brophy."],
];
export const SITES: Site[] = raw.map(([customer, name, count, containers, schedule, last, next, access, flag, flagTone], i) => ({ id: "S-" + (101 + i), customer, name, count, containers, schedule, last, next, access, flag, flagTone }));

/* ---------- Contacts (3 per account) ---------- */
export type Contact = { name: string; role: string; phone: string; receives: string };
export const CONTACTS: Record<string, Contact[]> = {
  "FreshFields Foods": [
    { name: "Orla Keane", role: "Operations Manager", phone: "045 870 214", receives: "ETA updates, collection changes" },
    { name: "Brian Tully", role: "Finance Controller", phone: "045 870 230", receives: "Invoices, weight queries" },
    { name: "Aoife Nolan", role: "Sustainability Lead", phone: "045 870 262", receives: "Quarterly sustainability report" },
  ],
  GreenMart: [
    { name: "Declan Moran", role: "Head of Store Operations", phone: "01 482 1190", receives: "Service reviews, escalations" },
    { name: "Úna Brady", role: "Regional Facilities Manager", phone: "01 482 1204", receives: "Site changes, contamination notices" },
    { name: "Peter Walsh", role: "ESG Reporting Analyst", phone: "01 482 1277", receives: "Sustainability reports" },
  ],
  CityFresh: [
    { name: "Hannah Lyons", role: "Depot Manager", phone: "01 840 3312", receives: "ETA updates, extra lifts" },
    { name: "Gavin Roche", role: "Accounts Payable", phone: "01 840 3340", receives: "Invoices" },
    { name: "Nora Quigley", role: "Quality Manager", phone: "01 840 3351", receives: "Dockets, sustainability reports" },
  ],
  "Dublin Foods": [
    { name: "Kieran Fox", role: "Plant Manager", phone: "01 456 7702", receives: "Tanker schedule" },
    { name: "Maeve Dolan", role: "Environmental Officer", phone: "01 456 7718", receives: "Dockets, sustainability reports" },
    { name: "Colm Hurley", role: "Finance", phone: "01 456 7730", receives: "Invoices" },
  ],
  "Boyne Valley Dairies": [
    { name: "Sinéad Kerr", role: "Site Services Manager", phone: "041 983 4410", receives: "Tanker schedule, exceptions" },
    { name: "Tadhg Byrne", role: "Shift Supervisor", phone: "041 983 4422", receives: "On-the-day changes" },
    { name: "Ellen Cassidy", role: "Sustainability Manager", phone: "041 983 4460", receives: "Sustainability reports" },
  ],
  "Northside Distribution": [
    { name: "Rob Carey", role: "Transport Manager", phone: "01 864 2210", receives: "ETA updates" },
    { name: "Lisa Tormey", role: "Warehouse Supervisor", phone: "01 864 2231", receives: "Dolav counts" },
    { name: "Ger Mulligan", role: "Finance", phone: "01 864 2250", receives: "Invoices" },
  ],
  "Liffey Hospitality Group": [
    { name: "Clare Dunphy", role: "Group Facilities Manager", phone: "01 677 9021", receives: "Service issues, extra lifts" },
    { name: "Mark Delaney", role: "Executive Chef, Temple Bar", phone: "01 677 9044", receives: "On-the-day changes" },
    { name: "Ruth Kinsella", role: "Procurement", phone: "01 677 9060", receives: "Invoices, reports" },
  ],
  "Leinster Bakeries": [
    { name: "Eamon Reddy", role: "Operations Director", phone: "059 913 2280", receives: "Schedule, reports" },
    { name: "Karen Doyle", role: "Dispatch Lead", phone: "059 913 2291", receives: "Load readiness" },
    { name: "Seán Fitzpatrick", role: "Finance", phone: "059 913 2204", receives: "Invoices" },
  ],
  "Meath Fresh Produce": [
    { name: "Fiona Tighe", role: "Packhouse Manager", phone: "046 902 7715", receives: "Schedule, weights" },
    { name: "Owen Reilly", role: "Farm Manager", phone: "046 902 7730", receives: "Trim collections" },
    { name: "Gráinne Lynch", role: "Accounts", phone: "046 902 7742", receives: "Invoices" },
  ],
  "Riverbank Healthcare Campus": [
    { name: "Mark Hession", role: "Estates Manager", phone: "01 809 3350", receives: "Schedule, access changes" },
    { name: "Deirdre Foley", role: "Catering Manager", phone: "01 809 3371", receives: "On-the-day changes" },
    { name: "Philip Ahern", role: "Sustainability Officer", phone: "01 809 3398", receives: "Sustainability reports" },
  ],
  "Hibernia College Catering": [
    { name: "Aisling Rowe", role: "Catering Operations Manager", phone: "01 716 4420", receives: "Onboarding, schedule" },
    { name: "Daniel Coyle", role: "Campus Services", phone: "01 716 4437", receives: "Access, new sites" },
    { name: "Laura Keogh", role: "Green Campus Coordinator", phone: "01 716 4459", receives: "Sustainability reports" },
  ],
  "Kildare Tillage Partners": [
    { name: "Joe Brophy", role: "Partner", phone: "045 892 118", receives: "Digestate deliveries" },
    { name: "Niamh Brophy", role: "Farm Administrator", phone: "045 892 127", receives: "Invoices, nutrient records" },
    { name: "Tom Keating", role: "Agronomist", phone: "087 441 2093", receives: "Digestate analysis" },
  ],
};

/* ---------- Service levels (last 30 days) ---------- */
export type Sla = { target: number; onTime: number; missed: number; contamination: number; trend: number[]; lifts: number };
export const SLA: Record<string, Sla> = {
  "FreshFields Foods": { target: 95, onTime: 92.4, missed: 0, contamination: 0.8, trend: [96, 95, 97, 96, 94, 92], lifts: 21 },
  GreenMart: { target: 95, onTime: 96.1, missed: 1, contamination: 3.8, trend: [95, 96, 95, 97, 96, 96], lifts: 262 },
  CityFresh: { target: 95, onTime: 97.2, missed: 0, contamination: 1.1, trend: [96, 97, 97, 96, 98, 97], lifts: 71 },
  "Dublin Foods": { target: 97, onTime: 98.1, missed: 0, contamination: 0.3, trend: [98, 97, 99, 98, 98, 98], lifts: 13 },
  "Boyne Valley Dairies": { target: 97, onTime: 93.8, missed: 0, contamination: 0.2, trend: [97, 98, 96, 95, 94, 94], lifts: 18 },
  "Northside Distribution": { target: 95, onTime: 96.0, missed: 0, contamination: 1.4, trend: [95, 94, 96, 96, 97, 96], lifts: 57 },
  "Liffey Hospitality Group": { target: 95, onTime: 94.1, missed: 1, contamination: 2.6, trend: [96, 95, 96, 95, 95, 94], lifts: 188 },
  "Leinster Bakeries": { target: 95, onTime: 97.5, missed: 0, contamination: 0.6, trend: [97, 96, 98, 97, 98, 97], lifts: 9 },
  "Meath Fresh Produce": { target: 95, onTime: 95.8, missed: 0, contamination: 1.0, trend: [94, 95, 96, 95, 96, 96], lifts: 13 },
  "Riverbank Healthcare Campus": { target: 98, onTime: 98.6, missed: 0, contamination: 0.9, trend: [98, 99, 98, 99, 98, 99], lifts: 22 },
  "Hibernia College Catering": { target: 95, onTime: 96.3, missed: 0, contamination: 2.1, trend: [95, 96, 96, 97, 96, 96], lifts: 8 },
  "Kildare Tillage Partners": { target: 95, onTime: 100, missed: 0, contamination: 0, trend: [100, 100, 100, 100, 100, 100], lifts: 3 },
};

/* ---------- Account meta ---------- */
export const META: Record<string, { since: string; contract: string; renews: string; basis: string; owner: string }> = {
  "FreshFields Foods": { since: "2021", contract: "SC-2021-118", renews: "31 Mar 2027", basis: "Gate fee per tonne + bulk lift charge", owner: "Garreth Ritchie" },
  GreenMart: { since: "2019", contract: "SC-2019-044", renews: "31 Dec 2026", basis: "Per lift, 240 L, tiered by volume", owner: "Garreth Ritchie" },
  CityFresh: { since: "2022", contract: "SC-2022-071", renews: "30 Jun 2027", basis: "Per lift + per tonne on Dolavs", owner: "Commercial team" },
  "Dublin Foods": { since: "2020", contract: "SC-2020-019", renews: "31 Jan 2027", basis: "Gate fee per tonne, tanker", owner: "Garreth Ritchie" },
  "Boyne Valley Dairies": { since: "2020", contract: "SC-2020-033", renews: "30 Sep 2027", basis: "Gate fee per tonne, tanker", owner: "Garreth Ritchie" },
  "Northside Distribution": { since: "2023", contract: "SC-2023-102", renews: "31 May 2027", basis: "Per Dolav + per tonne", owner: "Commercial team" },
  "Liffey Hospitality Group": { since: "2022", contract: "SC-2022-088", renews: "31 Mar 2027", basis: "Per lift, 240 L", owner: "Commercial team" },
  "Leinster Bakeries": { since: "2021", contract: "SC-2021-061", renews: "31 Aug 2027", basis: "Gate fee per tonne + haulage", owner: "Commercial team" },
  "Meath Fresh Produce": { since: "2023", contract: "SC-2023-015", renews: "28 Feb 2027", basis: "Gate fee per tonne", owner: "Commercial team" },
  "Riverbank Healthcare Campus": { since: "2024", contract: "SC-2024-027", renews: "31 Dec 2027", basis: "Per lift, 240 L", owner: "Commercial team" },
  "Hibernia College Catering": { since: "2026", contract: "SC-2026-064", renews: "31 Aug 2028", basis: "Per lift, 240 L", owner: "Commercial team" },
  "Kildare Tillage Partners": { since: "2022", contract: "DS-2022-009", renews: "Seasonal", basis: "Digestate supply per tonne, delivered", owner: "Shane O'Brien" },
};

/* ---------- Issues ---------- */
export type Issue = { id: string; customer: string; site: string; title: string; kind: string; owner: string; age: string; opened: string; channel: string; linked: string[]; message: string; reply: string; tone: Tone };
export const ISSUES: Issue[] = [
  { id: "ISS-311", customer: "FreshFields Foods", site: "Naas production facility", title: "BULK-204 collection delay", kind: "Delay", owner: "Logistics desk", age: "52 min", opened: "Today 12:38", channel: "Email",
    linked: ["BULK-204", "BIA-07", "BIA-14"], message: "Hi, we have 18 pallets staged on dock 4 for this afternoon. Can you confirm the collection time? We need the dock clear for a 16:00 inbound. Orla",
    reply: "", tone: "warn" },
  { id: "ISS-310", customer: "FreshFields Foods", site: "Naas production facility", title: "INT-1048 weight query", kind: "Weight query", owner: "Weighbridge", age: "34 min", opened: "Today 12:56", channel: "Email",
    linked: ["INT-1048", "WTD-58812", "BULK-201"], message: "Our dispatch note for this morning's load says 17.57 t. Your ticket shows 19.27 t. Before this goes on the invoice can you check it? Brian",
    reply: "", tone: "warn" },
  { id: "ISS-308", customer: "Liffey Hospitality Group", site: "Temple Bar", title: "Missed lift yesterday", kind: "Missed lift", owner: "Logistics desk", age: "1 day", opened: "Mon 28 Sep 15:12", channel: "Phone",
    linked: ["COL-1846", "BIA-04"], message: "Bins at Temple Bar weren't lifted this morning and the laneway is full. We have a full service tonight. Clare",
    reply: "Hi Clare, sorry about Monday. The lane was blocked by a delivery when our truck arrived and the lift wasn't rebooked, which it should have been. Temple Bar is on today's run as COL-1846 with a 15:30 slot, and we've added a note so the driver calls the kitchen if access is blocked again. Dragos, Bia Energy logistics", tone: "bad" },
  { id: "ISS-305", customer: "GreenMart", site: "Lucan", title: "Contamination in food bins", kind: "Contamination", owner: "Customer service", age: "2 days", opened: "Sun 27 Sep 10:02", channel: "Driver app",
    linked: ["COL-1847", "3 driver photos"], message: "Driver report: plastic wrap and cans in 4 of 10 bins at Lucan. Third time this month. Bins tagged and lifted.",
    reply: "Hi Úna, our drivers have found plastic wrap and cans in the food bins at GreenMart Lucan on three lifts this month (photos attached). We've lifted everything so far, but loads like this have to be depackaged or rejected at Huntstown. Could the store team get a short refresher? We can send bin stickers and a one-page guide this week. Bia Energy customer service", tone: "bad" },
  { id: "ISS-302", customer: "CityFresh", site: "Swords depot", title: "Invoice query INV-20417", kind: "Invoice query", owner: "Accounts", age: "3 days", opened: "Sat 26 Sep 09:40", channel: "Email",
    linked: ["INV-20417", "COL-1833"], message: "INV-20417 shows 5 lifts at Malahide for the week of 14 Sep. Our log shows 4. Can you check? Gavin",
    reply: "Hi Gavin, thanks for flagging. Our records show 4 completed lifts at Malahide that week plus one failed attempt on 17 Sep, when the gate was locked. Under the service terms a failed attempt is charged, but as the gate code had changed without notice to us we will credit it this time. A credit note for one lift will follow today. Bia Energy accounts", tone: "neutral" },
];

/* ---------- Service requests ---------- */
export type ServiceReq = { id: string; customer: string; site: string; kind: "Extra lift" | "Bin swap" | "New site" | "Frequency change"; detail: string; when: string; system: string; write: string };
export const REQUESTS: ServiceReq[] = [
  { id: "SR-421", customer: "CityFresh", site: "Malahide", kind: "Extra lift", detail: "Extra lift Friday 2 Oct, promotional weekend", when: "Today 11:12", system: "Fleet System", write: "Extra lift added to Fri 2 Oct, Swords loop B (BIA-02)." },
  { id: "SR-420", customer: "GreenMart", site: "Tallaght", kind: "Bin swap", detail: "Swap 4 × 240 L for 2 × 660 L to cut lift time", when: "Today 09:48", system: "Fleet System", write: "Bin swap booked for BIA-12 run, Thu 1 Oct. Container register updated." },
  { id: "SR-419", customer: "Liffey Hospitality Group", site: "Ballsbridge", kind: "Extra lift", detail: "Extra lift Saturday 3 Oct, wedding event", when: "Mon 28 Sep", system: "Fleet System", write: "Extra lift added to Sat 3 Oct, city centre loop (BIA-04)." },
  { id: "SR-418", customer: "Hibernia College Catering", site: "Blackrock campus", kind: "New site", detail: "New site, 3 × 240 L, Mon and Thu. Survey done 24 Sep", when: "Fri 25 Sep", system: "Accounting", write: "Blackrock campus added to contract SC-2026-064. First lift Mon 5 Oct." },
  { id: "SR-416", customer: "Boyne Valley Dairies", site: "Duleek separation plant", kind: "Frequency change", detail: "Move from 1 to 2 tanker lifts per week from October", when: "Thu 24 Sep", system: "Fleet System", write: "Duleek moved to Mon and Thu tanker lifts from 5 Oct." },
];

/* ---------- FreshFields record detail ---------- */
export const FF_COLLECTIONS = [
  { id: "COL-1822", date: "Mon 28 Sep", site: "Naas cold store", type: "Wheelie Bin", vehicle: "BIA-11", expected: 1.1, actual: 1.1 },
  { id: "COL-1815", date: "Fri 25 Sep", site: "Newbridge distribution", type: "Dolav", vehicle: "BIA-01", expected: 2.6, actual: 2.5 },
  { id: "COL-1811", date: "Fri 25 Sep", site: "Naas cold store", type: "Wheelie Bin", vehicle: "BIA-11", expected: 1.2, actual: 1.2 },
  { id: "BULK-189", date: "Tue 22 Sep", site: "Naas production facility", type: "Bulk Pallet", vehicle: "BIA-08", expected: 18.0, actual: 17.9 },
  { id: "COL-1797", date: "Wed 23 Sep", site: "Naas cold store", type: "Wheelie Bin", vehicle: "BIA-11", expected: 1.0, actual: 1.0 },
];

/* Monthly split of YTD tonnes, Jan–Sep. */
const W = [0.1, 0.1, 0.11, 0.11, 0.11, 0.12, 0.11, 0.12, 0.12];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
export const monthly = (ytd: number): [string, number][] => MONTHS.map((m, i) => [m, Math.round(ytd * W[i] * 10) / 10]);

/* Sustainability model: demo factors, configurable during onboarding. */
export function sustain(ytd: number) {
  return { diverted: ytd, biomethane: Math.round(ytd * 1.2), co2: Math.round(ytd * 0.25), digestate: Math.round(ytd * 0.9), packaging: Math.round(ytd * 0.078) };
}

export type Invoice = { id: string; period: string; amount: number; status: "Paid" | "Due" | "Draft"; due: string; note?: string };
export function invoicesFor(c: Customer): Invoice[] {
  const base = c.ytd > 0 ? (c.ytd / 9) * 128 : 3420;
  const seed = c.name.length;
  const nums = [20431, 20388, 20312, 20257, 20198].map((n) => n + (seed % 7) * 3);
  const f = [0.96, 1.04, 0.97, 1.01, 0.93];
  const period = ["Sep 2026", "Aug 2026", "Jul 2026", "Jun 2026", "May 2026"];
  return nums.map((n, i) => ({ id: "INV-" + n, period: period[i], amount: base * f[i], status: i === 0 ? "Draft" : i === 1 ? "Due" : "Paid", due: i === 0 ? "Issues 1 Oct" : i === 1 ? "Due 30 Sep" : "Paid" }));
}

export function jobsFor(name: string) { return JOBS.filter((j) => j.customer === name); }

export const DOCS_FOR = (c: Customer) => [
  { id: "d1", name: "Service contract " + META[c.name].contract, kind: "Contract", date: "Renews " + META[c.name].renews },
  { id: "d2", name: "Waste transfer dockets, 2026", kind: "Dockets", date: c.name === "FreshFields Foods" ? "214 dockets, latest WTD-58812" : "Updated today" },
  { id: "d3", name: "Sustainability report Q3 2026", kind: "Report", date: "Generated 28 Sep" },
  { id: "d4", name: "Rate card 2026", kind: "Commercial", date: "Issued 6 Jan" },
  { id: "d5", name: "Site risk assessments (" + c.sites + ")", kind: "H&S", date: "Reviewed Jul 2026" },
  { id: "d6", name: "Acceptance criteria and waste description", kind: "Compliance", date: "Signed Feb 2026" },
];
