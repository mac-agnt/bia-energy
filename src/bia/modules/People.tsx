import type { ModProps } from "../Module";
import PeopleOverview from "./people/Overview";
import Team from "./people/Team";
import Roster from "./people/Roster";
import Timesheets from "./people/Timesheets";
import Productivity from "./people/Productivity";
import Availability from "./people/Availability";

/* People: rosters, timesheets and the draft productivity model. Real managers carry no metrics. */
export default function People(p: ModProps) {
  switch (p.tab) {
    case "Team": return <Team {...p} />;
    case "Roster": return <Roster {...p} />;
    case "Timesheets": return <Timesheets {...p} />;
    case "Productivity": return <Productivity {...p} />;
    case "Availability": return <Availability {...p} />;
    default: return <PeopleOverview {...p} />;
  }
}
