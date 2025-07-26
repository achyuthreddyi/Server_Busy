import SidebarItem from "./SidebarItem";

interface Requirement {
  id: string;
  title: string;
}

interface SidebarProps {
  requirements: Requirement[];
  selected: string;
  onSelect: (title: string) => void;
}

export default function Sidebar({ requirements, selected, onSelect }: SidebarProps) {
  return (
    <aside style={{ minWidth: 260, borderRight: "1px solid #eee", padding: 24, display: "flex", flexDirection: "column", height: "100vh" }}>
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, height: "100%", display: "flex", flexDirection: "column" }}>
          {requirements.map((req) => (
            <li key={req.id}>
              <SidebarItem
                title={req.title}
                selected={selected === req.title}
                onClick={() => onSelect(req.title)}
              />
            </li>
          ))}
          <li style={{ marginTop: 32, borderTop: "1px solid #eee", paddingTop: 16 }}>
            <SidebarItem
              title="Knowledge Base"
              selected={selected === "knowledge-base"}
              onClick={() => onSelect("knowledge-base")}
            />
          </li>
        </ul>
      </nav>
    </aside>
  );
} 