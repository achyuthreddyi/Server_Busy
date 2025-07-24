interface SidebarItemProps {
  title: string;
  selected: boolean;
  onClick: () => void;
}

export default function SidebarItem({ title, selected, onClick }: SidebarItemProps) {
  return (
    <li>
      <button
        style={{
          background: selected ? "#f0f0f0" : "transparent",
          border: "none",
          padding: "12px 16px",
          width: "100%",
          textAlign: "left",
          fontWeight: selected ? "bold" : "normal",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        {title}
      </button>
    </li>
  );
} 