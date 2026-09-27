import { useState, type ReactNode } from "react";
import type { ModProps } from "../../Module";
import { markDone, toast, useBia } from "../../store";
import { AgentNote, Btn, Card, Grid, Head, Kpis, Page, Pill, Segmented, WriteBackBadge } from "../../ui";
import { CODE, DAYS, REQUIRED, STAFF, TODAY_IDX, coverage, rosterOf, type Code } from "./data";
import { PersonDrawer, ShiftChip } from "./shared";

export default function Roster({ setTab }: ModProps) {
  const s = useBia();
  const [dept, setDept] = useState("All");
  const [who, setWho] = useState<string | null>(null);
  const covered = !!s.done.bulk211cover;
  const satDone = !!s.done.satplant;
  const people = STAFF.filter((p) => dept === "All" || p.dept === dept);
  const cov = { Logistics: coverage("Logistics", s.done), Plant: coverage("Plant", s.done) };
  const gaps = (["Logistics", "Plant"] as const).flatMap((d) => cov[d].map((n, i) => ({ d, i, n, req: REQUIRED[d][i] })).filter((g) => g.n < g.req));
  const hours = people.reduce((a, p) => a + rosterOf(p, s.done).split("").filter((c) => c === "E" || c === "D" || c === "L").length * 8.5, 0);

  const cell = (children: ReactNode, i: number, key?: string) => (
    <div key={key} style={{ padding: "6px 4px", display: "flex", justifyContent: "center", alignItems: "center", background: i === TODAY_IDX ? "var(--accent-faint)" : undefined }}>{children}</div>
  );
  const grid = { display: "grid", gridTemplateColumns: "190px repeat(7,minmax(64px,1fr))", minWidth: 690 } as const;

  const offerNowak = () => { markDone("bulk211cover"); toast("Updated in Timesheets / HR", "Marek Nowak rostered Wed 05:30 on overtime. BULK-211 assigned to BIA-09 in Fleet System."); };
  const askSat = () => { markDone("satplant"); toast("Updated in Timesheets / HR", "Ultan Reid rostered Saturday 14:00 on overtime. Gytis Meskauskas notified."); };

  return (
    <Page>
      <Head eyebrow="People" title="Roster" sub="Week of 28 September. Early 05:00 to 06:00 starts, day 07:00 to 08:00, late 14:00. Gaps are checked against planned collections and plant cover."
        right={<Segmented options={["All", "Logistics", "Plant"]} value={dept} onChange={setDept} />} />

      <Kpis items={[
        { label: "Rostered this week", value: String(people.length), sub: dept === "All" ? "Operational staff" : dept },
        { label: "Planned hours", value: `${Math.round(hours).toLocaleString("en-IE")} h`, sub: "At 8.5 h a shift" },
        { label: "Coverage gaps", value: String(gaps.length), sub: gaps.length ? gaps.map((g) => `${DAYS[g.i].d} ${g.d.toLowerCase()}`).join(", ") : "Fully covered", tone: gaps.length ? "bad" : "ok", hero: !gaps.length },
        { label: "Leave and sick", value: "2", sub: "Kevin Moran, Sorcha Daly" },
        { label: "Training", value: "1", sub: "Niall Gorman, Thu" },
      ]} />

      <Card title="Week grid" sub="Click a name for their week and certifications" pad={false} right={
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{(["E", "D", "L", "A", "S", "T"] as Code[]).map((c) => <Pill key={c} tone={CODE[c].tone}>{CODE[c].label}</Pill>)}</div>}>
        <div style={{ overflowX: "auto", padding: "4px 0 6px" }}>
          <div style={{ ...grid, borderBottom: "1px solid var(--border)" }}>
            <div style={{ padding: "8px 16px", fontSize: 11, color: "var(--faint)", fontWeight: 600 }}>Person</div>
            {DAYS.map((d, i) => cell(
              <div style={{ textAlign: "center", lineHeight: 1.2 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: i === TODAY_IDX ? "var(--accent)" : "var(--ink)" }}>{i === TODAY_IDX ? "Today" : d.d}</div>
                <div style={{ fontSize: 10.5, color: "var(--faint)" }}>{d.n}</div>
              </div>, i, d.d))}
          </div>
          {people.map((p) => {
            const r = rosterOf(p, s.done);
            return (
              <div key={p.name} className="bia-row" style={{ ...grid, borderBottom: "1px solid var(--border)" }}>
                <button onClick={() => setWho(p.name)} style={{ textAlign: "left", padding: "7px 16px", border: 0, background: "none", cursor: "pointer", fontFamily: "inherit", minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--faint)", whiteSpace: "nowrap" }}>{p.role}</div>
                </button>
                {r.split("").map((c, i) => cell(<ShiftChip p={p} code={c} flag={r[i] !== p.roster[i]} />, i, p.name + i))}
              </div>
            );
          })}
          {(["Logistics", "Plant"] as const).filter((d) => dept === "All" || d === dept).map((d) => (
            <div key={d} style={{ ...grid, background: "var(--surface-2)" }}>
              <div style={{ padding: "9px 16px", fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{d === "Logistics" ? "Drivers" : "Plant crew"} <span style={{ color: "var(--faint)", fontWeight: 400 }}>rostered / needed</span></div>
              {cov[d].map((n, i) => {
                const gap = n < REQUIRED[d][i];
                return cell(<span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums", padding: "3px 8px", borderRadius: 8, color: gap ? "var(--bad)" : "var(--ok)", background: gap ? "var(--bad-soft)" : "transparent" }}>{n}/{REQUIRED[d][i]}{gap ? " gap" : ""}</span>, i, d + i);
              })}
            </div>
          ))}
        </div>
      </Card>

      <Grid style={{ marginTop: 14 }}>
        <Card span={6} title="Wednesday early, drivers" sub="BULK-211 on BIA-09 at 06:00 has no driver" right={<Pill tone={covered ? "ok" : "bad"}>{covered ? "Covered" : "1 short"}</Pill>}>
          <AgentNote agent="Roster Agent" state={covered ? "approved" : undefined}
            actions={covered ? <><WriteBackBadge system="Timesheets / HR" /><WriteBackBadge system="Fleet System" /></> : <><Btn kind="primary" small onClick={offerNowak}>Roster Marek Nowak, 05:30 overtime</Btn><Btn small onClick={() => setTab("Availability")}>See availability</Btn></>}>
            {covered ? "Marek Nowak is rostered for Wednesday 05:30 on overtime and assigned to BULK-211 on BIA-09." : "Marek Nowak is off Wednesday, holds a C+E licence and has 2.5 h of weekly overtime headroom left. Rostering him covers BULK-211 without moving anyone else."}
          </AgentNote>
        </Card>
        <Card span={6} title="Saturday late, plant" sub="Two late operators needed with digesters on weekend feed" right={<Pill tone={satDone ? "ok" : "warn"}>{satDone ? "Covered" : "1 short"}</Pill>}>
          <AgentNote agent="Roster Agent" state={satDone ? "approved" : undefined}
            actions={satDone ? <WriteBackBadge system="Timesheets / HR" /> : <Btn small kind="primary" onClick={askSat}>Offer Saturday late to Ultan Reid</Btn>}>
            {satDone ? "Ultan Reid takes the Saturday late shift on overtime. Plant cover is back to 3 on Saturday." : "Ultan Reid is off Saturday and has overtime headroom this week. Offering him the late shift brings Saturday cover to 3 and leaves Sunday unchanged."}
          </AgentNote>
        </Card>
      </Grid>

      <PersonDrawer name={who} onClose={() => setWho(null)} onPick={setWho} />
    </Page>
  );
}
