import { useState } from "react";
import type { ModProps } from "../../Module";
import { useBia } from "../../store";
import { EXPIRIES, TODAY, type Tone } from "../../story";
import { Bar, Btn, Card, Grid, Head, Kpis, Page, Pill, toneColor } from "../../ui";
import { DEPTS, NOW, REQUIRED, STAFF, TODAY_IDX, coverage, rosterOf } from "./data";
import { Avatar, PersonDrawer } from "./shared";

const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const AX0 = 5 * 60, AX1 = 22 * 60;
const pos = (t: string) => ((toMin(t) - AX0) / (AX1 - AX0)) * 100;

export default function PeopleOverview({ setTab, go }: ModProps) {
  const s = useBia();
  const [who, setWho] = useState<string | null>(null);
  const otDone = s.approvals.overtime === "approved";
  const head = DEPTS.reduce((a, d) => a + d.head, 0);
  const on = DEPTS.reduce((a, d) => a + d.onShift, 0);
  const todayCodes = STAFF.map((p) => ({ p, c: rosterOf(p, s.done)[TODAY_IDX] }));
  const absent = todayCodes.filter((x) => x.c === "A" || x.c === "S" || x.c === "T");
  const shifts = todayCodes.filter((x) => x.c === "E" || x.c === "D" || x.c === "L").sort((a, b) => toMin(a.p.start) - toMin(b.p.start));
  const cpc = EXPIRIES.find((e) => e.item.includes("Paul Doyle"));
  const wedGap = coverage("Logistics", s.done)[2] < REQUIRED.Logistics[2];
  const satGap = coverage("Plant", s.done)[5] < REQUIRED.Plant[5];

  const attention: { tone: Tone; title: string; sub: string; cta: string; run: () => void }[] = [
    ...(otDone ? [] : [{ tone: "warn" as Tone, title: "6.5 h Logistics overtime to approve", sub: "5 timesheets in review: Nowak, Kowalski, Quinn, Wiśniewski, Doyle.", cta: "Timesheets", run: () => setTab("Timesheets") }]),
    ...(wedGap ? [{ tone: "bad" as Tone, title: "Tomorrow 06:00: no driver for BULK-211", sub: "BIA-09 is ready but unassigned. One artic driver short on the roster.", cta: "Roster", run: () => setTab("Roster") }] : []),
    { tone: "warn", title: `Driver CPC renewal, Paul Doyle, ${cpc?.days ?? 19} days`, sub: "Periodic training course not yet booked.", cta: "Availability", run: () => setTab("Availability") },
    ...(satGap ? [{ tone: "neutral" as Tone, title: "Saturday late plant cover is one short", sub: "Ionut Radu is the only late operator rostered.", cta: "Roster", run: () => setTab("Roster") }] : []),
  ];

  return (
    <Page>
      <Head eyebrow="People" title="People" sub="Headcount, shifts, timesheets and availability across Logistics, Plant and support teams. Timesheets and rosters sync with Timesheets / HR."
        right={<Btn small onClick={() => setTab("Team")}>Team directory</Btn>} />

      <Kpis items={[
        { label: "Headcount", value: String(head), sub: `${DEPTS.length} departments` },
        { label: "On shift now", value: String(on), sub: `At ${NOW}` },
        { label: "Productivity", value: `${TODAY.productivity}%`, sub: "Draft model, operational staff", hero: true },
        { label: "Overtime pending", value: otDone ? "0 h" : `${TODAY.overtimePending} h`, sub: otDone ? "Approved, posted to payroll" : "Logistics", tone: otDone ? "ok" : "warn" },
        { label: "Absent today", value: String(absent.length), sub: absent.map((a) => a.c === "A" ? "1 leave" : a.c === "S" ? "1 sick" : "1 training").join(", ") },
      ]} />

      <Grid style={{ marginBottom: 14 }}>
        <Card span={5} title="Headcount by department" sub="Bars show share of each team on shift now">
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
            {DEPTS.map((d) => (
              <div key={d.dept}>
                <div style={{ display: "flex", fontSize: 12.5, marginBottom: 6 }}>
                  <span style={{ flex: 1, color: "var(--body)" }}>{d.dept}</span>
                  <span style={{ color: "var(--ink)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{d.onShift}<span style={{ color: "var(--faint)", fontWeight: 400 }}> of {d.head}</span></span>
                </div>
                <Bar value={d.onShift} max={d.head} h={7} />
              </div>
            ))}
          </div>
        </Card>
        <Card span={7} title="Today's shifts" sub={`Operational crew, 05:00 to 22:00. Line marks ${NOW}.`} right={<Pill tone="accent">{shifts.length} rostered</Pill>}>
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", marginLeft: 132, fontSize: 10.5, color: "var(--faint)", marginBottom: 6, position: "relative", height: 14 }}>
              {["06:00", "10:00", "14:00", "18:00"].map((t) => <span key={t} style={{ position: "absolute", left: `${pos(t)}%`, transform: "translateX(-50%)" }}>{t}</span>)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {shifts.map(({ p }) => {
                const a = pos(p.start), b = pos(p.end);
                return (
                  <div key={p.name} className="bia-row" onClick={() => setWho(p.name)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", borderRadius: 8 }}>
                    <span style={{ width: 124, flex: "none", fontSize: 12, color: "var(--body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                    <div style={{ position: "relative", flex: 1, height: 14 }}>
                      <div style={{ position: "absolute", left: `${a}%`, width: `${b - a}%`, top: 2, bottom: 2, borderRadius: 6, background: p.dept === "Plant" ? "rgba(111,182,217,.45)" : "var(--accent-soft)", border: "1px solid " + (p.dept === "Plant" ? "rgba(111,182,217,.7)" : "var(--accent-line)") }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ position: "absolute", top: 18, bottom: 0, left: `calc(132px + (100% - 132px) * ${pos(NOW) / 100})`, width: 1.5, background: "var(--accent)", pointerEvents: "none" }} />
            <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11.5, color: "var(--faint)" }}>
              <span><span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 3, background: "var(--accent-soft)", marginRight: 6 }} />Logistics</span>
              <span><span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 3, background: "rgba(111,182,217,.45)", marginRight: 6 }} />Plant</span>
            </div>
          </div>
        </Card>
      </Grid>

      <Grid>
        <Card span={7} title="Needs attention" sub="People items across rosters, timesheets and compliance" right={<Pill tone={attention.length ? "warn" : "ok"}>{attention.length}</Pill>} pad={false}>
          <div style={{ padding: "0 6px 6px" }}>
            {attention.map((a) => (
              <div key={a.title} className="bia-row" onClick={a.run} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderRadius: 14, cursor: "pointer" }}>
                <span style={{ width: 8, height: 8, borderRadius: 9, background: toneColor[a.tone], flex: "none" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{a.title}</div>
                  <div style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 2 }}>{a.sub}</div>
                </div>
                <Btn small>{a.cta}</Btn>
              </div>
            ))}
          </div>
        </Card>
        <Card span={5} title="Absent today and quick links">
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {absent.map(({ p, c }) => (
              <div key={p.name} className="bia-row" onClick={() => setWho(p.name)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", borderRadius: 12, cursor: "pointer" }}>
                <Avatar name={p.name} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{p.role}, {p.dept}</div></div>
                <Pill tone={c === "S" ? "bad" : "warn"}>{c === "S" ? "Sick" : c === "A" ? "Annual leave" : "Training"}</Pill>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {([["Roster", "Week grid and gaps", () => setTab("Roster")], ["Timesheets", "Approve hours", () => setTab("Timesheets")], ["Productivity", "Model and views", () => setTab("Productivity")], ["Driver compliance", "CPC and licences", () => go("Compliance", "Expiries")]] as [string, string, () => void][]).map(([t, sub, run]) => (
              <button key={t} onClick={run} style={{ textAlign: "left", padding: "12px 14px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface-2)", cursor: "pointer", fontFamily: "inherit" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{t} →</div>
                <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 3 }}>{sub}</div>
              </button>
            ))}
          </div>
        </Card>
      </Grid>
      <PersonDrawer name={who} onClose={() => setWho(null)} onPick={setWho} />
    </Page>
  );
}
