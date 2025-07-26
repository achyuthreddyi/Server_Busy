export async function fetchDocuments() {
  const res = await fetch("http://localhost:4000/api/documents");
  if (!res.ok) throw new Error("Failed to fetch documents");
  const data = await res.json();
  return data.documents;
} 