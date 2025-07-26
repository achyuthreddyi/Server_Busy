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

// Mock discoverable resources database
const discoverableResources = [
  // Mathematics Resources
  { id: 'd1', title: 'Advanced Calculus Lecture Series', type: 'youtube', url: 'https://youtube.com/watch?v=calculus123', description: 'Comprehensive calculus lectures covering derivatives and integrals', subject: 'mathematics', level: 'advanced' },
  { id: 'd2', title: 'Linear Algebra Complete Guide.pdf', type: 'pdf', url: 'https://example.com/linear-algebra.pdf', description: 'Complete guide to linear algebra concepts and applications', subject: 'mathematics', level: 'intermediate' },
  { id: 'd3', title: 'Statistics Fundamentals.docx', type: 'doc', url: 'https://example.com/statistics.docx', description: 'Introduction to statistical concepts and methods', subject: 'mathematics', level: 'beginner' },
  { id: 'd4', title: 'Geometry Formulas Reference.txt', type: 'text', url: 'https://example.com/geometry.txt', description: 'Quick reference for geometric formulas and theorems', subject: 'mathematics', level: 'intermediate' },
  
  // Physics Resources
  { id: 'd5', title: 'Quantum Mechanics Explained', type: 'youtube', url: 'https://youtube.com/watch?v=quantum456', description: 'Visual explanation of quantum mechanics principles', subject: 'physics', level: 'advanced' },
  { id: 'd6', title: 'Classical Mechanics Textbook.pdf', type: 'pdf', url: 'https://example.com/classical-mechanics.pdf', description: 'University-level classical mechanics textbook', subject: 'physics', level: 'advanced' },
  { id: 'd7', title: 'Thermodynamics Lab Manual.doc', type: 'doc', url: 'https://example.com/thermodynamics.doc', description: 'Laboratory exercises for thermodynamics', subject: 'physics', level: 'intermediate' },
  { id: 'd8', title: 'Physics Constants Reference.txt', type: 'text', url: 'https://example.com/constants.txt', description: 'List of important physical constants', subject: 'physics', level: 'beginner' },
  
  // Chemistry Resources
  { id: 'd9', title: 'Organic Chemistry Reactions', type: 'youtube', url: 'https://youtube.com/watch?v=organic789', description: 'Step-by-step organic chemistry reaction mechanisms', subject: 'chemistry', level: 'intermediate' },
  { id: 'd10', title: 'Periodic Table Extended.pdf', type: 'pdf', url: 'https://example.com/periodic-table.pdf', description: 'Extended periodic table with detailed element information', subject: 'chemistry', level: 'beginner' },
  { id: 'd11', title: 'Chemical Safety Guidelines.docx', type: 'doc', url: 'https://example.com/safety.docx', description: 'Laboratory safety procedures and guidelines', subject: 'chemistry', level: 'beginner' },
  { id: 'd12', title: 'Molecular Structures Database.txt', type: 'text', url: 'https://example.com/molecules.txt', description: 'Database of common molecular structures', subject: 'chemistry', level: 'intermediate' },
  
  // Literature/English Resources
  { id: 'd13', title: 'Shakespeare Analysis Workshop', type: 'youtube', url: 'https://youtube.com/watch?v=shakespeare101', description: 'In-depth analysis of Shakespeare\'s major works', subject: 'literature', level: 'intermediate' },
  { id: 'd14', title: 'Poetry Analysis Techniques.pdf', type: 'pdf', url: 'https://example.com/poetry.pdf', description: 'Guide to analyzing poetry and literary devices', subject: 'literature', level: 'intermediate' },
  { id: 'd15', title: 'Grammar Reference Manual.doc', type: 'doc', url: 'https://example.com/grammar.doc', description: 'Comprehensive English grammar reference', subject: 'english', level: 'beginner' },
  { id: 'd16', title: 'Vocabulary Building Lists.txt', type: 'text', url: 'https://example.com/vocabulary.txt', description: 'Curated vocabulary lists for different levels', subject: 'english', level: 'beginner' },
  
  // General Education Resources
  { id: 'd17', title: 'Study Techniques That Work', type: 'youtube', url: 'https://youtube.com/watch?v=study123', description: 'Evidence-based study techniques and methods', subject: 'education', level: 'general' },
  { id: 'd18', title: 'Critical Thinking Skills.pdf', type: 'pdf', url: 'https://example.com/critical-thinking.pdf', description: 'Developing critical thinking and problem-solving skills', subject: 'education', level: 'general' },
  { id: 'd19', title: 'Teaching Methodologies.docx', type: 'doc', url: 'https://example.com/teaching.docx', description: 'Modern teaching methodologies and best practices', subject: 'education', level: 'general' },
  { id: 'd20', title: 'Learning Theories Summary.txt', type: 'text', url: 'https://example.com/learning.txt', description: 'Summary of major learning theories', subject: 'education', level: 'general' },
  
  // Technology Resources
  { id: 'd21', title: 'Programming Fundamentals Course', type: 'youtube', url: 'https://youtube.com/watch?v=programming101', description: 'Introduction to programming concepts', subject: 'technology', level: 'beginner' },
  { id: 'd22', title: 'Data Structures Guide.pdf', type: 'pdf', url: 'https://example.com/data-structures.pdf', description: 'Comprehensive guide to data structures and algorithms', subject: 'technology', level: 'intermediate' },
  { id: 'd23', title: 'Web Development Basics.doc', type: 'doc', url: 'https://example.com/web-dev.doc', description: 'Introduction to web development technologies', subject: 'technology', level: 'beginner' },
  { id: 'd24', title: 'AI and Machine Learning Overview.txt', type: 'text', url: 'https://example.com/ai-ml.txt', description: 'Overview of artificial intelligence and machine learning', subject: 'technology', level: 'advanced' }
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

// Update notebook sources (for when user selects/deselects sources or imports new ones)
app.put('/api/notebooks/:id/sources', (req, res) => {
  const notebookId = parseInt(req.params.id);
  const { sources } = req.body;
  
  console.log(`Updating sources for notebook ${notebookId}`);
  console.log(`Received ${sources ? sources.length : 0} sources:`, sources);
  
  try {
    const notebookIndex = notebookData.findIndex(nb => nb.id === notebookId);
    
    if (notebookIndex === -1) {
      return res.status(404).json({ error: "Notebook not found" });
    }

    // Validate sources array
    if (!Array.isArray(sources)) {
      return res.status(400).json({ error: "Sources must be an array" });
    }

    // Store the previous sources for comparison
    const previousSources = notebookData[notebookIndex].sources;
    const newImportedSources = sources.filter(source => 
      source.id.startsWith('imported_') && 
      !previousSources.some(prevSource => prevSource.id === source.id)
    );

    // Update the notebook sources
    notebookData[notebookIndex].sources = sources;
    
    // Log import activity
    if (newImportedSources.length > 0) {
      console.log(`Successfully imported ${newImportedSources.length} new resources:`);
      newImportedSources.forEach(source => {
        console.log(`  - ${source.title} (${source.type})`);
      });
    }
    
    // Update last modified timestamp
    notebookData[notebookIndex].lastModified = 'Just now';
    
    res.json({ 
      message: "Sources updated successfully", 
      notebook: notebookData[notebookIndex],
      importedCount: newImportedSources.length,
      totalSources: sources.length
    });
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

// NEW: Discover/Search resources endpoint
app.get('/api/discover', (req, res) => {
  const { q: query, type, limit = 20 } = req.query;
  
  console.log(`Searching resources with query: "${query}", type: ${type}`);
  
  try {
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: "Search query is required" });
    }

    let filteredResources = [...discoverableResources]; // Create a copy to avoid mutating original

    // Filter by search query (title, description, subject)
    const searchTerm = query.toLowerCase().trim();
    filteredResources = filteredResources.filter(resource => {
      const titleMatch = resource.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = resource.description.toLowerCase().includes(searchTerm);
      const subjectMatch = resource.subject.toLowerCase().includes(searchTerm);
      
      return titleMatch || descriptionMatch || subjectMatch;
    });

    // Filter by type if specified
    if (type && type !== 'all') {
      filteredResources = filteredResources.filter(resource => resource.type === type);
    }

    // Sort by relevance (prioritize title matches, then description matches)
    filteredResources.sort((a, b) => {
      const aInTitle = a.title.toLowerCase().includes(searchTerm) ? 2 : 0;
      const aInDescription = a.description.toLowerCase().includes(searchTerm) ? 1 : 0;
      const bInTitle = b.title.toLowerCase().includes(searchTerm) ? 2 : 0;
      const bInDescription = b.description.toLowerCase().includes(searchTerm) ? 1 : 0;
      
      const aScore = aInTitle + aInDescription;
      const bScore = bInTitle + bInDescription;
      
      return bScore - aScore;
    });

    // Limit results
    const limitNum = parseInt(limit);
    if (limitNum > 0 && limitNum < filteredResources.length) {
      filteredResources = filteredResources.slice(0, limitNum);
    }

    res.json({ 
      resources: filteredResources,
      query: query,
      total: filteredResources.length,
      filters: { type: type || 'all' }
    });
  } catch (error) {
    console.error("Error searching resources:", error);
    res.status(500).json({ error: "Failed to search resources" });
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
  console.log(`  GET  /api/discover?q=<query>&type=<type>&limit=<limit>`);
}); 