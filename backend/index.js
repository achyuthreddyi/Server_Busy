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

// Mock lesson planner data - represents subjects a teacher teaches for different classes
const lessonPlannerData = [
  {
    id: 1,
    subject: "Mathematics",
    classes: ["Grade 7 A", "Grade 7 C"],
    color: "bg-blue-50 border-blue-200",
    icon: "📊",
    description: "Algebra, geometry, and basic statistics for Grade 7 students",
    topics: ["Algebra", "Geometry", "Statistics", "Number Theory"],
    academicYear: "2023-24",
    createdDate: "August 15, 2023",
    // Consolidated data (average across all classes)
    totalLessons: 45,
    completedLessons: 28,
    nextLesson: "Quadratic Equations Introduction",
    nextLessonDate: "2024-01-25",
    // Class-specific data
    classData: [
      {
        className: "Grade 7 A",
        totalLessons: 45,
        completedLessons: 32,
        progress: 71,
        nextLesson: "Quadratic Equations Introduction",
        nextLessonDate: "2024-01-25",
        upcomingLessons: [
          { id: 1, title: "Quadratic Equations Introduction", date: "2024-01-25", duration: "45 minutes", status: "scheduled" },
          { id: 2, title: "Solving Quadratic Equations", date: "2024-01-27", duration: "45 minutes", status: "scheduled" },
          { id: 3, title: "Graphing Quadratics", date: "2024-01-30", duration: "60 minutes", status: "scheduled" }
        ],
        recentLessons: [
          { id: 1, title: "Linear Equations Advanced", date: "2024-01-22", duration: "45 minutes", status: "completed" },
          { id: 2, title: "Systems of Equations Practice", date: "2024-01-20", duration: "45 minutes", status: "completed" },
          { id: 3, title: "Word Problems with Linear Equations", date: "2024-01-18", duration: "45 minutes", status: "completed" }
        ]
      },
      {
        className: "Grade 7 C",
        totalLessons: 45,
        completedLessons: 25,
        progress: 56,
        nextLesson: "Systems of Linear Equations Review",
        nextLessonDate: "2024-01-26",
        upcomingLessons: [
          { id: 1, title: "Systems of Linear Equations Review", date: "2024-01-26", duration: "45 minutes", status: "scheduled" },
          { id: 2, title: "Introduction to Quadratic Equations", date: "2024-01-29", duration: "45 minutes", status: "scheduled" },
          { id: 3, title: "Basic Quadratic Practice", date: "2024-01-31", duration: "60 minutes", status: "scheduled" }
        ],
        recentLessons: [
          { id: 1, title: "Linear Equations Review", date: "2024-01-23", duration: "45 minutes", status: "completed" },
          { id: 2, title: "Solving Simple Systems", date: "2024-01-21", duration: "45 minutes", status: "completed" },
          { id: 3, title: "Graphing Linear Functions", date: "2024-01-19", duration: "45 minutes", status: "completed" }
        ]
      }
    ]
  },
  {
    id: 2,
    subject: "Biology",
    classes: ["Grade 8 D", "Grade 8 B"],
    color: "bg-green-50 border-green-200",
    icon: "🧬",
    description: "Basic biology concepts including cell structure, genetics, and ecosystems",
    topics: ["Cell Biology", "Genetics", "Ecology", "Human Body Systems"],
    academicYear: "2023-24",
    createdDate: "August 20, 2023",
    // Consolidated data
    totalLessons: 38,
    completedLessons: 22,
    nextLesson: "Photosynthesis Process",
    nextLessonDate: "2024-01-26",
    // Class-specific data
    classData: [
      {
        className: "Grade 8 D",
        totalLessons: 38,
        completedLessons: 26,
        progress: 68,
        nextLesson: "Photosynthesis Process",
        nextLessonDate: "2024-01-26",
        upcomingLessons: [
          { id: 1, title: "Photosynthesis Process", date: "2024-01-26", duration: "50 minutes", status: "scheduled" },
          { id: 2, title: "Cellular Respiration", date: "2024-01-28", duration: "50 minutes", status: "scheduled" }
        ],
        recentLessons: [
          { id: 1, title: "Cell Structure Review", date: "2024-01-24", duration: "50 minutes", status: "completed" },
          { id: 2, title: "Plant vs Animal Cells", date: "2024-01-22", duration: "50 minutes", status: "completed" }
        ]
      },
      {
        className: "Grade 8 B",
        totalLessons: 38,
        completedLessons: 18,
        progress: 47,
        nextLesson: "Cell Structure Advanced",
        nextLessonDate: "2024-01-27",
        upcomingLessons: [
          { id: 1, title: "Cell Structure Advanced", date: "2024-01-27", duration: "50 minutes", status: "scheduled" },
          { id: 2, title: "Introduction to Photosynthesis", date: "2024-01-30", duration: "50 minutes", status: "scheduled" }
        ],
        recentLessons: [
          { id: 1, title: "Basic Cell Structure", date: "2024-01-23", duration: "50 minutes", status: "completed" },
          { id: 2, title: "Cell Types Overview", date: "2024-01-21", duration: "50 minutes", status: "completed" }
        ]
      }
    ]
  },
  {
    id: 3,
    subject: "Civics",
    classes: ["Grade 7 A", "Grade 7 C"],
    color: "bg-purple-50 border-purple-200",
    icon: "🏛️",
    description: "Introduction to government, democracy, and civic responsibilities",
    topics: ["Democracy", "Constitution", "Rights & Duties", "Local Government"],
    academicYear: "2023-24",
    createdDate: "August 18, 2023",
    // Consolidated data
    totalLessons: 32,
    completedLessons: 18,
    nextLesson: "Local Government Structure",
    nextLessonDate: "2024-01-27",
    // Class-specific data
    classData: [
      {
        className: "Grade 7 A",
        totalLessons: 32,
        completedLessons: 21,
        progress: 66,
        nextLesson: "Local Government Structure",
        nextLessonDate: "2024-01-27",
        upcomingLessons: [
          { id: 1, title: "Local Government Structure", date: "2024-01-27", duration: "40 minutes", status: "scheduled" }
        ],
        recentLessons: [
          { id: 1, title: "Constitutional Rights", date: "2024-01-24", duration: "40 minutes", status: "completed" }
        ]
      },
      {
        className: "Grade 7 C",
        totalLessons: 32,
        completedLessons: 15,
        progress: 47,
        nextLesson: "Fundamental Rights Review",
        nextLessonDate: "2024-01-28",
        upcomingLessons: [
          { id: 1, title: "Fundamental Rights Review", date: "2024-01-28", duration: "40 minutes", status: "scheduled" }
        ],
        recentLessons: [
          { id: 1, title: "Introduction to Constitution", date: "2024-01-25", duration: "40 minutes", status: "completed" }
        ]
      }
    ]
  },
  {
    id: 4,
    subject: "Chemistry",
    classes: ["Grade 9 A", "Grade 9 B"],
    color: "bg-orange-50 border-orange-200",
    icon: "⚗️",
    description: "Basic chemistry principles including atomic structure and chemical reactions",
    topics: ["Atomic Structure", "Chemical Reactions", "Periodic Table", "Acids & Bases"],
    academicYear: "2023-24",
    createdDate: "August 22, 2023",
    // Consolidated data
    totalLessons: 42,
    completedLessons: 25,
    nextLesson: "Chemical Bonding Types",
    nextLessonDate: "2024-01-28",
    // Class-specific data
    classData: [
      {
        className: "Grade 9 A",
        totalLessons: 42,
        completedLessons: 28,
        progress: 67,
        nextLesson: "Chemical Bonding Types",
        nextLessonDate: "2024-01-28",
        upcomingLessons: [
          { id: 1, title: "Chemical Bonding Types", date: "2024-01-28", duration: "60 minutes", status: "scheduled" }
        ],
        recentLessons: [
          { id: 1, title: "Atomic Structure Review", date: "2024-01-25", duration: "60 minutes", status: "completed" }
        ]
      },
      {
        className: "Grade 9 B",
        totalLessons: 42,
        completedLessons: 22,
        progress: 52,
        nextLesson: "Atomic Structure Advanced",
        nextLessonDate: "2024-01-29",
        upcomingLessons: [
          { id: 1, title: "Atomic Structure Advanced", date: "2024-01-29", duration: "60 minutes", status: "scheduled" }
        ],
        recentLessons: [
          { id: 1, title: "Basic Atomic Theory", date: "2024-01-26", duration: "60 minutes", status: "completed" }
        ]
      }
    ]
  },
  {
    id: 5,
    subject: "English Literature",
    classes: ["Grade 10 A"],
    color: "bg-yellow-50 border-yellow-200",
    icon: "📚",
    description: "Classic and modern literature analysis with focus on critical thinking",
    topics: ["Poetry", "Drama", "Prose", "Literary Devices"],
    academicYear: "2023-24",
    createdDate: "August 25, 2023",
    // Consolidated data
    totalLessons: 36,
    completedLessons: 20,
    nextLesson: "Poetry Analysis Techniques",
    nextLessonDate: "2024-01-29",
    // Class-specific data (single class)
    classData: [
      {
        className: "Grade 10 A",
        totalLessons: 36,
        completedLessons: 20,
        progress: 56,
        nextLesson: "Poetry Analysis Techniques",
        nextLessonDate: "2024-01-29",
        upcomingLessons: [
          { id: 1, title: "Poetry Analysis Techniques", date: "2024-01-29", duration: "45 minutes", status: "scheduled" }
        ],
        recentLessons: [
          { id: 1, title: "Shakespeare's Sonnets", date: "2024-01-26", duration: "45 minutes", status: "completed" }
        ]
      }
    ]
  },
  {
    id: 6,
    subject: "Physics",
    classes: ["Grade 11 Science"],
    color: "bg-indigo-50 border-indigo-200",
    icon: "⚡",
    description: "Fundamental physics concepts including mechanics, electricity, and waves",
    topics: ["Mechanics", "Electricity", "Magnetism", "Waves", "Optics"],
    academicYear: "2023-24",
    createdDate: "August 28, 2023",
    // Consolidated data
    totalLessons: 48,
    completedLessons: 30,
    nextLesson: "Electromagnetic Induction",
    nextLessonDate: "2024-01-30",
    // Class-specific data (single class)
    classData: [
      {
        className: "Grade 11 Science",
        totalLessons: 48,
        completedLessons: 30,
        progress: 63,
        nextLesson: "Electromagnetic Induction",
        nextLessonDate: "2024-01-30",
        upcomingLessons: [
          { id: 1, title: "Electromagnetic Induction", date: "2024-01-30", duration: "75 minutes", status: "scheduled" }
        ],
        recentLessons: [
          { id: 1, title: "Magnetic Fields", date: "2024-01-27", duration: "75 minutes", status: "completed" }
        ]
      }
    ]
  }
];

// Teacher's classes data for dashboard
const teacherClassData = [
  {
    id: 1,
    name: "Grade 7 A",
    subject: "Mathematics",
    totalStudents: 32,
    presentToday: 28,
    averagePerformance: 78,
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    icon: "📊",
    schedule: "Mon, Wed, Fri - 9:00 AM",
    room: "Room 201",
    nextClass: "Today 2:00 PM",
    recentActivity: "Quiz submitted by 25 students",
    performanceTrend: "up", // up, down, stable
    teacher: "Ms. Sarah Johnson"
  },
  {
    id: 2,
    name: "Grade 7 C",
    subject: "Mathematics", 
    totalStudents: 30,
    presentToday: 27,
    averagePerformance: 82,
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
    icon: "📊",
    schedule: "Tue, Thu - 10:30 AM",
    room: "Room 201",
    nextClass: "Tomorrow 10:30 AM",
    recentActivity: "Assignment graded",
    performanceTrend: "up",
    teacher: "Ms. Sarah Johnson"
  },
  {
    id: 3,
    name: "Grade 8 D",
    subject: "Biology",
    totalStudents: 28,
    presentToday: 26,
    averagePerformance: 75,
    color: "bg-purple-50 border-purple-200", 
    iconColor: "text-purple-600",
    icon: "🧬",
    schedule: "Mon, Wed, Fri - 11:00 AM",
    room: "Science Lab 1",
    nextClass: "Today 11:00 AM",
    recentActivity: "Lab report pending from 8 students",
    performanceTrend: "stable",
    teacher: "Ms. Sarah Johnson"
  },
  {
    id: 4,
    name: "Grade 8 B",
    subject: "Biology",
    totalStudents: 29,
    presentToday: 24,
    averagePerformance: 69,
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-600", 
    icon: "🧬",
    schedule: "Tue, Thu, Sat - 2:00 PM",
    room: "Science Lab 1",
    nextClass: "Today 2:00 PM",
    recentActivity: "Test scheduled for next week",
    performanceTrend: "down",
    teacher: "Ms. Sarah Johnson"
  },
  {
    id: 5,
    name: "Grade 10 A",
    subject: "English Literature",
    totalStudents: 25,
    presentToday: 23,
    averagePerformance: 85,
    color: "bg-yellow-50 border-yellow-200",
    iconColor: "text-yellow-600",
    icon: "📚",
    schedule: "Daily - 1:00 PM",
    room: "Room 105",
    nextClass: "Today 1:00 PM",
    recentActivity: "Essay submissions reviewed",
    performanceTrend: "up",
    teacher: "Ms. Sarah Johnson"
  },
  {
    id: 6,
    name: "Grade 11 Science",
    subject: "Physics",
    totalStudents: 22,
    presentToday: 20,
    averagePerformance: 88,
    color: "bg-indigo-50 border-indigo-200",
    iconColor: "text-indigo-600",
    icon: "⚡",
    schedule: "Mon, Wed, Fri - 3:30 PM",
    room: "Physics Lab",
    nextClass: "Tomorrow 3:30 PM",
    recentActivity: "Practical exam completed",
    performanceTrend: "up",
    teacher: "Ms. Sarah Johnson"
  }
];

// Student data for each class
const studentData = {
  1: [ // Grade 7 A Mathematics
    { id: 1, name: "Alice Johnson", rollNo: "7A01", attendance: 95, performance: 88, lastGrade: "A", status: "present", parentContact: "+1-234-567-8901", email: "alice.j@school.edu" },
    { id: 2, name: "Bob Smith", rollNo: "7A02", attendance: 87, performance: 75, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8902", email: "bob.s@school.edu" },
    { id: 3, name: "Carol Davis", rollNo: "7A03", attendance: 92, performance: 82, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8903", email: "carol.d@school.edu" },
    { id: 4, name: "David Brown", rollNo: "7A04", attendance: 78, performance: 68, lastGrade: "B", status: "absent", parentContact: "+1-234-567-8904", email: "david.b@school.edu" },
    { id: 5, name: "Emma Wilson", rollNo: "7A05", attendance: 98, performance: 92, lastGrade: "A+", status: "present", parentContact: "+1-234-567-8905", email: "emma.w@school.edu" },
    { id: 6, name: "Frank Miller", rollNo: "7A06", attendance: 85, performance: 77, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8906", email: "frank.m@school.edu" },
    { id: 7, name: "Grace Lee", rollNo: "7A07", attendance: 90, performance: 85, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8907", email: "grace.l@school.edu" },
    { id: 8, name: "Henry Taylor", rollNo: "7A08", attendance: 82, performance: 70, lastGrade: "B", status: "present", parentContact: "+1-234-567-8908", email: "henry.t@school.edu" },
    { id: 9, name: "Isabel Garcia", rollNo: "7A09", attendance: 94, performance: 86, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8909", email: "isabel.g@school.edu" },
    { id: 10, name: "Jack Robinson", rollNo: "7A10", attendance: 89, performance: 79, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8910", email: "jack.r@school.edu" },
    { id: 11, name: "Katie Chen", rollNo: "7A11", attendance: 96, performance: 90, lastGrade: "A", status: "present", parentContact: "+1-234-567-8911", email: "katie.c@school.edu" },
    { id: 12, name: "Liam Martinez", rollNo: "7A12", attendance: 83, performance: 74, lastGrade: "B", status: "present", parentContact: "+1-234-567-8912", email: "liam.m@school.edu" },
    { id: 13, name: "Mia Thompson", rollNo: "7A13", attendance: 91, performance: 83, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8913", email: "mia.t@school.edu" },
    { id: 14, name: "Noah Davis", rollNo: "7A14", attendance: 86, performance: 76, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8914", email: "noah.d@school.edu" },
    { id: 15, name: "Olivia White", rollNo: "7A15", attendance: 93, performance: 87, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8915", email: "olivia.w@school.edu" },
    { id: 16, name: "Peter Kim", rollNo: "7A16", attendance: 88, performance: 78, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8916", email: "peter.k@school.edu" },
    { id: 17, name: "Quinn Johnson", rollNo: "7A17", attendance: 90, performance: 81, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8917", email: "quinn.j@school.edu" },
    { id: 18, name: "Rachel Green", rollNo: "7A18", attendance: 97, performance: 91, lastGrade: "A", status: "present", parentContact: "+1-234-567-8918", email: "rachel.g@school.edu" },
    { id: 19, name: "Sam Wilson", rollNo: "7A19", attendance: 84, performance: 73, lastGrade: "B", status: "present", parentContact: "+1-234-567-8919", email: "sam.w@school.edu" },
    { id: 20, name: "Tara Lopez", rollNo: "7A20", attendance: 92, performance: 84, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8920", email: "tara.l@school.edu" },
    { id: 21, name: "Uma Patel", rollNo: "7A21", attendance: 89, performance: 80, lastGrade: "B+", status: "absent", parentContact: "+1-234-567-8921", email: "uma.p@school.edu" },
    { id: 22, name: "Victor Brown", rollNo: "7A22", attendance: 87, performance: 77, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8922", email: "victor.b@school.edu" },
    { id: 23, name: "Wendy Clark", rollNo: "7A23", attendance: 95, performance: 89, lastGrade: "A", status: "present", parentContact: "+1-234-567-8923", email: "wendy.c@school.edu" },
    { id: 24, name: "Xavier Lee", rollNo: "7A24", attendance: 81, performance: 71, lastGrade: "B", status: "present", parentContact: "+1-234-567-8924", email: "xavier.l@school.edu" },
    { id: 25, name: "Yara Ahmed", rollNo: "7A25", attendance: 93, performance: 85, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8925", email: "yara.a@school.edu" },
    { id: 26, name: "Zoe Taylor", rollNo: "7A26", attendance: 88, performance: 79, lastGrade: "B+", status: "absent", parentContact: "+1-234-567-8926", email: "zoe.t@school.edu" },
    { id: 27, name: "Aaron Miller", rollNo: "7A27", attendance: 90, performance: 82, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8927", email: "aaron.m@school.edu" },
    { id: 28, name: "Bella Rodriguez", rollNo: "7A28", attendance: 86, performance: 75, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8928", email: "bella.r@school.edu" },
    { id: 29, name: "Carlos Garcia", rollNo: "7A29", attendance: 91, performance: 83, lastGrade: "A-", status: "absent", parentContact: "+1-234-567-8929", email: "carlos.g@school.edu" },
    { id: 30, name: "Diana Singh", rollNo: "7A30", attendance: 94, performance: 87, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8930", email: "diana.s@school.edu" },
    { id: 31, name: "Ethan Cooper", rollNo: "7A31", attendance: 85, performance: 76, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8931", email: "ethan.c@school.edu" },
    { id: 32, name: "Fiona Hall", rollNo: "7A32", attendance: 92, performance: 84, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8932", email: "fiona.h@school.edu" }
  ],
  2: [ // Grade 7 C Mathematics  
    { id: 33, name: "Ivy Chen", rollNo: "7C01", attendance: 94, performance: 89, lastGrade: "A", status: "present", parentContact: "+1-234-567-8933", email: "ivy.c@school.edu" },
    { id: 34, name: "Jack Anderson", rollNo: "7C02", attendance: 88, performance: 78, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8934", email: "jack.a@school.edu" },
    { id: 35, name: "Kate Thompson", rollNo: "7C03", attendance: 96, performance: 91, lastGrade: "A+", status: "present", parentContact: "+1-234-567-8935", email: "kate.t@school.edu" },
    { id: 36, name: "Liam Garcia", rollNo: "7C04", attendance: 80, performance: 72, lastGrade: "B", status: "absent", parentContact: "+1-234-567-8936", email: "liam.g@school.edu" },
    { id: 37, name: "Mia Rodriguez", rollNo: "7C05", attendance: 93, performance: 86, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8937", email: "mia.r@school.edu" },
    { id: 38, name: "Nathan Brooks", rollNo: "7C06", attendance: 87, performance: 77, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8938", email: "nathan.b@school.edu" },
    { id: 39, name: "Olivia Turner", rollNo: "7C07", attendance: 95, performance: 88, lastGrade: "A", status: "present", parentContact: "+1-234-567-8939", email: "olivia.t@school.edu" },
    { id: 40, name: "Paul Wright", rollNo: "7C08", attendance: 82, performance: 74, lastGrade: "B", status: "present", parentContact: "+1-234-567-8940", email: "paul.w@school.edu" },
    { id: 41, name: "Quinn Adams", rollNo: "7C09", attendance: 91, performance: 83, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8941", email: "quinn.a@school.edu" },
    { id: 42, name: "Ruby Martinez", rollNo: "7C10", attendance: 89, performance: 80, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8942", email: "ruby.m@school.edu" },
    { id: 43, name: "Sophie Clark", rollNo: "7C11", attendance: 97, performance: 92, lastGrade: "A+", status: "present", parentContact: "+1-234-567-8943", email: "sophie.c@school.edu" },
    { id: 44, name: "Tyler Evans", rollNo: "7C12", attendance: 84, performance: 75, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8944", email: "tyler.e@school.edu" },
    { id: 45, name: "Uma Williams", rollNo: "7C13", attendance: 92, performance: 85, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8945", email: "uma.w@school.edu" },
    { id: 46, name: "Victor Davis", rollNo: "7C14", attendance: 86, performance: 76, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8946", email: "victor.d@school.edu" },
    { id: 47, name: "Willow Green", rollNo: "7C15", attendance: 94, performance: 87, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8947", email: "willow.g@school.edu" },
    { id: 48, name: "Xander Lee", rollNo: "7C16", attendance: 88, performance: 79, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8948", email: "xander.l@school.edu" },
    { id: 49, name: "Yasmin Ahmed", rollNo: "7C17", attendance: 90, performance: 81, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8949", email: "yasmin.a@school.edu" },
    { id: 50, name: "Zara Johnson", rollNo: "7C18", attendance: 93, performance: 84, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8950", email: "zara.j@school.edu" },
    { id: 51, name: "Adam Foster", rollNo: "7C19", attendance: 85, performance: 76, lastGrade: "B+", status: "absent", parentContact: "+1-234-567-8951", email: "adam.f@school.edu" },
    { id: 52, name: "Bella Santos", rollNo: "7C20", attendance: 91, performance: 82, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8952", email: "bella.s@school.edu" },
    { id: 53, name: "Caleb White", rollNo: "7C21", attendance: 87, performance: 78, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8953", email: "caleb.w@school.edu" },
    { id: 54, name: "Daisy Patel", rollNo: "7C22", attendance: 96, performance: 90, lastGrade: "A", status: "present", parentContact: "+1-234-567-8954", email: "daisy.p@school.edu" },
    { id: 55, name: "Eli Brown", rollNo: "7C23", attendance: 83, performance: 73, lastGrade: "B", status: "present", parentContact: "+1-234-567-8955", email: "eli.b@school.edu" },
    { id: 56, name: "Freya Wilson", rollNo: "7C24", attendance: 92, performance: 85, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8956", email: "freya.w@school.edu" },
    { id: 57, name: "Gabriel Kim", rollNo: "7C25", attendance: 89, performance: 80, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8957", email: "gabriel.k@school.edu" },
    { id: 58, name: "Hazel Cooper", rollNo: "7C26", attendance: 94, performance: 86, lastGrade: "A-", status: "present", parentContact: "+1-234-567-8958", email: "hazel.c@school.edu" },
    { id: 59, name: "Ian Taylor", rollNo: "7C27", attendance: 86, performance: 77, lastGrade: "B+", status: "absent", parentContact: "+1-234-567-8959", email: "ian.t@school.edu" },
    { id: 60, name: "Jade Miller", rollNo: "7C28", attendance: 90, performance: 81, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8960", email: "jade.m@school.edu" },
    { id: 61, name: "Kyle Rodriguez", rollNo: "7C29", attendance: 88, performance: 79, lastGrade: "B+", status: "present", parentContact: "+1-234-567-8961", email: "kyle.r@school.edu" },
    { id: 62, name: "Luna Singh", rollNo: "7C30", attendance: 95, performance: 88, lastGrade: "A", status: "present", parentContact: "+1-234-567-8962", email: "luna.s@school.edu" }
  ],
  // Add data for other classes (3, 4, 5, 6) as needed...
  3: [], // Grade 8 D Biology - placeholder
  4: [], // Grade 8 B Biology - placeholder  
  5: [], // Grade 10 A English Literature - placeholder
  6: []  // Grade 11 Science Physics - placeholder
};

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

// LESSON PLANNER API ENDPOINTS

// Get all lesson plans for listing
app.get('/api/lesson-planner', (req, res) => {
  console.log("Returning all lesson plans");
  try {
    // Return lesson plans with summary data for listing page
    const lessonPlansListing = lessonPlannerData.map(plan => {
      // Calculate consolidated progress from class data
      const totalCompleted = plan.classData.reduce((sum, classData) => sum + classData.completedLessons, 0);
      const totalLessons = plan.classData.reduce((sum, classData) => sum + classData.totalLessons, 0);
      const consolidatedProgress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
      
      return {
        id: plan.id,
        subject: plan.subject,
        classes: plan.classes,
        color: plan.color,
        icon: plan.icon,
        description: plan.description,
        totalLessons: totalLessons,
        completedLessons: Math.round(totalCompleted / plan.classData.length), // Average
        nextLesson: plan.nextLesson,
        nextLessonDate: plan.nextLessonDate,
        progress: consolidatedProgress
      };
    });
    res.json({ lessonPlans: lessonPlansListing });
  } catch (error) {
    console.error("Error fetching lesson plans:", error);
    res.status(500).json({ error: "Failed to fetch lesson plans" });
  }
});

// Get individual lesson plan by ID
app.get('/api/lesson-planner/:id', (req, res) => {
  const lessonPlanId = parseInt(req.params.id);
  console.log(`Returning lesson plan with ID: ${lessonPlanId}`);
  
  try {
    const lessonPlan = lessonPlannerData.find(plan => plan.id === lessonPlanId);
    
    if (!lessonPlan) {
      return res.status(404).json({ error: "Lesson plan not found" });
    }
    
    // Calculate consolidated progress from class data
    const totalCompleted = lessonPlan.classData.reduce((sum, classData) => sum + classData.completedLessons, 0);
    const totalLessons = lessonPlan.classData.reduce((sum, classData) => sum + classData.totalLessons, 0);
    const consolidatedProgress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
    
    // Add additional detail for individual plan view
    const detailedPlan = {
      ...lessonPlan,
      progress: consolidatedProgress,
      completedLessons: Math.round(totalCompleted / lessonPlan.classData.length), // Average
      
      // Consolidated upcoming lessons (mix from all classes, sorted by date)
      upcomingLessons: lessonPlan.classData
        .flatMap(classData => classData.upcomingLessons || [])
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3), // Show next 3 lessons
        
      // Consolidated recent lessons (mix from all classes, sorted by date desc)
      recentLessons: lessonPlan.classData
        .flatMap(classData => classData.recentLessons || [])
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3) // Show last 3 lessons
    };
    
    res.json({ lessonPlan: detailedPlan });
  } catch (error) {
    console.error("Error fetching lesson plan:", error);
    res.status(500).json({ error: "Failed to fetch lesson plan" });
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
  console.log(`  GET  /api/lesson-planner`);
  console.log(`  GET  /api/lesson-planner/:id`);
  console.log(`  GET  /api/teacher/classes`);
  console.log(`  GET  /api/teacher/classes/:id`);
}); 

// TEACHER DASHBOARD API ENDPOINTS

// Get all teacher's classes for dashboard
app.get('/api/teacher/classes', (req, res) => {
  console.log("Returning teacher's classes");
  try {
    res.json({ classes: teacherClassData });
  } catch (error) {
    console.error("Error fetching teacher classes:", error);
    res.status(500).json({ error: "Failed to fetch teacher classes" });
  }
});

// Get individual class details with students
app.get('/api/teacher/classes/:id', (req, res) => {
  const classId = parseInt(req.params.id);
  console.log(`Returning class details for class ID: ${classId}`);
  
  try {
    const classInfo = teacherClassData.find(cls => cls.id === classId);
    
    if (!classInfo) {
      return res.status(404).json({ error: "Class not found" });
    }
    
    // Get students for this class
    const students = studentData[classId] || [];
    
    // Calculate real-time metrics
    const presentStudents = students.filter(s => s.status === 'present').length;
    const attendancePercentage = students.length > 0 ? Math.round((presentStudents / students.length) * 100) : 0;
    const averagePerformance = students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.performance, 0) / students.length) : 0;
    const averageAttendance = students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length) : 0;
    
    // Return class info with students and calculated metrics
    const classDetails = {
      ...classInfo,
      students,
      metrics: {
        totalStudents: students.length,
        presentToday: presentStudents,
        attendancePercentage,
        averagePerformance,
        averageAttendance
      }
    };
    
    res.json({ class: classDetails });
  } catch (error) {
    console.error("Error fetching class details:", error);
    res.status(500).json({ error: "Failed to fetch class details" });
  }
}); 