import { useEffect, useMemo, useState } from "react";
import { bulk204, useBia } from "./store";
import { Pill } from "./ui";
import { RECORD_TYPES } from "../logic/data";

/* Record focus over the ontology canvas: pick a record and see every other
   record Pulse has linked to it, typed by entity. Two chain strips show the
   service flow and the energy flow the entities sit on. */

type Kind = "Customer" | "Site" | "Contract" | "Contact" | "Collection" | "Vehicle" | "Driver" | "Docket" | "Weight"
  | "Invoice" | "Email" | "Issue" | "Document" | "Feedstock" | "Intake" | "Processing" | "Biomethane" | "Digestate" | "Farmer";

const KIND_C: Record<Kind, string> = {
  Customer: "#3ed24b", Farmer: "#3ed24b", Site: "#6fb6d9", Contract: "#8fa6ff", Contact: "#b9a6ee", Collection: "#e6c78a",
  Vehicle: "#f0803a", Driver: "#b9a6ee", Docket: "#f0c04b", Weight: "#f0c04b", Invoice: "#f0567f", Email: "#f0567f",
  Issue: "#e2705c", Document: "#8fa6ff", Feedstock: "#5fe0a8", Intake: "#5fe0a8", Processing: "#5fe0a8", Biomethane: "#7fd8a4", Digestate: "#7fd8a4",
};

type Link = { kind: Kind; label: string; detail: string; focus?: string };
type Focus = { id: string; kind: Kind; name: string; sub: string; match: string[]; links: Link[] };

const SERVICE: Kind[] = ["Customer", "Site", "Collection", "Vehicle", "Driver", "Docket", "Weight", "Invoice", "Email", "Issue", "Document"];
const ENERGY: [Kind, string][] = [["Feedstock", "Feedstock"], ["Intake", "Intake"], ["Processing", "Processing"], ["Biomethane", "Biomethane"], ["Digestate", "Digestate"], ["Farmer", "Customer / Farmer"]];

function useFocusData(): Focus[] {
  const s = useBia();
  const b = bulk204(s);
  const intDone = s.approvals.int1048 === "approved";
  return useMemo(() => [
    { id: "freshfields", kind: "Customer", name: "FreshFields Foods", sub: "Food manufacturing · 3 sites · Watch", match: ["freshfields", "fresh fields", "customer"],
      links: [
        { kind: "Site", label: "Naas production facility", detail: "Bulk pallets, 5 collections a week" },
        { kind: "Contract", label: "Service agreement 2026", detail: "Packaged food waste, signed January" },
        { kind: "Contact", label: "3 contacts", detail: "Orla Keane, Brian Tallon, Maeve Doran" },
        { kind: "Collection", label: "92 collection jobs", detail: "Year to date, 486 t collected" },
        { kind: "Collection", label: "BULK-204", detail: b.moved ? `En route on BIA-14, ETA ${b.eta} (${b.delay})` : `At risk on BIA-07, ETA ${b.delay}`, focus: "bulk204" },
        { kind: "Vehicle", label: "BIA-14", detail: b.moved ? "Assigned to BULK-204, M. Kowalski" : "Tipped INT-1048, proposed for BULK-204", focus: "bia14" },
        { kind: "Weight", label: "INT-1048", detail: "Net 19.27 t against 17.57 t expected", focus: "int1048" },
        { kind: "Docket", label: "Waste transfer docket WTD-58812", detail: "Driver sign-off 12:31, Naas" },
        { kind: "Document", label: "Sustainability report, Q3", detail: "486 t diverted, draft for October" },
        { kind: "Invoice", label: "Invoice INV-26-0418", detail: intDone ? "Line adjusted to 19.27 t in Accounting" : "September, held for INT-1048" },
        { kind: "Email", label: "Email thread: BULK-204 ETA", detail: "Orla Keane, 4 messages today" },
        { kind: "Issue", label: "Current exception", detail: intDone ? "INT-1048 accepted at 19.27 t, closed" : "INT-1048 +1.70 t variance, in review" },
      ] },
    { id: "bulk204", kind: "Collection", name: "BULK-204", sub: "Bulk pallet collection · 18.6 t expected", match: ["bulk-204", "bulk204", "bulk"],
      links: [
        { kind: "Customer", label: "FreshFields Foods", detail: "Watch account", focus: "freshfields" },
        { kind: "Site", label: "Naas production facility", detail: "Loading bay 2, pallets wrapped" },
        { kind: "Vehicle", label: "BIA-07", detail: "Hydraulic warning 12:34, off road" },
        { kind: "Vehicle", label: "BIA-14", detail: b.moved ? "Assigned, recovers to +27 min" : "Proposed replacement, recovers to +27 min", focus: "bia14" },
        { kind: "Driver", label: "Marek Kowalski", detail: "Driver on both vehicles today" },
        { kind: "Weight", label: "18.6 t expected", detail: "From customer booking" },
        { kind: "Email", label: "Revised ETA to Orla Keane", detail: b.moved ? "Sent, +27 min" : "Drafted, waiting on reassignment" },
        { kind: "Issue", label: "Workshop ticket WS-2291", detail: b.moved ? "Opened in Fleet system" : "Opens on approval" },
        { kind: "Invoice", label: "Invoice line pending", detail: "Raised after weighbridge ticket" },
      ] },
    { id: "bia14", kind: "Vehicle", name: "BIA-14", sub: "Artic Curtainsider · 231-KE-8814", match: ["bia-14", "bia14"],
      links: [
        { kind: "Driver", label: "Marek Kowalski", detail: "Assigned driver" },
        { kind: "Weight", label: "INT-1048", detail: "Tipped at 12:46, 37.42 t gross", focus: "int1048" },
        { kind: "Collection", label: "BULK-201", detail: "Complete, FreshFields Foods" },
        { kind: "Collection", label: "BULK-204", detail: b.moved ? "Assigned, en route to Naas" : "Proposed reassignment", focus: "bulk204" },
        { kind: "Customer", label: "FreshFields Foods", detail: "Two jobs today", focus: "freshfields" },
        { kind: "Document", label: "Inspection record", detail: "Last 5 Sep, next 5 Dec" },
        { kind: "Document", label: "Daily vehicle check", detail: "Completed 05:12, no defects" },
      ] },
    { id: "int1048", kind: "Weight", name: "INT-1048", sub: "Weighbridge ticket · 12:46 · BIA-14", match: ["int-1048", "int1048", "weighbridge", "ticket"],
      links: [
        { kind: "Customer", label: "FreshFields Foods", detail: "Packaged food, pallets", focus: "freshfields" },
        { kind: "Vehicle", label: "BIA-14", detail: "Gross 37.42 t, tare 18.15 t", focus: "bia14" },
        { kind: "Driver", label: "Marek Kowalski", detail: "Signed off at the bridge" },
        { kind: "Docket", label: "WTD-58812", detail: "Waste transfer docket" },
        { kind: "Intake", label: "Depackaging line 1", detail: "Destination for the load" },
        { kind: "Invoice", label: "Invoice INV-26-0418", detail: intDone ? "Adjusted to 19.27 t" : "Held until review" },
        { kind: "Issue", label: "Weight variance +1.70 t", detail: intDone ? "Accepted, note on docket" : "Review, Weighbridge Manager" },
        { kind: "Document", label: "Customer reference FF-PO-7719", detail: "Expected 17.57 t" },
      ] },
    { id: "kildare", kind: "Farmer", name: "Kildare Tillage Partners", sub: "Agriculture · biofertiliser customer", match: ["kildare", "tillage", "farmer", "digestate", "biofertiliser"],
      links: [
        { kind: "Digestate", label: "DEL-311, 22.0 t", detail: "Digestate delivery, 16:00 today" },
        { kind: "Processing", label: "Digestion, today", detail: "143.1 t processed at Huntstown" },
        { kind: "Biomethane", label: "172.4 MWh biomethane", detail: "Same batch, injected to grid" },
        { kind: "Feedstock", label: "Food waste feedstock", detail: "46% packaged, 27% liquid" },
        { kind: "Site", label: "Kilcock farms", detail: "4 spreading sites" },
        { kind: "Vehicle", label: "Contract haulier", detail: "Booked for DEL-311" },
        { kind: "Document", label: "Nutrient analysis certificate", detail: "Batch 39, N-P-K tested" },
        { kind: "Invoice", label: "Seasonal supply invoice", detail: "Raised on delivery" },
      ] },
  ], [b.moved, b.eta, b.delay, intDone]);
}

function short(t: string, n = 20) { return t.length > n ? t.slice(0, n - 1) + "…" : t; }

export default function OntologyFocus({ query }: { query?: string }) {
  const data = useFocusData();
  const [id, setId] = useState("freshfields");
  const [hot, setHot] = useState<number | null>(null);
  useEffect(() => {
    const q = (query || "").trim().toLowerCase();
    if (q.length < 3) return;
    const f = data.find((d) => d.match.some((m) => m.startsWith(q) || q.includes(m)));
    if (f) setId(f.id);
  }, [query, data]);
  const f = data.find((d) => d.id === id) || data[0];
  const kinds = new Set<Kind>([f.kind, ...f.links.map((l) => l.kind)]);
  if (kinds.has("Contract") || kinds.has("Contact")) kinds.add("Customer");
  const W = 340, H = 272, CX = W / 2, CY = H / 2, R = 104;
  const pts = f.links.map((_, i) => {
    const a = -Math.PI / 2 + (i / f.links.length) * Math.PI * 2;
    return { x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R, a };
  });

  const chip = (k: Kind, label: string) => {
    const on = kinds.has(k);
    return (
      <span style={{ fontSize: 10.5, fontWeight: 600, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap", transition: "background .25s var(--ease), color .25s var(--ease)",
        background: on ? "var(--accent-faint)" : "var(--surface-2)", color: on ? "var(--ink)" : "var(--faint)", border: "1px solid " + (on ? "var(--accent-line)" : "var(--border)") }}>
        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 6, marginRight: 5, background: on ? KIND_C[k] : "var(--track)" }} />{label}
      </span>
    );
  };
  const arrow = <span style={{ color: "var(--faint)", fontSize: 10 }}>→</span>;

  return (
    <>
      <div className="bia-onto-chains" style={{ position: "absolute", left: 14, top: 14, right: 388, zIndex: 2, display: "flex", flexDirection: "column", gap: 7, pointerEvents: "none" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9.5, letterSpacing: ".13em", color: "var(--faint)", width: 58, fontWeight: 600 }}>SERVICE</span>
          {SERVICE.map((k, i) => <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{chip(k, k)}{i < SERVICE.length - 1 && arrow}</span>)}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9.5, letterSpacing: ".13em", color: "var(--faint)", width: 58, fontWeight: 600 }}>ENERGY</span>
          {ENERGY.map(([k, l], i) => <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{chip(k, l)}{i < ENERGY.length - 1 && arrow}</span>)}
        </div>
      </div>

      <aside className="bia-onto-panel" style={{ position: "absolute", top: 14, right: 14, bottom: 14, width: "min(360px, calc(100% - 28px))", zIndex: 3, display: "flex", flexDirection: "column",
        background: "var(--overlay)", border: "1px solid var(--border)", borderRadius: 20, backdropFilter: "blur(18px) saturate(1.3)", WebkitBackdropFilter: "blur(18px) saturate(1.3)", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 9.5, letterSpacing: ".13em", color: "var(--faint)", fontWeight: 600 }}>RECORD FOCUS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
            {data.map((d) => (
              <button key={d.id} onClick={() => { setId(d.id); setHot(null); }}
                style={{ height: 26, padding: "0 10px", borderRadius: 999, fontFamily: "inherit", fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                  background: d.id === f.id ? "var(--accent-fill,var(--accent))" : "var(--surface-2)", color: d.id === f.id ? "var(--on-accent)" : "var(--dim)",
                  border: "1px solid " + (d.id === f.id ? "transparent" : "var(--border)") }}>{d.name}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <div style={{ padding: "12px 16px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: KIND_C[f.kind] }} />
              <span style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", letterSpacing: "-.3px" }}>{f.name}</span>
              <span style={{ marginLeft: "auto" }}><Pill tone="accent">{f.links.length} links</Pill></span>
            </div>
            <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 3 }}>{f.kind} · {f.sub}</div>
          </div>
          <svg key={f.id} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block", marginTop: 4 }}>
            {pts.map((p, i) => (
              <line key={"l" + i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={hot === i ? KIND_C[f.links[i].kind] : "var(--border-strong)"} strokeWidth={hot === i ? 2 : 1}
                strokeDasharray="3 4" style={{ animation: "biaDash 1.4s linear infinite", transition: "stroke .2s" }} />
            ))}
            {pts.map((p, i) => {
              const l = f.links[i], right = Math.cos(p.a) >= -0.05;
              const lx = p.x + (right ? 10 : -10), ly = p.y + (Math.sin(p.a) > 0.9 ? 14 : Math.sin(p.a) < -0.9 ? -10 : 3.5);
              const anchor = Math.abs(Math.cos(p.a)) < 0.2 ? "middle" : right ? "start" : "end";
              return (
                <g key={"n" + i} style={{ cursor: l.focus ? "pointer" : "default", animation: `biaFade .4s var(--ease) ${i * 45}ms both` }}
                  onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)} onClick={() => l.focus && setId(l.focus)}>
                  <circle cx={p.x} cy={p.y} r={hot === i ? 8 : 6.5} fill={KIND_C[l.kind]} stroke="var(--overlay)" strokeWidth="2" />
                  <text x={Math.abs(Math.cos(p.a)) < 0.2 ? p.x : lx} y={ly} textAnchor={anchor} fontSize="9.5" fill={hot === i ? "var(--ink)" : "var(--dim)"} style={{ fontFamily: "inherit" }}>{short(l.label)}</text>
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r={34} fill="var(--accent-faint)" stroke="var(--accent)" strokeWidth="1.5" />
            <circle cx={CX} cy={CY} r={44} fill="none" stroke="var(--accent-line)" strokeWidth="1" style={{ animation: "biaPulse 2.4s ease-in-out infinite" }} />
            <text x={CX} y={CY - 2} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--ink)">{short(f.name.split(" ")[0], 12)}</text>
            <text x={CX} y={CY + 11} textAnchor="middle" fontSize="8.5" fill="var(--faint)">{f.kind.toUpperCase()}</text>
          </svg>
          <div style={{ padding: "0 10px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
            {f.links.map((l, i) => (
              <div key={l.label + i} className="bia-row" onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)} onClick={() => l.focus && setId(l.focus)}
                style={{ display: "grid", gridTemplateColumns: "74px minmax(0,1fr) 12px", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 10, cursor: l.focus ? "pointer" : "default",
                  background: hot === i ? "var(--surface-2)" : undefined }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".04em", color: KIND_C[l.kind], textTransform: "uppercase" }}>{l.kind}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--ink)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.label}</span>
                  <span style={{ display: "block", fontSize: 11, color: "var(--faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.detail}</span>
                </span>
                <span style={{ color: "var(--faint)", fontSize: 12 }}>{l.focus ? "›" : ""}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "4px 16px 14px" }}>
            <div style={{ fontSize: 9.5, letterSpacing: ".13em", color: "var(--faint)", fontWeight: 600, marginBottom: 7 }}>RECORD SPINE · {RECORD_TYPES.length} ENTITY TYPES</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {(RECORD_TYPES as string[]).map((t) => (
                <span key={t} style={{ fontSize: 10.5, padding: "2px 7px", borderRadius: 7, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--dim)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--faint)", lineHeight: 1.45 }}>
          Linked automatically from Email, Weighbridge, Fleet / telematics, Accounting and Documents.
        </div>
      </aside>
    </>
  );
}
