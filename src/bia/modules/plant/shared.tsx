import type { ReactNode } from "react";
import { useBia } from "../../store";
import { INTAKE, JOBS, VEHICLES, type Intake, type Tone } from "../../story";
import { toneColor } from "../../ui";

/* Shared Plant data and small visuals. Figures reconcile with TODAY in story.ts:
   incoming 153.4 t, accepted 149.7 t (INT-1041 3.7 t rejected), processed 143.1 t,
   queue 6.6 t. Demo mock values. */

export const NOW = "13:05";

/* Intake with INT-1048 reflecting the shared approval state. */
export function useIntake(): Intake[] {
  const s = useBia();
  return INTAKE.map((i) => (i.id === "INT-1048" && s.approvals.int1048 === "approved" ? { ...i, status: "Accepted" as const } : i));
}

export function linkedJob(i: Intake) {
  return JOBS.find((j) => j.vehicle === i.vehicle && j.actual != null && Math.abs(j.actual - i.net) < 0.01);
}

export const ticketNo = (i: Intake) => "WB-" + i.id.slice(4);
export const pctDiff = (i: Intake) => ((i.net - i.expected) / i.expected) * 100;
export const fmt2 = (n: number) => n.toFixed(2) + " t";

/* Hourly intake to 13:00 sums to 153.4 t; plan sums to 160 t. */
export const HOURLY_INTAKE: [string, number][] = [["05", 6.4], ["06", 7.9], ["07", 9.6], ["08", 10.0], ["09", 21.3], ["10", 23.6], ["11", 24.0], ["12", 50.6]];
export const HOURLY_PLAN = [8, 10, 12, 14, 22, 26, 28, 40];

/* Digester feed rate, t/h. The 11:00 dip is the 22 min Digester 2 feed pause. */
export const RATE_TREND: [string, number][] = [["05", 11.6], ["06", 11.8], ["07", 12.1], ["08", 12.3], ["09", 12.0], ["10", 12.2], ["11", 9.4], ["12", 11.9]];
export const RATE_TARGET = 12.0;

/* Vehicles heading back to Huntstown, soonest first, from the fleet record. */
export function inbound() {
  return VEHICLES.map((v) => ({ v, m: /Return Huntstown (\d\d:\d\d)/.exec(v.next) }))
    .filter((x): x is { v: (typeof VEHICLES)[number]; m: RegExpExecArray } => !!x.m)
    .map(({ v, m }) => ({ id: v.id, time: m[1], route: v.route, driver: v.driver, type: v.type }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function Mono({ children, dim }: { children: ReactNode; dim?: boolean }) {
  return <span style={{ fontWeight: 600, color: dim ? "var(--dim)" : "var(--ink)", fontVariantNumeric: "tabular-nums", letterSpacing: "-.1px" }}>{children}</span>;
}

export function Stat({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: Tone }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 11, color: "var(--faint)" }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 18, fontWeight: 600, letterSpacing: "-.4px", color: tone ? toneColor[tone] : "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

/* Row in a list: tone dot, title, sub, optional right side. */
export function ListRow({ tone = "neutral", title, sub, right, onClick, active }: { tone?: Tone; title: ReactNode; sub?: ReactNode; right?: ReactNode; onClick?: () => void; active?: boolean }) {
  return (
    <div className="bia-row" onClick={onClick} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 12px", borderRadius: 14, cursor: onClick ? "pointer" : "default",
      background: active ? "var(--accent-faint)" : undefined, boxShadow: active ? "inset 0 0 0 1px var(--accent-line)" : undefined }}>
      <span style={{ width: 8, height: 8, borderRadius: 9, marginTop: 5, flex: "none", background: toneColor[tone] }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 3, lineHeight: 1.45 }}>{sub}</div>}
      </div>
      {right && <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 8 }}>{right}</div>}
    </div>
  );
}

/* Document checklist line. */
export function DocRow({ name, value, state }: { name: string; value: ReactNode; state: "ok" | "warn" | "bad" }) {
  const mark = state === "ok" ? "✓" : state === "warn" ? "…" : "×";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 14, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
      <span style={{ width: 26, height: 26, borderRadius: 9, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
        background: `var(--${state}-soft)`, color: toneColor[state] }}>{mark}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 1 }}>{value}</div>
      </div>
    </div>
  );
}

/* Gross = tare + net stacked bar, then net against expected with the variance highlighted. */
export function WeighBars({ i, max = 40 }: { i: Intake; max?: number }) {
  const w = (t: number) => `${(t / max) * 100}%`;
  const over = i.net > i.expected;
  const lo = Math.min(i.net, i.expected), hi = Math.max(i.net, i.expected);
  const label = (t: string, v: string, c = "var(--ink)") => (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
      <span style={{ color: "var(--dim)" }}>{t}</span><span style={{ color: c, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{v}</span>
    </div>
  );
  const track = { position: "relative" as const, height: 16, borderRadius: 8, background: "var(--track)", overflow: "hidden" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        {label("Gross", fmt2(i.gross))}
        <div style={{ ...track, display: "flex" }}>
          <div title={`Tare ${fmt2(i.tare)}`} style={{ width: w(i.tare), background: "var(--border-strong)" }} />
          <div title={`Net ${fmt2(i.net)}`} style={{ width: w(i.net), background: "var(--accent)", opacity: 0.9 }} />
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 11, color: "var(--faint)" }}>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "var(--border-strong)", marginRight: 5 }} />Tare {fmt2(i.tare)}</span>
          <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "var(--accent)", marginRight: 5 }} />Net {fmt2(i.net)}</span>
        </div>
      </div>
      <div>
        {label("Net weighed", fmt2(i.net))}
        <div style={track}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: w(lo), background: "var(--accent)" }} />
          <div style={{ position: "absolute", left: w(lo), top: 0, bottom: 0, width: `${((hi - lo) / max) * 100}%`,
            background: over ? "repeating-linear-gradient(135deg,var(--warn) 0 4px,transparent 4px 8px)" : "var(--track)", boxShadow: "inset 0 0 0 1px var(--warn)" }} />
        </div>
      </div>
      <div>
        {label("Expected (customer order)", fmt2(i.expected), "var(--dim)")}
        <div style={track}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: w(i.expected), border: "1.5px dashed var(--faint)", borderRadius: 8, boxSizing: "border-box" }} />
        </div>
      </div>
    </div>
  );
}

/* Semicircle gauge of variance %, with the acceptance tolerance band. */
export function VarianceGauge({ pct, tol = 5, range = 15, label }: { pct: number; tol?: number; range?: number; label?: ReactNode }) {
  const cx = 120, cy = 118, r = 92;
  const ang = (p: number) => Math.PI * (1 - (Math.max(-range, Math.min(range, p)) + range) / (2 * range));
  const pt = (p: number, rr = r): [number, number] => [cx + rr * Math.cos(ang(p)), cy - rr * Math.sin(ang(p))];
  const arc = (a: number, b: number) => { const [x1, y1] = pt(a), [x2, y2] = pt(b); return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`; };
  const [nx, ny] = pt(pct, r - 18);
  const out = Math.abs(pct) > tol;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg viewBox="0 0 240 132" style={{ width: "100%", maxWidth: 260, display: "block" }}>
        <path d={arc(-range, -tol)} fill="none" stroke="var(--warn-soft)" strokeWidth="16" />
        <path d={arc(-tol, tol)} fill="none" stroke="var(--ok-soft)" strokeWidth="16" />
        <path d={arc(tol, range)} fill="none" stroke="var(--warn-soft)" strokeWidth="16" />
        <path d={arc(-tol, tol)} fill="none" stroke="var(--ok)" strokeWidth="2" />
        <path d={arc(pct >= 0 ? 0 : pct, pct >= 0 ? pct : 0)} fill="none" stroke={out ? "var(--warn)" : "var(--ok)"} strokeWidth="16" style={{ animation: "biaFade .6s var(--ease) both" }} />
        {[-range, -tol, 0, tol, range].map((p) => {
          const [x2, y2] = pt(p, r + 18);
          return (
            <g key={p}>
              <line x1={pt(p, r - 9)[0]} y1={pt(p, r - 9)[1]} x2={pt(p, r + 8)[0]} y2={pt(p, r + 8)[1]} stroke="var(--border-strong)" strokeWidth="1" />
              <text x={x2} y={y2 + 3} fontSize="9" fill="var(--faint)" textAnchor={p < 0 ? "end" : p > 0 ? "start" : "middle"} style={{ fontVariantNumeric: "tabular-nums" }}>{p > 0 ? "+" : ""}{p}%</text>
            </g>
          );
        })}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="6" fill="var(--ink)" />
      </svg>
      <div style={{ marginTop: -4, fontSize: 28, fontWeight: 600, letterSpacing: "-.8px", color: out ? "var(--warn)" : "var(--ok)", fontVariantNumeric: "tabular-nums" }}>{pct > 0 ? "+" : ""}{pct.toFixed(1)}%</div>
      <div style={{ fontSize: 11.5, color: "var(--faint)", textAlign: "center" }}>{label ?? `Tolerance ±${tol}%`}</div>
    </div>
  );
}
