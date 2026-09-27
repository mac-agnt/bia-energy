import Collections from "./modules/Collections";
import Fleet from "./modules/Fleet";
import Plant from "./modules/Plant";
import People from "./modules/People";
import Customers from "./modules/Customers";
import Compliance from "./modules/Compliance";

export type ModProps = { tab: string; setTab: (t: string) => void; go: (page: string, tab?: string) => void };

/* Routes the Bia operational modules. Tabs live in the Pulse header. */
export default function Module({ v }: { v: any }) {
  const p: ModProps = {
    tab: v.modTab,
    setTab: (t) => v.setModTab(v.modPage, t),
    go: (page, tab) => (tab ? v.setModTab(page, tab) : v.goPage(page)),
  };
  switch (v.modPage) {
    case "Collections": return <Collections {...p} />;
    case "Fleet": return <Fleet {...p} />;
    case "Plant": return <Plant {...p} />;
    case "People": return <People {...p} />;
    case "Customers": return <Customers {...p} />;
    case "Compliance": return <Compliance {...p} />;
    default: return null;
  }
}
