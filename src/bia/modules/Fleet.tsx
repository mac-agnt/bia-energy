import type { ModProps } from "../Module";
import { Page } from "../ui";
import Overview from "./fleet/Overview";
import Vehicles from "./fleet/Vehicles";
import LiveFleet from "./fleet/LiveFleet";
import Maintenance from "./fleet/Maintenance";
import Inspections from "./fleet/Inspections";
import Costs from "./fleet/Costs";

export default function Fleet(p: ModProps) {
  const body = (() => {
    switch (p.tab) {
      case "Vehicles": return <Vehicles {...p} />;
      case "Live Fleet": return <LiveFleet {...p} />;
      case "Maintenance": return <Maintenance {...p} />;
      case "Inspections": return <Inspections {...p} />;
      case "Costs": return <Costs {...p} />;
      default: return <Overview {...p} />;
    }
  })();
  return <Page key={p.tab}>{body}</Page>;
}
