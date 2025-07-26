import Logo from "./Logo";
import UserIcon from "./UserIcon";

export default function Header() {
  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      height: 64,
      borderBottom: "1px solid #eee",
      background: "#fff",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      <Logo />
      <UserIcon />
    </header>
  );
} 