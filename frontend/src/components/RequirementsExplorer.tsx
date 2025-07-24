"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

const requirements = [
  {
    id: "introduction",
    title: "1. Introduction",
    details: [
      "1.1 Executive Summary",
      "1.2 Vision Statement",
      "1.3 Problem Statement",
      "1.4 Goals & Objectives",
      "1.5 Target Audience",
      "1.6 Scope",
    ],
  },
  {
    id: "user-stories",
    title: "2. User Stories / Use Cases",
    details: [
      "2.1 Teacher User Stories",
    ],
  },
  {
    id: "functional-requirements",
    title: "3. Functional Requirements",
    details: [
      "3.1 Intelligent Content Generation & Customization",
      "3.2 Adaptive Learning & Student Progress Tracking",
      "3.3 Teacher Support & Workflow Automation",
      "3.4 Interactive Learning Tools",
      "3.5 System & Platform Requirements",
    ],
  },
  {
    id: "key-success-metrics",
    title: "4. Key Success Metrics",
    details: [
      "Teacher Engagement",
      "Time Savings",
      "Content Relevance",
      "Student Progress",
      "Retention",
    ],
  },
];

const detailsMap: Record<string, string[]> = {
  "1.1 Executive Summary": [
    "The AI Teacher Companion is an innovative Agentic AI solution designed to empower teachers in under-resourced, multi-grade classrooms, especially in rural and semi-urban India. Leveraging Google Cloud AI Studio, Gemini, Vertex AI, and Firebase, the product aims to: Reduce administrative and pedagogical burden on teachers, Automate content generation, Personalize learning paths, Streamline administrative tasks.",
    "Ultimate Goal: Enhance education quality and address diverse learning levels within a single classroom."
  ],
  "1.2 Vision Statement": [
    "Transform multi-grade classrooms into vibrant, personalized learning hubs by providing teachers with an intelligent AI companion that: Automates mundane tasks, Generates tailored content, Offers data-driven insights."
  ],
  "1.3 Problem Statement": [
    "In under-resourced Indian schools, a single teacher often manages multiple grades without adequate time or tools to: Create localized teaching aids, Address diverse learning levels, Personalize education.",
    "Challenge: Build an AI companion to lessen their burden and amplify their impact."
  ],
  "1.4 Goals & Objectives": [
    "Primary Goal: Reduce preparation and administrative workload for teachers in multi-grade classrooms.",
    "Secondary Goal: Enhance the teacher’s ability to provide personalized and differentiated instruction.",
    "Tertiary Goal: Improve student engagement and learning outcomes through tailored content and adaptive learning.",
    "Quantifiable Objectives:",
    "Objective 1: Reduce teacher preparation time for lesson planning and material creation by 50% within 6 months of pilot deployment.",
    "Objective 2: Increase teacher satisfaction with available teaching aids and support by 30% in pilot schools.",
    "Objective 3: Improve average student engagement scores by 20% in supported classrooms."
  ],
  "1.5 Target Audience": [
    "Primary: Teachers in rural and semi-urban Indian schools, especially those managing multi-grade classrooms.",
    "Secondary: School administrators, educational NGOs, and government bodies focused on primary education."
  ],
  "1.6 Scope": [
    "MVP Focus: Core functionalities related to content generation, basic assessment support, and administrative assistance.",
    "Future Iterations: Advanced analytics, parent communication portals, broader resource integration."
  ],
  "2.1 Teacher User Stories": [
    "As a teacher, I want to:",
    "- Generate a lesson plan for 'Fractions' that caters to Grade 3 and Grade 5 simultaneously",
    "- Create differentiated worksheets on 'Addition' for students with varying understanding levels (remedial and advanced)",
    "- Receive AI-suggested, culturally relevant examples and stories for my lessons",
    "- Administer quick, digital assessments and receive immediate feedback on student performance",
    "- Track individual student progress over time and highlight areas needing support",
    "- Automate attendance tracking and basic report card data compilation",
    "- Draft personalized messages to parents about student progress or school events, in local languages",
    "- Access professional development modules and teaching strategies tailored for multi-grade settings",
    "- Use the AI companion effectively even with limited or no internet connectivity",
    "- Speak lesson ideas and have the AI convert them into structured text or generate related content"
  ],
  "3.1 Intelligent Content Generation & Customization": [
    "FR-3.1.1 Lesson Plan Generation:",
    "- Input topic, grade levels, and learning objectives to generate comprehensive lesson plans",
    "- Specify duration, activities, and assessment methods",
    "- Support for 'combined' lesson plans for multi-grade teaching",
    "FR-3.1.2 Worksheet & Activity Creation:",
    "- Generate differentiated worksheets, quizzes, and interactive activities by topic, grade, and difficulty",
    "- Support various question types (MCQ, fill-in-the-blanks, short answer)",
    "- Generate different versions for varied student levels",
    "FR-3.1.3 Storytelling & Explanations:",
    "- Generate engaging stories, analogies, and simplified explanations",
    "- Incorporate user-specified keywords for localization",
    "FR-3.1.4 Multilingual Support:",
    "- Content generation and translation in major regional Indian languages",
    "FR-3.1.5 Resource Curation:",
    "- Suggest relevant external educational resources (videos, simulations, articles)",
    "FR-3.1.6 Curriculum Ingestion:",
    "- Allow teachers to upload curriculum documents (PDF, text) for AI reference"
  ],
  "3.2 Adaptive Learning & Student Progress Tracking": [
    "FR-3.2.1 Real-time Assessment Generation:",
    "- Generate short, formative assessments based on lesson content",
    "FR-3.2.2 Assessment Input & Scoring:",
    "- Intuitive interface for inputting student responses and automating scoring",
    "FR-3.2.3 Performance Analytics:",
    "- Analyze assessment data to identify learning gaps, misconceptions, and strengths",
    "- Visual dashboards for class and individual performance",
    "FR-3.2.4 Personalized Learning Path Recommendations:",
    "- Recommend tailored learning activities or remedial content",
    "FR-3.2.5 Progress Reports:",
    "- Generate concise progress reports for individual students"
  ],
  "3.3 Teacher Support & Workflow Automation": [
    "FR-3.3.1 Attendance Management:",
    "- Simple interface for daily attendance and report generation",
    "FR-3.3.2 Grading Assistance:",
    "- Automated grading of objective assessments and feedback for subjective assignments",
    "FR-3.3.3 Parent Communication Drafts:",
    "- Draft personalized messages to parents for review and sending",
    "FR-3.3.4 Professional Development Hub:",
    "- Access to professional development modules and best practices",
    "FR-3.3.5 Query Answering:",
    "- Knowledge base for curriculum, classroom management, and student challenges"
  ],
  "3.4 Interactive Learning Tools": [
    "FR-3.4.1 AI-Assisted Whiteboard:",
    "- Digital whiteboard with AI-generated diagrams, maps, and multimedia",
    "FR-3.4.2 Speech-to-Text & Text-to-Speech:",
    "- Support for speech input and audio explanations",
    "FR-3.4.3 Gamified Learning Modules:",
    "- Creation or suggestion of simple, curriculum-aligned educational games"
  ],
  "3.5 System & Platform Requirements": [
    "FR-3.5.1 Offline Capability:",
    "- Caching of generated content for offline access",
    "FR-3.5.2 Low-Bandwidth Optimization:",
    "- Efficient performance under low or intermittent connectivity",
    "FR-3.5.3 Intuitive User Interface:",
    "- Simple, intuitive UI for varying tech literacy; support for touch interactions",
    "FR-3.5.4 Cross-Platform Compatibility:",
    "- Accessible via web browsers (responsive design) and lightweight Android app",
    "FR-3.5.5 Data Security & Privacy:",
    "- Robust data security and privacy, adhering to educational data protection guidelines"
  ],
  "4. Key Success Metrics": [
    "Teacher Engagement: Daily/weekly active users, features used per session",
    "Time Savings: Survey results on time saved per week",
    "Content Relevance: Qualitative feedback on utility and accuracy of generated content",
    "Student Progress: Improvement in assessment scores over time",
    "Retention: Teacher retention rate on the platform"
  ],
};

export default function RequirementsExplorer() {
  // Default to first sub-detail of first section
  const [selected, setSelected] = useState(requirements[0].details[0]);

  // Find which section the selected detail belongs to, for sidebar highlighting
  const getSectionTitle = () => {
    for (const req of requirements) {
      if (req.details.includes(selected)) {
        return req.title;
      }
    }
    return requirements[0].title;
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Sidebar
        requirements={requirements.map((r) => ({ id: r.id, title: r.title }))}
        selected={getSectionTitle()}
        onSelect={(sectionTitle) => {
          // When a section is selected, select its first detail
          const req = requirements.find((r) => r.title === sectionTitle);
          if (req) setSelected(req.details[0]);
        }}
      />
      <main style={{ flex: 1, padding: 32 }}>
        <nav style={{ marginBottom: 24 }}>
          <ul style={{ display: "flex", gap: 16, listStyle: "none", padding: 0 }}>
            {requirements.find((r) => r.title === getSectionTitle())?.details.map((detail) => (
              <li key={detail}>
                <button
                  style={{
                    background: selected === detail ? "#e0e0e0" : "#f9f9f9",
                    border: "1px solid #ddd",
                    borderRadius: 4,
                    padding: "6px 12px",
                    fontWeight: selected === detail ? "bold" : "normal",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelected(detail)}
                >
                  {detail}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>{selected}</h2>
        <ul style={{ paddingLeft: 20 }}>
          {detailsMap[selected]?.map((detail, idx) => (
            <li key={idx} style={{ marginBottom: 12 }}>{detail}</li>
          ))}
        </ul>
      </main>
    </div>
  );
} 