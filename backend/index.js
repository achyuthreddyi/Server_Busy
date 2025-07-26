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

// Notebook data moved from frontend
const notebookData = [
  {
    id: 1,
    title: "Advanced Mathematics - Calculus",
    class: "Grade 12 Mathematics",
    section: "Section A",
    tags: ["calculus", "derivatives", "integrals", "grade-12"],
    lastModified: "2 days ago",
    noteCount: 23,
    color: "bg-blue-50 border-blue-200",
    description: "Comprehensive study notes for calculus concepts including limits, derivatives, and integrals for Grade 12 students.",
    createdDate: "January 15, 2024",
    sources: [
      { id: '1', title: 'Calculus Fundamentals.pdf', type: 'pdf', selected: true, dateAdded: '2 days ago' },
      { id: '2', title: 'Derivative Rules Handbook', type: 'doc', selected: true, dateAdded: '1 week ago' },
      { id: '3', title: 'Integration Techniques Notes', type: 'text', selected: false, dateAdded: '3 days ago' },
      { id: '4', title: 'Khan Academy - Calculus Course', type: 'url', selected: true, dateAdded: '5 days ago' }
    ]
  },
  {
    id: 2,
    title: "Physics - Quantum Mechanics",
    class: "Grade 11 Physics",
    section: "Section B",
    tags: ["quantum", "mechanics", "physics", "grade-11"],
    lastModified: "1 week ago",
    noteCount: 15,
    color: "bg-green-50 border-green-200",
    description: "Fundamental concepts of quantum mechanics for advanced physics students.",
    createdDate: "December 20, 2023",
    sources: [
      { id: '1', title: 'Quantum Physics Introduction.pdf', type: 'pdf', selected: true, dateAdded: '1 week ago' },
      { id: '2', title: 'Wave-Particle Duality Experiments', type: 'doc', selected: false, dateAdded: '2 weeks ago' },
      { id: '3', title: 'Heisenberg Principle Explained', type: 'text', selected: true, dateAdded: '4 days ago' }
    ]
  },
  {
    id: 3,
    title: "Chemistry - Organic Compounds",
    class: "Grade 10 Chemistry",
    section: "Section A",
    tags: ["organic", "compounds", "chemistry", "grade-10"],
    lastModified: "3 days ago",
    noteCount: 31,
    color: "bg-purple-50 border-purple-200",
    description: "Study of organic chemistry focusing on carbon-based compounds and their reactions.",
    createdDate: "November 10, 2023",
    sources: [
      { id: '1', title: 'Organic Chemistry Basics.pdf', type: 'pdf', selected: true, dateAdded: '3 days ago' },
      { id: '2', title: 'Hydrocarbon Classification Guide', type: 'doc', selected: true, dateAdded: '1 week ago' },
      { id: '3', title: 'Functional Groups Reference', type: 'text', selected: false, dateAdded: '5 days ago' },
      { id: '4', title: 'ChemLibreTexts - Organic Chemistry', type: 'url', selected: true, dateAdded: '2 weeks ago' }
    ]
  },
  {
    id: 4,
    title: "Literature - Shakespeare Studies",
    class: "Grade 12 English",
    section: "Section C",
    tags: ["shakespeare", "literature", "english", "grade-12"],
    lastModified: "5 days ago",
    noteCount: 18,
    color: "bg-yellow-50 border-yellow-200",
    description: "Analysis of Shakespeare's major works including themes, characters, and literary devices.",
    createdDate: "October 5, 2023",
    sources: [
      { id: '1', title: 'Hamlet Complete Text.pdf', type: 'pdf', selected: true, dateAdded: '5 days ago' },
      { id: '2', title: 'Macbeth Analysis Notes', type: 'doc', selected: true, dateAdded: '1 week ago' },
      { id: '3', title: 'Shakespeare Themes Overview', type: 'text', selected: false, dateAdded: '3 days ago' }
    ]
  }
];

// API Routes

// Get all documents (existing)
app.get('/api/documents', (req, res) => {
  console.log("Returning the documents");
  res.json({ documents: mockDocuments });
});

// Get all notebooks for knowledge base listing
app.get('/api/notebooks', (req, res) => {
  console.log("Returning all notebooks");
  try {
    // Return notebooks without sources for listing page (lighter payload)
    const notebooksListing = notebookData.map(notebook => ({
      id: notebook.id,
      title: notebook.title,
      class: notebook.class,
      section: notebook.section,
      tags: notebook.tags,
      lastModified: notebook.lastModified,
      noteCount: notebook.noteCount,
      color: notebook.color,
      description: notebook.description
    }));
    res.json({ notebooks: notebooksListing });
  } catch (error) {
    console.error("Error fetching notebooks:", error);
    res.status(500).json({ error: "Failed to fetch notebooks" });
  }
});

// Get individual notebook by ID
app.get('/api/notebooks/:id', (req, res) => {
  const notebookId = parseInt(req.params.id);
  console.log(`Returning notebook with ID: ${notebookId}`);
  
  try {
    const notebook = notebookData.find(nb => nb.id === notebookId);
    
    if (!notebook) {
      return res.status(404).json({ error: "Notebook not found" });
    }
    
    res.json({ notebook });
  } catch (error) {
    console.error("Error fetching notebook:", error);
    res.status(500).json({ error: "Failed to fetch notebook" });
  }
});

// Update notebook sources (for when user selects/deselects sources)
app.put('/api/notebooks/:id/sources', (req, res) => {
  const notebookId = parseInt(req.params.id);
  const { sources } = req.body;
  
  console.log(`Updating sources for notebook ${notebookId}`);
  
  try {
    const notebookIndex = notebookData.findIndex(nb => nb.id === notebookId);
    
    if (notebookIndex === -1) {
      return res.status(404).json({ error: "Notebook not found" });
    }
    
    notebookData[notebookIndex].sources = sources;
    res.json({ message: "Sources updated successfully", notebook: notebookData[notebookIndex] });
  } catch (error) {
    console.error("Error updating sources:", error);
    res.status(500).json({ error: "Failed to update sources" });
  }
});

// Send chat message (placeholder for future LLM integration)
app.post('/api/notebooks/:id/chat', (req, res) => {
  const notebookId = parseInt(req.params.id);
  const { message, selectedSources } = req.body;
  
  console.log(`Chat message for notebook ${notebookId}: ${message}`);
  console.log(`Selected sources: ${selectedSources.length}`);
  
  try {
    // Simulate AI response (replace with actual LLM API call)
    const response = {
      id: Date.now().toString(),
      content: `Based on your ${selectedSources.length} selected sources, I can help you with "${message}". Here's what I found in your materials...`,
      role: 'assistant',
      timestamp: new Date(),
      sources: selectedSources.slice(0, 2).map(source => source.title) // Reference first 2 sources
    };
    
    res.json({ response });
  } catch (error) {
    console.error("Error processing chat message:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET  /api/documents`);
  console.log(`  GET  /api/notebooks`);
  console.log(`  GET  /api/notebooks/:id`);
  console.log(`  PUT  /api/notebooks/:id/sources`);
  console.log(`  POST /api/notebooks/:id/chat`);
}); 