export default function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#2563eb" />
        <text x="16" y="21" textAnchor="middle" fontSize="16" fill="#fff" fontFamily="Arial" fontWeight="bold">VM</text>
      </svg>
      <span style={{ fontWeight: 700, fontSize: 20, color: "#2563eb", letterSpacing: 1 }}>Vidya Mitra</span>
    </div>
  );
} 