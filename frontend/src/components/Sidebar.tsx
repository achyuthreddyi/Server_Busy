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
    <aside style={{ minWidth: 260, borderRight: "1px solid #eee", padding: 24 }}>
      <nav>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {requirements.map((req) => (
            <SidebarItem
              key={req.id}
              title={req.title}
              selected={selected === req.title}
              onClick={() => onSelect(req.title)}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
} 