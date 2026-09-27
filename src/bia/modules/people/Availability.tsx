import { useState } from "react";
import type { ModProps } from "../../Module";
import { markDone, toast, useBia } from "../../store";
import { EXPIRIES, type Tone } from "../../story";
import { AgentNote, Btn, Card, Grid, Head, Kpis, Page, Pill, Section, WriteBackBadge, toneColor } from "../../ui";
import { DAYS, STAFF, rosterOf, working, type Staff } from "./data";
import { Avatar, PersonDrawer } from "./shared";

/* Vehicles planned per day (fleet plan) against drivers rostered. */
const VEHICLES_PLANNED = [13, 14, 14, 13, 12, 5, 1];
const VEH_NOTE = ["", "BIA-07 off road, BIA-10 in workshop", "BULK-211 on BIA-09 at 06:00", "BIA-10 back in service", "BIA-12 test due; off road if missed", "Weekend bulk and tanker runs", "Tanker cover only"];

const LEAVE = [
  { name: "Kevin Moran", what: "Annual leave", when: "Mon 28 Sep to Fri 2 Oct", tone: "warn" as Tone },
  { name: "Sorcha Daly", what: "Sick", when: "Today. Fit to return Wed, to confirm", tone: "bad" as Tone },
  { name: "Niall Gorman", what: "Training", when: "Thu 1 Oct, forklift refresher", tone: "info" as Tone },
  { name: "Eoin Farrell", what: "Annual leave", when: "Mon 12 to Fri 16 Oct", tone: "warn" as Tone },
  { name: "Aoife Brennan", what: "Annual leave", when: "Mon 19 and Tue 20 Oct", tone: "warn" as Tone },
];

export default function Availability({ setTab, go }: ModProps) {
  const s = useBia();
  const [who, setWho] = useState<string | null>(null);
  const covered = !!s.done.bulk211cover;
  const cpcBooked = !!s.done.cpcDoyle;
  const cpc = EXPIRIES.find((e) => e.item.includes("Paul Doyle"));

  const day = (i: number) => {
    const g = (c: string) => STAFF.filter((p) => rosterOf(p, s.done)[i] === c);
    return { avail: STAFF.filter((p) => working(rosterOf(p, s.done)[i])), leave: g("A"), sick: g("S"), train: g("T"), off: g("O") };
  };
  const today = day(1), tomorrow = day(2);
  const drivers = DAYS.map((_, i) => STAFF.filter((p) => p.dept === "Logistics" && working(rosterOf(p, s.done)[i])).length);

  const Chips = ({ list, tone }: { list: Staff[]; tone?: Tone }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {list.map((p) => (
        <button key={p.name} onClick={() => setWho(p.name)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "3px 10px 3px 3px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface-2)", cursor: "pointer", fontFamily: "inherit", fontSize: 12, color: tone ? toneColor[tone] : "var(--ink)" }}>
          <Avatar name={p.name} size={22} />{p.name}
        </button>
      ))}
      {!list.length && <span style={{ fontSize: 12.5, color: "var(--faint)" }}>None</span>}
    </div>
  );
  const DayCard = ({ title, d, sub }: { title: string; d: ReturnType<typeof day>; sub: string }) => (
    <Card span={6} title={title} sub={sub} right={<Pill tone="ok">{d.avail.length} available</Pill>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Section title={`Logistics (${d.avail.filter((p) => p.dept === "Logistics").length})`}><Chips list={d.avail.filter((p) => p.dept === "Logistics")} /></Section>
        <Section title={`Plant (${d.avail.filter((p) => p.dept === "Plant").length})`}><Chips list={d.avail.filter((p) => p.dept === "Plant")} /></Section>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12 }}>
          <Section title="Leave"><Chips list={d.leave} tone="warn" /></Section>
          <Section title="Sick"><Chips list={d.sick} tone="bad" /></Section>
          <Section title="Training"><Chips list={d.train} tone="info" /></Section>
        </div>
      </div>
    </Card>
  );

  return (
    <Page>
      <Head eyebrow="People" title="Availability" sub="Who is available today and tomorrow, planned leave and training, and whether there are enough drivers for the vehicles planned." />

      <Kpis items={[
        { label: "Available today", value: `${today.avail.length} of ${STAFF.length}`, sub: "Operational staff", hero: true },
        { label: "Available tomorrow", value: `${tomorrow.avail.length} of ${STAFF.length}`, sub: covered ? "Includes Marek Nowak on overtime" : "One artic driver short" , tone: covered ? undefined : "warn" },
        { label: "On leave", value: String(today.leave.length), sub: "Kevin Moran to Fri" },
        { label: "Sick", value: String(today.sick.length), sub: "Sorcha Daly, plant" },
        { label: "Certifications due", value: "1", sub: `Driver CPC, ${cpc?.days ?? 19} days`, tone: cpcBooked ? "ok" : "warn" },
      ]} />

      <Grid style={{ marginBottom: 14 }}>
        <DayCard title="Today, Tue 29" d={today} sub="Rostered and clocked in" />
        <DayCard title="Tomorrow, Wed 30" d={tomorrow} sub="From the roster in Timesheets / HR" />
      </Grid>

      <Grid style={{ marginBottom: 14 }}>
        <Card span={7} title="Drivers against vehicles" sub="Rostered drivers against vehicles in the fleet plan, this week">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {DAYS.map((d, i) => {
              const dr = drivers[i], vh = VEHICLES_PLANNED[i], gap = dr < vh, max = 15;
              return (
                <div key={d.d} style={{ display: "grid", gridTemplateColumns: "58px 1fr 92px", alignItems: "center", gap: 12, padding: "7px 8px", borderRadius: 12, background: i === 1 ? "var(--accent-faint)" : gap ? "var(--bad-soft)" : undefined }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: i === 1 ? "var(--accent)" : "var(--ink)" }}>{i === 1 ? "Today" : `${d.d} ${d.n}`}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ position: "relative", height: 8, borderRadius: 6, background: "var(--track)" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(dr / max) * 100}%`, borderRadius: 6, background: gap ? "var(--bad)" : "var(--accent)", transition: "width .5s var(--ease)" }} />
                      <div title="Vehicles planned" style={{ position: "absolute", top: -3, bottom: -3, left: `calc(${(vh / max) * 100}% - 1px)`, width: 2, background: "var(--ink)", borderRadius: 2 }} />
                    </div>
                    {VEH_NOTE[i] && <div style={{ fontSize: 11, color: "var(--faint)", marginTop: 4 }}>{VEH_NOTE[i]}</div>}
                  </div>
                  <div style={{ textAlign: "right", fontSize: 12.5, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: gap ? "var(--bad)" : "var(--ink)" }}>{dr} / {vh}{gap ? " short" : ""}</div>
                </div>
              );
            })}
            <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 6 }}>Bar: drivers rostered. Marker: vehicles planned.</div>
          </div>
        </Card>
        <Card span={5} title="Cover and certifications">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <AgentNote agent="Roster Agent" state={covered ? "approved" : undefined}
              actions={covered ? <><WriteBackBadge system="Timesheets / HR" /><WriteBackBadge system="Fleet System" /></> : <><Btn small kind="primary" onClick={() => { markDone("bulk211cover"); toast("Updated in Timesheets / HR", "Marek Nowak rostered Wed 05:30 on overtime. BULK-211 assigned to BIA-09 in Fleet System."); }}>Roster Marek Nowak</Btn><Btn small onClick={() => setTab("Roster")}>Open roster</Btn></>}>
              {covered ? "Wednesday is covered. Marek Nowak takes BULK-211 on BIA-09 at 05:30." : "Tomorrow has 14 vehicles planned and 13 drivers. Marek Nowak is off, artic-qualified and within his hours, so he's the cleanest cover for BULK-211."}
            </AgentNote>
            <AgentNote agent="Compliance Agent" state={cpcBooked ? "approved" : undefined}
              actions={cpcBooked ? <WriteBackBadge system="Calendar" /> : <><Btn small kind="primary" onClick={() => { markDone("cpcDoyle"); toast("Updated in Calendar", "Paul Doyle booked on Driver CPC periodic training, Sat 10 Oct. Gary Nolan covers tanker runs."); }}>Book Sat 10 Oct</Btn><Btn small onClick={() => go("Compliance", "Expiries")}>Compliance</Btn></>}>
              {cpcBooked ? "Paul Doyle is booked on Driver CPC periodic training on Sat 10 Oct, nine days before expiry." : `Paul Doyle's Driver CPC renewal is due in ${cpc?.days ?? 19} days and the course isn't booked. Saturday 10 Oct keeps him off the weekday tanker roster; Gary Nolan is already on.`}
            </AgentNote>
          </div>
        </Card>
      </Grid>

      <Card title="Leave and training, next 3 weeks" pad={false}>
        <div style={{ padding: "0 6px 6px" }}>
          {LEAVE.map((l) => (
            <div key={l.name + l.what} className="bia-row" onClick={() => setWho(l.name)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 14, cursor: "pointer" }}>
              <Avatar name={l.name} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{l.name}</div>
                <div style={{ fontSize: 12, color: "var(--dim)" }}>{l.when}</div>
              </div>
              <Pill tone={l.tone}>{l.what}</Pill>
            </div>
          ))}
          <div className="bia-row" onClick={() => setWho("Paul Doyle")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 14, cursor: "pointer" }}>
            <Avatar name="Paul Doyle" size={30} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>Paul Doyle</div>
              <div style={{ fontSize: 12, color: "var(--dim)" }}>{cpcBooked ? "Sat 10 Oct, Driver CPC periodic training" : `Driver CPC renewal due in ${cpc?.days ?? 19} days, not booked`}</div>
            </div>
            <Pill tone={cpcBooked ? "info" : "warn"}>{cpcBooked ? "Training" : "Due"}</Pill>
          </div>
        </div>
      </Card>

      <PersonDrawer name={who} onClose={() => setWho(null)} onPick={setWho} />
    </Page>
  );
}
