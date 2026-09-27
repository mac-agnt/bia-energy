/* Demo data and pure helpers for the Pulse prototype (Bia Energy). */
import * as BIA_STORY from "../bia/story";

const INK="var(--ink)", BODY="var(--body)", DIM="var(--dim)", FAINT="var(--faint)";
const LIME="var(--accent)", GREEN="var(--ok)", AMBER="var(--warn)", RED="var(--bad)", NEUTRAL="var(--neutral)";
const MONO="var(--mono)";

const ICONS = {
  navHome:"M12 3.2 3.6 9.1v10a1.5 1.5 0 0 0 1.5 1.5h13.8a1.5 1.5 0 0 0 1.5-1.5v-10L12 3.2Z M8.9 13.1h2l1-2.6 1.5 5 1.1-2.4h1.6",
  navAgents:"M12 2.4v2.3 M12 2.4a.9.9 0 1 0 0-.02 M8.2 6.5h7.6A2.2 2.2 0 0 1 18 8.7v5.1a2.2 2.2 0 0 1-2.2 2.2H8.2A2.2 2.2 0 0 1 6 13.8V8.7a2.2 2.2 0 0 1 2.2-2.2Z M9.9 10.6v1.4 M14.1 10.6v1.4 M6 10h-1.9 M18 10h1.9 M9.2 18.6h5.6 M9.2 21.2h5.6",
  navDash:"M4 5.6h7.2v5.1H4V5.6Z M13.6 5.6H20v8.6h-6.4V5.6Z M4 13.1h7.2v5.3H4v-5.3Z M13.6 16.6H20v1.8h-6.4v-1.8Z",
  navWork:"M9.4 4.4h5.2a1.4 1.4 0 0 1 1.4 1.4v1.1h2.4A1.6 1.6 0 0 1 20 8.5v9.1a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 17.6V8.5a1.6 1.6 0 0 1 1.6-1.6H8V5.8a1.4 1.4 0 0 1 1.4-1.4Z M8 6.9h8 M9.6 13.3l1.8 1.8 3.4-3.6",
  navRecords:"M12 3.6c3.9 0 7 1.1 7 2.5S15.9 8.6 12 8.6 5 7.5 5 6.1 8.1 3.6 12 3.6Z M5 6.1v5.7c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6.1 M5 11.8v5.7c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-5.7",
  navActivity:"M4.6 4.6h14.8A1.6 1.6 0 0 1 21 6.2v11.6a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 17.8V6.2a1.6 1.6 0 0 1 1.6-1.6Z M6 12.4h2.2l1.5-4.1 2.3 8 1.9-5.4 1.2 1.5H18",
  navAdmin:"M12 2.9 5 5.6v5.9c0 4 2.8 7.1 7 8.6 4.2-1.5 7-4.6 7-8.6V5.6L12 2.9Z M12 8.6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z M8.8 16.3a3.6 3.6 0 0 1 6.4 0",
  helios:"M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-4-.8L3 21l1.9-4.9A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z M8 12h1.6l1.2-2.6 1.6 5 1.4-2.4H16",
  inbox:"M3 13h4l1.5 3h7l1.5-3h4 M3 13l2.4-7A2 2 0 0 1 7.3 4.6h9.4a2 2 0 0 1 1.9 1.4L21 13v4.4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V13Z",
  work:"M6 4.6h12a1.6 1.6 0 0 1 1.6 1.6v12.2A1.6 1.6 0 0 1 18 20H6a1.6 1.6 0 0 1-1.6-1.6V6.2A1.6 1.6 0 0 1 6 4.6Z M8.4 10.4l1.9 1.9 3.9-3.9 M8.4 15.6h7.2",
  approvals:"M12 3.6 19.5 6v6.1c0 4-3.1 6.9-7.5 8.3-4.4-1.4-7.5-4.3-7.5-8.3V6L12 3.6Z M9.2 12.2l2 2 3.6-3.7",
  insights:"M4.5 19.5V13 M9.7 19.5V7.5 M14.9 19.5v-8 M20 19.5V5",
  people:"M12 12.5a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z M5 20.2c.9-3.1 3.6-4.9 7-4.9s6.1 1.8 7 4.9",
  orgs:"M4.5 20V6.4A1.4 1.4 0 0 1 5.9 5h6.2a1.4 1.4 0 0 1 1.4 1.4V20 M13.5 10.5h4.6A1.4 1.4 0 0 1 19.5 12v8 M3 20h18 M7.5 8.5h2.5 M7.5 12h2.5 M7.5 15.5h2.5",
  teams:"M9 12a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 12Z M16.5 12.5a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z M2.6 19.6c.8-2.8 3.2-4.4 6.4-4.4s5.6 1.6 6.4 4.4 M17 15.4c2.2.4 3.7 1.8 4.3 4.2",
  locations:"M12 21s6.5-5.6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z M12 12.8a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z",
  visits:"M8 4v3 M16 4v3 M4.5 9.5h15 M6.4 6h11.2A1.9 1.9 0 0 1 19.5 8v10a1.9 1.9 0 0 1-1.9 1.9H6.4A1.9 1.9 0 0 1 4.5 18V8A1.9 1.9 0 0 1 6.4 6Z M9 13.5l1.6 1.6 3.4-3.4",
  autos:"M18.5 8.5A5 5 0 0 0 8.9 7.3 3.8 3.8 0 0 0 6 14.6 M8 17.5l3.2 3.2 M11.2 20.7l3.2-3.2 M11.2 20.7V9.6",
  health:"M3 12.5h3.4l2-5 3 10 2.2-5H21",
  modules:"M6.6 4.4h10.8a2.2 2.2 0 0 1 2.2 2.2v10.8a2.2 2.2 0 0 1-2.2 2.2H6.6a2.2 2.2 0 0 1-2.2-2.2V6.6a2.2 2.2 0 0 1 2.2-2.2Z M4.4 9.6h15.2 M9.6 19.6V9.6",
  agents:"M8.5 3.6h7A2.4 2.4 0 0 1 17.9 6v5.6a2.4 2.4 0 0 1-2.4 2.4h-7A2.4 2.4 0 0 1 6.1 11.6V6a2.4 2.4 0 0 1 2.4-2.4Z M9.6 8.2h.01 M14.4 8.2h.01 M12 14v2.6 M7.6 20.4h8.8 M12 16.6c-2.4 0-4.4 1.7-4.4 3.8h8.8c0-2.1-2-3.8-4.4-3.8Z",
  dash:"M4.4 4.4h6v6h-6v-6Z M13.6 4.4h6v3.6h-6V4.4Z M13.6 11.6h6v8h-6v-8Z M4.4 14h6v5.6h-6V14Z",
  files:"M5 7.2a1.8 1.8 0 0 1 1.8-1.8h3l1.8 2.2h5.6A1.8 1.8 0 0 1 19 9.4v7.4a1.8 1.8 0 0 1-1.8 1.8H6.8A1.8 1.8 0 0 1 5 16.8V7.2Z",
  pulseLine:"M2.5 12.5h3.6l2.1-6.4 3.2 12.2 2.6-8.4 1.8 2.6h5.7",
  records:"M6.4 3.6h7.4l4.2 4.2v12.6H6.4V3.6Z M13.4 3.8v4.2h4.2 M9 12.4h6 M9 16h4",
  tree:"M4.5 6h5 M4.5 12h5 M4.5 18h5 M12.5 6h7 M12.5 12h7 M12.5 18h7",
  graph:"M7 7.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z M17.6 10.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z M9.4 21.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z M8.6 6.4l7.6 2.6 M15.8 11.4l-5.6 5.2",
  navCollections:"M3.5 7.5h10v8.5h-10V7.5Z M13.5 10.5h3.6l3.4 3.2V16h-7 M7 18.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z M17 18.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z",
  navFleet:"M4 16.5V8.2A1.7 1.7 0 0 1 5.7 6.5h8.6A1.7 1.7 0 0 1 16 8.2v8.3 M16 10h2.6l2.4 3v3.5h-5 M4 16.5h2 M10 16.5h4 M8 18.4a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z M18 18.4a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z M4 11h12",
  navPlant:"M3.5 20.5h17 M5 20.5V11l4.5 3v-3l4.5 3V6.5h4v14 M16 4v2.5 M7.5 17h1.5 M11.5 17H13",
  bell:"M6 8.5a6 6 0 0 1 12 0c0 6.5 2.6 8.5 2.6 8.5H3.4S6 15 6 8.5Z M10.3 20.5a1.94 1.94 0 0 0 3.4 0"
};

const REC_SECTIONS = [
  {id:"contacts", label:"Contacts", blurb:"Bia staff, customer contacts and suppliers as one set of records."},
  {id:"files", label:"Files", blurb:"Service agreements, dockets, weighbridge tickets, permits, ISO certificates and SOPs, indexed where Pulse can read them."},
  {id:"ontology", label:"Ontology", blurb:"How every record connects: customers, sites, collections, vehicles, dockets, feedstock and what comes out of the plant."}
];

/* Record spine: the entity types every Bia record belongs to. */
const RECORD_TYPES = ["Customers","Sites","Contacts","Collections","Routes","Vehicles","Drivers","Staff","Feedstock",
  "Intake records","Weighbridge tickets","Documents","Suppliers","Invoices","Issues","SOPs","Compliance records"];

const CONTACTS = [
  ["Pat Loughman","Group Operations Director","pat.loughman@biaenergy.ie","Bia Energy","staff","var(--accent)"],
  ["Dragos Busuioc","Group Logistics Manager","dragos.busuioc@biaenergy.ie","Bia Energy","staff","#6fb6d9"],
  ["Gytis Meskauskas","Plant Manager","gytis.meskauskas@biaenergy.ie","Bia Energy","staff","#e6c78a"],
  ["Natalia Biancha","Weighbridge Manager","natalia.biancha@biaenergy.ie","Bia Energy","staff","#c8b4f0"],
  ["Ricarte Nazerenco","H&S and Compliance","ricarte.nazerenco@biaenergy.ie","Bia Energy","staff","#9fd6f0"],
  ["Larissa Franca","Compliance","larissa.franca@biaenergy.ie","Bia Energy","staff","#a8e0c0"],
  ["Garreth Ritchie","Group Commercial Director","garreth.ritchie@biaenergy.ie","Bia Energy","staff","#e6c78a"],
  ["Shane O'Brien","Agri Lead","shane.obrien@biaenergy.ie","Bia Energy","staff","#7fd8a4"],
  ["Orla Keane","Environmental manager","orla.keane@freshfieldsfoods.ie","FreshFields Foods","watch","#e6c78a"],
  ["Brian Tallon","Site manager, Naas","brian.tallon@freshfieldsfoods.ie","FreshFields Foods","watch","#9fd6f0"],
  ["Maeve Doran","Accounts payable","maeve.doran@freshfieldsfoods.ie","FreshFields Foods","watch","#c8b4f0"],
  ["Declan Moran","Facilities lead","declan.moran@greenmart.ie","GreenMart","customer","#9fd6f0"],
  ["Hannah Lyons","Depot manager","hannah.lyons@cityfresh.ie","CityFresh","customer","#a8e0c0"],
  ["Kieran Fox","Operations manager","kieran.fox@dublinfoods.ie","Dublin Foods","customer","#e2a08c"],
  ["Sinéad Kerr","Site services","sinead.kerr@boynevalleydairies.ie","Boyne Valley Dairies","watch","#e6c78a"],
  ["Rob Carey","Warehouse manager","rob.carey@northsidedistribution.ie","Northside Distribution","customer","#c8b4f0"],
  ["Clare Dunphy","Group purchasing","clare.dunphy@liffeyhospitality.ie","Liffey Hospitality Group","customer","#9fd6f0"],
  ["Eamon Reddy","Production manager","eamon.reddy@leinsterbakeries.ie","Leinster Bakeries","customer","#a8e0c0"],
  ["Fiona Tighe","Quality lead","fiona.tighe@meathfreshproduce.ie","Meath Fresh Produce","customer","#e6c78a"],
  ["Mark Hession","Estates officer","mark.hession@riverbankhealth.ie","Riverbank Healthcare Campus","customer","#c8b4f0"],
  ["Aisling Rowe","Catering manager","aisling.rowe@hiberniacatering.ie","Hibernia College Catering","onboarding","#9fd6f0"],
  ["Joe Brophy","Farm partner","joe.brophy@kildaretillage.ie","Kildare Tillage Partners","farmer","#7fd8a4"],
  ["Declan Hurley","Service manager","declan.hurley@midlandhydraulics.ie","Midland Hydraulics","supplier","#e2a08c"]
];

const FILE_TREE = [
  {type:"folder", id:"f-cust", name:"Customers", depth:0},
  {type:"file", id:"fl-1", name:"FreshFields Foods, service agreement 2026.pdf", depth:1, parent:"f-cust", indexed:true,
   path:"Customers / FreshFields Foods", title:"FreshFields Foods, service agreement 2026",
   facts:[["TYPE","PDF · 8 pages"],["ADDED","14 Jan 2026"],["INDEXED","All 8 pages"],["OWNER","Commercial"]],
   body:["Covers packaged and unpackaged food waste from three FreshFields sites, including the Naas production facility. Bulk pallet collections run five times a week, with extra lifts on request.",
     "Tonnage is billed on the net weight recorded at the Huntstown weighbridge. Any variance over 1 tonne against the customer reference is reviewed before the invoice line is released.",
     "Bia commits to collecting inside the agreed window and to emailing a revised ETA when a collection will run late. Quarterly sustainability reporting is included."],
   links:[["FreshFields Foods","org"],["Orla Keane","person"],["BULK-204","collection"]]},
  {type:"file", id:"fl-2", name:"GreenMart store schedule 2026.xlsx", depth:1, parent:"f-cust", indexed:false,
   path:"Customers / GreenMart", title:"GreenMart store schedule 2026",
   facts:[["TYPE","XLSX · 3 sheets"],["ADDED","6 Feb 2026"],["INDEXED","Not indexed"],["OWNER","Logistics"]],
   body:["Daily wheelie bin lifts across 14 GreenMart stores in Dublin, with lift windows agreed per store.",
     "Spreadsheets are stored but not indexed by default. The live schedule Pulse works from comes from the collection records, not this file."],
   links:[["GreenMart","org"],["Declan Moran","person"]]},
  {type:"folder", id:"f-col", name:"Collections & dockets", depth:0},
  {type:"file", id:"fl-3", name:"WTD-58812 waste transfer docket.pdf", depth:1, parent:"f-col", indexed:true,
   path:"Collections & dockets / September", title:"WTD-58812 waste transfer docket",
   facts:[["TYPE","PDF · 2 pages"],["ISSUED","29 Sep, 12:31"],["INDEXED","Both pages"],["OWNER","Logistics"]],
   body:["Transfer of packaged food waste on pallets from FreshFields Foods, Naas production facility, to Bia Energy, Huntstown. Carried on BIA-14, driver Marek Kowalski, signed at collection.",
     "Customer reference gives an expected weight of 17.57 t. The load was weighed on arrival as INT-1048 at 19.27 t net, so the docket carries a variance note until the Weighbridge Manager signs it off."],
   links:[["FreshFields Foods","org"],["INT-1048","weighbridge"],["BIA-14","vehicle"]]},
  {type:"file", id:"fl-4", name:"BULK-204 collection plan.pdf", depth:1, parent:"f-col", indexed:true,
   path:"Collections & dockets / Today", title:"BULK-204 collection plan",
   facts:[["TYPE","PDF · 1 page"],["ADDED","28 Sep 2026"],["INDEXED","1 page"],["OWNER","Logistics"]],
   body:["Bulk pallet collection at FreshFields Foods, Naas. 18.6 t expected, planned on BIA-07 with an ETA of 14:10.",
     "BIA-07 was removed from service at 12:34. Pulse has proposed moving the job to BIA-14, which brings the delay down from 42 to 27 minutes."],
   links:[["FreshFields Foods","org"],["BIA-07 hydraulic fault","issue"]]},
  {type:"folder", id:"f-wb", name:"Weighbridge", depth:0},
  {type:"file", id:"fl-5", name:"INT-1048 weighbridge ticket.pdf", depth:1, parent:"f-wb", indexed:true,
   path:"Weighbridge / Tickets", title:"INT-1048 weighbridge ticket",
   facts:[["TYPE","PDF · 1 page"],["ARRIVAL","12:46 today"],["INDEXED","1 page"],["OWNER","Weighbridge"]],
   body:["BIA-14 for FreshFields Foods. Gross 37.42 t, tare 18.15 t, net 19.27 t against 17.57 t expected, a variance of +1.70 t.",
     "Status is Review. The load is routed to depackaging line 1 while the variance is checked against docket WTD-58812 and the driver sign-off."],
   links:[["FreshFields Foods","org"],["WTD-58812","docket"],["Natalia Biancha","person"]]},
  {type:"file", id:"fl-6", name:"Weighbridge calibration certificate.pdf", depth:1, parent:"f-wb", indexed:true,
   path:"Weighbridge / Certificates", title:"Weighbridge calibration certificate",
   facts:[["TYPE","PDF · 3 pages"],["EXPIRES","9 Nov 2026"],["INDEXED","All 3 pages"],["OWNER","Plant"]],
   body:["Annual calibration of the Huntstown weighbridge, within tolerance at every test load.",
     "Expires in 41 days. Pulse has flagged it so the calibration contractor is booked before 9 November."],
   links:[["Gytis Meskauskas","person"],["Compliance expiries","compliance"]]},
  {type:"folder", id:"f-fleet", name:"Fleet", depth:0},
  {type:"file", id:"fl-7", name:"BIA-07 hydraulic fault report.pdf", depth:1, parent:"f-fleet", indexed:true,
   path:"Fleet / Faults", title:"BIA-07 hydraulic fault report",
   facts:[["TYPE","PDF · 2 pages"],["RAISED","12:34 today"],["INDEXED","Both pages"],["OWNER","Fleet workshop"]],
   body:["Hydraulic pressure warning on the tail-lift ram of BIA-07, Artic Curtainsider, near Johnstown on the N7. The driver stopped safely and the vehicle was removed from service.",
     "Route BULK-204 is affected. Workshop ticket WS-2291 opens when the reassignment to BIA-14 is approved."],
   links:[["BIA-07","vehicle"],["BULK-204","collection"],["Marek Kowalski","person"]]},
  {type:"file", id:"fl-8", name:"BIA-12 roadworthiness test notice.pdf", depth:1, parent:"f-fleet", indexed:true,
   path:"Fleet / Inspections", title:"BIA-12 roadworthiness test notice",
   facts:[["TYPE","PDF · 1 page"],["DUE","2 Oct 2026"],["INDEXED","1 page"],["OWNER","Fleet workshop"]],
   body:["Annual roadworthiness test for BIA-12, Support Vehicle, due in 3 days.",
     "If the test is missed the vehicle is off road and the Dublin 15 bin swaps need cover from another vehicle."],
   links:[["BIA-12","vehicle"],["Compliance expiries","compliance"]]},
  {type:"folder", id:"f-comp", name:"Compliance & permits", depth:0},
  {type:"file", id:"fl-9", name:"Waste collection permit.pdf", depth:1, parent:"f-comp", indexed:true,
   path:"Compliance & permits / Permits", title:"Waste collection permit",
   facts:[["TYPE","PDF · 14 pages"],["ADDED","3 Mar 2025"],["INDEXED","All 14 pages"],["OWNER","Compliance"]],
   body:["Authorises Bia Energy to collect food waste and packaged food waste using the listed vehicles, with the conditions on records, dockets and reporting.",
     "The vehicle schedule in the permit is checked against the fleet list, so a new vehicle added in Fleet is flagged here until the permit is updated."],
   links:[["Ricarte Nazerenco","person"],["Fleet","vehicle"]]},
  {type:"file", id:"fl-10", name:"Supplier insurance, Midland Hydraulics.pdf", depth:1, parent:"f-comp", indexed:false,
   path:"Compliance & permits / Suppliers", title:"Supplier insurance, Midland Hydraulics",
   facts:[["TYPE","PDF · 6 pages"],["EXPIRES","26 Oct 2026"],["INDEXED","Not indexed"],["OWNER","Procurement"]],
   body:["Public liability cover for the hydraulic repair contractor used on the curtainsider fleet. Expires in 27 days.",
     "Not indexed, so Pulse cannot answer questions from it yet. Indexing it would let the workshop check cover before booking BIA-07 in."],
   links:[["Midland Hydraulics","org"],["Declan Hurley","person"]]},
  {type:"folder", id:"f-iso", name:"ISO", depth:0},
  {type:"file", id:"fl-11", name:"ISO 14001 certificate.pdf", depth:1, parent:"f-iso", indexed:true,
   path:"ISO / Environmental", title:"ISO 14001 certificate",
   facts:[["TYPE","PDF · 2 pages"],["VALID TO","Mar 2028"],["INDEXED","Both pages"],["OWNER","Compliance"]],
   body:["Environmental management system certificate covering collection, reception, depackaging, anaerobic digestion and digestate handling at Huntstown.",
     "The surveillance audit is due in March. Evidence for it is pulled from the audit and issues records in Compliance."],
   links:[["Larissa Franca","person"],["Compliance audits","compliance"]]},
  {type:"file", id:"fl-12", name:"Internal environmental audit, Q3.pdf", depth:1, parent:"f-iso", indexed:true,
   path:"ISO / Audits", title:"Internal environmental audit, Q3",
   facts:[["TYPE","PDF · 11 pages"],["ADDED","19 Sep 2026"],["INDEXED","All 11 pages"],["OWNER","Compliance"]],
   body:["Two minor findings, both closed: odour log gaps on one weekend and a missing signature on a digestate dispatch note.",
     "No major nonconformities. Actions are tracked as issues with owners and due dates."],
   links:[["Larissa Franca","person"],["Ricarte Nazerenco","person"]]},
  {type:"folder", id:"f-sop", name:"SOPs", depth:0},
  {type:"file", id:"fl-13", name:"Depackaging SOP v4.pdf", depth:1, parent:"f-sop", indexed:true,
   path:"SOPs / Plant", title:"Depackaging SOP v4",
   facts:[["TYPE","PDF · 9 pages"],["UPDATED","2 Jul 2026"],["INDEXED","All 9 pages"],["OWNER","Plant"]],
   body:["Loading, feed rate and cleaning steps for depackaging lines 1 and 2, with the checks for contamination before material goes to the reception pits.",
     "Version 4 adds the pallet backlog procedure used today on line 1 after INT-1048."],
   links:[["Gytis Meskauskas","person"],["Depackaging line 1","plant"]]},
  {type:"file", id:"fl-14", name:"Weighbridge variance SOP v2.pdf", depth:1, parent:"f-sop", indexed:true,
   path:"SOPs / Weighbridge", title:"Weighbridge variance SOP v2",
   facts:[["TYPE","PDF · 3 pages"],["UPDATED","11 May 2026"],["INDEXED","All 3 pages"],["OWNER","Weighbridge"]],
   body:["Any net weight more than 1.0 t or 5% away from the customer reference is held for review by the Weighbridge Manager.",
     "The reviewer checks the docket, the driver sign-off and the tare record, then accepts, adjusts or rejects. The decision is written back to the ticket and to Accounting."],
   links:[["Natalia Biancha","person"],["INT-1048","weighbridge"]]},
  {type:"folder", id:"f-fin", name:"Finance", depth:0},
  {type:"file", id:"fl-15", name:"INV-26-0418 FreshFields Foods.pdf", depth:1, parent:"f-fin", indexed:true,
   path:"Finance / Invoices", title:"INV-26-0418 FreshFields Foods",
   facts:[["TYPE","PDF · 2 pages"],["PERIOD","September 2026"],["STATUS","Held"],["OWNER","Commercial"]],
   body:["September collections for FreshFields Foods across three sites, billed on weighbridge net weights.",
     "One line is held until INT-1048 is reviewed. Once accepted, Pulse updates the line in Accounting and releases the invoice."],
   links:[["FreshFields Foods","org"],["Maeve Doran","person"],["INT-1048","weighbridge"]]},
  {type:"file", id:"fl-16", name:"Month-end close, September.xlsx", depth:1, parent:"f-fin", indexed:false,
   path:"Finance / Close", title:"Month-end close, September",
   facts:[["TYPE","XLSX · 7 sheets"],["ADDED","29 Sep 2026"],["INDEXED","Not indexed"],["OWNER","Commercial"]],
   body:["The working file behind the September close: gate fees by customer, digestate sales and haulage costs.",
     "Spreadsheets are stored but not indexed by default. The figures Pulse quotes come from Accounting, not from here."],
   links:[["Garreth Ritchie","person"],["Accounting","system"]]}
];

const ONTO_NODES = [
  ["Customer","entity",500,300,1,"Food producers, retailers, hospitality, campuses and farms. Every other record hangs off a customer."],
  ["Site","entity",300,190,1,"The premises we collect from. FreshFields Foods has three, Naas production facility is one."],
  ["Collection","entity",700,190,1,"A scheduled job: wheelie bin, bulk pallet, Dolav, curtainsider or tanker."],
  ["Driver","entity",250,430,1,"Staff record. Links to timesheets, routes and vehicle checks."],
  ["Issue","entity",690,430,1,"Exceptions and variances. Each has an owner, a due time and an audit trail."],
  ["Vehicle","entity",850,320,0,"Fleet asset from Fleet / telematics: status, location, inspections and faults."],
  ["Invoice","ledger",390,95,0,"Read and written through Accounting. Net tonnes on the ticket drive the line."],
  ["Docket","ledger",620,95,0,"Waste transfer docket and weighbridge ticket, read from the Weighbridge system."],
  ["Feedstock","module",860,470,0,"Accepted tonnes into depackaging and digestion, from Plant / SCADA data."],
  ["Document","entity",140,300,0,"Contracts, permits, SOPs and reports. Indexed pages are readable by Pulse."],
  ["located at","predicate",395,240,0,"Customer → Site."],
  ["collected by","predicate",605,240,0,"Collection → Vehicle → Driver."],
  ["driven by","predicate",360,370,0,"Vehicle → Driver."],
  ["raises","predicate",600,370,0,"Docket or weight → Issue."],
  ["attached to","predicate",140,372,0,"Document → anything."]
];

const ONTO_EDGES = [
  [500,300,300,190],[500,300,700,190],[500,300,250,430],[500,300,690,430],
  [500,300,850,320],[500,300,390,95],[500,300,620,95],[500,300,140,300],
  [300,190,250,430],[700,190,860,470],[690,430,850,320],[690,430,860,470],
  [300,190,140,300],[390,95,620,95]
];

const REC_TEMPLATES = [
  ["Field sheet","Records","Labelled fields in a grid. The default for a customer, site or vehicle.",
   "M5 5.5h14v13H5v-13Z M5 10h14 M12 10v8.5","grid"],
  ["Contact card","Records","A contact, key fields and every linked record in one compact panel.",
   "M12 11.5a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Z M5.5 19c.8-3 3.3-4.7 6.5-4.7s5.7 1.7 6.5 4.7","card"],
  ["Directory","Records","A sortable table of many records at once, built for routes, tickets and dockets.",
   "M4.5 6.5h15 M4.5 12h15 M4.5 17.5h15 M4.5 6.5h.01 M4.5 12h.01 M4.5 17.5h.01","rows"],
  ["Timeline","Case work","Ordered events with who did what and when. Good for an exception or a weight variance.",
   "M12 3.5v17 M12 7.5h6 M12 13h-6 M12 18h6","timeline"],
  ["Kanban board","Case work","Cards in columns by status. For collections, repairs and anything that moves through stages.",
   "M5 5h4.5v14H5V5Z M9.75 5h4.5v9h-4.5V5Z M14.5 5H19v6h-4.5V5Z","kanban"],
  ["Checklist","Case work","Ticked steps in order, with an owner and a due date. Vehicle checks, SOPs and audits.",
   "M5 6.5h2l1.4 1.4L11 5.5 M5 12.5h2l1.4 1.4 2.6-2.4 M5 18.5h2l1.4 1.4 2.6-2.4 M15 6.5h4 M15 12.5h4 M15 18.5h4","checklist"],
  ["Ledger","Finance","Rows and running totals. For tonnes, gate fees and anything with amounts and dates.",
   "M4 6h16 M4 12h16 M4 18h16 M9 3.5v17","ledger"],
  ["Invoice","Finance","Line items from weighbridge net weights, totals and a status. Built to be sent.",
   "M7 3.5h10v17H7v-17Z M9.5 8h5 M9.5 11.5h5 M9.5 15h3","invoice"],
  ["Document","Notes","Long-form text such as an SOP or permit, with linked records down the side.",
   "M7 3.5h7l5 5v12H7v-17Z M14 3.7v5h5 M10 13h6 M10 16.5h4","document"],
  ["Gallery","Notes","A wall of photos and files with a caption on each. For a site, a load or a fault.",
   "M4.5 6h6v6h-6V6Z M13.5 6h6v6h-6V6Z M4.5 14h6v4h-6v-4Z M13.5 14h6v4h-6v-4Z","gallery"],
  ["Map & locations","Ops","A pinboard of customer sites and routes, with the record's fields beside each pin.",
   "M12 21s6.5-5.6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z M12 12.8a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z","map"],
  ["Schedule","Ops","A calendar of collections or inspections against this record, with recurring rules.",
   "M8 4v3 M16 4v3 M4.5 9.5h15 M6.4 6h11.2A1.9 1.9 0 0 1 19.5 8v10a1.9 1.9 0 0 1-1.9 1.9H6.4A1.9 1.9 0 0 1 4.5 18V8A1.9 1.9 0 0 1 6.4 6Z","schedule"]
];
const REC_TEMPLATE_CATS = ["All","Records","Case work","Finance","Notes","Ops"];

/* ---- admin hub ---- */
/* ---- admin hub: 13 settings areas in five groups ---- */
const PEOPLE = [
  ["Pat Loughman","Group Operations Director","pat.loughman@biaenergy.ie","Huntstown","active","Admin","12 min ago"],
  ["Dragos Busuioc","Group Logistics Manager","dragos.busuioc@biaenergy.ie","Huntstown","active","Manager","2 min ago"],
  ["Gytis Meskauskas","Plant Manager","gytis.meskauskas@biaenergy.ie","Huntstown","active","Manager","8 min ago"],
  ["Natalia Biancha","Weighbridge Manager","natalia.biancha@biaenergy.ie","Huntstown","active","Manager","4 min ago"],
  ["Ricarte Nazerenco","H&S and Compliance","ricarte.nazerenco@biaenergy.ie","Huntstown","active","Manager","41 min ago"],
  ["Larissa Franca","Compliance","larissa.franca@biaenergy.ie","Huntstown","active","Manager","1 h ago"],
  ["Garreth Ritchie","Group Commercial Director","garreth.ritchie@biaenergy.ie","Huntstown","active","Admin","26 min ago"],
  ["Shane O'Brien","Agri Lead","shane.obrien@biaenergy.ie","Huntstown","active","Manager","2 h ago"],
  ["Sean Kelly","Driver, Logistics","sean.kelly@biaenergy.ie","Huntstown","active","Driver","6 min ago"],
  ["Marek Kowalski","Driver, Logistics","marek.kowalski@biaenergy.ie","Huntstown","active","Driver","1 min ago"],
  ["Aoife Brennan","Weighbridge Operator","aoife.brennan@biaenergy.ie","Huntstown","active","Operator","3 min ago"],
  ["Adam Doyle","Plant Operator","adam.doyle@biaenergy.ie","Huntstown","active","Operator","17 min ago"],
  ["Orla Keane","Environmental manager · FreshFields Foods","orla.keane@freshfieldsfoods.ie","Customer portal","external","External","Yesterday"],
  ["Declan Hurley","Service manager · Midland Hydraulics","declan.hurley@midlandhydraulics.ie","Supplier","inactive","External","23 days ago"]
];
const ROLE_LEVELS = ["Admin","Manager","Operator","Driver","External"];
const PERM_KEYS = [["view","View records in scope"],["edit","Edit records"],["approve","Approve routes, overtime and tickets"],["finance","See financial metrics"]];
const GRANT_DEFS = [
  ["view","View records","Read anything in scope"],
  ["edit","Edit records","Create and change records"],
  ["approve","Approve decisions","Routes, overtime, weight variances"],
  ["finance","See financials","Revenue, margins and gate fees"],
  ["payroll","See payroll","Other employees' pay and hours"],
  ["export","Export data","Download and share out"],
  ["agents","Manage agents","Create and grant agents"],
  ["settings","Change settings","Modules, roles, integrations"],
  ["audit","Read the audit log","Every action, everyone"]
];
const ROLE_SCOPES = ["All records","Their team","Own jobs and vehicle"];
const DEFAULT_PERMS = {Admin:{view:true,edit:true,approve:true,finance:true}, Manager:{view:true,edit:true,approve:true,finance:false},
  Operator:{view:true,edit:true,approve:false,finance:false}, Driver:{view:true,edit:false,approve:false,finance:false},
  External:{view:true,edit:false,approve:false,finance:false}, Standard:{view:true,edit:true,approve:false,finance:false}};
const INTEGRATIONS = [
  {name:"Email", blurb:"Customer and supplier threads attach to the record they mention. Pulse drafts replies and ETA updates, and sends once approved.", tint:"#f07a9d", status:"Connected", statusKind:"ok",
   glyph:"M4 7.2 12 13 20 7.2 M4 7.2v10.6h16V7.2 M4 7.2 8.5 4h7L20 7.2",
   lastSync:"1 min ago", usage:"340 emails a day", auth:"OAuth 2.0", scopes:["Read","Write"], access:"Read + Write"},
  {name:"Calendar", blurb:"Inspections, services and customer visits. Pulse books slots such as the BIA-12 roadworthiness test once approved.", tint:"#6fb6d9", status:"Connected", statusKind:"ok",
   glyph:"M8 4v3 M16 4v3 M4.5 9.5h15 M6.4 6h11.2A1.9 1.9 0 0 1 19.5 8v10a1.9 1.9 0 0 1-1.9 1.9H6.4A1.9 1.9 0 0 1 4.5 18V8A1.9 1.9 0 0 1 6.4 6Z",
   lastSync:"4 min ago", usage:"38 bookings this week", auth:"OAuth 2.0", scopes:["Read","Write"], access:"Read + Write"},
  {name:"Fleet / telematics", blurb:"Live position, status and faults for all 16 vehicles. Approved reassignments are pushed back to the fleet system.", tint:"#f0803a", status:"Connected", statusKind:"ok",
   glyph:"M4 16.5V8.2A1.7 1.7 0 0 1 5.7 6.5h8.6A1.7 1.7 0 0 1 16 8.2v8.3 M16 10h2.6l2.4 3v3.5h-5 M4 16.5h2 M10 16.5h4 M8 18.4a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z M18 18.4a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z",
   lastSync:"Live, 30 s ago", usage:"16 vehicles tracked", auth:"API key", scopes:["Read","Write"], access:"Read + Write"},
  {name:"Weighbridge", blurb:"Every ticket at Huntstown: gross, tare, net and docket. Read only, so a weight can never be changed from Pulse.", tint:"#f0c04b", status:"Connected", statusKind:"ok",
   glyph:"M3.5 18.5h17 M5.5 18.5v-6h13v6 M8 12.5V9.5h8v3 M12 9.5V6",
   lastSync:"12:46, imported INT-1048", usage:"11 tickets today", auth:"Read-only service account", scopes:["Read"], access:"Read"},
  {name:"Plant / SCADA data", blurb:"Throughput, digester feed, gas output and alarms, read once a minute. Pulse reports on the plant and never controls it.", tint:"#5fe0a8", status:"Connected", statusKind:"ok",
   glyph:"M3.5 20.5h17 M5 20.5V11l4.5 3v-3l4.5 3V6.5h4v14 M16 4v2.5",
   lastSync:"Live, 1 min ago", usage:"42 tags every 60 s", auth:"Secure gateway, read only", scopes:["Read"], access:"Read"},
  {name:"Accounting", blurb:"Customers, invoices and payment status. Pulse adjusts invoice lines after a weighbridge review is approved.", tint:"#8fa6ff", status:"Connected", statusKind:"ok",
   glyph:"M4.5 12a7.5 7.5 0 0 1 12.8-5.3 M19.5 12a7.5 7.5 0 0 1-12.8 5.3 M17.3 4v3.3h-3.3 M6.7 20v-3.3H10",
   lastSync:"6 min ago", usage:"214 invoices this month", auth:"OAuth 2.0", scopes:["Read","Write"], access:"Read + Write"},
  {name:"Timesheets / HR", blurb:"Shifts, hours and overtime. Approved overtime is posted to the payroll period from Pulse.", tint:"#b9a6ee", status:"Connected", statusKind:"ok",
   glyph:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7v5l3.2 2",
   lastSync:"14 min ago", usage:"12 timesheets today", auth:"API key", scopes:["Read","Write"], access:"Read + Write"},
  {name:"Documents", blurb:"Service agreements, permits, certificates and SOPs, indexed so Pulse can read them and file new ones against the right record.", tint:"#7fd8a4", status:"Connected", statusKind:"ok",
   glyph:"M6.4 3.6h7.4l4.2 4.2v12.6H6.4V3.6Z M13.4 3.8v4.2h4.2 M9 12.4h6 M9 16h4",
   lastSync:"9 min ago", usage:"1,284 files indexed", auth:"OAuth 2.0", scopes:["Read","Write"], access:"Read + Write"}
];

/* Background catalogue. Each entry is pure CSS so a tile is the real thing at
   thumbnail size, not a picture of it. */
const BG_DEFS = [
  {id:"bloom", name:"Bloom", cat:"Signature",
   css:"background:radial-gradient(60% 48% at 50% 34%, var(--accent-faint), transparent 72%), radial-gradient(44% 38% at 16% 84%, rgba(255,255,255,.05), transparent 70%)",
   thumb:"background:radial-gradient(62% 58% at 46% 34%, var(--accent-soft), transparent 74%), radial-gradient(50% 46% at 82% 84%, rgba(255,255,255,.08), transparent 72%), var(--surface-2)"},
  {id:"mist", name:"Mist", cat:"Signature",
   css:"background:radial-gradient(52% 44% at 24% 22%, rgba(255,255,255,.07), transparent 70%), radial-gradient(56% 46% at 80% 76%, rgba(255,255,255,.05), transparent 72%)",
   thumb:"background:radial-gradient(58% 52% at 24% 22%, rgba(255,255,255,.16), transparent 72%), radial-gradient(60% 54% at 82% 78%, rgba(255,255,255,.10), transparent 74%), var(--surface-2)"},
  {id:"grid", name:"Grid", cat:"Signature",
   css:"background-image:linear-gradient(var(--border) 1px, transparent 1px),linear-gradient(90deg, var(--border) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(62% 56% at 50% 46%, #000, transparent 78%);-webkit-mask-image:radial-gradient(62% 56% at 50% 46%, #000, transparent 78%)",
   thumb:"background-color:var(--surface-2);background-image:linear-gradient(var(--border-strong) 1px, transparent 1px),linear-gradient(90deg, var(--border-strong) 1px, transparent 1px);background-size:14px 14px"},
  {id:"none", name:"None", cat:"Signature", css:"", thumb:"background:var(--surface-2)"},

  {id:"aurora", name:"Aurora", cat:"Gradient",
   css:"background:radial-gradient(70% 52% at 18% 8%, var(--bloom-a), transparent 66%), radial-gradient(64% 48% at 84% 22%, var(--bloom-b), transparent 68%), radial-gradient(70% 60% at 50% 104%, var(--bloom-c), transparent 70%);filter:blur(24px)",
   thumb:"background:radial-gradient(72% 60% at 16% 6%, var(--bloom-a), transparent 68%), radial-gradient(66% 54% at 86% 24%, var(--bloom-b), transparent 70%), radial-gradient(74% 66% at 50% 108%, var(--bloom-c), transparent 72%), var(--surface-2)"},
  {id:"horizon", name:"Horizon", cat:"Gradient",
   css:"background:linear-gradient(180deg, transparent 0%, var(--accent-faint) 58%, transparent 100%), radial-gradient(90% 40% at 50% 72%, var(--accent-soft), transparent 70%)",
   thumb:"background:linear-gradient(180deg, var(--surface-2) 0%, var(--accent-faint) 58%, var(--surface-2) 100%), radial-gradient(90% 44% at 50% 74%, var(--accent-soft), transparent 70%)"},
  {id:"dusk", name:"Dusk", cat:"Gradient",
   css:"background:linear-gradient(200deg, var(--bloom-c) -10%, transparent 46%), linear-gradient(20deg, var(--bloom-b) -10%, transparent 52%);opacity:.5",
   thumb:"background:linear-gradient(200deg, var(--bloom-c) -12%, transparent 48%), linear-gradient(20deg, var(--bloom-b) -12%, transparent 54%), var(--surface-2)"},
  {id:"ember", name:"Ember", cat:"Gradient",
   css:"background:radial-gradient(60% 70% at 84% 96%, var(--bloom-a), transparent 64%), radial-gradient(50% 60% at 10% 96%, var(--bloom-c), transparent 66%)",
   thumb:"background:radial-gradient(64% 76% at 84% 100%, var(--bloom-a), transparent 66%), radial-gradient(54% 66% at 8% 100%, var(--bloom-c), transparent 68%), var(--surface-2)"},

  {id:"mesh", name:"Mesh", cat:"Abstract",
   css:"background-image:radial-gradient(var(--border-strong) 1px, transparent 1px);background-size:22px 22px;mask-image:radial-gradient(70% 62% at 50% 46%, #000, transparent 76%);-webkit-mask-image:radial-gradient(70% 62% at 50% 46%, #000, transparent 76%)",
   thumb:"background-color:var(--surface-2);background-image:radial-gradient(var(--border-strong) 1px, transparent 1px);background-size:8px 8px"},
  {id:"contour", name:"Contour", cat:"Abstract",
   css:"background:repeating-radial-gradient(circle at 30% 110%, transparent 0 22px, var(--border) 22px 23px);mask-image:radial-gradient(80% 70% at 40% 80%, #000, transparent 78%);-webkit-mask-image:radial-gradient(80% 70% at 40% 80%, #000, transparent 78%)",
   thumb:"background:repeating-radial-gradient(circle at 26% 116%, var(--surface-2) 0 9px, var(--border-strong) 9px 10px)"},
  {id:"weave", name:"Weave", cat:"Abstract",
   css:"background:repeating-linear-gradient(48deg, transparent 0 16px, var(--border) 16px 17px), repeating-linear-gradient(-48deg, transparent 0 16px, var(--border) 16px 17px);opacity:.7",
   thumb:"background-color:var(--surface-2);background-image:repeating-linear-gradient(48deg, transparent 0 7px, var(--border-strong) 7px 8px), repeating-linear-gradient(-48deg, transparent 0 7px, var(--border-strong) 7px 8px)"},
  {id:"halo", name:"Halo", cat:"Abstract",
   css:"background:repeating-radial-gradient(circle at 50% 50%, transparent 0 46px, var(--accent-line) 46px 47px);mask-image:radial-gradient(60% 60% at 50% 50%, #000, transparent 72%);-webkit-mask-image:radial-gradient(60% 60% at 50% 50%, #000, transparent 72%)",
   thumb:"background:repeating-radial-gradient(circle at 50% 50%, var(--surface-2) 0 11px, var(--accent-line) 11px 12px)"},
  {id:"drift", name:"Drift", cat:"Abstract",
   css:"background:conic-gradient(from 210deg at 32% 38%, var(--bloom-b), transparent 38%), conic-gradient(from 20deg at 76% 70%, var(--bloom-a), transparent 34%);filter:blur(30px);opacity:.6",
   thumb:"background:conic-gradient(from 210deg at 32% 38%, var(--bloom-b), transparent 38%), conic-gradient(from 20deg at 76% 70%, var(--bloom-a), transparent 34%), var(--surface-2)"},
  {id:"scan", name:"Scanlines", cat:"Abstract",
   css:"background:repeating-linear-gradient(0deg, var(--border) 0 1px, transparent 1px 7px);mask-image:linear-gradient(180deg, #000, transparent 88%);-webkit-mask-image:linear-gradient(180deg, #000, transparent 88%)",
   thumb:"background-color:var(--surface-2);background-image:repeating-linear-gradient(0deg, var(--border-strong) 0 1px, transparent 1px 5px)"}
];

const THEMES = [
  {id:"dark", label:"Dark", group:"Dark", bg:"#0b0c0b", surface:"#1a1c19", ink:"#f2f3ef", accent:"#c8f04b"},
  {id:"indigo", label:"Indigo", group:"Dark", bg:"#0a0b13", surface:"#1a1b26", ink:"#f0f1fa", accent:"#8b93ff"},
  {id:"slate", label:"Slate", group:"Dark", bg:"#100e0c", surface:"#211c17", ink:"#f4f0ea", accent:"#e8a14a"},
  {id:"plum", label:"Plum", group:"Dark", bg:"#100a10", surface:"#20151f", ink:"#f6eef4", accent:"#f077b0"},
  {id:"ember", label:"Ember", group:"Dark", bg:"#0b0b0b", surface:"#1c1714", ink:"#f7f3ef", accent:"#f4561a"},
  {id:"harbour", label:"Bia", group:"Dark", bg:"#061a20", surface:"#0e2a32", ink:"#f4f8f6", accent:"#3ed24b"},
  {id:"cargo", label:"Cargo", group:"Dark", bg:"#0a0a0a", surface:"#1a1c1a", ink:"#f2f5f2", accent:"#4ade80"},
  {id:"ocean", label:"Ocean", group:"Dark", bg:"#080e12", surface:"#141f25", ink:"#eaf4f8", accent:"#4fd4d0"},
  {id:"graphite", label:"Graphite", group:"Dark", bg:"#111112", surface:"#212124", ink:"#f4f4f5", accent:"#f4f4f5"},
  {id:"light", label:"Cream", group:"Light", bg:"#f4f2ed", surface:"#ffffff", ink:"#16181c", accent:"#0071e3"},
  {id:"warm", label:"Warm paper", group:"Light", bg:"#faf5ec", surface:"#fffdf9", ink:"#2a2016", accent:"#c9683f"},
  {id:"mist", label:"Mist", group:"Light", bg:"#eef1f4", surface:"#ffffff", ink:"#141e20", accent:"#0e9f6e"},
  {id:"sand", label:"Sand", group:"Light", bg:"#f6f1e6", surface:"#fffdf7", ink:"#221d12", accent:"#7d5fd6"}
];

const ADMIN_ICONS = {
  people:"M12 12.5a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z M5 20.2c.9-3.1 3.6-4.9 7-4.9s6.1 1.8 7 4.9",
  teams:"M9 12a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 12Z M16.5 12.5a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z M2.6 19.6c.8-2.8 3.2-4.4 6.4-4.4s5.6 1.6 6.4 4.4 M17 15.4c2.2.4 3.7 1.8 4.3 4.2",
  structure:"M4.5 20V6.4A1.4 1.4 0 0 1 5.9 5h6.2a1.4 1.4 0 0 1 1.4 1.4V20 M13.5 10.5h4.6A1.4 1.4 0 0 1 19.5 12v8 M3 20h18 M7.5 8.5h2.5 M7.5 12h2.5",
  shield:"M12 3.6 19.5 6v6.1c0 4-3.1 6.9-7.5 8.3-4.4-1.4-7.5-4.3-7.5-8.3V6L12 3.6Z M9.2 12.2l2 2 3.6-3.7",
  agent:"M2 12h4l2.5-6 3.5 12 3-8 2 2h5",
  flow:"M18.5 8.5A5 5 0 0 0 8.9 7.3 3.8 3.8 0 0 0 6 14.6 M8 17.5l3.2 3.2 M11.2 20.7l3.2-3.2 M11.2 20.7V9.6",
  plug:"M9 3.5v5 M15 3.5v5 M6.5 8.5h11v3a5.5 5.5 0 0 1-11 0v-3Z M12 17v3.5",
  modules:"M6.6 4.4h10.8a2.2 2.2 0 0 1 2.2 2.2v10.8a2.2 2.2 0 0 1-2.2 2.2H6.6a2.2 2.2 0 0 1-2.2-2.2V6.6a2.2 2.2 0 0 1 2.2-2.2Z M4.4 9.6h15.2 M9.6 19.6V9.6",
  health:"M3 12.5h3.4l2-5 3 10 2.2-5H21",
  lock:"M6.5 10.5h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19v-7a1.5 1.5 0 0 1 1.5-1.5Z M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3",
  audit:"M8 3.5h8l3.5 3.5v13a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 6 3.5h2Z M9 12h6 M9 16h4",
  brand:"M12 3.5 14.6 9l6.4.6-4.8 4.2 1.4 6.2-5.6-3.3-5.6 3.3 1.4-6.2L3 9.6 9.4 9 12 3.5Z",
  navCollections:"M3.5 7.5h10v8.5h-10V7.5Z M13.5 10.5h3.6l3.4 3.2V16h-7 M7 18.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z M17 18.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z",
  navFleet:"M4 16.5V8.2A1.7 1.7 0 0 1 5.7 6.5h8.6A1.7 1.7 0 0 1 16 8.2v8.3 M16 10h2.6l2.4 3v3.5h-5 M4 16.5h2 M10 16.5h4 M8 18.4a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z M18 18.4a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z M4 11h12",
  navPlant:"M3.5 20.5h17 M5 20.5V11l4.5 3v-3l4.5 3V6.5h4v14 M16 4v2.5 M7.5 17h1.5 M11.5 17H13",
  bell:"M6 8.5a6 6 0 0 1 12 0c0 6.5 2.6 8.5 2.6 8.5H3.4S6 15 6 8.5Z M10.3 20.5a1.94 1.94 0 0 0 3.4 0",
  data:"M4.5 7.5c0-1.7 3.4-3 7.5-3s7.5 1.3 7.5 3-3.4 3-7.5 3-7.5-1.3-7.5-3Z M4.5 7.5v9c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-9 M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"
};

const ADMIN_CARDS = [
  {id:"people", group:"ORGANISATION", title:"People & access", icon:"people", tint:"#6ad0f0",
   blurb:"Invite, suspend and offboard the people who use Pulse.",
   tags:["62 people","7 teams","Huntstown"], badge:"2 waiting", badgeKind:"warn",
   footer:"Last login checked 4 minutes ago", action:"Review 2 invites",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Add, invite or remove employees","",""],["Create teams and departments","7 teams"],["Assign managers","8 reporting lines"],
     ["Set sites","Huntstown, Co. Dublin"],["Suspend accounts","1 suspended"],["View last login","62 people tracked"]]},
  {id:"structure", group:"ORGANISATION", title:"Company structure", icon:"structure", tint:"#f0c04b",
   blurb:"The company, the site, and who reports to whom.",
   tags:["Bia Energy Ltd","Huntstown","EUR"],
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Company","Bia Energy Ltd"],["Site","Huntstown, Co. Dublin"],["Departments","Operations, Logistics, Plant, Compliance, Commercial, Agri"],
     ["Teams","7"],["Reporting lines","8"],["Working hours","Plant 24/7 · Logistics 05:00 to 19:00"],["Holidays","Irish public holidays"],
     ["Default currency and timezone","EUR · Europe/Dublin"]]},

  {id:"bia-teams", group:"TEAMS", title:"Teams", icon:"teams", tint:"#3ed24b",
   blurb:"Seven teams at Huntstown, each with a lead and a default permission scope.",
   tags:["7 teams","62 people","1 site"],
   footer:"Team scope decides what each person sees by default", action:"Add a team",
   listLabel:"TEAMS AT HUNTSTOWN",
   rows:[["Logistics","24 people · Group Logistics Manager"],["Plant","11 people · Plant Manager"],["Weighbridge","4 people · Weighbridge Manager"],
     ["Fleet workshop","5 people · Workshop supervisor"],["Compliance & H&S","3 people · H&S and Compliance"],
     ["Commercial","9 people · Group Commercial Director"],["Agri","6 people · Agri Lead"]]},

  {id:"teams", group:"PERMISSIONS", title:"Roles & permissions", icon:"shield", tint:"var(--accent)",
   blurb:"Role-based access: what each role can see and do, and on which records.",
   tags:["5 roles","9 grants","3 scopes"],
   heroLabel:"THE QUESTION THIS ANSWERS", heroAction:"Show me what someone can access",
   heroText:"Pick a person and see every record, action and export they can reach, resolved through their role and scope rather than guessed from the menus.",
   footer:"Preview Pulse as another user", action:"Open preview",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Role templates","Admin, Manager, Operator, Driver, External"],["View, edit, export and delete access","per grant"],
     ["Restrict by team, or to own jobs and vehicle","3 scopes"],["Approval rights","overtime, route changes, weight variances"],
     ["Financial metrics limited to Admin and Commercial","", true],["Payroll visible to HR and own record only","", true],["Preview Pulse as another user",""]]},
  {id:"driver-role", group:"PERMISSIONS", title:"Role example: Driver", icon:"navFleet", tint:"#f0803a",
   blurb:"A driver sees their own day in full, and nothing commercial.",
   tags:["Driver role","Own jobs and vehicle","24 people"],
   heroLabel:"HOW IT RESOLVES", heroAction:"Preview as Marek Kowalski",
   heroText:"Marek Kowalski opens Pulse in the cab and sees BULK-204, his route, BIA-14, his dockets and his timesheet. Company revenue, other people's payroll and executive metrics never load, not even as hidden fields.",
   footer:"Scope: own jobs and vehicle", action:"Edit role",
   listLabel:"DRIVER ROLE · CAN ACCESS / CANNOT ACCESS",
   rows:[["Own jobs","today and upcoming", true],["Own route","live map, stops and ETAs", true],["Own vehicle","checks, defects and fuel", true],
     ["Own documents","dockets, licence and CPC", true],["Own timesheet","submit and view", true],
     ["Company revenue","no access", false],["Other employees' payroll","no access", false],["Executive financial metrics","no access", false]]},

  {id:"integrations", group:"SYSTEMS", title:"Integrations", icon:"plug", tint:"#6ad0f0",
   blurb:"Every connected system, which way data flows, and what Pulse is allowed to write back.",
   tags:["8 connected","6 read + write","2 read only"], badge:"All live", badgeKind:"ok",
   footer:"Weighbridge and Plant / SCADA data are read only by design", action:"View activity",
   listLabel:"CONNECTIONS",
   rows:[["Email","read + write"],["Calendar","read + write"],["Fleet / telematics","read + write"],["Weighbridge","read only"],
     ["Plant / SCADA data","read only"],["Accounting","read + write"],["Timesheets / HR","read + write"],["Documents","read + write"]]},
  {id:"modules", group:"SYSTEMS", title:"Modules & configuration", icon:"modules", tint:"#f0c04b",
   blurb:"Turn modules on, and make Pulse speak Bia's own words.",
   tags:["6 modules","17 record types","3 renamed terms"],
   heroLabel:"TERMINOLOGY", heroAction:"Edit terminology",
   heroText:"Organisation reads as Customer, Location reads as Site and Task reads as Job everywhere in the interface, including what Pulse says back to you.",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Enabled modules","Collections, Fleet, Plant, People, Customers, Compliance"],["Record types","17 on the spine"],
     ["Rename business terminology","3 overridden"],["Custom fields","14 fields"],["Configure statuses","8 sets"],
     ["Required information","per record type"],["Form layouts","5 layouts"]]},
  {id:"health", group:"SYSTEMS", title:"Data health", icon:"health", tint:"#e2705c",
   blurb:"What is wrong with the data, how bad it is, and the fix.",
   tags:["6 issue types","96 records affected"], badge:"23 duplicates", badgeKind:"warn",
   footer:"Last scanned 12 minutes ago", action:"Fix 2 automatically",
   listLabel:"ISSUES FOUND",
   trend:[188,164,151,132,118,104,96],
   bySeverity:[["High","31",RED],["Medium","17",AMBER],["Low","48",DIM]],
   issues:[["Duplicate customer sites","23","high","Merge on matching Eircode and customer","Fix automatically"],
     ["Missing site contacts","8","high","8 sites have no on-site contact for collection issues","Review"],
     ["Tickets without a docket","6","medium","Weighbridge tickets with no matched waste transfer docket","Review"],
     ["Out-of-date vehicle records","11","medium","Mileage not refreshed from telematics in 7 days","Fix automatically"],
     ["Unmatched invoice lines","19","low","Invoice lines with no weighbridge ticket attached","Review"],
     ["Records needing review","29","low","Flagged by an agent as inconsistent","Review"]],
   rows:[]},

  {id:"security", group:"GOVERNANCE", title:"Security", icon:"lock", tint:"#8fa6ff",
   blurb:"Sign-in, sessions, devices and the keys that reach the API.",
   tags:["SSO on","2FA enforced","2 API keys"], badge:"1 advisory", badgeKind:"warn",
   footer:"1 security recommendation open", action:"Review",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Single sign-on","company identity provider", true],["Two-factor authentication","enforced", true],
     ["Login policies","12-hour session on shared yard devices"],["Active sessions","58"],["Approved devices","49, including 16 cab tablets"],
     ["IP restrictions","off", false],["Security alerts","on", true],["API keys","2 active"],
     ["Data retention rules","7 years"]]},
  {id:"audit", group:"GOVERNANCE", title:"Audit log", icon:"audit", tint:"#9d8cf5",
   blurb:"A locked history of who changed what. Searchable, exportable, never editable.",
   tags:["Append-only","7-year retention"],
   footer:"Nobody can edit or delete entries", action:"Export",
   listLabel:"WHAT IS RECORDED",
   rows:[["Permission changes","12 this month"],["Employee access","96"],["Data exports","4"],
     ["Integration changes","3"],["Agent actions","2,140"],["Write-backs to connected systems","318"],["Deleted records","1"],["Admin changes","19"]]},
  {id:"datamgmt", group:"GOVERNANCE", title:"Data management", icon:"data", tint:"#5fe0a8",
   blurb:"Import, export, restore and, carefully, delete.",
   tags:["Backup 02:00","30-day restore"],
   footer:"Last backup completed 02:00 today", action:"Run backup",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Import data","CSV, Weighbridge, Accounting"],["Export data","full or per module"],["Backup status","healthy · 02:00 daily"],
     ["Restore previous versions","30 days available"],["Merge records","23 candidates"],
     ["Data retention","7 years"],["Delete company data","requires two admins"]]},

  {id:"agents", group:"AI CONTROLS", title:"Agents & AI controls", icon:"agent", tint:"var(--accent)",
   blurb:"What agents may read, what they may propose, and where a person must approve.",
   tags:["6 agents","318 actions today","Writes need approval"],
   heroLabel:"GLOBAL CONTROL", heroAction:"Pause every agent",
   heroText:"One switch stops every agent immediately. Anything mid-run finishes its current step and then holds. Nothing is written back to Fleet, Accounting or any other system without a person approving it.",
   footer:"Every write-back needs a yes", action:"Review limits",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Approved agent roles","6 approved"],["Data agents can read","by permission"],
     ["Actions agents can take","read · propose · write back"],["Approval before any write-back","every connected system", true],
     ["Spending and usage limits","€40/month cap"],["Agent memory and retention","90 days"]]},
  {id:"wf", group:"AI CONTROLS", title:"Workflow controls", icon:"flow", tint:"#9d8cf5",
   blurb:"The guardrails, not the builder. That lives under Work.",
   tags:["Managers only","3 approval rules","Retry twice"],
   footer:"Building workflows happens in Work", action:"Open Work",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Who can create workflows","Managers only"],["Maximum autonomy","proposes, never writes alone", true],
     ["Approval rules","3 configured"],["Failure handling","retry twice, then notify"],
     ["Usage limits","500 runs/day"],["Global pause","all workflows", true],["Default notification settings","inbox only"]]},
  {id:"notif", group:"AI CONTROLS", title:"Notifications", icon:"bell", tint:"#f0994b",
   blurb:"Which events reach people, on which channel, and when not to.",
   tags:["Inbox","Email","Quiet 20:00 to 05:00"],
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Which events trigger notifications","16 of 24 events"],["Email","", true],["Mobile push to drivers","", true],
     ["SMS","", false],["In-app","", true],["Escalation rules","after 30 min for at-risk collections"],
     ["Quiet hours","20:00 to 05:00, office roles"],["Daily and weekly summaries","06:30 daily"]]},

  {id:"brand", group:"EXPERIENCE", title:"Branding", icon:"brand", tint:"var(--accent)",
   blurb:"Logo, accent colour, templates and how agents appear.",
   tags:["Bia green accent","3 templates"],
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Company logo","bia-energy-mark.svg"],["Pulse accent colour","#3ED24B"],
     ["Email templates","4"],["Document templates","3"],["Agent appearance","12 faces · 6 shells"],
     ["Customer-facing portal branding","on", true]]},
  {id:"appearance", group:"EXPERIENCE", title:"Appearance & themes", icon:"brand", tint:"#6ad0f0",
   blurb:"Pick a light or dark theme for how Pulse looks to you.",
   tags:["8 themes","4 dark","4 light"],
   listLabel:"THEMES", rows:[]}
];

const ADMIN_GROUPS = [
  ["ORGANISATION", "repeat(3,1fr)", "Organisation"],
  ["TEAMS", "repeat(3,1fr)", "Teams"],
  ["PERMISSIONS", "repeat(3,1fr)", "Permissions"],
  ["SYSTEMS", "repeat(3,1fr)", "Systems"],
  ["GOVERNANCE", "repeat(3,1fr)", "Governance"],
  ["AI CONTROLS", "repeat(3,1fr)", "AI Controls"],
  ["EXPERIENCE", "repeat(3,1fr)", "Experience"]
];

/* ---- activity feeds (Bia Energy) ----
   Each event: [title, note, actor, related record, source system, status, clock?]
   A clock ("13:04") pins a seeded event to that demo time; unclocked events
   are the pool the live view streams from. Source names are functional
   systems, never vendor products. */
const SRC_TINT = {Email:"#f07a9d", Pulse:"var(--accent)", Fleet:"#6ad0f0", Weighbridge:"#f0c04b",
  Plant:"#5fe0a8", Accounting:"#8fa6ff", Timesheets:"#f0994b", Documents:"#c8b4f0", Calendar:"#9fd6f0", Agent:"var(--accent)"};
const SRC_ABBR = {Email:"EM", Pulse:"PU", Fleet:"FL", Weighbridge:"WB", Plant:"PT", Accounting:"AC",
  Timesheets:"TS", Documents:"DC", Calendar:"CA", Agent:"AI"};

const DATA_EVENTS = [
  ["INT-1048 recorded at 19.27 t net","BIA-14, FreshFields Foods. Gross 37.42 t, tare 18.15 t. Docket WTD-58812.","Weighbridge","INT-1048","Weighbridge","completed","12:58"],
  ["Waste transfer docket filed","WTD-58811 for INT-1047 matched to GreenMart Clonsilla and attached to COL-1838.","Documents","INT-1047","Documents","completed","12:44"],
  ["BIA-07 hydraulic warning received","Tail-lift ram pressure fault reported by telematics near Johnstown, N7. Vehicle removed from service.","Fleet System","BIA-07","Fleet","failed","12:34"],
  ["Extra collection requested","CityFresh Swords asked for an extra Dolav pickup on Thursday. Added to the schedule draft.","Email","CityFresh","Email","completed","12:10"],
  ["Processing rate returned to target","Digester 2 feed restored after a 22 min pause. Running at 11.9 t/h.","Plant System","Digester 2","Plant","completed","11:58"],
  ["INT-1049 in the weighbridge queue","Third-party haulier 08-D-55120, 9.60 t net expected. Awaiting tip.","Weighbridge","INT-1049","Weighbridge","working"],
  ["Invoice lines drafted","19 completed collections posted as draft invoice lines for September.","Accounting","19 collections","Accounting","completed"],
  ["Timesheets synced","12 timesheets in from the driver app. 5 carry overtime for review.","Timesheets / HR","Logistics","Timesheets","completed"],
  ["Biomethane export reading","1,340 Nm³/h to the grid. 172.4 MWh so far today.","Plant System","Grid injection","Plant","completed"],
  ["Telematics position update","BIA-14 at Huntstown weighbridge, 74% fuel, ready for dispatch.","Fleet System","BIA-14","Fleet","completed"],
  ["Driver sign-off received","M. Kowalski signed the FreshFields Foods load at 12:46.","Documents","WTD-58812","Documents","completed"],
  ["Digestate load booked out","DEL-311 for Kildare Tillage Partners, 22.0 t, contract haulier 16:00.","Plant System","DEL-311","Plant","working"],
  ["BIA-16 left Drogheda","TNK-043 Boyne Valley Dairies, 20.1 t expected. ETA Huntstown 15:20.","Fleet System","TNK-043","Fleet","completed"]
];

const PEOPLE_EVENTS = [
  ["Natalia Biancha opened INT-1048","Pulled the docket and driver sign-off to check the +1.70 t variance.","Natalia Biancha","INT-1048","Weighbridge","awaiting","12:59"],
  ["Sean Kelly completed COL-1838","GreenMart Clonsilla. 2.7 t collected against 2.6 t expected.","Sean Kelly","COL-1838","Fleet","completed","12:41"],
  ["Aoife Brennan accepted INT-1046","CityFresh load checked and sent to depackaging line 2.","Aoife Brennan","INT-1046","Weighbridge","completed","12:32"],
  ["Ciarán Walsh completed COL-1849","CityFresh Swords depot clear-out. 26.1 t across several Dolavs.","Ciarán Walsh","COL-1849","Fleet","completed","12:30"],
  ["Dragos Busuioc confirmed BIA-10 service","Scheduled service confirmed with the workshop. Back in service Thursday.","Dragos Busuioc","BIA-10","Fleet","completed","11:40"],
  ["Overtime submitted","Marek Kowalski submitted 1.8 h for the BULK-201 run. Waiting on approval.","Marek Kowalski","Timesheet","Timesheets","awaiting"],
  ["Gytis Meskauskas signed off the digester check","Digester 2 feed restored and logged against the plant record.","Gytis Meskauskas","Digester 2","Plant","completed"],
  ["Paul Doyle started loading TNK-041","Dublin Foods Ballymount. Liquid food waste, 21.5 t expected.","Paul Doyle","TNK-041","Fleet","completed"],
  ["Ricarte Nazerenco held a test slot","BIA-12 roadworthiness test held for Thursday 08:00 pending approval.","Ricarte Nazerenco","BIA-12","Calendar","awaiting"],
  ["Eoin Farrell departed Sandyford","COL-1861 GreenMart complete. Next stop in the sequence is Dún Laoghaire.","Eoin Farrell","COL-1861","Fleet","completed"],
  ["Viktor Horvat cleared a pallet backlog","Depackaging line 1 back to full rate after the INT-1048 pallets.","Viktor Horvat","Depackaging line 1","Plant","completed"],
  ["Stephen Murphy arrived Blanchardstown","COL-1842 GreenMart. On site, 2.4 t expected.","Stephen Murphy","COL-1842","Fleet","completed"]
];

const AI_EVENTS = [
  ["Dispatch Agent prepared reassignment for BULK-204","BIA-07 → BIA-14 cuts the delay from 42 to 27 min. Waiting on your yes.","Dispatch Agent","BULK-204","Fleet","awaiting","13:04"],
  ["Ops Watchdog detected 1.70 t expected-weight variance","INT-1048 net 19.27 t against 17.57 t expected. Parked for weighbridge review.","Ops Watchdog","INT-1048","Weighbridge","awaiting","12:54"],
  ["Fleet Agent drafted a workshop ticket","BIA-07 hydraulic warning logged as WS-2291 for the tail-lift ram.","Fleet Agent","BIA-07","Fleet","completed","12:36"],
  ["Dispatch Agent updated collection ETA for CityFresh","COL-1851 Swords now due 14:35. Email sent to Hannah Lyons.","Dispatch Agent","CityFresh","Email","completed","12:21"],
  ["Briefing Agent posted the morning brief","34 collections scheduled, fleet 15 of 16 available. Delivered to Dragos.","Briefing Agent","Dragos Busuioc","Agent","completed","06:30"],
  ["Intake Agent matched dockets","WTD-58810 and WTD-58811 matched to weighbridge tickets and collections.","Intake Agent","2 dockets","Documents","working"],
  ["Productivity Agent refreshed the model","Logistics at 91% today. Productivity Model is configurable during onboarding.","Productivity Agent","Logistics","Timesheets","working"],
  ["Compliance Agent checked expiries","BIA-12 roadworthiness in 3 days. Driver CPC for Paul Doyle in 19 days.","Compliance Agent","BIA-12","Documents","working"],
  ["Dispatch Agent resequenced a draft route","COL-1858 moved behind COL-1861 in the plan. Waiting on your yes.","Dispatch Agent","COL-1858","Fleet","awaiting"],
  ["Ops Watchdog checked the fleet","14 of 16 vehicles available. No new faults since 12:34.","Ops Watchdog","Fleet","Fleet","working"],
  ["Intake Agent reconciled INT-1047","GreenMart 2.70 t net against 2.60 t expected. Inside tolerance, accepted.","Intake Agent","INT-1047","Weighbridge","completed"],
  ["Compliance Agent chased a docket signature","WTD-58807 for Northside Distribution sent back for a customer signature.","Compliance Agent","WTD-58807","Email","working"]
];

const STREAM_DEFS = [
  {id:"data", title:"Systems", sub:"Fleet, weighbridge, plant and documents", pool:DATA_EVENTS, every:3200,
   tint:"#6ad0f0", icon:"M4.5 7.5c0-1.7 3.4-3 7.5-3s7.5 1.3 7.5 3-3.4 3-7.5 3-7.5-1.3-7.5-3Z M4.5 7.5v9c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-9 M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"},
  {id:"people", title:"People", sub:"Drivers, operators and managers", pool:PEOPLE_EVENTS, every:6400,
   tint:"#f0c04b", icon:"M12 12.5a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z M5 20.2c.9-3.1 3.6-4.9 7-4.9s6.1 1.8 7 4.9"},
  {id:"ai", title:"Agents", sub:"What the agents did", pool:AI_EVENTS, every:4600,
   tint:"var(--accent)", icon:"M2 12h4l2.5-6 3.5 12 3-8 2 2h5"}
];

const NAV = [
  {label:"Home", icon:"helios", page:"Home"},
  {label:"Agents", icon:"navAgents", page:"Agents"},
  {label:"Dashboard", icon:"navDash", page:"Dashboard", dot:true},
  {label:"Collections", icon:"navCollections", page:"Collections", dot:true},
  {label:"Fleet", icon:"navFleet", page:"Fleet", dot:true},
  {label:"Plant", icon:"navPlant", page:"Plant"},
  {label:"People", icon:"people", page:"People"},
  {label:"Customers", icon:"orgs", page:"Customers"},
  {label:"Compliance", icon:"approvals", page:"Compliance"},
  {label:"Work", icon:"navWork", page:"Work"},
  {label:"Records", icon:"navRecords", page:"Records"},
  {label:"Activity", icon:"pulseLine", page:"Activity", dot:true}
];

/* Bia operational modules: each gets its own top-bar tabs. */
const MODULE_TABS = {
  Collections:["Overview","Live Jobs","Schedule","Routes","Exceptions","History"],
  Fleet:["Overview","Vehicles","Live Fleet","Maintenance","Inspections","Costs"],
  Plant:["Overview","Intake","Processing","Output","Weighbridge","Exceptions"],
  People:["Overview","Team","Roster","Timesheets","Productivity","Availability"],
  Customers:["Overview","Accounts","Sites","Service","Issues"],
  Compliance:["Overview","Vehicles","Waste","Documents","Audits","Expiries"]
};

/* Needs attention: the five Home items from story.ts ATTENTION, in the InboxItem
   shape (what happened, why it matters, what I can do). `nav` is the module and
   tab the item opens; `decide` is the shared-store approval its action writes. */
const ITEMS = {
  bia07:{kind:"Alert", importance:"critical", icon:ICONS.navFleet, age:"12:34",
    title:"BIA-07 fault",
    why:"Artic Curtainsider. Hydraulic warning. Route BULK-204 affected, 3 collections potentially delayed.",
    detail:"Telematics reported a hydraulic pressure warning on the tail-lift ram near Johnstown on the N7. The vehicle is off road and Fleet Agent has drafted workshop ticket WS-2291. Dispatch Agent has BIA-14 ready as the replacement.",
    actionLabel:"Open in Fleet", secondaryLabel:"Review reassignment", group:"Alerts", nav:["Fleet","Overview"],
    fields:[{k:"Vehicle",v:"BIA-07 · 201-KE-3390"},{k:"Type",v:"Artic Curtainsider"},{k:"Route",v:"BULK-204 Naas"},{k:"Source",v:"Fleet System"}],
    history:[{when:"Today 12:34",text:"Hydraulic warning received from telematics"},{when:"Today 12:36",text:"Workshop ticket WS-2291 drafted by Fleet Agent"}]},
  bulk204:{kind:"Approval", importance:"high", icon:ICONS.navCollections, age:"13:04",
    title:"FreshFields Foods, BULK-204",
    why:"18.6 t bulk collection. ETA slipping by 42 minutes. Customer notified automatically.",
    detail:"Dispatch Agent has prepared a reassignment from BIA-07 to BIA-14, which cuts the delay to 27 minutes with the same driver. Approving writes the change back to the Fleet System and sends FreshFields Foods the new ETA.",
    actionLabel:"Approve reassignment", secondaryLabel:"View route", group:"Approvals", nav:["Collections","Live Jobs"], decide:"reassign204",
    fields:[{k:"Customer",v:"FreshFields Foods, Naas"},{k:"Expected",v:"18.6 t"},{k:"Vehicle",v:"BIA-07 → BIA-14"},{k:"Delay",v:"+42 min → +27 min"}],
    history:[{when:"Today 12:34",text:"BIA-07 removed from service"},{when:"Today 13:04",text:"Reassignment prepared by Dispatch Agent"}]},
  int1048:{kind:"Approval", importance:"high", icon:ICONS.navPlant, age:"12:54",
    title:"INT-1048 weight variance",
    why:"Net weight differs from expected by 1.70 t. Requires weighbridge review.",
    detail:"BIA-14 tipped the FreshFields Foods load at 12:46. Gross 37.42 t, tare 18.15 t, net 19.27 t against 17.57 t expected. Docket WTD-58812, customer reference, driver sign-off and weighbridge ticket are attached.",
    actionLabel:"Review in Weighbridge", secondaryLabel:"Accept at 19.27 t", group:"Approvals", nav:["Plant","Weighbridge"],
    fields:[{k:"Ticket",v:"INT-1048"},{k:"Net",v:"19.27 t"},{k:"Expected",v:"17.57 t"},{k:"Variance",v:"+1.70 t"}],
    history:[{when:"Today 12:46",text:"Weighed in at Huntstown"},{when:"Today 12:54",text:"Variance flagged by Ops Watchdog"}]},
  bia12:{kind:"Task", importance:"high", icon:ICONS.approvals, age:"3 days",
    title:"BIA-12 inspection",
    why:"Inspection due in 3 days. Unavailable if not completed.",
    detail:"Annual roadworthiness test for the Support Vehicle on Dublin 15 bin swaps. Fleet Agent found a workshop slot on Thursday at 08:00.",
    actionLabel:"Book Thursday 08:00", secondaryLabel:"Open Compliance", group:"Work", nav:["Compliance","Expiries"], decide:"bia12",
    fields:[{k:"Vehicle",v:"BIA-12 · 221-D-6045"},{k:"Due",v:"2 Oct"},{k:"Slot",v:"Thu 08:00"},{k:"Owner",v:"Fleet"}],
    history:[{when:"Today 07:00",text:"Flagged by the daily expiry check"}]},
  overtime:{kind:"Approval", importance:"normal", icon:ICONS.people, age:"12:00",
    title:"Timesheet approval",
    why:"6.5 overtime hours awaiting approval in Logistics.",
    detail:"Five drivers ran long on bulk and tanker routes today. Approving posts the hours to payroll period 40 in Timesheets / HR.",
    actionLabel:"Approve 6.5 h", secondaryLabel:"Open Timesheets", group:"Approvals", nav:["People","Timesheets"], decide:"overtime",
    fields:[{k:"Team",v:"Logistics"},{k:"Hours",v:"6.5 h"},{k:"People",v:"5 drivers"},{k:"Period",v:"Payroll 40"}],
    history:[{when:"Today 12:00",text:"Submitted from the driver app"}]}
};
const ORDER = ["bia07","bulk204","int1048","bia12","overtime"];

/* Pulse answers. actions: [label, primary, go?] where go = {page, tab?, ...state}
   navigates instead of asking. `decide` writes an approval to the shared store;
   `decideKey` hides the confirm card once that approval has been made. */
const BIA_S = BIA_STORY;
const ANSWERS = {
  wrong:{tool:"ops_exceptions_find", effect:"read",
    text:"Four of today's 34 collections are at risk, and four other things need a decision. BIA-07 is off road with a hydraulic warning, which puts BULK-204 for FreshFields Foods 42 minutes late. INT-1048 weighed 1.70 t over expected. BIA-12 has an inspection due in 3 days, and 6.5 overtime hours in Logistics are waiting on approval.",
    cols:["Item","Where","Impact","Next step"],
    rows:[["BULK-204","FreshFields, Naas","+42 min","Reassign to BIA-14"],["COL-1858","GreenMart, Tallaght","Sequence clash","Move behind COL-1861"],
      ["COL-1846","Liffey Hosp., Temple Bar","Break window","Delay break 18 min"],["TNK-044","Boyne Valley, Drogheda","No tanker","Manual review"],
      ["BIA-07","Johnstown, N7","Off road","Workshop WS-2291"],["INT-1048","Weighbridge","+1.70 t","Weighbridge review"],
      ["BIA-12","Huntstown yard","Due in 3 days","Book inspection"],["Overtime","Logistics","6.5 h","Approve"]],
    actions:[["Fix what you can",1],["Open Collections",0,{page:"Collections", tab:"Exceptions"}]]},
  fix:{tool:"dispatch_plan_prepare", effect:"write", confirm:true, decideKey:"dispatchPlan",
    confirmSummary:"Reassign BULK-204 from BIA-07 to BIA-14. Move COL-1858 behind COL-1861. Delay D. Quinn's break by 18 minutes within permitted limits. FreshFields Foods gets an updated ETA automatically. TNK-044 stays with you: no compatible tanker is free.",
    text:"I found 4 at-risk collections and can recover 3 of them. The dispatch plan reassigns BULK-204 to BIA-14, moves COL-1858 behind COL-1861 and delays one driver break by 18 minutes within permitted limits. FreshFields Foods would receive an updated ETA automatically. TNK-044 needs manual review because no compatible tanker is currently available. Nothing changes in the Fleet System until you approve.",
    actions:[["Approve changes",1],["Review plan",0,{page:"Work", workSection:"approvals", workDoc:"ap-plan", workDocTab:"work"}]]},
  approvePlan:{tool:"fleet.routes.update", effect:"write", decide:"dispatchPlan",
    text:"Updated in Fleet System. BULK-204 is now on BIA-14 with an ETA of 14:37, COL-1858 runs behind COL-1861, and D. Quinn's break moves 18 minutes later. FreshFields Foods and GreenMart Tallaght have their new ETAs by email. TNK-044 is still with you for manual review.",
    actions:[["View route",1,{page:"Collections", tab:"Live Jobs"}],["Open Fleet",0,{page:"Fleet", tab:"Live Fleet"}]]},
  bulk204:{tool:"collections_find", effect:"read",
    text:"BULK-204 is an 18.6 t bulk packaged food collection for FreshFields Foods in Naas. It was on BIA-07, which came off the road at 12:34. Left alone the ETA slips 42 minutes. Moving it to BIA-14, which has just tipped INT-1048 at Huntstown, brings that down to 27 minutes with the same driver.",
    actions:[["Approve reassignment",1],["View route",0,{page:"Collections", tab:"Live Jobs"}]]},
  approve204:{tool:"fleet.routes.update", effect:"write", decide:"reassign204",
    text:"Updated in Fleet System. BULK-204 is reassigned from BIA-07 to BIA-14, driver M. Kowalski unchanged. FreshFields Foods has the new ETA of 14:37 by email, and BIA-07 has workshop ticket WS-2291 open.",
    actions:[["View route",1,{page:"Collections", tab:"Live Jobs"}],["Open Fleet",0,{page:"Fleet", tab:"Overview"}]]},
  int1048:{tool:"weighbridge_tickets_find", effect:"read",
    text:"INT-1048 is the FreshFields Foods load BIA-14 tipped at 12:46. Gross 37.42 t, tare 18.15 t, net 19.27 t against 17.57 t expected, a +1.70 t variance. Docket WTD-58812, the customer reference, driver sign-off and weighbridge ticket are all attached. Nothing in the documents explains the difference yet.",
    cols:["Document","Reference","Status","Source"],
    rows:[["Waste transfer docket","WTD-58812","Attached","Documents"],["Customer reference","FreshFields, Naas","Matched","Email"],
      ["Driver sign-off","M. Kowalski 12:46","Signed","Documents"],["Weighbridge ticket","INT-1048","Review","Weighbridge"]],
    actions:[["Accept at 19.27 t",1],["Open Weighbridge",0,{page:"Plant", tab:"Weighbridge"}]]},
  acceptInt:{tool:"weighbridge.tickets.accept", effect:"write", decide:"int1048",
    text:"Updated in Weighbridge. INT-1048 is accepted at 19.27 t net with a variance note on docket WTD-58812. Accounting has the FreshFields Foods invoice line adjusted to 19.27 t.",
    actions:[["Open Weighbridge",0,{page:"Plant", tab:"Weighbridge"}]]},
  overtime:{tool:"timesheets_find", effect:"read",
    text:"6.5 overtime hours in Logistics are waiting on approval across five drivers, all on the longer bulk and tanker routes today. Approving posts them to payroll period 40 in Timesheets / HR.",
    cols:["Driver","Shift","Worked","Overtime"],
    rows:BIA_S.TIMESHEETS.filter(t => t.status === "Review").map(t => [t.name, t.shift.replace("–", "-"), t.worked.toFixed(1) + " h", t.overtime.toFixed(1) + " h"]),
    actions:[["Approve overtime",1],["Open Timesheets",0,{page:"People", tab:"Timesheets"}]]},
  approveOt:{tool:"timesheets.overtime.approve", effect:"write", decide:"overtime",
    text:"Updated in Timesheets / HR. 6.5 h of Logistics overtime is approved and posted to payroll period 40.",
    actions:[["Open Timesheets",0,{page:"People", tab:"Timesheets"}]]},
  productivity:{tool:"productivity_model_read", effect:"read",
    text:"Logistics productivity is 91% today, with on-time collection at 94% and fleet utilisation at 87%. The Productivity Model is configurable during onboarding, so treat this formula as a starting point rather than an agreed measure.",
    cols:["Person","Role","Productive","Index"],
    rows:BIA_S.TIMESHEETS.slice(0, 6).map(t => [t.name, t.role, t.productive.toFixed(1) + " of " + t.worked.toFixed(1) + " h", String(t.index)]),
    actions:[["Open Productivity",1,{page:"People", tab:"Productivity"}]]},
  tonnes:{tool:"collections_summary", effect:"read",
    text:"146.8 t collected so far today across 19 completed collections, with 11 still active and 4 at risk. Huntstown has taken in 153.4 t including third-party hauliers, and 149.7 t is accepted after weighbridge checks.",
    cols:["Collection type","Jobs today","Planned","Share"],
    rows:BIA_S.COLLECTION_TYPES.map(c => [c.type, String(c.count), c.tonnes.toFixed(1) + " t", Math.round(100 * c.count / 34) + "%"]),
    actions:[["Open Collections",1,{page:"Collections", tab:"Overview"}],["How is Huntstown doing?",0]]},
  plant:{tool:"plant_intake_read", effect:"read",
    text:"Huntstown has received 153.4 t today against a plan of 160 t, 94% of planned throughput. 149.7 t is accepted and 143.1 t processed. The digesters are exporting 1,340 Nm³/h of biomethane, 172.4 MWh so far today, with 118.6 t of digestate. INT-1049 is in the queue and INT-1048 is under review.",
    cols:["Measure","Today","Plan","Status"],
    rows:[["Intake","153.4 t","160 t","94%"],["Accepted","149.7 t","153.4 t","2 in review"],["Processed","143.1 t","148 t","11.9 t/h"],
      ["Biomethane","172.4 MWh","178 MWh","On target"],["Digestate","118.6 t","120 t","On target"]],
    actions:[["Open Plant",1,{page:"Plant", tab:"Overview"}],["Open Weighbridge",0,{page:"Plant", tab:"Weighbridge"}]]},
  fleet:{tool:"fleet_status_read", effect:"read",
    text:"14 of 16 vehicles are available. 11 are active, 3 are on standby, BIA-10 is in its scheduled service and BIA-07 is off road with a hydraulic fault. BIA-12 needs its roadworthiness test within 3 days or it comes off the road.",
    cols:["Vehicle","Type","Status","Next"],
    rows:[["BIA-07","Artic Curtainsider","Fault","Workshop WS-2291"],["BIA-10","Support Vehicle","Maintenance","Back Thursday"],
      ["BIA-12","Support Vehicle","Standby","Test due in 3 days"],["BIA-14","Artic Curtainsider","Standby","Proposed: BULK-204"]],
    actions:[["Book BIA-12 inspection",1],["Open Fleet",0,{page:"Fleet", tab:"Overview"}]]},
  book12:{tool:"calendar.bookings.create", effect:"write", decide:"bia12",
    text:"Updated in Calendar. The BIA-12 roadworthiness test is booked for Thursday at 08:00 in the Huntstown workshop.",
    actions:[["Open Compliance",0,{page:"Compliance", tab:"Expiries"}]]},
  customers:{tool:"customers_find", effect:"read",
    text:"Two customers are on watch today. FreshFields Foods because BULK-204 is running late, and Boyne Valley Dairies because TNK-044 has no compatible tanker. Everyone else is on schedule, and Hibernia College Catering is still onboarding.",
    cols:["Customer","Industry","Frequency","Status"],
    rows:BIA_S.CUSTOMERS.slice(0, 6).map(c => [c.name, c.industry, c.freq, c.status + (c.issue ? ": " + c.issue : "")]),
    actions:[["Open Customers",1,{page:"Customers", tab:"Overview"}]]},
  briefing:{tool:"briefing_compose", effect:"read",
    text:BIA_S.BRIEFING.join(" "),
    actions:[["What is going wrong today?",1],["Review reassignment",0,{page:"Work", workSection:"approvals", workDoc:"ap-204", workDocTab:"work"}]]},
  fallback:{tool:"pulse_search", effect:"read",
    text:"I can answer from everything connected to Pulse: collections, fleet telematics, the weighbridge, plant data, timesheets, documents and accounting. Ask about today's tonnes, a vehicle, a customer or a reference like BULK-204 or INT-1048.",
    actions:[["What is going wrong today?",0]]}
};

// Turns a plain-English filter name into a full dashboard area — the "primitive
// vibe-coding" bit: no real backend, just a seeded generator so the same phrase
// always produces the same numbers, with direction and vocabulary nudged by
// keywords in the text (expansion/growth trends up, risk/issue trends down, a
// region/cost/people/ops/customer word picks which metrics show).
function synthesizeCustomArea(name){
  const trimmed = (name || "").trim();
  if (!trimmed) return null;
  let seed = 0;
  for (let i = 0; i < trimmed.length; i++) seed = (seed * 31 + trimmed.charCodeAt(i)) >>> 0;
  const rnd = (n) => (((seed >>> (n % 24)) ^ (seed << ((n * 7) % 13))) >>> 0) % 997 / 997;
  const low = trimmed.toLowerCase();
  const has = (...words) => words.some(w => low.indexOf(w) > -1);
  const growth = has("expansion","growth","launch","scale","pilot","new site","open","opening","grow");
  const risk = has("risk","issue","delay","problem","complaint","fault","incident","churn","decline");
  const dir = risk ? -1 : (growth ? 1 : (rnd(2) > 0.45 ? 1 : -1));

  let vocab = "generic";
  if (has("ireland","region","dublin","leinster","kildare","meath","naas","navan","carlow","drogheda","swords","tallaght","wicklow","louth"))
    vocab = "region";
  else if (has("cost","spend","budget","saving","margin")) vocab = "cost";
  else if (has("staff","hiring","team","recruit","headcount")) vocab = "people";
  else if (has("fleet","vehicle","truck","tanker","route","driver","plant","digester","feedstock")) vocab = "ops";
  else if (has("customer","client","retention","account","retail","hospitality","campus")) vocab = "customer";

  const V = {
    region:   {labels:["Collections","On-time rate","Tonnes collected","Sites served"], unit:"TONNES · 30 DAYS"},
    cost:     {labels:["Spend","Cost per tonne","Savings found","Budget used"], unit:"EUR · 30 DAYS"},
    people:   {labels:["Headcount","Productive share","Overtime hours","Retention"], unit:"PEOPLE"},
    ops:      {labels:["Vehicles available","Utilisation","Breakdowns","Inspections due"], unit:"FLEET AND PLANT"},
    customer: {labels:["Active customers","SLA met","Exceptions","Collections"], unit:"CUSTOMERS"},
    generic:  {labels:["Volume","Rate","Tonnes","Coverage"], unit:"ACTIVITY · 30 DAYS"}
  }[vocab];

  const months = ["Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"];
  let v0 = 40 + Math.floor(rnd(1) * 220);
  const chart = months.map((m, i) => {
    v0 = Math.max(8, Math.round(v0 * (1 + dir * (0.03 + rnd(i + 3) * 0.07))));
    return [m, v0, String(v0)];
  });
  const metrics = V.labels.map((label, i) => {
    const val = 20 + Math.floor(rnd(i + 5) * 400);
    const pct = 2 + Math.round(rnd(i + 9) * 18);
    const up = dir > 0 ? rnd(i + 12) > 0.25 : rnd(i + 12) > 0.7;
    const bars = [0,1,2,3,4,5,6,7,8].map(k => 0.3 + rnd(i * 3 + k) * 0.7);
    return [label, i === 1 ? pct + "%" : String(val), (up ? "+" : "\u2212") + pct + (i === 1 ? "pt" : "%"), up ? "up" : "down", "vs last month", bars];
  });
  const capName = trimmed.replace(/\b\w/g, c => c.toUpperCase());
  const split = [
    [capName + ", direct", String(Math.round(v0 * 0.5)), "48%", 1],
    ["Existing routes", String(Math.round(v0 * 0.3)), "31%", 0],
    ["Everything else", String(Math.round(v0 * 0.2)), "21%", 0]
  ];
  const table = [1,2,3].map(w => [capName + ", week " + w, String(20 + Math.floor(rnd(20 + w) * 200)),
    (dir > 0 ? "+" : "\u2212") + (3 + Math.floor(rnd(23 + w) * 14)) + "%", "Tagged from records mentioning \u201c" + low + "\u201d"]);
  table.push(["Everything else", String(20 + Math.floor(rnd(30) * 200)), "+0%", "Baseline"]);
  return {
    id: trimmed, label: capName, color: "var(--accent)", owner: "CUSTOM FILTER",
    description: "Generated from \u201c" + trimmed + "\u201d. A plain-English filter, not a registered metric set. Refine it and Pulse will tighten this up.",
    kind: "columns", chartTitle: capName + " over time", chartUnit: V.unit,
    chart, splitTitle: "Where \u201c" + low + "\u201d shows up", split,
    tableCols: ["Item","Value","Change","Note"], table,
    metrics, legend: [capName, "Existing routes", "Other"]
  };
}

function pickAnswer(q){
  const s = q.toLowerCase();
  if (/approve (the )?(changes|plan|dispatch)/.test(s)) return ANSWERS.approvePlan;
  if (/approve (the )?reassign/.test(s)) return ANSWERS.approve204;
  if (/approve (the )?overtime|approve 6\.5/.test(s)) return ANSWERS.approveOt;
  if (/accept at|accept int/.test(s)) return ANSWERS.acceptInt;
  if (/book (bia-?12|.*inspection)|book thursday/.test(s)) return ANSWERS.book12;
  if (/fix|recover|sort (it|them|out)|delays|review plan/.test(s)) return ANSWERS.fix;
  if (/wrong|attention|at risk|problem|issue/.test(s)) return ANSWERS.wrong;
  if (/int-?1048|weigh|variance|docket/.test(s)) return ANSWERS.int1048;
  if (/bulk-?204|reassign|freshfields/.test(s)) return ANSWERS.bulk204;
  if (/overtime|timesheet/.test(s)) return ANSWERS.overtime;
  if (/productiv|utilisation|on.time/.test(s)) return ANSWERS.productivity;
  if (/tonne|collected|how much|volume/.test(s)) return ANSWERS.tonnes;
  if (/plant|huntstown|intake|throughput|digest|biomethane|gas/.test(s)) return ANSWERS.plant;
  if (/fleet|vehicle|truck|lorr|bia-?\d+|tanker/.test(s)) return ANSWERS.fleet;
  if (/customer|cityfresh|greenmart|boyne|client/.test(s)) return ANSWERS.customers;
  if (/changed|brief|morning|summary|know about|today/.test(s)) return ANSWERS.briefing;
  return ANSWERS.fallback;
}

const ORGS = [
  ["FreshFields Foods","Customer","€18,420","24 days","watch"],
  ["GreenMart","Customer","€22,160","18 days","active"],
  ["Boyne Valley Dairies","Customer","€31,870","41 days","watch"],
  ["Dublin Foods","Customer","€26,340","12 days","active"],
  ["Midland Hydraulics","Supplier","—","—","active"],
  ["Bia Energy Ltd","Company","—","—","active"]
];
const TEAMS = [
  ["Logistics","24 members","Dragos Busuioc","collections:route:update"],
  ["Plant","11 members","Gytis Meskauskas","plant:intake:view"],
  ["Weighbridge","4 members","Natalia Biancha","weighbridge:ticket:review"],
  ["Fleet workshop","5 members","Workshop supervisor","fleet:vehicle:update"],
  ["Compliance & H&S","3 members","Ricarte Nazerenco","compliance:record:update"],
  ["Commercial","9 members","Garreth Ritchie","finance:invoice:view"],
  ["Agri","6 members","Shane O'Brien","agri:delivery:update"]
];
const LOCATIONS = [
  ["Huntstown site","Huntstown, Co. Dublin","62 staff","active"]
];

/* Seven Bia agents. Besides the thread, each carries what the profile panel
   shows: skills (read or write), connected systems with the access granted,
   and recent runs. Thread kinds: stamp, routine, agent, user, and "actions"
   (buttons; `decideKey` swaps them for the write-back once approved). */
const AGENT_DEFS = [
  {id:"briefing", name:"Briefing", shape:"crown-pebble", tint:"#191c1f", state:"complete",
   role:"Writes the 06:30 morning brief and the weekly management brief",
   when:"13:05", preview:"4 collections need attention. BULK-204 reassignment is ready.",
   access:"Reads everything Dragos can see. Sends only to named people.",
   skills:[["Summarise operations","read"],["Read collections and ETAs","read"],["Read plant intake","read"],["Draft management brief","write"],["Send brief by email","write"]],
   systems:[["Fleet System","Read"],["Weighbridge","Read"],["Plant / SCADA data","Read"],["Timesheets / HR","Read"],["Email","Read + write"]],
   runs:[["Today 13:05","Brief refreshed after BIA-07 fault","ok"],["Today 06:30","Morning brief to Dragos","ok"],["Fri 16:00","Management brief to Pat Loughman","ok"]],
   thread:[
     {kind:"stamp", text:"Today 06:30"},
     {kind:"routine", text:"Ran routine", routine:"Morning brief"},
     {kind:"agent", text:"Morning brief:", lines:[
       {k:"Collections", v:"34 scheduled, first departures 06:00"},
       {k:"Fleet", v:"15 of 16 available, BIA-10 in service until Thursday"},
       {k:"Huntstown", v:"Plan is 160 t intake today"},
       {k:"Waiting on you", v:"BIA-12 inspection booking and Logistics overtime"}]},
     {kind:"stamp", text:"Today 13:05"},
     {kind:"routine", text:"Ran routine", routine:"Brief refreshed after BIA-07 fault"},
     {kind:"agent", text:"Good morning Dragos. 34 collections are scheduled today. 4 currently need attention. BIA-07 has reported a hydraulic fault and BULK-204 is currently at risk of a 42-minute delay. I have prepared a reassignment to BIA-14 which reduces the expected delay to 27 minutes. Huntstown intake is currently 153.4 tonnes against a planned 160 tonnes. INT-1048 has a 1.70-tonne weight discrepancy and requires review."},
     {kind:"actions", decideKey:"reassign204", actions:[["Review reassignment",1,{page:"Work", workSection:"approvals", workDoc:"ap-204", workDocTab:"work"}],["View route",0,{page:"Collections", tab:"Live Jobs"}]]},
     {kind:"user", text:"Send the management brief to Pat at 17:00"},
     {kind:"agent", text:"Scheduled. The management brief goes to Pat Loughman at 17:00 with the BIA-07 recovery and the INT-1048 outcome included."}
   ]},
  {id:"ops", name:"Ops Watchdog", shape:"shield", tint:"#2b1b1e", state:"attention",
   role:"Watches fleet, weighbridge, plant and timesheets for exceptions",
   when:"12:54", preview:"INT-1048 is 1.70 t over expected. BIA-07 off road.",
   access:"Read-only on every connected system. Raises alerts and tasks in Pulse.",
   skills:[["Monitor telematics","read"],["Check weighbridge variance","read"],["Read plant data","read"],["Raise alert","write"],["Create task","write"]],
   systems:[["Fleet System","Read"],["Weighbridge","Read"],["Plant / SCADA data","Read"],["Timesheets / HR","Read"],["Pulse","Read + write"]],
   runs:[["Today 12:54","Flagged INT-1048 variance","attention"],["Today 12:34","BIA-07 fault alert","ok"],["Today 11:58","Digester 2 feed restored","ok"]],
   thread:[
     {kind:"stamp", text:"Today 12:34"},
     {kind:"agent", text:"BIA-07 reported a hydraulic pressure warning on the tail-lift ram near Johnstown on the N7. Marked it off road and passed it to Dispatch Agent and Fleet Agent."},
     {kind:"stamp", text:"Today 12:54"},
     {kind:"agent", text:"INT-1048 weighed in above the review tolerance, so I parked it rather than let it accept automatically.", lines:[
       {k:"Gross", v:"37.42 t"},{k:"Tare", v:"18.15 t"},{k:"Net", v:"19.27 t"},{k:"Expected", v:"17.57 t, variance +1.70 t"}]},
     {kind:"user", text:"Anything else outside tolerance?"},
     {kind:"agent", text:"Two slower items. BIA-12's roadworthiness test is due in 3 days, and depackaging line 1 is running 8% slow while it clears the INT-1048 pallets. Nothing else is out of range."}
   ]},
  {id:"dispatch", name:"Dispatch Agent", shape:"control-cube", tint:"#16241f", state:"waiting",
   role:"Plans routes, recovers delays and writes changes back to the Fleet System",
   when:"13:04", preview:"3 of 4 at-risk collections recoverable. Waiting on your yes.",
   access:"Reads routes and driver hours. Writes to the Fleet System only after approval.",
   skills:[["Read routes and ETAs","read"],["Check driver hours","read"],["Reassign vehicle","write"],["Resequence route","write"],["Send customer ETA","write"]],
   systems:[["Fleet System","Read + write"],["Timesheets / HR","Read"],["Email","Read + write"],["Calendar","Read"]],
   runs:[["Today 13:04","Prepared dispatch plan","attention"],["Today 12:21","CityFresh ETA update","ok"],["Today 05:00","Route plan for 34 collections","ok"]],
   thread:[
     {kind:"stamp", text:"Today 13:04"},
     {kind:"user", text:"Fix today's collection delays."},
     {kind:"agent", text:"I found 4 at-risk collections. I can recover 3 by:", lines:[
       {k:"Reassigning BULK-204", v:"to BIA-14"},
       {k:"Moving COL-1858", v:"behind COL-1861"},
       {k:"Delaying driver break", v:"by 18 minutes within permitted limits"}]},
     {kind:"agent", text:"FreshFields Foods would receive an updated ETA automatically. 1 issue requires manual review because no compatible tanker is currently available."},
     {kind:"actions", decideKey:"dispatchPlan", actions:[["Review plan",0,{page:"Work", workSection:"approvals", workDoc:"ap-plan", workDocTab:"work"}],["Approve changes",1,{decide:"dispatchPlan"}]]}
   ]},
  {id:"fleet", name:"Fleet Agent", shape:"tall-unit", tint:"#1b2430", state:"working",
   role:"Tracks vehicle health, faults, inspections and running cost",
   when:"12:36", preview:"WS-2291 drafted for BIA-07. BIA-12 test due in 3 days.",
   access:"Reads telematics and maintenance. Books workshop slots after approval.",
   skills:[["Read telematics","read"],["Read maintenance records","read"],["Open workshop ticket","write"],["Book inspection","write"]],
   systems:[["Fleet System","Read + write"],["Calendar","Read + write"],["Documents","Read"],["Accounting","Read"]],
   runs:[["Today 12:36","Workshop ticket WS-2291 drafted","ok"],["Today 07:00","Daily vehicle check, 16 vehicles","ok"],["Mon 08:00","Inspection schedule refresh","ok"]],
   thread:[
     {kind:"stamp", text:"Today 12:36"},
     {kind:"agent", text:"BIA-07 is off road at Johnstown. I drafted workshop ticket WS-2291 for the tail-lift ram. BIA-14 is at Huntstown with 74% fuel, so Dispatch Agent has it as the replacement.", lines:[
       {k:"Available", v:"14 of 16"},{k:"Active", v:"11"},{k:"Maintenance", v:"BIA-10, back Thursday"},{k:"Fault", v:"BIA-07"}]},
     {kind:"user", text:"And BIA-12?"},
     {kind:"agent", text:"Roadworthiness test due in 3 days. There is a workshop slot on Thursday at 08:00. Booking it writes to the Calendar, so it waits for your yes."},
     {kind:"actions", decideKey:"bia12", actions:[["Book Thursday 08:00",1,{decide:"bia12"}],["Open inspections",0,{page:"Fleet", tab:"Inspections"}]]}
   ]},
  {id:"intake", name:"Intake Agent", shape:"glass-visor", tint:"#241b2e", state:"waiting",
   role:"Reconciles weighbridge tickets, dockets and expected weights at Huntstown",
   when:"12:58", preview:"INT-1048 documents matched. Accept at 19.27 t?",
   access:"Reads tickets and dockets. Accepts intake and adjusts invoice lines after approval.",
   skills:[["Read weighbridge tickets","read"],["Match dockets","read"],["Accept intake","write"],["Adjust invoice line","write"]],
   systems:[["Weighbridge","Read + write"],["Documents","Read"],["Accounting","Read + write"],["Plant / SCADA data","Read"]],
   runs:[["Today 12:58","INT-1048 matched, waiting on review","attention"],["Today 12:41","INT-1047 accepted","ok"],["Today 12:32","INT-1046 accepted","ok"]],
   thread:[
     {kind:"stamp", text:"Today 12:58"},
     {kind:"agent", text:"INT-1048 from BIA-14 is recorded at 19.27 t net. I matched all four documents:", lines:[
       {k:"Waste transfer docket", v:"WTD-58812"},{k:"Customer reference", v:"FreshFields Foods, Naas"},
       {k:"Driver sign-off", v:"M. Kowalski, 12:46"},{k:"Weighbridge ticket", v:"gross 37.42 t, tare 18.15 t"}]},
     {kind:"agent", text:"The +1.70 t variance is above tolerance. If you accept, I write 19.27 t back to the Weighbridge and adjust the FreshFields Foods invoice line in Accounting."},
     {kind:"actions", decideKey:"int1048", actions:[["Accept at 19.27 t",1,{decide:"int1048"}],["Open Weighbridge",0,{page:"Plant", tab:"Weighbridge"}]]}
   ]},
  {id:"productivity", name:"Productivity Agent", shape:"precision-brow", tint:"#2a2118", state:"thinking",
   role:"Turns timesheets, stops and tonnes into a productivity view",
   when:"12:00", preview:"Logistics at 91% today. 6.5 h overtime waiting.",
   access:"Reads timesheets, stops and tonnes. Approves overtime only with your yes.",
   skills:[["Read timesheets","read"],["Read stops and tonnes","read"],["Calculate productivity","read"],["Approve overtime","write"]],
   systems:[["Timesheets / HR","Read + write"],["Fleet System","Read"],["Weighbridge","Read"]],
   runs:[["Today 12:00","Midday productivity","ok"],["Today 06:00","Shift roster check","ok"],["Fri 17:00","Weekly productivity pack","ok"]],
   thread:[
     {kind:"stamp", text:"Today 12:00"},
     {kind:"agent", text:"Midday numbers from timesheets and telematics:", lines:[
       {k:"Productivity", v:"91% (Productivity Model, configurable during onboarding)"},
       {k:"On time", v:"94%"},{k:"Fleet utilisation", v:"87%"},{k:"Overtime pending", v:"6.5 h in Logistics"}]},
     {kind:"user", text:"Where is the overtime from?"},
     {kind:"agent", text:"Five drivers on the longer bulk and tanker runs today: Marek Nowak, Marek Kowalski, Darragh Quinn, Tomasz Wiśniewski and Paul Doyle. Approving posts it to payroll period 40."},
     {kind:"actions", decideKey:"overtime", actions:[["Approve 6.5 h",1,{decide:"overtime"}],["Open Timesheets",0,{page:"People", tab:"Timesheets"}]]}
   ]},
  {id:"compliance", name:"Compliance Agent", shape:"low-dome", tint:"#191c1f", state:"working",
   role:"Keeps vehicle tests, driver CPC, permits and dockets in date",
   when:"11:30", preview:"BIA-12 test in 3 days. Paul Doyle CPC in 19 days.",
   access:"Reads documents and expiries. Chases signatures and books renewals after approval.",
   skills:[["Read documents","read"],["Check expiries","read"],["Chase missing dockets","write"],["Book renewals","write"]],
   systems:[["Documents","Read + write"],["Fleet System","Read"],["Timesheets / HR","Read"],["Calendar","Read + write"]],
   runs:[["Today 11:30","Docket check, 34 of 34 drafted","ok"],["Today 07:00","Daily expiry check","ok"],["Mon 09:00","Waste permit audit","ok"]],
   thread:[
     {kind:"stamp", text:"Today 07:00"},
     {kind:"routine", text:"Ran routine", routine:"Daily expiry check"},
     {kind:"agent", text:"Four things are coming due:", lines:BIA_STORY.EXPIRIES.map(e => ({k:e.item, v:"in " + e.days + " days"}))},
     {kind:"stamp", text:"Today 11:30"},
     {kind:"agent", text:"All 34 of today's collections have a waste transfer docket drafted. 19 are signed and the rest sign on collection. WTD-58807 went back to Northside Distribution for a customer signature."}
   ]}
];

const KPI_DEFS = {
  tonnesCollected:{label:"Weekly tonnes collected", value:"1,946 t", delta:"+3.2%", dir:"up", hint:"vs last week", hero:true},
  tonnesProcessed:{label:"Weekly tonnes processed", value:"1,872 t", delta:"+3.8%", dir:"up", hint:"vs last week"},
  collections:{label:"Collections completed", value:"186", delta:"+8", dir:"up", hint:"this week"},
  sla:{label:"Collection SLA", value:"95.1%", delta:"+0.6pt", dir:"up", hint:"on time, in full"},
  fleetUtil:{label:"Fleet utilisation", value:"87%", delta:"+2pt", dir:"up", hint:"16 vehicles"},
  plantAvail:{label:"Plant availability", value:"96.8%", delta:"+0.4pt", dir:"up", hint:"this week"},
  biomethane:{label:"Biomethane produced", value:"2,214 MWh", delta:"+2.9%", dir:"up", hint:"renewable gas"},
  openIssues:{label:"Open issues", value:"9", delta:"4 fewer", dir:"up", hint:"vs last week"}
};

const ASPECT_DEFS = [
  {id:"executive", label:"Executive", color:"var(--accent)", owner:"GROUP OPERATIONS DIRECTOR", description:"The whole chain in one view: waste collected, feedstock processed, gas and biofertiliser out.",
   kind:"area", chartTitle:"Tonnes processed by week", chartUnit:"TONNES",
   chart:[["W29",1688,"1,688 t"],["W30",1712,"1,712 t"],["W31",1694,"1,694 t"],["W32",1746,"1,746 t"],["W33",1731,"1,731 t"],["W34",1768,"1,768 t"],["W35",1752,"1,752 t"],["W36",1790,"1,790 t"],["W37",1774,"1,774 t"],["W38",1806,"1,806 t"],["W39",1803,"1,803 t"],["W40",1872,"1,872 t"]],
   splitTitle:"Where this week's tonnes came from",
   split:[["Food manufacturing","894 t","46%",1],["Large retail","506 t","26%",0],["Distribution","331 t","17%",0],["Hospitality, healthcare, campuses","215 t","11%",0]],
   tableCols:["Area","This week","Change","Lead"],
   table:[["Collections","186 jobs","+4.5%","Group Logistics"],["Plant intake","1,912 t","+3.4%","Plant"],["Biomethane","2,214 MWh","+2.9%","Plant"],["Fleet utilisation","87%","+2.0pt","Fleet workshop"],["Open issues","9","4 fewer","Compliance and H&S"]],
   metrics:[["Tonnes processed","1,872 t","+3.8%","up","this week",[.52,.58,.54,.62,.6,.68,.66,.74,1]],
     ["Collection SLA","95.1%","+0.6pt","up","this week",[.7,.72,.7,.74,.76,.75,.78,.8,.84]],
     ["Plant availability","96.8%","+0.4pt","up","this week",[.8,.82,.8,.84,.83,.86,.85,.88,.9]],
     ["Open issues","9","4 fewer","up","vs last week",[.9,.84,.8,.76,.8,.7,.66,.6,.5]]]},
  {id:"logistics", label:"Logistics", color:"#6fb6d9", owner:"GROUP LOGISTICS MANAGER", description:"Collections, routes and vehicles, from the customer's bin to the Huntstown weighbridge.",
   kind:"columns", chartTitle:"Collections completed by week", chartUnit:"JOBS",
   chart:[["W29",171,"171"],["W30",174,"174"],["W31",169,"169"],["W32",177,"177"],["W33",175,"175"],["W34",180,"180"],["W35",178,"178"],["W36",181,"181"],["W37",179,"179"],["W38",183,"183"],["W39",178,"178"],["W40",186,"186"]],
   splitTitle:"Tonnes by collection type, this week",
   split:[["Tanker","508 t","26%",1],["Bulk Pallet","412 t","21%",0],["Wheelie Bin","392 t","20%",0],["Dolav","286 t","15%",0],["Curtainsider","244 t","13%",0],["Customer Delivery","104 t","5%",0]],
   tableCols:["Route","Collections","Change","Vehicle"],
   table:[["Swords loop B","31","+6.9%","BIA-02"],["City centre loop","28","+3.7%","BIA-04"],["Tallaght loop","26","−3.7%","BIA-05"],["Navan loop","17","+13.3%","BIA-13"],["Bulk, Naas and Carlow","9","−10.0%","BIA-07, BIA-08"]],
   metrics:[["Collections completed","186","+8","up","this week",[.6,.64,.58,.68,.66,.72,.7,.76,1]],
     ["Tonnes collected","1,946 t","+3.2%","up","this week",[.56,.6,.58,.64,.62,.7,.68,.74,.8]],
     ["On-time rate","94%","+1pt","up","today",[.7,.74,.72,.76,.74,.78,.8,.79,.84]],
     ["Vehicle utilisation","87%","+2pt","up","this week",[.66,.7,.68,.72,.74,.73,.76,.78,.8]]]},
  {id:"plant", label:"Plant", color:"#e6c78a", owner:"PLANT MANAGER", description:"Weighbridge intake, depackaging, digestion and what comes out: renewable gas and biofertiliser.",
   kind:"stacked", legend:["Packaged, depackaged","Liquid food waste","Unpackaged, fruit and veg"],
   stacked:[["W29",[800,470,470]],["W30",[813,477,478]],["W31",[806,473,473]],["W32",[826,485,485]],["W33",[819,481,481]],["W34",[837,491,492]],["W35",[830,487,487]],["W36",[847,497,498]],["W37",[840,493,493]],["W38",[856,502,503]],["W39",[851,500,499]],["W40",[880,516,516]]],
   chartTitle:"Feedstock accepted by week", chartUnit:"TONNES",
   chart:[["W29",1740,"1,740 t"],["W30",1768,"1,768 t"],["W31",1752,"1,752 t"],["W32",1796,"1,796 t"],["W33",1781,"1,781 t"],["W34",1820,"1,820 t"],["W35",1804,"1,804 t"],["W36",1842,"1,842 t"],["W37",1826,"1,826 t"],["W38",1861,"1,861 t"],["W39",1850,"1,850 t"],["W40",1912,"1,912 t"]],
   splitTitle:"Feedstock mix, accepted this week",
   split:[["Packaged food, depackaged","880 t","46%",1],["Liquid food waste","516 t","27%",0],["Unpackaged food waste","325 t","17%",0],["Fruit and veg","191 t","10%",0]],
   tableCols:["Asset","Throughput","Change","Status"],
   table:[["Depackaging line 1","10.9 t/h","−8.0%","Pallet backlog from INT-1048"],["Depackaging line 2","12.4 t/h","+1.6%","On target"],["Digester 2 feed","138 t/day","−1.4%","Restored 11:58 after 22 min pause"],["Gas upgrading","1,340 Nm³/h","+0.8%","On target"]],
   metrics:[["Tonnes processed","1,872 t","+3.8%","up","this week",[.52,.58,.54,.62,.6,.68,.66,.74,.8]],
     ["Plant availability","96.8%","+0.4pt","up","this week",[.8,.82,.8,.84,.83,.86,.85,.88,.9]],
     ["Biomethane","2,214 MWh","+2.9%","up","this week",[.6,.62,.6,.66,.64,.7,.69,.74,.78]],
     ["Unplanned downtime","2.4 h","1.1 h less","up","this week",[.8,.7,.74,.6,.66,.5,.46,.42,.36]]]},
  {id:"productivity", label:"Productivity", color:"#b9a6ee", owner:"GROUP OPERATIONS", description:"Team-level productive hours, overtime and cost per hour. The productivity model is configurable during onboarding.",
   kind:"rows", rows:[["Weighbridge","94%",94],["Plant operators","93%",93],["Drivers","91%",91],["Yard","90%",90],["Depackaging","88%",88]],
   chartTitle:"Productive share by team", chartUnit:"THIS WEEK",
   chart:[["W29",88,"88%"],["W30",89,"89%"],["W31",88,"88%"],["W32",89,"89%"],["W33",90,"90%"],["W34",89,"89%"],["W35",90,"90%"],["W36",91,"91%"],["W37",90,"90%"],["W38",91,"91%"],["W39",90,"90%"],["W40",91,"91%"]],
   splitTitle:"Where paid hours went, this week",
   split:[["Productive","1,642 h","88%",1],["Travel and queuing","112 h","6%",0],["Breaks","75 h","4%",0],["Admin and training","37 h","2%",0]],
   tableCols:["Team","Productivity","Change","Measured on"],
   table:[["Logistics drivers","91%","+1.2pt","Stops, tonnes and route time"],["Plant operators","93%","+0.8pt","Throughput per staffed hour"],["Weighbridge","94%","+0.5pt","Tickets per hour"],["Depackaging","88%","−1.4pt","Line 1 backlog today"]],
   metrics:[["Workforce productivity","91%","+1pt","up","this week",[.7,.72,.7,.74,.76,.74,.78,.8,.84]],
     ["Productive hours","1,642 h","+2.4%","up","this week",[.6,.64,.62,.66,.68,.7,.69,.74,.78]],
     ["Overtime pending","6.5 h","5 timesheets","down","awaiting approval",[.3,.4,.36,.5,.44,.56,.5,.62,.7]],
     ["Cost per productive hour","€38.40","€0.60 lower","up","blended",[.8,.78,.76,.77,.74,.72,.7,.7,.68]]]},
  {id:"sustainability", label:"Sustainability", color:"#7fd8a4", owner:"COMPLIANCE AND AGRI", description:"Food waste diverted, renewable gas generated and carbon avoided. Figures marked estimate use standard factors.",
   kind:"funnel", funnel:[["Food waste collected","1,946 t","this week",1946],["Accepted as feedstock","1,912 t","98% of collected",1912],["Processed through AD","1,872 t","96% of collected",1872],["Returned to land as biofertiliser","1,642 t","digestate out",1642]],
   chartTitle:"Waste to renewable energy, this week", chartUnit:"TONNES",
   chart:[["W29",1980,"1,980"],["W30",2010,"2,010"],["W31",1995,"1,995"],["W32",2060,"2,060"],["W33",2040,"2,040"],["W34",2090,"2,090"],["W35",2075,"2,075"],["W36",2120,"2,120"],["W37",2105,"2,105"],["W38",2160,"2,160"],["W39",2151,"2,151"],["W40",2214,"2,214"]],
   splitTitle:"CO₂e avoided this week, estimate",
   split:[["Waste kept out of landfill","486 t","48%",1],["Fossil gas displaced","443 t","43%",0],["Chemical fertiliser displaced","91 t","9%",0]],
   tableCols:["Measure","Year to date","Change","Basis"],
   table:[["Food waste diverted","73,480 t","+6.2%","Weighbridge net weights"],["Renewable gas generated","82,640 MWh","+5.8%","Grid injection meter"],["CO₂e avoided","38,100 t","+6.0%","Estimate, standard factors"],["Chemical fertiliser displaced","1,310 t","+4.4%","Estimate, N-P-K equivalent"]],
   metrics:[["Renewable gas","2,214 MWh","+2.9%","up","this week",[.6,.62,.6,.66,.64,.7,.69,.74,.8]],
     ["CO₂e avoided","1,020 t","+3.1%","up","estimate, this week",[.58,.6,.6,.64,.63,.68,.67,.72,.78]],
     ["Homes supplied, equivalent","10,400","+2.9%","up","estimate, annualised",[.6,.62,.61,.65,.64,.69,.68,.72,.76]],
     ["Digestate produced","1,642 t","+2.4%","up","this week",[.62,.64,.63,.66,.66,.7,.69,.72,.75]]]}
];

const FILTER_GROUPS = [
  {title:"AREA", items:["Executive","Logistics","Plant","Productivity","Sustainability"]},
  {title:"SPINE", items:["Customer","Site","Vehicle","Team","Feedstock"]},
  {title:"TIME", items:["This week","This month","This quarter","Year to date"]}
];

const OPS_DEFS = [
  {id:"o1", name:"Vehicle fault → reassignment", kind:"automation", owner:"Dispatch Agent", ownerKind:"agent", initials:"DA",
   trigger:"Fleet fault event", triggerKind:"event", next:"Event-based", last:"BULK-204 plan waiting", status:"approval", rate:97, on:true,
   what:"When telematics reports a fault, finds every collection on that vehicle, picks a compatible replacement inside driver hours and prepares the reassignment for approval.",
   why:"A breakdown used to mean an hour of phone calls before anyone knew which customers were affected.",
   saved:"14 hours a month",
   steps:[["Trigger","Fleet System reports a vehicle fault"],["Find","Collections on the affected vehicle"],["Check","Compatible vehicles and driver hours"],["Draft","Reassignment and new ETAs"],["Approval","Logistics manager approves","gate"],["Update","Write the change back to the Fleet System"],["Send","Updated ETA to the customer"]],
   runs:[["Today 13:04","9s","partial","Waiting on approval","€0.02"],["Thu 10:12","8s","ok","2 routes moved","€0.02"],["Mon 07:48","11s","ok","1 route moved","€0.02"]]},
  {id:"o2", name:"Weighbridge variance review", kind:"automation", owner:"Intake Agent", ownerKind:"agent", initials:"IA",
   trigger:"Net weight outside tolerance", triggerKind:"event", next:"Event-based", last:"INT-1048 flagged 12:54", status:"approval", rate:99, on:true,
   what:"Compares every net weight with the expected weight on the collection, matches the docket, sign-off and ticket, and parks anything outside tolerance for review.",
   why:"Variances were only found at month end, when the invoice was already out.",
   saved:"9 hours a month",
   steps:[["Trigger","A ticket is outside the weight tolerance"],["Find","Docket, customer reference and driver sign-off"],["Check","Match all four documents"],["Approval","Weighbridge review","gate"],["Update","Accept the ticket and adjust the invoice line"]],
   runs:[["Today 12:54","4s","partial","INT-1048 parked","€0.01"],["Today 12:41","3s","ok","INT-1047 accepted","€0.01"],["Today 12:32","3s","ok","INT-1046 accepted","€0.01"]]},
  {id:"o3", name:"Missing docket chase", kind:"automation", owner:"Compliance Agent", ownerKind:"agent", initials:"CA",
   trigger:"Daily, 16:00", triggerKind:"schedule", next:"16:00", last:"1 signature chased", status:"healthy", rate:98, on:true,
   what:"Finds collections without a signed waste transfer docket and sends the customer a signature request.",
   why:"An unsigned docket holds up the invoice and the environmental return.",
   saved:"6 hours a month",
   steps:[["Trigger","Every day at 16:00"],["Find","Collections with no signed docket"],["Draft","Signature request for each customer"],["Send","Email the customer contact"],["Update","Log the chase against the docket"]],
   runs:[["Yesterday 16:00","6s","ok","1 chased","€0.01"],["Mon 16:00","5s","ok","0 missing","€0.00"]]},
  {id:"o4", name:"Overtime approval", kind:"routine", owner:"Productivity Agent", ownerKind:"agent", initials:"PA",
   trigger:"Daily, 15:00", triggerKind:"schedule", next:"15:00", last:"6.5 h waiting", status:"approval", rate:100, on:true,
   what:"Collects overtime from submitted timesheets, checks it against the route and stops, and sends it for approval before payroll.",
   why:"Overtime was approved in bulk at month end with no link to the work behind it.",
   saved:"5 hours a month",
   steps:[["Trigger","Every day at 15:00"],["Find","Timesheets with overtime"],["Check","Match hours to routes and stops"],["Approval","Logistics manager approves","gate"],["Update","Post to payroll in Timesheets / HR"]],
   runs:[["Yesterday 15:00","5s","ok","3.2 h approved","€0.01"],["Mon 15:00","5s","ok","4.1 h approved","€0.01"]]},
  {id:"o5", name:"Morning brief", kind:"routine", owner:"Briefing Agent", ownerKind:"agent", initials:"BR",
   trigger:"Weekdays, 06:30", triggerKind:"schedule", next:"Tomorrow", last:"Delivered 06:30", status:"healthy", rate:100, on:true,
   what:"Reads collections, fleet, Huntstown intake and timesheets and tells Dragos what needs attention before the day gets going.",
   why:"The day used to start with six screens and a phone call to the weighbridge.",
   saved:"9 hours a month",
   steps:[["Trigger","Every weekday at 06:30"],["Find","Collections, fleet status, intake plan and approvals"],["Check","Drop anything already handled"],["Draft","Write the brief"],["Send","Post to Home and email"]],
   runs:[["Today 06:30","22s","ok","1 brief","€0.02"],["Yesterday 06:30","19s","ok","1 brief","€0.02"],["Fri 06:30","24s","ok","1 brief","€0.02"]]},
  {id:"o6", name:"Customer ETA notification", kind:"automation", owner:"Dispatch Agent", ownerKind:"agent", initials:"DA",
   trigger:"ETA moves by 15 min or more", triggerKind:"event", next:"Event-based", last:"CityFresh at 12:21", status:"healthy", rate:99, on:true,
   what:"When a collection ETA moves by 15 minutes or more, emails the customer contact with the new time.",
   why:"Customers were ringing the office to find out where their collection was.",
   saved:"11 hours a month",
   steps:[["Trigger","An ETA moves by 15 minutes or more"],["Find","The customer contact for the site"],["Draft","ETA update"],["Send","Email the customer"],["Update","Log it against the collection"]],
   runs:[["Today 12:21","3s","ok","CityFresh notified","€0.01"],["Today 09:48","3s","ok","GreenMart notified","€0.01"]]},
  {id:"o7", name:"Inspection renewal", kind:"routine", owner:"Compliance Agent", ownerKind:"agent", initials:"CA",
   trigger:"30 days before expiry", triggerKind:"event", next:"Daily check", last:"BIA-12 due in 3 days", status:"approval", rate:96, on:true,
   what:"Watches every vehicle test, driver CPC and certificate, and books the renewal before it lapses.",
   why:"A missed test takes a vehicle off the road with no warning.",
   saved:"4 hours a month",
   steps:[["Trigger","30 days before an expiry"],["Find","The owner and the next workshop slot"],["Approval","Fleet approves the booking","gate"],["Update","Book it in the Calendar"]],
   runs:[["Today 07:00","3s","partial","BIA-12 waiting on booking","€0.00"],["Mon 07:00","3s","ok","CPC reminder sent","€0.00"]]},
  {id:"o8", name:"Route plan", kind:"routine", owner:"Dispatch Agent", ownerKind:"agent", initials:"DA",
   trigger:"Weekdays, 05:00", triggerKind:"schedule", next:"Tomorrow 05:00", last:"34 collections planned", status:"healthy", rate:98, on:true,
   what:"Builds the day's routes from scheduled collections, vehicle availability and driver rosters.",
   why:"Routes were planned by hand the evening before and rarely survived the first breakdown.",
   saved:"16 hours a month",
   steps:[["Trigger","Every weekday at 05:00"],["Find","Scheduled collections and available vehicles"],["Check","Driver hours and vehicle type"],["Update","Publish routes to the Fleet System"]],
   runs:[["Today 05:00","48s","ok","34 collections","€0.04"],["Yesterday 05:00","44s","ok","31 collections","€0.04"]]},
  {id:"o9", name:"Weekly customer sustainability reports", kind:"report", owner:"Briefing Agent", ownerKind:"agent", initials:"BR",
   trigger:"Mon, 08:00", triggerKind:"schedule", next:"Mon 08:00", last:"Sent to 12 customers", status:"healthy", rate:97, on:true,
   what:"Tells each customer how much food waste Bia collected, the biomethane it made and the digestate returned to land.",
   why:"Customers need the figures for their own environmental reporting.",
   saved:"12 hours a month",
   steps:[["Trigger","Every Monday at 08:00"],["Find","Last week's tonnes per customer"],["Draft","One report per customer"],["Send","Email each customer contact"]],
   runs:[["Mon 08:00","1m 20s","ok","12 reports","€0.06"],["Mon 21 Sep 08:00","1m 14s","ok","12 reports","€0.06"]]},
  {id:"o10", name:"Weekly management brief", kind:"report", owner:"Briefing Agent", ownerKind:"agent", initials:"BR",
   trigger:"Fri, 16:00", triggerKind:"schedule", next:"Fri 16:00", last:"Sent to Pat Loughman", status:"healthy", rate:100, on:true,
   what:"One page for Pat Loughman and the management team: collections, tonnes, plant availability, SLA and open issues.",
   why:"The Monday meeting used to start with everyone reading their own numbers.",
   saved:"6 hours a month",
   steps:[["Trigger","Every Friday at 16:00"],["Find","The week's figures across logistics and plant"],["Draft","Write the commentary"],["Send","Email the management team"]],
   runs:[["Fri 16:00","1m 02s","ok","5 recipients","€0.04"],["Fri 18 Sep 16:00","58s","ok","5 recipients","€0.04"]]},
  {id:"o11", name:"Telematics sync", kind:"automation", owner:"Ops Watchdog", ownerKind:"agent", initials:"OW",
   trigger:"Every 5 minutes", triggerKind:"schedule", next:"13:10", last:"16 vehicles reporting", status:"healthy", rate:100, on:true,
   what:"Pulls position, fuel and fault codes for all 16 vehicles and raises anything new.",
   why:"Faults were found when the driver rang in, not when the truck reported them.",
   saved:"8 hours a month",
   steps:[["Trigger","Every 5 minutes"],["Find","Position, fuel and fault codes"],["Check","New faults since the last sync"],["Send","Alert only if something changed"]],
   runs:[["Today 13:05","2s","ok","16 vehicles","€0.00"],["Today 12:35","2s","ok","1 fault raised","€0.00"]]},
  {id:"o12", name:"Timesheet reminder", kind:"task", owner:"Logistics", ownerKind:"person", initials:"DB",
   trigger:"Fri, 15:00", triggerKind:"schedule", next:"Fri 15:00", last:"12 of 12 submitted", status:"healthy", rate:94, on:true,
   what:"Nudges anyone who has not filed hours, then sends Logistics the list still outstanding.",
   why:"Payroll was chasing the same drivers every week.",
   saved:"3 hours a month",
   steps:[["Trigger","Every Friday at 15:00"],["Find","Staff with no hours filed"],["Send","Remind each person"]],
   runs:[["Fri 15:00","9s","ok","12 of 12","€0.00"],["Fri 18 Sep 15:00","11s","ok","11 of 12","€0.00"]]},
  {id:"o13", name:"Weighbridge calibration reminder", kind:"task", owner:"Weighbridge", ownerKind:"person", initials:"NB",
   trigger:"1st, 07:00", triggerKind:"schedule", next:"1 Oct 07:00", last:"Due in 41 days", status:"healthy", rate:100, on:true,
   what:"Checks the calibration certificate and books the contractor before it expires.",
   why:"An expired certificate stops the weighbridge from issuing legal tickets.",
   saved:"1 hour a month",
   steps:[["Trigger","First of the month at 07:00"],["Check","Days left on the certificate"],["Send","Remind the weighbridge manager"]],
   runs:[["1 Sep 07:00","2s","ok","69 days left","€0.00"]]}
];

const OPS_FILTERS = [
  ["all","All"], ["routine","Agent routines"], ["automation","Automations"],
  ["report","Scheduled reports"], ["task","Recurring tasks"], ["approval","Needs approval"], ["failed","Failed"]
];

const WORK_SECTIONS = [
  {id:"tasks", label:"Tasks", blurb:"Everything assigned to you or the logistics and plant teams, in one list.",
   views:["All tasks","Due tasks","Review","Done"], filters:["Due date","Any status","Anyone","Any due date"]},
  {id:"approvals", label:"Approvals", blurb:"Changes the agents prepared, waiting on a yes. Approving writes back to the connected system.",
   views:["Awaiting you","Awaiting others","Decided"], filters:["Raised date","Any system","Any agent"]},
  {id:"workflows", label:"Workflows", blurb:"What runs on its own across fleet, weighbridge, plant and timesheets, and who owns it.",
   views:[], filters:[]},
  {id:"schedules", label:"Schedules", blurb:"When recurring work fires: route plans, briefs, customer reports and checks.",
   views:[], filters:[]}
];

/* storeKey ties a task to a shared-store approval: once approved anywhere, the task shows done. */
const WORK_TASKS = [
  {id:"w1", title:"Reassign BULK-204 from BIA-07 to BIA-14", status:"Review", priority:"High", who:"DB",
   due:"Due 13:30", late:false, client:"FreshFields Foods", day:"Today", mins:"5 mins", view:"Due tasks", storeKey:"reassign204"},
  {id:"w2", title:"Inspect BIA-07 hydraulic system", status:"In progress", priority:"High", who:"WS",
   due:"Due today", late:false, client:"BIA-07 · Workshop", day:"Today", mins:"2 hours", view:"Due tasks"},
  {id:"w3", title:"Review INT-1048 weight discrepancy", status:"Review", priority:"High", who:"NB",
   due:"Due 14:00", late:false, client:"FreshFields Foods", day:"Today", mins:"20 mins", view:"Review", storeKey:"int1048"},
  {id:"w4", title:"Approve 6.5 overtime hours", status:"Review", priority:"Medium", who:"DB",
   due:"Due 15:00", late:false, client:"Logistics", day:"Today", mins:"10 mins", view:"Review", storeKey:"overtime"},
  {id:"w5", title:"Renew BIA-12 inspection", status:"Not started", priority:"High", who:"RN",
   due:"Due in 3 days", late:false, client:"BIA-12", day:"Thu", mins:"1 hour", view:"All tasks", storeKey:"bia12"},
  {id:"w6", title:"Find a compatible tanker for TNK-044", status:"In progress", priority:"High", who:"DB",
   due:"Due 14:30", late:false, client:"Boyne Valley Dairies", day:"Today", mins:"30 mins", view:"Due tasks"},
  {id:"w7", title:"Confirm BIA-10 service parts", status:"In progress", priority:"Medium", who:"WS",
   due:"1d overdue", late:true, client:"BIA-10 · Workshop", day:"Yesterday", mins:"15 mins", view:"Due tasks"},
  {id:"w8", title:"Chase signature on docket WTD-58807", status:"Not started", priority:"Medium", who:"AB",
   due:"Tomorrow", late:false, client:"Northside Distribution", day:"Wed", mins:"10 mins", view:"All tasks"},
  {id:"w9", title:"Book weighbridge calibration contractor", status:"Not started", priority:"Low", who:"NB",
   due:"Before 9 Nov", late:false, client:"Huntstown", day:"Any day", mins:"30 mins", view:"All tasks"},
  {id:"w10", title:"Onboard Hibernia College Catering sites", status:"In progress", priority:"Medium", who:"GR",
   due:"Fri", late:false, client:"Hibernia College Catering", day:"Fri", mins:"1 hour", view:"All tasks"},
  {id:"w11", title:"Send FreshFields Foods sustainability report", status:"Done", priority:"Medium", who:"BR",
   due:"Sent Monday", late:false, client:"FreshFields Foods", day:"Mon", mins:"Agent", view:"Done", done:true}
];

const WORKFLOWS = [
  {name:"Vehicle fault → reassignment", state:"live", trigger:"event · fleet.vehicle.fault",
   actions:[["fleet.routes.update","write"],["email.customer_eta","external"]], lastRun:"Today 13:04",
   result:"waiting on approval", resultKind:"warn", runSummary:"13 ok · 1 waiting",
   runs:["ok","ok","idle","ok","ok","ok","idle","ok","ok","ok","ok","ok","ok","partial"]},
  {name:"Weighbridge variance review", state:"live", trigger:"event · weighbridge.ticket.variance",
   actions:[["weighbridge.tickets.accept","write"],["accounting.lines.adjust","write"]], lastRun:"Today 12:54",
   result:"INT-1048 parked", resultKind:"warn", runSummary:"13 ok · 1 parked",
   runs:["ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","partial"]},
  {name:"Customer ETA notification", state:"live", trigger:"event · collection.eta.changed",
   actions:[["email.customer_eta","external"]], lastRun:"Today 12:21",
   result:"ok", resultKind:"ok", runSummary:"14 ok",
   runs:["ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok"]},
  {name:"Telematics sync", state:"live", trigger:"schedule · every 5 minutes",
   actions:[["fleet.telematics.read","read"]], lastRun:"Today 13:05",
   result:"16 vehicles", resultKind:"ok", runSummary:"14 ok",
   runs:["ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok"]}
];

const SCHEDULES = [
  {id:"s1", name:"Route plan", cadence:"Every weekday · 05:00", next:"Tomorrow 05:00", owner:"Dispatch Agent", on:true, day:1},
  {id:"s2", name:"Morning brief", cadence:"Every weekday · 06:30", next:"Tomorrow 06:30", owner:"Briefing Agent", on:true, day:1},
  {id:"s3", name:"Overtime approval", cadence:"Daily · 15:00", next:"Today 15:00", owner:"Productivity Agent", on:true, day:1},
  {id:"s4", name:"Weekly customer sustainability reports", cadence:"Mondays · 08:00", next:"Mon 08:00", owner:"Briefing Agent", on:true, day:0},
  {id:"s5", name:"Weekly management brief", cadence:"Fridays · 16:00", next:"Fri 16:00", owner:"Briefing Agent", on:true, day:4}
];

const WIDGET_DEFS = [["inbox","Needs attention"],["work","My work"],["activity","Activity"],["kpi","Today's numbers"],["visits","Arrivals at Huntstown"]];
const WORK_WIDGETS = [
  {id:"queue", label:"My queue", value:"4", hint:"assigned to you", icon:"work", queue:"mine"},
  {id:"late", label:"Running late", value:"1", hint:"past their due time", icon:"health", queue:"overdue"},
  {id:"unassigned", label:"Unassigned", value:"1", hint:"nobody owns it yet", icon:"teams", queue:"unassigned"},
  {id:"week", label:"Next 7 days", value:"3", hint:"due this week", icon:"visits", queue:"upcoming"}
];
const PERSONALITIES = ["Straight-talking","Warm","Formal","Dry"];
const ANSWER_STYLES = ["Short answers","Show the working","Ask before acting"];
/* Every context source and every registered tool the agent could be granted:
   the builder shows the whole catalogue, grouped, rather than a sample. */
const CONTEXT_DEFS = [
  ["Collections","operations","Jobs, routes, ETAs and customers"],
  ["Fleet","operations","Vehicles, telematics, faults, inspections"],
  ["Weighbridge","plant","Tickets, dockets and variances"],
  ["Plant","plant","Intake, processing, biomethane, digestate"],
  ["Timesheets","people","Hours, overtime and productivity"],
  ["People","people","Drivers, operators and managers"],
  ["Customers","records","Accounts, sites and service levels"],
  ["Documents","records","Dockets, permits and certificates"],
  ["Invoices","money","Collections billed and adjustments"],
  ["Tasks","work","Queues, owners, due dates"],
  ["Approvals","work","What is waiting on a decision"],
  ["Activity log","system","Every event, agent and human"]
];
const CONTEXT_SOURCES = CONTEXT_DEFS.map(c => c[0]);
const SKILL_DEFS = [
  ["Search records","read"],["Summarise activity","read"],["Read telematics","read"],
  ["Read weighbridge tickets","read"],["Read timesheets","read"],
  ["Draft email","write"],["Create task","write"],["Reassign vehicle","write"],
  ["Resequence route","write"],["Accept intake","write"],["Raise approval","write"],
  ["Send customer ETA","external"],["Write to Fleet System","external"],["Post to Accounting","external"]
];
/* The two questions the agent asks back once it knows the job. */
const TRAIN_PHASES = [
  ["Reading the operations ontology", "6,240 records"],
  ["Learning how Bia words things", "collection, not job"],
  ["Researching food waste logistics and AD", "14 sources"],
  ["Writing its own system prompt", "1,180 tokens"]
];
const BRIEF_QUESTIONS = [
  {title:"What should it cover?", sub:"Pick as many as you like. You can refine it later.",
   options:[["Collections","At-risk jobs and ETAs"],["Fleet","Faults, inspections and availability"],
            ["Huntstown","Intake, weighbridge and throughput"],["People","Timesheets and overtime"],
            ["Something else","Tell me in the next message"]]},
  {title:"When should it land?", sub:"One is enough to start.",
   options:[["Every morning 06:30","Before the first trucks leave"],["Weekdays 07:00","Monday to Friday only"],
            ["Only when something changes","Event-driven, no noise"],["On demand","When you ask for it"]]}
];
/* The words under a name, keyed to the same state the face lights with. */
const STATE_LABELS = {working:"working", thinking:"thinking", waiting:"waiting on you",
  complete:"up to date", attention:"needs you", idle:"idle"};

const FACE_SHAPES = [
  ["crown-pebble","Crown pebble"],["executive-capsule","Executive capsule"],["shield","Shield"],
  ["glass-visor","Glass visor"],["control-cube","Control cube"],["low-dome","Low dome"],
  ["offset-pebble","Offset pebble"],["rim-capsule","Rim capsule"],["wide-eyed","Wide-eyed"],
  ["precision-brow","Precision brow"],["tall-unit","Tall unit"],["soft-asymmetric","Soft asymmetric"]
];
/* Shell colours only — deliberately desaturated so none of them reads as a
   state. The eyes, rim and dots always carry the state colour. */
const FACE_TINTS = [
  ["#191c1f","Graphite"],["#1b2430","Slate"],["#241b2e","Aubergine"],
  ["#2a2118","Bronze"],["#16241f","Pine"],["#2b1b1e","Oxblood"]
];

/* ---- ontology graph: generation, Dijkstra traversal, canvas render ---- */
const CLUSTERS = [
  ["Customers",              "#3ed24b", 0.00, 0.62, 36, ["customer","freshfields","greenmart","cityfresh","boyne","liffey","leinster","meath","riverbank","hibernia","northside","farmer","account"]],
  ["Sites",                  "#6fb6d9", 0.63, 0.70, 30, ["site","naas","facility","premises","blanchardstown","swords","tallaght","location","huntstown"]],
  ["Collections",            "#e6c78a", 1.26, 0.66, 40, ["collection","bulk","col","job","route","tnk","del","schedule"]],
  ["Vehicles",               "#f0803a", 1.88, 0.72, 30, ["vehicle","bia","truck","tanker","curtainsider","macpac","fleet","telematics"]],
  ["Drivers & staff",        "#b9a6ee", 2.51, 0.62, 32, ["driver","staff","kowalski","marek","people","timesheet","contact","team"]],
  ["Dockets & weights",      "#f0c04b", 3.14, 0.70, 38, ["docket","wtd","weight","weighbridge","int","ticket","tonnes"]],
  ["Feedstock & intake",     "#5fe0a8", 3.77, 0.64, 34, ["feedstock","intake","depackaging","processing","digester","plant"]],
  ["Biomethane & digestate", "#7fd8a4", 4.40, 0.72, 30, ["biomethane","gas","digestate","biofertiliser","energy","renewable"]],
  ["Invoices & email",       "#f0567f", 5.03, 0.66, 34, ["invoice","email","payment","billing","thread","accounting"]],
  ["Documents & issues",     "#8fa6ff", 5.65, 0.70, 36, ["document","issue","exception","sop","permit","iso","report","compliance","certificate"]]
];

function mulberry(seed){
  return function(){
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* Hub-and-spoke clusters around a dense phyllotaxis core, in unit space
   (-1..1 on both axes) so the layout is resolution independent. */
const _hexCache = {};
function hexRGB(hex){
  if (_hexCache[hex]) return _hexCache[hex];
  const h = hex.replace("#", "");
  const v = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  _hexCache[hex] = v;
  return v;
}


function buildGraph(){
  const rnd = mulberry(20260902);
  const nodes = [], edges = [], adj = [];
  const add = (x, y, z, r, cluster, kind) => {
    nodes.push({x, y, z, r, cluster, kind}); adj.push([]); return nodes.length - 1;
  };
  const link = (a, b) => {
    const dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y, dz = nodes[a].z - nodes[b].z;
    const w = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.004;
    const id = edges.length;
    edges.push({a, b, w});
    adj[a].push([b, w, id]); adj[b].push([a, w, id]);
  };

  // the core is a filled sphere on a Fibonacci lattice, not a disc
  const CORE = 880, coreIds = [];
  for (let i = 0; i < CORE; i++){
    const t = (i + 0.5) / CORE;
    const phi = Math.acos(1 - 2 * t);
    const theta = i * 2.39996;
    const shell = 0.16 + 0.28 * Math.pow(rnd(), 0.5);
    const grade = rnd();
    coreIds.push(add(
      Math.sin(phi) * Math.cos(theta) * shell * 1.04,
      Math.cos(phi) * shell * 0.96,
      Math.sin(phi) * Math.sin(theta) * shell,
      grade < 0.06 ? 3.4 + rnd() * 1.4 : grade < 0.3 ? 2.1 + rnd() * 0.7 : 1.0 + rnd() * 0.8, 0, "core"));
  }
  // lattice neighbours plus a mesh of chords, so the sphere reads as a volume
  for (let i = 1; i < coreIds.length; i++){
    link(coreIds[i], coreIds[i - 1]);
    if (i >= 13) link(coreIds[i], coreIds[i - 13]);
    if (i >= 21 && i % 2 === 0) link(coreIds[i], coreIds[i - 21]);
    if (i >= 34 && i % 3 === 0) link(coreIds[i], coreIds[i - 34]);
    if (i >= 55 && i % 4 === 0) link(coreIds[i], coreIds[i - 55]);
    if (i >= 89 && i % 5 === 0) link(coreIds[i], coreIds[i - 89]);
    if (i % 6 === 0) link(coreIds[i], coreIds[Math.floor(rnd() * coreIds.length)]);
  }

  // a mid shell between the nucleus and the lobes: the layer that makes it
  // read as a network rather than a ball with satellites
  const MID = 560, midIds = [];
  for (let i = 0; i < MID; i++){
    const t = (i + 0.5) / MID;
    const phi = Math.acos(1 - 2 * t), theta = i * 2.39996 + 0.7;
    const d = 0.52 + 0.16 * Math.pow(rnd(), 0.6);
    const g2 = rnd();
    midIds.push(add(
      Math.sin(phi) * Math.cos(theta) * d * 1.02,
      Math.cos(phi) * d * 0.96,
      Math.sin(phi) * Math.sin(theta) * d,
      g2 < 0.05 ? 2.6 + rnd() * 1.0 : g2 < 0.3 ? 1.6 + rnd() * 0.6 : 0.8 + rnd() * 0.7, 0, "core"));
  }
  for (let i = 0; i < midIds.length; i++){
    if (i >= 1) link(midIds[i], midIds[i - 1]);
    if (i >= 17) link(midIds[i], midIds[i - 17]);
    if (i >= 29 && i % 2 === 0) link(midIds[i], midIds[i - 29]);
    // radial spokes tying the shell to the nucleus
    if (i % 2 === 0) link(midIds[i], coreIds[Math.floor(rnd() * coreIds.length)]);
    if (i % 9 === 0) link(midIds[i], coreIds[Math.floor(rnd() * coreIds.length)]);
  }

  // clusters ride a sphere: each hub gets its own latitude as well as longitude
  const hubs = [], clusterLeaves = [];
  const onSphere = (lon, lat, d0) => { const d = d0 * 1.22;
    return [Math.cos(lat) * Math.cos(lon) * d * 1.02, Math.sin(lat) * d * 0.96, Math.cos(lat) * Math.sin(lon) * d]; };
  CLUSTERS.forEach((c, ci) => {
    const [, , ang, dist, leaves] = c;
    const lat = (ci % 2 ? 1 : -1) * (0.26 + rnd() * 0.5);
    const wob = 1.06 + rnd() * 0.16;
    const hp = onSphere(ang, lat, dist * wob);
    const hub = add(hp[0], hp[1], hp[2], 5.4, ci, "hub");
    hubs.push(hub);
    const mine = [];
    clusterLeaves.push(mine);
    for (let k = 0; k < 3; k++) link(hub, coreIds[Math.floor(rnd() * coreIds.length)]);
    for (let k = 0; k < 5; k++) link(hub, midIds[Math.floor(rnd() * midIds.length)]);

    const subs = 5 + Math.floor(rnd() * 4);
    const subIds = [];
    for (let s = 0; s < subs; s++){
      const sa = ang + (rnd() - 0.5) * 0.52, sl = lat + (rnd() - 0.5) * 0.3;
      const sd = dist + 0.08 + rnd() * 0.18;
      const sp = onSphere(sa, sl, sd);
      const sub = add(sp[0], sp[1], sp[2], 3.2, ci, "sub");
      subIds.push(sub);
      link(sub, hub);
      if (s > 0 && rnd() < 0.7) link(sub, subIds[s - 1]);
      const fan = Math.floor((leaves * 7.4) / subs);
      const spread = 0.17 + rnd() * 0.2;
      let prev = -1;
      for (let l = 0; l < fan; l++){
        const la = sa + (rnd() - 0.5) * spread * 2 + (rnd() - 0.5) * 0.06;
        const ll = sl + (rnd() - 0.5) * spread * 1.1;
        const ld = sd + 0.03 + Math.pow(rnd(), 0.8) * 0.17;
        const lp = onSphere(la, ll, ld);
        const lg = rnd();
        const leaf = add(lp[0], lp[1], lp[2],
          lg < 0.08 ? 2.8 + rnd() * 1.2 : lg < 0.34 ? 1.8 + rnd() * 0.6 : 1.0 + rnd() * 0.7, ci, "leaf");
        link(leaf, sub);
        mine.push(leaf);
        if (rnd() < 0.14) link(leaf, hub);
        if (prev >= 0 && rnd() < 0.34) link(leaf, prev);
        if (rnd() < 0.16) link(leaf, midIds[Math.floor(rnd() * midIds.length)]);
        prev = leaf;
      }
    }
  });
  // far satellites hanging off the outer leaves
  CLUSTERS.forEach((c, ci) => {
    const [, , ang, dist] = c;
    for (let s = 0; s < 7; s++){
      const sa = ang + (rnd() - 0.5) * 1.5, sl = (rnd() - 0.5) * 1.3;
      const sd = dist + 0.42 + rnd() * 0.22;
      const ap = onSphere(sa, sl, sd);
      const anchor = add(ap[0], ap[1], ap[2], 2.4, ci, "sub");
      link(anchor, hubs[ci]);
      const n = 14 + Math.floor(rnd() * 18);
      for (let l = 0; l < n; l++){
        const la = sa + (rnd() - 0.5) * 0.9, ll = sl + (rnd() - 0.5) * 0.7;
        const ld = sd + 0.02 + Math.pow(rnd(), 0.8) * 0.18;
        const p = onSphere(la, ll, ld);
        const leaf = add(p[0], p[1], p[2], 0.8 + rnd() * 0.9, ci, "leaf");
        link(leaf, anchor);
        clusterLeaves[ci].push(leaf);
      }
    }
  });

  // two hub rings and long chords across the sphere
  hubs.forEach((h, i) => {
    link(h, hubs[(i + 1) % hubs.length]);
    link(h, hubs[(i + 2) % hubs.length]);
    if (i % 3 === 0) link(h, hubs[(i + 4) % hubs.length]);
  });
  // neighbouring clusters share records, so their leaves cross-link
  for (let ci = 0; ci < clusterLeaves.length; ci++){
    const a = clusterLeaves[ci], b = clusterLeaves[(ci + 1) % clusterLeaves.length];
    const n = 26 + Math.floor(rnd() * 16);
    for (let k = 0; k < n; k++){
      link(a[Math.floor(rnd() * a.length)], b[Math.floor(rnd() * b.length)]);
    }
    // and a good number reach right across to the far side
    for (let k = 0; k < 12; k++){
      const far = clusterLeaves[(ci + 3) % clusterLeaves.length];
      link(a[Math.floor(rnd() * a.length)], far[Math.floor(rnd() * far.length)]);
    }
    for (let k = 0; k < 8; k++){
      const far = clusterLeaves[(ci + 4) % clusterLeaves.length];
      link(a[Math.floor(rnd() * a.length)], far[Math.floor(rnd() * far.length)]);
    }
  }

  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9, minZ = 1e9, maxZ = -1e9;
  for (const n of nodes){
    if (n.x < minX) minX = n.x; if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y; if (n.y > maxY) maxY = n.y;
    if (n.z < minZ) minZ = n.z; if (n.z > maxZ) maxZ = n.z;
  }
  const bounds = {minX, maxX, minY, maxY, cx:(minX + maxX) / 2, cy:(minY + maxY) / 2,
    cz:(minZ + maxZ) / 2, w:maxX - minX, h:maxY - minY, d:maxZ - minZ,
    radius: Math.max(maxX - minX, maxY - minY, maxZ - minZ) / 2,
    reach: nodes.reduce((m, n) => Math.max(m, Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z)), 0)};
  return {nodes, edges, adj, hubs, coreIds, bounds};
}

export {
  MODULE_TABS,
  INK,
  BODY,
  DIM,
  FAINT,
  LIME,
  GREEN,
  AMBER,
  RED,
  NEUTRAL,
  MONO,
  ICONS,
  REC_SECTIONS,
  RECORD_TYPES,
  CONTACTS,
  FILE_TREE,
  ONTO_NODES,
  ONTO_EDGES,
  REC_TEMPLATES,
  REC_TEMPLATE_CATS,
  PEOPLE,
  ROLE_LEVELS,
  PERM_KEYS,
  GRANT_DEFS,
  ROLE_SCOPES,
  DEFAULT_PERMS,
  INTEGRATIONS,
  BG_DEFS,
  THEMES,
  ADMIN_ICONS,
  ADMIN_CARDS,
  ADMIN_GROUPS,
  SRC_TINT,
  SRC_ABBR,
  DATA_EVENTS,
  PEOPLE_EVENTS,
  AI_EVENTS,
  STREAM_DEFS,
  NAV,
  ITEMS,
  ORDER,
  ANSWERS,
  synthesizeCustomArea,
  pickAnswer,
  ORGS,
  TEAMS,
  LOCATIONS,
  AGENT_DEFS,
  KPI_DEFS,
  ASPECT_DEFS,
  FILTER_GROUPS,
  OPS_DEFS,
  OPS_FILTERS,
  WORK_SECTIONS,
  WORK_TASKS,
  WORKFLOWS,
  SCHEDULES,
  WIDGET_DEFS,
  WORK_WIDGETS,
  PERSONALITIES,
  ANSWER_STYLES,
  CONTEXT_DEFS,
  CONTEXT_SOURCES,
  SKILL_DEFS,
  TRAIN_PHASES,
  BRIEF_QUESTIONS,
  STATE_LABELS,
  FACE_SHAPES,
  FACE_TINTS,
  CLUSTERS,
  mulberry,
  _hexCache,
  hexRGB,
  buildGraph
};
