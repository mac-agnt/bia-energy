/* Bia Home: today's KPI strip, the AI briefing and question chips. Sits under
   the greeting on the empty chat view; everything comes from PulseLogic. */

type Kpi = { label: string; value: string; hint: string; valueColor: string; delay: string; open: () => void };
type Briefing = {
  eyebrow: string; text: string; status: string; statusColor: string; reviewLabel: string;
  review: () => void; viewRoute: () => void; askPulse: () => void;
};
type Chip = { label: string; run: () => void };
type Props = { v: { homeKpis?: Kpi[]; homeBriefing?: Briefing; suggestions?: Chip[] } };

const card = {
  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--card-r,18px)",
  backdropFilter: "blur(20px) saturate(1.3)", boxShadow: "var(--card-shadow)",
} as const;

export default function HomeBriefing({ v }: Props) {
  const kpis = v.homeKpis || [];
  const b = v.homeBriefing;
  const chips = v.suggestions || [];
  return (
    <div style={{ width: "100%", maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12, textAlign: "left", padding: "0 2px 14px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 8 }}>
        {kpis.map((k, i) => (
          <button key={i} className="ixe" onClick={k.open} title={"Open " + k.label}
            style={{ ...card, boxShadow: "none", padding: "11px 13px 12px", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 4, minWidth: 0,
              transition: "border-color .2s var(--ease),transform .18s var(--ease)", animation: "rowIn .34s var(--ease) " + k.delay + " both" }}>
            <span style={{ fontSize: 11, color: "var(--dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{k.label}</span>
            <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-.5px", lineHeight: 1.1, color: k.valueColor, fontVariantNumeric: "tabular-nums" }}>{k.value}</span>
            <span style={{ fontSize: 10.5, color: "var(--faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{k.hint}</span>
          </button>
        ))}
      </div>
      {b && (
        <div style={{ ...card, padding: "16px 18px 16px", animation: "rowIn .4s var(--ease) 200ms both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
            <span style={{ width: 22, height: 22, flex: "none", borderRadius: "var(--r-sm,8px)", background: "var(--accent-soft)", border: "1px solid var(--accent-line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l2.5-6 3.5 12 3-8 2 2h5" /></svg>
            </span>
            <span style={{ flex: 1, fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".14em", color: "var(--accent)" }}>{b.eyebrow}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: b.statusColor }}>
              <span style={{ width: 6, height: 6, borderRadius: 2, background: b.statusColor }} />
              {b.status}
            </span>
          </div>
          <div style={{ marginTop: 11, fontSize: 14, lineHeight: 1.62, color: "var(--body)", textWrap: "pretty" }}>{b.text}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            <button className="ixp" onClick={b.review} style={{ height: 32, padding: "0 15px", border: 0, borderRadius: "var(--cta-r,9px)", background: "var(--accent-fill,var(--accent))", color: "var(--on-accent)", boxShadow: "var(--accent-glow,none)", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>{b.reviewLabel}</button>
            <button className="ixz" onClick={b.viewRoute} style={{ height: 32, padding: "0 14px", border: "1px solid var(--border)", borderRadius: "var(--r-ctl,9px)", background: "none", color: "var(--ink)", fontSize: 12.5, cursor: "pointer" }}>View route</button>
            <button className="ixz" onClick={b.askPulse} style={{ height: 32, padding: "0 14px", border: "1px solid var(--accent-line)", borderRadius: "var(--r-ctl,9px)", background: "var(--accent-faint)", color: "var(--ink)", fontSize: 12.5, cursor: "pointer" }}>Ask Pulse</button>
          </div>
        </div>
      )}
      {chips.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
          {chips.map((c, i) => (
            <button key={i} className="ixe" onClick={c.run} style={{ height: 28, padding: "0 12px", border: "1px solid var(--border)", borderRadius: 999, background: "var(--surface-faint)", backdropFilter: "blur(16px)", color: "var(--dim)", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>{c.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}
