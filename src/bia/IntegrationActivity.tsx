import { useBia } from "./store";
import { Pill } from "./ui";

/* Recent traffic across the connected systems. Approved write-backs from the
   shared store appear on top, ahead of the standing examples. */

type Row = { time: string; system: string; dir: "In" | "Out"; text: string };

const BASE: Row[] = [
  { time: "13:04", system: "Fleet / telematics", dir: "In", text: "Fleet system synced vehicle status for 16 vehicles. BIA-07 reported Fault." },
  { time: "12:47", system: "Weighbridge", dir: "In", text: "Weighbridge imported INT-1048: 37.42 t gross, 18.15 t tare, 19.27 t net." },
  { time: "12:40", system: "Accounting", dir: "In", text: "Accounting updated payment status: GreenMart paid INV-26-0402." },
  { time: "12:38", system: "Email", dir: "In", text: "Email thread linked to FreshFields Foods: BULK-204 collection window." },
  { time: "12:20", system: "Plant / SCADA data", dir: "In", text: "Digester 2 feed restored at 11:58 after a 22 minute pause." },
  { time: "11:52", system: "Documents", dir: "In", text: "WTD-58811 docket filed against GreenMart, Clonsilla." },
  { time: "11:31", system: "Fleet / telematics", dir: "Out", text: "Pulse pushed approved route reassignment: COL-1847 moved from BIA-01 to BIA-03." },
];

export default function IntegrationActivity() {
  const s = useBia();
  const live: Row[] = s.writeBacks.map((w) => ({ time: w.time, system: w.system, dir: "Out", text: w.text }));
  const rows: Row[] = [
    ...live,
    ...BASE,
  ];
  return (
    <div style={{ marginTop: 16, background: "var(--chip)", border: "1px solid var(--chip-border)", borderRadius: "var(--card-r,18px)", padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Integration activity</div>
        <span style={{ fontSize: 11, color: "var(--faint)" }}>In: read from the system · Out: written back by Pulse after approval</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {rows.slice(0, 9).map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "54px 132px 44px minmax(0,1fr)", alignItems: "center", gap: 10, padding: "8px 0", borderTop: i ? "1px solid var(--border)" : 0, fontSize: 12.5 }}>
            <span style={{ color: "var(--faint)", fontVariantNumeric: "tabular-nums" }}>{r.time}</span>
            <span style={{ color: "var(--ink)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.system}</span>
            <span><Pill tone={r.dir === "Out" ? "accent" : "info"}>{r.dir}</Pill></span>
            <span style={{ color: "var(--body)", minWidth: 0 }}>{r.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
