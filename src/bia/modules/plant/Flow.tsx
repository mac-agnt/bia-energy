import type { ReactNode } from "react";
import { TODAY } from "../../story";
import { Bar, type Kpi } from "../../ui";

/* Operational material flow: Incoming → Accepted → Processing → Biomethane + Digestate.
   Connectors animate with biaFlow / biaDash, which bia.css disables under reduced motion. */

const CSS = `
.pl-flow{display:flex;align-items:stretch}
.pl-node{flex:1 1 0;min-width:0}
.pl-conn{flex:0 0 44px;display:flex;align-items:center;justify-content:center}
.pl-fork{flex:0 0 56px;position:relative;align-self:stretch}
.pl-outs{flex:1.15 1 0;min-width:0;display:flex;flex-direction:column;gap:12px}
.pl-mob{display:none}
@media (max-width:900px){
  .pl-flow{flex-direction:column}
  .pl-conn{flex-basis:30px}
  .pl-conn .pl-line{transform:rotate(90deg)}
  .pl-fork{display:none}
  .pl-mob{display:flex}
}
@media (prefers-reduced-motion: reduce){.pl-flow *{animation:none !important}}
`;

type NodeProps = { label: string; value: ReactNode; unit?: string; sub: ReactNode; pct?: number; pctLabel?: ReactNode; hero?: boolean; tone?: Kpi["tone"]; compact?: boolean; delay?: number };

function Node({ label, value, unit, sub, pct, pctLabel, hero, tone = "accent", compact, delay = 0 }: NodeProps) {
  return (
    <div className="pl-node" style={{ padding: compact ? "14px 16px" : "18px 18px 16px", borderRadius: 18, display: "flex", flexDirection: "column", gap: 6,
      background: hero ? "linear-gradient(155deg,var(--accent-faint),transparent 72%), var(--surface-2)" : "var(--surface-2)",
      border: "1px solid " + (hero ? "var(--accent-line)" : "var(--border)"), animation: `pageIn .55s var(--ease) ${delay}ms both` }}>
      <div style={{ fontSize: 11.5, color: hero ? "var(--accent)" : "var(--dim)", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: compact ? 26 : 32, fontWeight: 600, letterSpacing: "-1.1px", color: "var(--ink)", fontVariantNumeric: "tabular-nums", lineHeight: 1.05 }}>
        {value}{unit && <span style={{ fontSize: 14, color: "var(--dim)", fontWeight: 500, marginLeft: 5, letterSpacing: 0 }}>{unit}</span>}
      </div>
      <div style={{ fontSize: 12, color: "var(--faint)", lineHeight: 1.45, flex: 1 }}>{sub}</div>
      {pct != null && (
        <div style={{ marginTop: 4 }}>
          <Bar value={pct} tone={tone} h={5} />
          <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{pctLabel}</div>
        </div>
      )}
    </div>
  );
}

function Conn({ mob }: { mob?: boolean }) {
  return (
    <div className={"pl-conn" + (mob ? " pl-mob" : "")} aria-hidden>
      <div className="pl-line" style={{ position: "relative", width: 40, height: 2, borderRadius: 2, background: "var(--accent-line)" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 2 }}>
          <span style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "35%", background: "linear-gradient(90deg,transparent,var(--accent),transparent)", animation: "biaFlow 1.4s linear infinite" }} />
        </div>
        <span style={{ position: "absolute", right: 0, top: -3, width: 7, height: 7, borderTop: "2px solid var(--accent)", borderRight: "2px solid var(--accent)", transform: "rotate(45deg)" }} />
      </div>
    </div>
  );
}

function Fork() {
  const paths = ["M0 50 C30 50 26 24 56 24", "M0 50 C30 50 26 76 56 76"];
  return (
    <div className="pl-fork" aria-hidden>
      <svg viewBox="0 0 56 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        {paths.map((d) => (
          <g key={d}>
            <path d={d} fill="none" stroke="var(--accent-line)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 12" vectorEffect="non-scaling-stroke" style={{ animation: "biaDash 1.2s linear infinite" }} />
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function Flow({ reviewPending }: { reviewPending: boolean }) {
  const acceptPct = (TODAY.acceptedT / TODAY.intakeT) * 100;
  const fedPct = (TODAY.processedT / TODAY.acceptedT) * 100;
  return (
    <>
      <style>{CSS}</style>
      <div className="pl-flow">
        <Node delay={0} label="Incoming" value={TODAY.intakeT.toFixed(1)} unit="t" sub={`Weighed in at Huntstown today. Plan ${TODAY.intakePlanT} t.`}
          pct={TODAY.plantThroughput} pctLabel={`${TODAY.plantThroughput}% of plan`} tone="warn" />
        <Conn />
        <Node delay={60} label="Accepted" value={TODAY.acceptedT.toFixed(1)} unit="t"
          sub={<>3.7 t rejected (INT-1041). {reviewPending ? "19.27 t held for review (INT-1048)." : "INT-1048 accepted at 19.27 t."}</>}
          pct={acceptPct} pctLabel={`${acceptPct.toFixed(1)}% acceptance`} />
        <Conn />
        <Node delay={120} label="Processing" value={TODAY.processedT.toFixed(1)} unit="t" sub={`Fed to digesters at ${TODAY.processingRate}. Queue ${TODAY.queueT} t.`}
          pct={fedPct} pctLabel={`${fedPct.toFixed(1)}% of accepted fed`} />
        <Fork />
        <Conn mob />
        <div className="pl-outs">
          <Node compact hero delay={180} label="Biomethane to grid" value="1,340" unit="Nm³/h" sub={<><b style={{ color: "var(--ink)", fontWeight: 600 }}>{TODAY.biomethaneMWh} MWh</b> injected today</>} />
          <Node compact delay={240} label="Digestate" value={TODAY.digestateT.toFixed(1)} unit="t" sub="Biofertiliser today. DEL-311, 22 t out at 16:00." />
        </div>
      </div>
    </>
  );
}
