import type { ReactNode } from "react";
import { toast, useBia } from "../../store";
import { Btn, Drawer, KV, Pill, Section, toneColor } from "../../ui";
import { CODE, DAYS, MANAGEMENT, MGMT_INFO, STAFF, TODAY_IDX, initials, rosterOf, shiftTime, type Code, type Staff } from "./data";

export function Avatar({ name, size = 30, mgmt }: { name: string; size?: number; mgmt?: boolean }) {
  return (
    <span style={{ width: size, height: size, borderRadius: size / 2.6, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 700, letterSpacing: ".02em",
      background: mgmt ? "var(--accent-soft)" : "var(--surface-2)", color: mgmt ? "var(--accent)" : "var(--ink)", border: "1px solid " + (mgmt ? "var(--accent-line)" : "var(--border)") }}>{initials(name)}</span>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      style={{ width: 34, height: 20, borderRadius: 999, border: 0, padding: 2, cursor: "pointer", flex: "none", background: on ? "var(--accent)" : "var(--track)", transition: "background .2s var(--ease)" }}>
      <span style={{ display: "block", width: 16, height: 16, borderRadius: 999, background: on ? "var(--on-accent)" : "var(--dim)", transform: on ? "translateX(14px)" : "none", transition: "transform .2s var(--ease)" }} />
    </button>
  );
}

const CHIP: Record<Code, { bg: string; fg: string; bd: string; text?: string }> = {
  E: { bg: "var(--accent-faint)", fg: "var(--accent)", bd: "var(--accent-line)" },
  D: { bg: "var(--surface-2)", fg: "var(--ink)", bd: "var(--border)" },
  L: { bg: "var(--surface-2)", fg: "var(--dim)", bd: "var(--border-strong)" },
  O: { bg: "transparent", fg: "var(--faint)", bd: "var(--border)", text: "Off" },
  A: { bg: "var(--warn-soft)", fg: "var(--warn)", bd: "transparent", text: "Leave" },
  S: { bg: "var(--bad-soft)", fg: "var(--bad)", bd: "transparent", text: "Sick" },
  T: { bg: "rgba(111,182,217,.14)", fg: toneColor.info, bd: "transparent", text: "Training" },
};

export function ShiftChip({ p, code, small, flag }: { p: Staff; code: string; small?: boolean; flag?: boolean }) {
  const k = code as Code;
  const c = CHIP[k];
  return (
    <span title={CODE[k].label + (flag ? ", overtime cover" : "")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4, width: "100%", maxWidth: small ? 64 : 76, height: small ? 22 : 26, borderRadius: 8, boxSizing: "border-box",
      fontSize: small ? 10.5 : 11.5, fontWeight: 600, fontVariantNumeric: "tabular-nums", background: c.bg, color: c.fg, border: `1px ${flag ? "dashed" : "solid"} ${flag ? "var(--accent)" : c.bd}` }}>
      {c.text ?? shiftTime(p, code)}
    </span>
  );
}

function Line({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 13, color: "var(--body)", padding: "7px 0", borderBottom: "1px solid var(--border)" }}>{children}</div>;
}

/* Person drawer. Managers: role, responsibilities, contact and reports only. */
export function PersonDrawer({ name, onClose, onPick }: { name: string | null; onClose: () => void; onPick?: (n: string) => void }) {
  const s = useBia();
  const m = MANAGEMENT.find((x) => x.name === name);
  const p = STAFF.find((x) => x.name === name);
  const info = m ? MGMT_INFO[m.name] : undefined;
  const roster = p ? rosterOf(p, s.done) : "";
  const today = p ? roster[TODAY_IDX] : "";
  const pick = (n: string) => (onPick ? <button onClick={() => onPick(n)} style={{ background: "none", border: 0, padding: 0, font: "inherit", color: "var(--ink)", cursor: "pointer", textDecoration: "underline", textDecorationColor: "var(--border-strong)", textUnderlineOffset: 3 }}>{n}</button> : n);

  return (
    <Drawer open={!!(m || p)} onClose={onClose} title={name || ""} sub={m ? `${m.role} · ${m.dept}` : p ? `${p.role} · ${p.dept} · ${p.crew}` : undefined}>
      {m && info && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={m.name} size={48} mgmt />
            <div style={{ flex: 1 }}><Pill tone="accent">Management</Pill></div>
            <Btn small onClick={() => toast("Message opened in Pulse", `New thread with ${m.name}`)}>Message</Btn>
          </div>
          <Section title="Role">
            <KV rows={[["Title", m.role], ["Department", m.dept], ["Based at", "Huntstown, Co. Dublin"], ["Reports to", info.reportsTo ? pick(info.reportsTo) : "Board"]]} />
          </Section>
          <Section title="Responsibilities">{info.resp.map((r) => <Line key={r}>{r}</Line>)}</Section>
          <Section title="Contact"><KV rows={[["Preferred", "Pulse message"], ["Office", "Huntstown admin building"]]} /></Section>
          <Section title={`Direct reports (${info.reports.length})`}>
            {info.reports.length ? <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{info.reports.map((r) => <span key={r} style={{ fontSize: 12.5, padding: "4px 10px", borderRadius: 999, background: "var(--surface-2)", border: "1px solid var(--border)" }}>{pick(r)}</span>)}</div>
              : <div style={{ fontSize: 13, color: "var(--faint)" }}>No direct reports in Pulse.</div>}
          </Section>
        </>
      )}
      {p && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={p.name} size={48} />
            <div style={{ flex: 1, display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Pill tone={today === "S" ? "bad" : today === "A" ? "warn" : "ok"}>{today === "S" ? "Sick today" : today === "A" ? "On leave" : today === "L" ? "Late shift, 14:00" : "On shift"}</Pill>
              {p.vehicle && <Pill tone="neutral">{p.vehicle}</Pill>}
            </div>
            <Btn small onClick={() => toast("Message opened in Pulse", `New thread with ${p.name}`)}>Message</Btn>
          </div>
          <Section title="Today">
            <KV rows={[["Shift", `${p.start} to ${p.end}`], ["Reports to", pick(p.reportsTo)],
              ...(p.sheet ? ([["Worked", `${p.sheet.worked} h`], ["Productive", `${p.sheet.productive} h`], ["Overtime", p.sheet.overtime ? `${p.sheet.overtime} h` : "None"], ["Timesheet", <Pill key="st">{s.approvals.overtime === "approved" && p.sheet.status === "Review" ? "Approved" : p.sheet.status}</Pill>]] as [string, ReactNode][]) : ([["Timesheet", "Not yet submitted"]] as [string, ReactNode][]))]} />
          </Section>
          {p.sheet && (
            <Section title="Productivity index">
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-1px", color: "var(--ink)" }}>{p.sheet.index}%</span>
                <span style={{ fontSize: 12, color: "var(--faint)" }}>Draft model, not yet agreed</span>
              </div>
            </Section>
          )}
          <Section title="This week">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
              {DAYS.map((d, i) => (
                <div key={d.d} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10.5, color: i === TODAY_IDX ? "var(--accent)" : "var(--faint)", marginBottom: 4, fontWeight: i === TODAY_IDX ? 700 : 400 }}>{d.d}</div>
                  <ShiftChip p={p} code={roster[i]} small />
                </div>
              ))}
            </div>
          </Section>
          <Section title="Certifications">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {p.certs.map((c) => (p.name === "Paul Doyle" && c.name === "Driver CPC" && s.done.cpcDoyle ? { ...c, note: "Course booked Sat 10 Oct", tone: "info" as const } : c)).map((c) => (
                <div key={c.name} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, padding: "8px 12px", borderRadius: 12, background: "var(--surface-2)" }}>
                  <span style={{ color: "var(--ink)" }}>{c.name}</span><span style={{ color: c.tone ? toneColor[c.tone] : "var(--dim)" }}>{c.note}</span>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}
    </Drawer>
  );
}
