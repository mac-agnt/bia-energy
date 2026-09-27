import { useState, type ReactNode } from "react";
import type { ModProps } from "../../Module";
import { markDone, toast, useBia } from "../../store";
import type { Tone } from "../../story";
import { AgentNote, Btn, Card, Grid, Head, KV, Kpis, Page, Pill, Section, Segmented, Timeline, WriteBackBadge } from "../../ui";
import { ListRow } from "./shared";

type Ex = {
  id: string; title: string; sub: string; tone: Tone; status: "Open" | "Watch" | "Resolved"; owner: string; source: string; raised: string;
  facts: [string, ReactNode][]; history: { time: string; text: string; tone?: Tone }[]; agent: string;
  action?: { label: string; run: () => void; system: string }; link?: { label: string; run: () => void };
};

export default function Exceptions({ setTab, go }: ModProps) {
  const s = useBia();
  const int1048 = s.approvals.int1048 === "approved";
  const [f, setF] = useState("Open");
  const [sel, setSel] = useState("int1048");

  const done = (k: string) => !!s.done[k];
  const list: Ex[] = [
    { id: "int1048", title: "INT-1048 weight variance, +1.70 t", sub: "FreshFields Foods on BIA-14. Net 19.27 t against 17.57 t expected.", tone: int1048 ? "ok" : "warn", status: int1048 ? "Resolved" : "Open",
      owner: "Natalia Biancha, Weighbridge", source: "Weighbridge", raised: "12:47",
      facts: [["Ticket", "WB-1048"], ["Docket", "WTD-58812"], ["Variance", "+9.7%, tolerance ±5%"], ["Value at stake", "1.70 t on the invoice"]],
      history: [{ time: "12:46", text: "BIA-14 weighed in, gross 37.42 t", tone: "info" }, { time: "12:47", text: "Variance outside tolerance, held for review", tone: "warn" }, { time: "12:52", text: "Intake Agent matched sign-off: 26 pallets against 23 ordered" },
        ...(int1048 ? [{ time: "Now", text: "Accepted at 19.27 t. Weighbridge and Accounting updated.", tone: "ok" as Tone }] : [])],
      agent: int1048 ? "Closed. Accepted at the weighed figure; FreshFields' invoice line reads 19.27 t." : "Likely extra pallets loaded at Naas. Recommend accepting at 19.27 t and updating the invoice. Review and approve on the Weighbridge tab.",
      link: { label: int1048 ? "View ticket" : "Review on Weighbridge", run: () => setTab("Weighbridge") } },
    { id: "int1041", title: "INT-1041 rejected, contaminated load", sub: "Third-party haulier 11-MN-804. Packaged food mixed with treated timber and strapping.", tone: done("int1041notice") ? "ok" : "bad", status: done("int1041notice") ? "Resolved" : "Open",
      owner: "Natalia Biancha, Weighbridge", source: "Weighbridge", raised: "10:52",
      facts: [["Net", "3.70 t, returned to sender"], ["Docket", "WTD-58805, annotated"], ["Evidence", "Rejection report RJ-0412, 6 photos"], ["Invoice", "None raised"]],
      history: [{ time: "10:52", text: "Weighed in, 24.60 t gross", tone: "info" }, { time: "10:58", text: "Contamination found at tipping, load stopped", tone: "bad" }, { time: "11:10", text: "Reloaded and returned to sender" },
        ...(done("int1041notice") ? [{ time: "Now", text: "Rejection notice sent to haulier with photos", tone: "ok" as Tone }] : [])],
      agent: done("int1041notice") ? "Rejection notice sent. The haulier's next booking is flagged for a gate inspection." : "The haulier has had one other rejection this quarter. I've drafted the formal rejection notice with RJ-0412 and the photos attached, and flagged their next booking for a gate inspection.",
      action: done("int1041notice") ? undefined : { label: "Send rejection notice", system: "Email", run: () => { markDone("int1041notice"); toast("Updated in Email", "Rejection notice for INT-1041 sent to the haulier with RJ-0412 attached."); } } },
    { id: "dp1", title: "Depackaging line 1 backlog", sub: "Throughput down 8%. 4.2 t of pallets waiting, clears in about 25 min.", tone: "warn", status: "Watch",
      owner: "Gytis Meskauskas, Plant", source: "Plant / SCADA data", raised: "12:58",
      facts: [["Throughput", "5.5 t/h, 92% of rated"], ["Backlog", "4.2 t"], ["Cause", "INT-1048 pallets"], ["Gas output", "Unaffected"]],
      history: [{ time: "12:58", text: "Line 1 throughput below 95% for 10 min", tone: "warn" }, { time: "13:02", text: "INT-1049 routed behind the backlog" }],
      agent: "No action needed. Line 2 has spare capacity if the backlog is still above 2 t at 13:30; I'll flag it then.",
      link: { label: "Line status", run: () => setTab("Processing") } },
    { id: "int1044", title: "Signed docket missing, INT-1044", sub: "Third-party haulier 07-LH-2291. Signed copy of WTD-58808 not received.", tone: done("int1044docket") ? "ok" : "warn", status: done("int1044docket") ? "Resolved" : "Open",
      owner: "Larissa Franca, Compliance", source: "Documents", raised: "12:05",
      facts: [["Net", "13.70 t, accepted"], ["Docket", "WTD-58808"], ["Missing", "Signed haulier copy"], ["Needed for", "Waste transfer records"]],
      history: [{ time: "11:58", text: "Weighed in and accepted, 13.70 t net", tone: "info" }, { time: "12:05", text: "Docket check: signature missing", tone: "warn" },
        ...(done("int1044docket") ? [{ time: "Now", text: "Signed copy requested from haulier", tone: "ok" as Tone }] : [])],
      agent: done("int1044docket") ? "Request sent. I'll attach the signed copy to the load record when it arrives and close this." : "The load is fine; the paperwork isn't complete. A signed copy is needed for the waste transfer record. I can request it from the haulier now.",
      action: done("int1044docket") ? undefined : { label: "Request signed copy", system: "Email", run: () => { markDone("int1044docket"); toast("Updated in Email", "Signed copy of WTD-58808 requested from the haulier."); } } },
    { id: "cal", title: "Weighbridge calibration due in 41 days", sub: "Certificate expires 9 Nov. Book the calibration contractor.", tone: done("wbcal") ? "ok" : "info", status: done("wbcal") ? "Resolved" : "Open",
      owner: "Natalia Biancha, Weighbridge", source: "Documents", raised: "Mon",
      facts: [["Certificate", "Weighbridge 1 and 2"], ["Expires", "9 Nov"], ["Lead time", "About 3 weeks"], ["If missed", "Tickets cannot be issued"]],
      history: [{ time: "Mon", text: "Expiry reminder raised at 45 days", tone: "info" }, ...(done("wbcal") ? [{ time: "Now", text: "Calibration booked 22 Oct, 07:00", tone: "ok" as Tone }] : [])],
      agent: done("wbcal") ? "Booked for 22 Oct at 07:00, before first loads. Bridge 2 stays open while bridge 1 is tested." : "Booking now leaves room to reschedule. 22 Oct at 07:00 avoids the morning peak and keeps bridge 2 open.",
      action: done("wbcal") ? undefined : { label: "Book 22 Oct, 07:00", system: "Calendar", run: () => { markDone("wbcal"); toast("Updated in Calendar", "Weighbridge calibration booked for 22 Oct, 07:00."); } },
      link: { label: "Compliance expiries", run: () => go("Compliance", "Expiries") } },
    { id: "dt0931", title: "Digester 2 feed pause, 22 min", sub: "Feed pump blockage at 11:36, cleared 11:58.", tone: "ok", status: "Resolved",
      owner: "Gytis Meskauskas, Plant", source: "Plant / SCADA data", raised: "11:36",
      facts: [["Duration", "22 min"], ["Cause", "Feed pump blockage"], ["Gas impact", "None, D1 and D3 took extra feed"], ["Follow-up", "Pump inspection Thu"]],
      history: [{ time: "11:36", text: "Digester 2 feed stopped", tone: "bad" }, { time: "11:41", text: "Plant crew on scene" }, { time: "11:58", text: "Feed restored, rate back to target", tone: "ok" }],
      agent: "Resolved. Second blockage on this pump in a month; the Thursday inspection is on the maintenance plan.", link: { label: "Downtime log", run: () => setTab("Processing") } },
  ];

  const shown = list.filter((e) => f === "All" || (f === "Open" ? e.status !== "Resolved" : e.status === "Resolved"));
  const cur = list.find((e) => e.id === sel) || shown[0] || list[0];
  const open = list.filter((e) => e.status !== "Resolved").length;
  const actionDone = (e: Ex) => e.status === "Resolved" && e.id !== "dt0931" && e.id !== "int1048";

  return (
    <Page>
      <Head eyebrow="Plant" title="Exceptions" sub="Anything at Huntstown that needs a decision: weight variances, rejected loads, missing paperwork and plant issues." />

      <Kpis items={[
        { label: "Open", value: String(open), sub: "Needs a decision or watching", tone: open ? "warn" : "ok", hero: true },
        { label: "Tonnes on hold", value: int1048 ? "0 t" : "19.27 t", sub: int1048 ? "Nothing held" : "INT-1048" },
        { label: "Rejected today", value: "1 load", sub: "3.7 t, INT-1041", tone: "bad" },
        { label: "Missing documents", value: done("int1044docket") ? "0, requested" : "1", sub: "WTD-58808 signed copy" },
        { label: "Resolved today", value: String(list.length - open), sub: "Closed by the team or Pulse" },
      ]} />

      <Grid>
        <Card span={7} title="Exception queue" sub={`${shown.length} shown`} right={<Segmented options={["Open", "Resolved", "All"]} value={f} onChange={setF} />} pad={false}>
          <div style={{ padding: "0 6px 6px" }}>
            {shown.map((e) => (
              <ListRow key={e.id} tone={e.tone} title={e.title} sub={<>{e.sub}<span style={{ color: "var(--faint)" }}> · {e.owner}</span></>} active={cur.id === e.id} onClick={() => setSel(e.id)}
                right={<Pill tone={e.status === "Resolved" ? "ok" : e.status === "Watch" ? "info" : e.tone}>{e.status}</Pill>} />
            ))}
            {!shown.length && <div style={{ padding: 24, textAlign: "center", color: "var(--faint)", fontSize: 13 }}>Nothing here.</div>}
          </div>
        </Card>
        <Card span={5} title={cur.title} sub={`Raised ${cur.raised} from ${cur.source}`} right={<Pill tone={cur.status === "Resolved" ? "ok" : cur.status === "Watch" ? "info" : cur.tone}>{cur.status}</Pill>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <KV rows={[...cur.facts, ["Owner", cur.owner]]} />
            <AgentNote agent="Intake Agent" actions={(cur.action || cur.link || actionDone(cur)) ? (
              <>
                {cur.action && <Btn small kind="primary" onClick={cur.action.run}>{cur.action.label}</Btn>}
                {actionDone(cur) && <WriteBackBadge system={cur.id === "cal" ? "Calendar" : "Email"} />}
                {cur.id === "int1048" && int1048 && <><WriteBackBadge system="Weighbridge" /><WriteBackBadge system="Accounting" /></>}
                {cur.link && <Btn small onClick={cur.link.run}>{cur.link.label}</Btn>}
              </>
            ) : undefined}>{cur.agent}</AgentNote>
            <Section title="History"><Timeline items={cur.history} /></Section>
          </div>
        </Card>
      </Grid>
    </Page>
  );
}
