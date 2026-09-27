/* What an agent is allowed to do: skills, connected systems with the access
   granted, and its recent runs. A side column when wide, a card on top of
   the thread when narrow. */

type Skill = { label: string; effect: string; effectColor: string };
type System = { label: string; access: string; accessColor: string };
type Run = { when: string; what: string; result: string; dot: string; resultColor: string };
export type AgentProfileModel = {
  show: boolean; wide: boolean; compact: boolean; access: string; readCount: string; writeCount: string;
  skills: Skill[]; systems: System[]; runs: Run[];
};

const label = { fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".14em", color: "var(--faint)" } as const;

export default function AgentProfile({ p, compact }: { p: AgentProfileModel; compact?: boolean }) {
  const section = (title: string, extra?: string) => (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "18px 0 8px" }}>
      <span style={{ ...label, flex: 1 }}>{title}</span>
      {extra && <span style={{ ...label, letterSpacing: ".06em" }}>{extra}</span>}
    </div>
  );
  const wrap = compact
    ? { margin: "4px auto 18px", maxWidth: 720, padding: "4px 16px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--card-r,18px)" }
    : { width: 300, flex: "none" as const, minHeight: 0, overflowY: "auto" as const, borderLeft: "1px solid var(--border)", padding: "8px 18px 20px", scrollbarWidth: "none" as const };
  return (
    <div style={wrap}>
      {section("ACCESS")}
      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--body)" }}>{p.access}</div>
      <div style={{ display: compact ? "grid" : "block", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", columnGap: 18 }}>
        <div>
          {section("SKILLS", p.readCount + " READ · " + p.writeCount + " WRITE")}
          {p.skills.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
              <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: "var(--ink)" }}>{s.label}</span>
              <span style={{ ...label, fontSize: 8.5, color: s.effectColor }}>{s.effect}</span>
            </div>
          ))}
        </div>
        <div>
          {section("CONNECTED SYSTEMS")}
          {p.systems.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
              <span style={{ width: 6, height: 6, flex: "none", borderRadius: 2, background: s.accessColor }} />
              <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: "var(--ink)" }}>{s.label}</span>
              <span style={{ fontSize: 11, color: s.accessColor }}>{s.access}</span>
            </div>
          ))}
        </div>
      </div>
      {section("RECENT RUNS")}
      {p.runs.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 9, padding: "7px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
          <span style={{ width: 6, height: 6, flex: "none", borderRadius: 2, marginTop: 6, background: r.dot }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, lineHeight: 1.4, color: "var(--ink)" }}>{r.what}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--faint)", marginTop: 2 }}>
              {r.when} · <span style={{ color: r.resultColor }}>{r.result}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
