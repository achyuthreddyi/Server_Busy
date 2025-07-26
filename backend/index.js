const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Hardcoded mock documents (should match frontend for now)
const mockDocuments = [
  { name: "Mathematics Textbook (Grade 3)", type: "PDF" },
  { name: "Mathematics Textbook (Grade 5)", type: "PDF" },
  { name: "Science Study Material", type: "DOCX" },
  { name: "English Reader", type: "PDF" },
  { name: "History Notes", type: "TXT" },
  { name: "Geography Atlas", type: "PDF" },
  { name: "Hindi Workbook", type: "PDF" },
  { name: "Computer Basics", type: "DOCX" },
];

app.get('/api/documents', (req, res) => {
  console.log("Returning the documents");
  res.json({ documents: mockDocuments });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 