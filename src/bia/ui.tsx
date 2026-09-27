import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { clearToast, useBia, type ApprovalState } from "./store";
import { HUNTSTOWN, type Tone, type Vehicle } from "./story";

/* Small UI kit for the Bia modules, built only on Pulse theme tokens so
   every screen inherits the active theme. */

export const toneColor: Record<Tone, string> = {
  ok: "var(--ok)", warn: "var(--warn)", bad: "var(--bad)", accent: "var(--accent)", neutral: "var(--dim)", info: "#6fb6d9",
};
const toneSoft: Record<Tone, string> = {
  ok: "var(--ok-soft)", warn: "var(--warn-soft)", bad: "var(--bad-soft)", accent: "var(--accent-soft)", neutral: "var(--surface-2)", info: "rgba(111,182,217,.14)",
};

export function statusTone(s: string): Tone {
  const k = s.toLowerCase();
  if (/(fault|reject|critical|at risk|overdue|exception|off road)/.test(k)) return "bad";
  if (/(review|maintenance|due|watch|pending|delay|queue|submitted|expir)/.test(k)) return "warn";
  if (/(complete|approved|accepted|active|available|ok|on time|valid|connected|done)/.test(k)) return "ok";
  if (/(en route|loading|on site|returning|scheduled|standby|onboarding|in progress)/.test(k)) return "info";
  return "neutral";
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: "100%", maxWidth: 1320, margin: "0 auto", boxSizing: "border-box", padding: "26px 32px 56px", animation: "pageIn .6s var(--ease) both" }}>
      {children}
      <Toast />
    </div>
  );
}

export function Head({ eyebrow, title, sub, right }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 20, flexWrap: "wrap", marginBottom: 22 }}>
      <div style={{ flex: 1, minWidth: 260 }}>
        {eyebrow && <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".16em", color: "var(--accent)" }}>{eyebrow}</div>}
        <h1 style={{ margin: eyebrow ? "8px 0 0" : 0, fontSize: 34, fontWeight: 500, letterSpacing: "-1.2px", lineHeight: 1.08, color: "var(--ink)" }}>{title}</h1>
        {sub && <div style={{ marginTop: 8, fontSize: 14, color: "var(--dim)", maxWidth: 720, lineHeight: 1.5 }}>{sub}</div>}
      </div>
      {right && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{right}</div>}
    </div>
  );
}

export type Kpi = { label: string; value: ReactNode; sub?: ReactNode; tone?: Tone; hero?: boolean };
export function Kpis({ items, min = 150 }: { items: Kpi[]; min?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`, gap: 10, marginBottom: 14 }}>
      {items.map((k, i) => (
        <div key={i} style={{ padding: "16px 18px", borderRadius: 18, background: k.hero ? "var(--accent-faint)" : "var(--surface)", border: "1px solid " + (k.hero ? "var(--accent-line)" : "var(--border)"), animation: `pageIn .5s var(--ease) ${i * 40}ms both` }}>
          <div style={{ fontSize: 11.5, color: "var(--dim)", fontWeight: 500 }}>{k.label}</div>
          <div style={{ marginTop: 8, fontSize: 26, fontWeight: 600, letterSpacing: "-.8px", color: k.tone ? toneColor[k.tone] : "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
          {k.sub && <div style={{ marginTop: 4, fontSize: 11.5, color: "var(--faint)" }}>{k.sub}</div>}
        </div>
      ))}
    </div>
  );
}

export function Grid({ cols = "repeat(12,1fr)", children, gap = 14, style }: { cols?: string; children: ReactNode; gap?: number; style?: CSSProperties }) {
  return <div className="bia-grid" style={{ display: "grid", gridTemplateColumns: cols, gap, alignItems: "stretch", ...style }}>{children}</div>;
}

export function Card({ title, sub, right, span = 12, children, pad = true, style, tone }: { title?: ReactNode; sub?: ReactNode; right?: ReactNode; span?: number; children: ReactNode; pad?: boolean; style?: CSSProperties; tone?: Tone }) {
  return (
    <section className="bia-card" style={{ gridColumn: `span ${span}`, minWidth: 0, background: "var(--surface)", border: "1px solid " + (tone ? toneColor[tone] : "var(--border)"), borderRadius: 22, display: "flex", flexDirection: "column", overflow: "hidden", ...style }}>
      {(title || right) && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 18px 0" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", letterSpacing: "-.2px" }}>{title}</div>
            {sub && <div style={{ fontSize: 12, color: "var(--faint)", marginTop: 3 }}>{sub}</div>}
          </div>
          {right}
        </div>
      )}
      <div style={{ padding: pad ? "14px 18px 18px" : "10px 0 4px", flex: 1, minHeight: 0 }}>{children}</div>
    </section>
  );
}

export function Pill({ children, tone, solid }: { children: ReactNode; tone?: Tone; solid?: boolean }) {
  const t = tone || statusTone(String(children));
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 22, padding: "0 9px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap",
      background: solid ? toneColor[t] : toneSoft[t], color: solid ? "var(--on-accent)" : toneColor[t] }}>
      <span style={{ width: 5, height: 5, borderRadius: 9, background: solid ? "var(--on-accent)" : toneColor[t] }} />
      {children}
    </span>
  );
}

export function Btn({ children, onClick, kind = "ghost", small, disabled }: { children: ReactNode; onClick?: () => void; kind?: "primary" | "ghost" | "danger"; small?: boolean; disabled?: boolean }) {
  const [down, setDown] = useState(false);
  const base: CSSProperties = { height: small ? 30 : 36, padding: small ? "0 12px" : "0 16px", borderRadius: 999, fontSize: small ? 12 : 13, fontWeight: 600, fontFamily: "inherit",
    cursor: disabled ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap", opacity: disabled ? 0.5 : 1,
    transform: down ? "translateY(1px) scale(.98)" : "none", transition: "transform .12s var(--ease), background .2s var(--ease)" };
  const look: CSSProperties = kind === "primary"
    ? { background: "var(--accent-fill,var(--accent))", color: "var(--on-accent)", border: 0, boxShadow: "var(--accent-glow,none)" }
    : kind === "danger" ? { background: "var(--bad-soft)", color: "var(--bad)", border: "1px solid transparent" }
    : { background: "var(--surface-2)", color: "var(--ink)", border: "1px solid var(--border)" };
  return (
    <button disabled={disabled} onClick={onClick} onPointerDown={() => setDown(true)} onPointerUp={() => setDown(false)} onPointerLeave={() => setDown(false)} style={{ ...base, ...look }}>
      {children}
    </button>
  );
}

export type Col<T> = { key: string; label: string; w?: string; align?: "left" | "right"; render?: (r: T) => ReactNode };
export function Table<T extends Record<string, any>>({ cols, rows, onRow, selected, rowKey = "id", dense }: { cols: Col<T>[]; rows: T[]; onRow?: (r: T) => void; selected?: string | null; rowKey?: string; dense?: boolean }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c.key} style={{ textAlign: c.align || "left", padding: "8px 14px", fontSize: 11, fontWeight: 600, color: "var(--faint)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap", width: c.w }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const k = String(r[rowKey] ?? i);
            const on = selected === k;
            return (
              <tr key={k} className="bia-row" onClick={onRow ? () => onRow(r) : undefined}
                style={{ cursor: onRow ? "pointer" : "default", background: on ? "var(--accent-faint)" : undefined, boxShadow: on ? "inset 2px 0 0 var(--accent)" : undefined }}>
                {cols.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align || "left", padding: dense ? "8px 14px" : "11px 14px", borderBottom: "1px solid var(--border)", color: "var(--body)", whiteSpace: "nowrap" }}>
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function Bar({ value, max = 100, tone = "accent", h = 6 }: { value: number; max?: number; tone?: Tone; h?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ height: h, borderRadius: 9, background: "var(--track)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: "100%", transformOrigin: "left", transform: `scaleX(${pct / 100})`, background: toneColor[tone], borderRadius: 9, transition: "transform .8s var(--ease)" }} />
    </div>
  );
}

export function Meter({ label, value, max = 100, suffix = "%", tone = "accent", note }: { label: ReactNode; value: number; max?: number; suffix?: string; tone?: Tone; note?: ReactNode }) {
  return (
    <div style={{ padding: "8px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 7 }}>
        <span style={{ color: "var(--body)" }}>{label}</span>
        <span style={{ color: "var(--ink)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{value}{suffix}{note && <span style={{ color: "var(--faint)", fontWeight: 400 }}> {note}</span>}</span>
      </div>
      <Bar value={value} max={max} tone={tone} />
    </div>
  );
}

/* Vertical bars with optional second series (plan). Values in any unit. */
export function Bars({ data, h = 150, unit = "", plan }: { data: [string, number][]; h?: number; unit?: string; plan?: number[] }) {
  const max = Math.max(...data.map((d) => d[1]), ...(plan || [0])) * 1.1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: h, paddingTop: 16 }}>
      {data.map(([l, v], i) => (
        <div key={l + i} title={`${l}: ${v}${unit}`} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 6, minWidth: 0 }}>
          <div style={{ position: "relative", width: "100%", maxWidth: 34, flex: 1, display: "flex", alignItems: "flex-end" }}>
            {plan && <div style={{ position: "absolute", left: 0, right: 0, bottom: `${(plan[i] / max) * 100}%`, borderTop: "1.5px dashed var(--faint)" }} />}
            <div style={{ width: "100%", height: `${(v / max) * 100}%`, borderRadius: "7px 7px 3px 3px", background: i === data.length - 1 ? "var(--accent)" : "var(--accent-soft)", transformOrigin: "bottom", animation: `biaGrow .7s var(--ease) ${i * 35}ms both` }} />
          </div>
          <div style={{ fontSize: 10.5, color: "var(--faint)", whiteSpace: "nowrap" }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

export function Spark({ data, w = 120, h = 34, tone = "accent" }: { data: number[]; w?: number; h?: number; tone?: Tone }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - 3 - ((v - min) / (max - min || 1)) * (h - 6)}`).join(" ");
  return <svg width={w} height={h} style={{ display: "block" }}><polyline points={pts} fill="none" stroke={toneColor[tone]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Donut({ parts, size = 132, label, sub }: { parts: { v: number; c: string }[]; size?: number; label?: ReactNode; sub?: ReactNode }) {
  const r = size / 2 - 10, C = 2 * Math.PI * r, tot = parts.reduce((a, p) => a + p.v, 0);
  let off = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth="12" />
        {parts.map((p, i) => {
          const len = (p.v / tot) * C; const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={p.c} strokeWidth="12" strokeDasharray={`${Math.max(0, len - 3)} ${C}`} strokeDashoffset={-off} />; off += len; return el;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: "var(--ink)", letterSpacing: "-.6px" }}>{label}</div>
        {sub && <div style={{ fontSize: 10.5, color: "var(--faint)" }}>{sub}</div>}
      </div>
    </div>
  );
}
export const SERIES = ["var(--accent)", "#6fb6d9", "#e6c78a", "#b9a6ee", "#e2705c", "#94a8a6"];

export function Legend({ items }: { items: { label: string; value?: ReactNode; c: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 0 }}>
      {items.map((it) => (
        <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5 }}>
          <span style={{ width: 9, height: 9, borderRadius: 3, background: it.c, flex: "none" }} />
          <span style={{ flex: 1, color: "var(--body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.label}</span>
          {it.value != null && <span style={{ color: "var(--ink)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{it.value}</span>}
        </div>
      ))}
    </div>
  );
}

export function KV({ rows, cols = 2 }: { rows: [string, ReactNode][]; cols?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},minmax(0,1fr))`, gap: "12px 18px" }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, color: "var(--faint)" }}>{k}</div>
          <div style={{ fontSize: 13.5, color: "var(--ink)", marginTop: 3, fontWeight: 500 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

/* Right-hand detail drawer, over the page. */
export function Drawer({ open, onClose, title, sub, children, width = 520 }: { open: boolean; onClose: () => void; title: ReactNode; sub?: ReactNode; children: ReactNode; width?: number }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--scrim)", animation: "biaFade .25s var(--ease) both" }} />
      <aside style={{ position: "absolute", top: 12, right: 12, bottom: 12, width: `min(${width}px, calc(100vw - 24px))`, background: "var(--overlay)", border: "1px solid var(--border-strong)", borderRadius: 24, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.45)", animation: "biaDrawer .38s var(--ease) both" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "20px 22px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-.5px", color: "var(--ink)" }}>{title}</div>
            {sub && <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--dim)" }}>{sub}</div>}
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 32, height: 32, borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--dim)", cursor: "pointer", fontSize: 16 }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px 26px", display: "flex", flexDirection: "column", gap: 18 }}>{children}</div>
      </aside>
    </div>
  );
}

export function Section({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <div style={{ flex: 1, fontSize: 11, fontWeight: 600, letterSpacing: ".12em", color: "var(--faint)", textTransform: "uppercase" }}>{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

/* A Pulse agent speaking: recommendation with actions. */
export function AgentNote({ agent = "Pulse", children, actions, state }: { agent?: string; children: ReactNode; actions?: ReactNode; state?: ApprovalState }) {
  return (
    <div style={{ position: "relative", padding: "14px 16px", borderRadius: 18, background: "linear-gradient(135deg,var(--accent-faint),transparent 70%), var(--surface-2)", border: "1px solid var(--accent-line)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 600, color: "var(--accent)" }}>
        <span style={{ width: 18, height: 18, borderRadius: 7, background: "var(--accent)", color: "var(--on-accent)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>✦</span>
        {agent}
        {state && state !== "pending" && <span style={{ marginLeft: "auto" }}><Pill tone={state === "approved" ? "ok" : "bad"}>{state === "approved" ? "Approved" : "Rejected"}</Pill></span>}
      </div>
      <div style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.55, color: "var(--body)" }}>{children}</div>
      {actions && <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>{actions}</div>}
    </div>
  );
}

export function WriteBackBadge({ system }: { system: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "var(--ok-soft)", color: "var(--ok)", fontSize: 11.5, fontWeight: 600, animation: "biaFade .4s var(--ease) both" }}>
      ✓ Updated in {system}
    </span>
  );
}

export function Timeline({ items }: { items: { time: string; text: ReactNode; who?: string; tone?: Tone }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 12, position: "relative" }}>
          <div style={{ width: 44, flex: "none", fontSize: 11.5, color: "var(--faint)", paddingTop: 1, fontVariantNumeric: "tabular-nums" }}>{it.time}</div>
          <div style={{ width: 9, flex: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ width: 9, height: 9, borderRadius: 9, marginTop: 4, background: toneColor[it.tone || "neutral"] }} />
            {i < items.length - 1 && <span style={{ flex: 1, width: 1, background: "var(--border-strong)", marginTop: 3 }} />}
          </div>
          <div style={{ flex: 1, fontSize: 13, color: "var(--body)", lineHeight: 1.45 }}>
            {it.who && <span style={{ color: "var(--ink)", fontWeight: 600 }}>{it.who} · </span>}{it.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "inline-flex", padding: 3, borderRadius: 999, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} style={{ height: 28, padding: "0 12px", borderRadius: 999, border: 0, fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer",
          background: value === o ? "var(--pill-bg)" : "transparent", color: value === o ? "var(--accent)" : "var(--dim)", transition: "background .2s var(--ease)" }}>{o}</button>
      ))}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      style={{ height: 34, minWidth: 220, padding: "0 14px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ink)", fontFamily: "inherit", fontSize: 13, outline: "none" }} />
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div style={{ padding: "28px 12px", textAlign: "center", color: "var(--faint)", fontSize: 13 }}>{children}</div>;
}

/* Schematic map of Dublin / Leinster with Huntstown at the centre.
   x/y are 0–100 positions within the frame. */
export function RouteMap({ vehicles, selected, onPick, h = 360, labels = true }: { vehicles: Vehicle[]; selected?: string | null; onPick?: (id: string) => void; h?: number; labels?: boolean }) {
  const places: [string, number, number][] = [["Drogheda", 64, 6], ["Navan", 28, 18], ["Swords", 62, 29], ["Blanchardstown", 36, 49], ["Dublin", 57, 56], ["Tallaght", 44, 73], ["Naas", 24, 80], ["Carlow", 14, 97], ["Bray", 66, 84]];
  return (
    <div style={{ position: "relative", height: h, borderRadius: 18, overflow: "hidden", background: "radial-gradient(60% 60% at 45% 40%, var(--accent-faint), transparent 70%), var(--surface-2)", border: "1px solid var(--border)" }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs><pattern id="biagrid" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M6 0H0V6" fill="none" stroke="var(--grid)" strokeWidth=".3" /></pattern></defs>
        <rect width="100" height="100" fill="url(#biagrid)" />
        <path d="M78 0 C70 18 74 30 68 44 C64 54 70 60 72 70 C74 82 70 92 76 100 L100 100 L100 0 Z" fill="rgba(111,182,217,.07)" />
        {/* motorways */}
        {["M45 38 L62 12 L66 0", "M45 38 L30 18 L24 0", "M45 38 L36 50 L28 74 L16 100", "M45 38 L56 52 L62 74 L68 100", "M36 50 C44 64 56 64 62 52 C64 40 56 34 45 38"].map((d) => (
          <path key={d} d={d} fill="none" stroke="var(--border-strong)" strokeWidth=".6" vectorEffect="non-scaling-stroke" />
        ))}
        {vehicles.filter((v) => v.status === "Active" || v.id === selected).map((v) => (
          <path key={v.id} d={`M${HUNTSTOWN.x} ${HUNTSTOWN.y} L${v.x} ${v.y}`} fill="none" stroke={v.id === selected ? "var(--accent)" : "var(--accent-line)"} strokeWidth={v.id === selected ? 2 : 1} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" style={{ animation: "biaDash 1.2s linear infinite" }} />
        ))}
      </svg>
      {labels && places.map(([n, x, y]) => (
        <span key={n} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", fontSize: 10.5, color: "var(--faint)", pointerEvents: "none", whiteSpace: "nowrap" }}>{n}</span>
      ))}
      <div style={{ position: "absolute", left: `${HUNTSTOWN.x}%`, top: `${HUNTSTOWN.y}%`, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 6, pointerEvents: "none" }}>
        <span style={{ width: 16, height: 16, borderRadius: 6, background: "var(--accent)", boxShadow: "0 0 0 6px var(--accent-soft), var(--accent-glow)" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink)", background: "var(--overlay)", padding: "2px 7px", borderRadius: 8 }}>Huntstown</span>
      </div>
      {vehicles.filter((v) => !(v.x === HUNTSTOWN.x && v.y === HUNTSTOWN.y)).map((v) => {
        const t: Tone = v.status === "Fault" ? "bad" : v.status === "Maintenance" ? "warn" : v.status === "Standby" ? "neutral" : "accent";
        const on = selected === v.id;
        return (
          <button key={v.id} onClick={() => onPick?.(v.id)} title={`${v.id} · ${v.route}`}
            style={{ position: "absolute", left: `${v.x}%`, top: `${v.y}%`, transform: `translate(-50%,-50%)`, display: "flex", alignItems: "center", gap: 5, padding: "3px 8px 3px 4px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
              background: on ? toneColor[t] : "var(--overlay)", color: on ? "var(--on-accent)" : "var(--ink)", border: "1px solid " + (on ? "transparent" : "var(--border-strong)"), fontSize: 10.5, fontWeight: 700, zIndex: on ? 3 : 2, transition: "background .2s var(--ease)" }}>
            <span style={{ width: 9, height: 9, borderRadius: 9, background: on ? "var(--on-accent)" : toneColor[t], animation: v.status === "Fault" ? "biaPulse 1.4s ease-in-out infinite" : undefined }} />
            {v.id}
          </button>
        );
      })}
    </div>
  );
}

export function Toast() {
  const { toast } = useBia();
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 4200);
    return () => clearTimeout(t);
  }, [toast?.n]);
  if (!toast) return null;
  return (
    <div key={toast.n} role="status" style={{ position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)", zIndex: 80, display: "flex", alignItems: "center", gap: 12, padding: "12px 18px 12px 12px", borderRadius: 18, background: "var(--overlay)", border: "1px solid var(--accent-line)", boxShadow: "0 20px 50px rgba(0,0,0,.4)", animation: "biaToast .4s var(--ease) both", maxWidth: "min(560px, calc(100vw - 32px))" }}>
      <span style={{ width: 30, height: 30, borderRadius: 10, background: "var(--accent)", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flex: "none" }}>✓</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{toast.text}</div>
        {toast.sub && <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 2 }}>{toast.sub}</div>}
      </div>
    </div>
  );
}
