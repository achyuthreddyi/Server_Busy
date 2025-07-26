import { useState, useMemo, useEffect } from "react";
import { fetchDocuments } from "./api";

interface Document {
  name: string;
  type: string;
}

export default function KnowledgeBasePlaceholder() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [subject] = useState<string>("Physics"); // Fixed for now

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchDocuments()
      .then((docs: Document[]) => {
        setDocuments(docs);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Handlers
  const handleDocToggle = (docName: string) => {
    setSelectedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(docName)) next.delete(docName);
      else next.add(docName);
      return next;
    });
  };
  const handleSelectAll = () => {
    if (selectedDocs.size === documents.length) setSelectedDocs(new Set());
    else setSelectedDocs(new Set(documents.map((d) => d.name)));
  };
  const handleUpload = () => alert("Upload feature coming soon!");
  const handleDiscover = () => alert("Discover feature coming soon!");

  // Selected document objects
  const selectedDocObjs = documents.filter((d) => selectedDocs.has(d.name));

  return (
    <div style={{
      display: "flex",
      width: "100vw",
      height: "100vh",
      background: "#181c23",
      overflow: "hidden", // Prevent horizontal scroll
      minWidth: 0,
    }}>
      {/* Left: Sources/Subject Panel */}
      <aside style={{
        width: 320,
        minWidth: 240,
        maxWidth: 340,
        background: "#232733",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #232733",
        flexShrink: 0,
      }}>
        <div style={{ padding: 24, borderBottom: "1px solid #232733" }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 18 }}>Subject</div>
          <select value={subject} disabled style={{ width: "100%", padding: 10, borderRadius: 8, background: "#232733", color: "#fff", border: "1px solid #353a4a", fontWeight: 600, fontSize: 16, marginBottom: 18 }}>
            <option>Physics</option>
          </select>
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            <button onClick={handleUpload} style={{ flex: 1, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 0", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>+ Add</button>
            <button onClick={handleDiscover} style={{ flex: 1, background: "#353a4a", color: "#fff", border: "none", borderRadius: 8, padding: "8px 0", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Discover</button>
          </div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10 }}>Sources</div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            <input type="checkbox" checked={selectedDocs.size === documents.length && documents.length > 0} onChange={handleSelectAll} style={{ marginRight: 8 }} />
            <span style={{ fontSize: 14 }}>Select all sources</span>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24, paddingTop: 0 }}>
          {loading ? (
            <div style={{ color: "#aaa" }}>Loading sources...</div>
          ) : error ? (
            <div style={{ color: "#d00" }}>Failed to load sources.</div>
          ) : documents.length === 0 ? (
            <div style={{ color: "#aaa" }}>No sources found.</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {documents.map((doc) => (
                <li key={doc.name} style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
                  <input
                    type="checkbox"
                    checked={selectedDocs.has(doc.name)}
                    onChange={() => handleDocToggle(doc.name)}
                    style={{ marginRight: 10 }}
                  />
                  <span style={{ fontSize: 18, marginRight: 8 }}>{doc.type === "PDF" ? "📄" : doc.type === "DOCX" ? "📝" : "📃"}</span>
                  <span style={{ fontSize: 15, color: "#fff" }}>{doc.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Center: Notebook/Chat Panel */}
      <main style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        background: "#181c23",
        color: "#fff",
        overflow: "hidden",
      }}>
        {/* Notebook summary/preview */}
        <div style={{ flex: 1, padding: 40, borderBottom: "1px solid #232733", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          {selectedDocObjs.length === 0 ? (
            <div style={{ color: "#aaa", fontSize: 22, textAlign: "center" }}>
              Select one or more sources from the left to view your Physics notebook.<br />
              <span style={{ fontSize: 16, color: "#666" }}>
                (PDF preview and summary will appear here)
              </span>
            </div>
          ) : (
            <div style={{ width: "100%", maxWidth: 700, textAlign: "left" }}>
              <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 18, color: "#fff" }}>Physics Notebook</div>
              <div style={{ marginBottom: 18, color: "#cbd5e1" }}>
                {selectedDocObjs.map((doc) => (
                  <div key={doc.name} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 20, marginRight: 10 }}>{doc.type === "PDF" ? "📄" : doc.type === "DOCX" ? "📝" : "📃"}</span>
                    <span style={{ fontWeight: 600 }}>{doc.name}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 18, color: "#aaa", fontStyle: "italic" }}>
                (Notebook summary and PDF preview coming soon)
              </div>
            </div>
          )}
        </div>
        {/* Chat interface */}
        <div style={{ padding: 0, background: "#181c23", borderTop: "1px solid #232733", minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ padding: 32, paddingBottom: 18, color: "#fff" }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Chat</div>
            <div style={{ color: "#aaa", fontSize: 15, marginBottom: 18 }}>
              Ask questions about your selected Physics sources. (Chat context will use selected PDFs)
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                placeholder="Type your question..."
                style={{ flex: 1, padding: 14, borderRadius: 8, border: "1px solid #353a4a", fontSize: 16, background: "#232733", color: "#fff" }}
                disabled
              />
              <button style={{ padding: "14px 24px", borderRadius: 8, background: "#2563eb", color: "#fff", border: "none", fontWeight: 600, fontSize: 16, cursor: "not-allowed" }} disabled>
                Send
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Right: Notes/Studio Panel */}
      <aside style={{
        width: 340,
        minWidth: 220,
        maxWidth: 380,
        background: "#20232b",
        color: "#fff",
        borderLeft: "1px solid #232733",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
      }}>
        <div style={{ padding: 28, borderBottom: "1px solid #232733" }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 18 }}>Notes</div>
          <div style={{ color: "#aaa", fontSize: 15, marginBottom: 18 }}>
            Saved notes will appear here.<br />
            (Feature coming soon)
          </div>
          <button style={{ background: "#353a4a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 600, fontSize: 15, cursor: "not-allowed", width: "100%" }} disabled>
            + Add note
          </button>
        </div>
        <div style={{ flex: 1 }} />
      </aside>
    </div>
  );
} 