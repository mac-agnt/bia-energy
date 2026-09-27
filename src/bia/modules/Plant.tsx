import type { ModProps } from "../Module";
import PlantOverview from "./plant/Overview";
import Intake from "./plant/Intake";
import Processing from "./plant/Processing";
import Output from "./plant/Output";
import Weighbridge from "./plant/Weighbridge";
import Exceptions from "./plant/Exceptions";

/* Plant: management layer above Weighbridge and Plant / SCADA data. No plant control. */
export default function Plant(p: ModProps) {
  switch (p.tab) {
    case "Intake": return <Intake {...p} />;
    case "Processing": return <Processing {...p} />;
    case "Output": return <Output {...p} />;
    case "Weighbridge": return <Weighbridge {...p} />;
    case "Exceptions": return <Exceptions {...p} />;
    default: return <PlantOverview {...p} />;
  }
}
