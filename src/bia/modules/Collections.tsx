import type { ModProps } from "../Module";
import { Page } from "../ui";
import Overview from "./collections/Overview";
import LiveJobs from "./collections/LiveJobs";
import Schedule from "./collections/Schedule";
import Routes from "./collections/Routes";
import Exceptions from "./collections/Exceptions";
import History from "./collections/History";

export default function Collections(p: ModProps) {
  const body = (() => {
    switch (p.tab) {
      case "Live Jobs": return <LiveJobs {...p} />;
      case "Schedule": return <Schedule {...p} />;
      case "Routes": return <Routes {...p} />;
      case "Exceptions": return <Exceptions {...p} />;
      case "History": return <History {...p} />;
      default: return <Overview {...p} />;
    }
  })();
  return <Page key={p.tab}>{body}</Page>;
}
