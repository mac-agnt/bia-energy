import { useState } from "react";
import type { ModProps } from "../../Module";
import { useBia } from "../../store";
import { Card, Empty, Head, Kpis, Page, Pill, SearchBox, Segmented, Table, type Col } from "../../ui";
import { MANAGEMENT, MGMT_INFO, STAFF, TODAY_IDX, rosterOf, type Staff } from "./data";
import { Avatar, PersonDrawer, ShiftChip } from "./shared";

const DEPTS = ["All", "Logistics", "Plant", "Operations", "Compliance", "Commercial", "Agri"];

export default function Team(_: ModProps) {
  const s = useBia();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [who, setWho] = useState<string | null>(null);
  const match = (name: string, role: string, d: string, extra = "") => (dept === "All" || d === dept) && (!q || `${name} ${role} ${d} ${extra}`.toLowerCase().includes(q.toLowerCase()));

  const mgmt = MANAGEMENT.filter((m) => match(m.name, m.role, m.dept));
  const staff = STAFF.filter((p) => match(p.name, p.role, p.dept, `${p.crew} ${p.vehicle ?? ""}`));

  const cols: Col<Staff>[] = [
    { key: "name", label: "Name", render: (p) => <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Avatar name={p.name} size={28} /><span style={{ color: "var(--ink)", fontWeight: 600 }}>{p.name}</span></span> },
    { key: "role", label: "Role" },
    { key: "dept", label: "Department" },
    { key: "crew", label: "Crew", render: (p) => <span style={{ color: "var(--dim)" }}>{p.crew}</span> },
    { key: "today", label: "Today", render: (p) => <ShiftChip p={p} code={rosterOf(p, s.done)[TODAY_IDX]} small /> },
    { key: "vehicle", label: "Vehicle", render: (p) => p.vehicle ?? <span style={{ color: "var(--faint)" }}>Plant</span> },
    { key: "reportsTo", label: "Reports to", render: (p) => <span style={{ color: "var(--dim)" }}>{p.reportsTo}</span> },
  ];

  return (
    <Page>
      <Head eyebrow="People" title="Team" sub="Management and operational staff. Management entries show role and responsibilities only."
        right={<SearchBox value={q} onChange={setQ} placeholder="Search name, role, crew, vehicle" />} />

      <Kpis items={[
        { label: "In Pulse", value: String(MANAGEMENT.length + STAFF.length), sub: "People with records here" },
        { label: "Management", value: String(MANAGEMENT.length), sub: "Across 6 departments" },
        { label: "Drivers", value: String(STAFF.filter((p) => p.dept === "Logistics").length), sub: "MacPac, artic, tanker, support", hero: true },
        { label: "Plant crew", value: String(STAFF.filter((p) => p.dept === "Plant").length), sub: "Weighbridge, process, late" },
      ]} />

      <div style={{ marginBottom: 14, overflowX: "auto" }}><Segmented options={DEPTS} value={dept} onChange={setDept} /></div>

      {mgmt.length > 0 && (
        <Card title="Management" sub="Roles and responsibilities" style={{ marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 10 }}>
            {mgmt.map((m, i) => (
              <button key={m.name} onClick={() => setWho(m.name)} style={{ textAlign: "left", display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 14px", borderRadius: 16, border: "1px solid var(--border)", background: "var(--surface-2)", cursor: "pointer", fontFamily: "inherit", animation: `pageIn .45s var(--ease) ${i * 30}ms both` }}>
                <Avatar name={m.name} size={38} mgmt />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 2 }}>{m.role}</div>
                  <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 6, lineHeight: 1.4 }}>{MGMT_INFO[m.name]?.resp[0]}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card title="Operational staff" sub={`${staff.length} shown. Click a name for shift, timesheet and certifications.`} right={<Pill tone="neutral">Synced from Timesheets / HR</Pill>} pad={false}>
        {staff.length ? <Table cols={cols} rows={staff} rowKey="name" onRow={(p) => setWho(p.name)} selected={who} dense /> : <Empty>{mgmt.length ? "No operational staff in this department." : "Nobody matches that search."}</Empty>}
      </Card>

      <PersonDrawer name={who} onClose={() => setWho(null)} onPick={setWho} />
    </Page>
  );
}
