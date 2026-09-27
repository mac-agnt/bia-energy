import type { ReactNode } from "react";
import { toneColor } from "../../ui";
import type { Tone } from "../../story";

/* Small local helpers shared by the Customers and Compliance modules.
   Built on Pulse theme tokens only. */

export function ListRow({ title, sub, right, tone, lead, onClick, first }: { title: ReactNode; sub?: ReactNode; right?: ReactNode; tone?: Tone; lead?: ReactNode; onClick?: () => void; first?: boolean }) {
  return (
    <div className={onClick ? "bia-row" : undefined} onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", borderTop: first ? 0 : "1px solid var(--border)", cursor: onClick ? "pointer" : "default" }}>
      {lead ?? (tone && <span style={{ width: 8, height: 8, borderRadius: 8, background: toneColor[tone], flex: "none" }} />)}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", lineHeight: 1.35 }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 3, lineHeight: 1.45 }}>{sub}</div>}
      </div>
      {right && <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "none", flexWrap: "wrap", justifyContent: "flex-end" }}>{right}</div>}
    </div>
  );
}

export function Chips({ options, value, onChange, counts }: { options: string[]; value: string; onChange: (v: string) => void; counts?: Record<string, number> }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map((o) => {
        const on = o === value;
        return (
          <button key={o} onClick={() => onChange(o)}
            style={{ height: 30, padding: "0 12px", borderRadius: 999, border: "1px solid " + (on ? "var(--accent-line)" : "var(--border)"), background: on ? "var(--accent-faint)" : "var(--surface-2)",
              color: on ? "var(--accent)" : "var(--dim)", fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: "background .2s var(--ease)" }}>
            {o}
            {counts && counts[o] != null && <span style={{ color: on ? "var(--accent)" : "var(--faint)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{counts[o]}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Toolbar({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
      {children}
      {right && <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>{right}</div>}
    </div>
  );
}

export function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  const ini = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <span style={{ width: size, height: size, borderRadius: size, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700,
      background: "var(--accent-faint)", color: "var(--accent)", border: "1px solid var(--accent-line)" }}>{ini}</span>
  );
}

export function Stat({ label, value, sub, tone }: { label: ReactNode; value: ReactNode; sub?: ReactNode; tone?: Tone }) {
  return (
    <div style={{ padding: "12px 14px", borderRadius: 16, background: "var(--surface-2)", border: "1px solid var(--border)", minWidth: 0 }}>
      <div style={{ fontSize: 11, color: "var(--faint)" }}>{label}</div>
      <div style={{ marginTop: 5, fontSize: 19, fontWeight: 600, letterSpacing: "-.5px", color: tone ? toneColor[tone] : "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {sub && <div style={{ marginTop: 2, fontSize: 11, color: "var(--faint)" }}>{sub}</div>}
    </div>
  );
}

export function StatRow({ children, min = 140 }: { children: ReactNode; min?: number }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`, gap: 8 }}>{children}</div>;
}

/* Horizontal labelled bar, value on the right. */
export function HRow({ label, value, max, display, sub, tone = "accent", color }: { label: ReactNode; value: number; max: number; display: ReactNode; sub?: ReactNode; tone?: Tone; color?: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <div style={{ padding: "7px 0" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, fontSize: 12.5, marginBottom: 6 }}>
        <span style={{ flex: 1, minWidth: 0, color: "var(--body)" }}>{label}{sub && <span style={{ color: "var(--faint)" }}> · {sub}</span>}</span>
        <span style={{ color: "var(--ink)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{display}</span>
      </div>
      <div style={{ height: 6, borderRadius: 9, background: "var(--track)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: "100%", transformOrigin: "left", transform: `scaleX(${pct})`, background: color || toneColor[tone], borderRadius: 9, transition: "transform .8s var(--ease)" }} />
      </div>
    </div>
  );
}

export function Note({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <div style={{ padding: "10px 12px", borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 12.5, lineHeight: 1.5, color: "var(--body)", display: "flex", gap: 10 }}>
      <span style={{ width: 7, height: 7, marginTop: 6, borderRadius: 7, background: toneColor[tone], flex: "none" }} />
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}

export const n0 = (n: number) => Math.round(n).toLocaleString("en-IE");
export const eur = (n: number) => "€" + Math.round(n).toLocaleString("en-IE");
