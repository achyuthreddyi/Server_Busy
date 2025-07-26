'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NotebookDetail() {
  const params = useParams();
  const id = params.id as string;

  // Mock data - in real app this would come from API based on ID
  const notebookData = {
    1: {
      title: "Advanced Mathematics - Calculus",
      class: "Grade 12 Mathematics",
      section: "Section A",
      tags: ["calculus", "derivatives", "integrals", "grade-12"],
      lastModified: "2 days ago",
      noteCount: 23,
      color: "bg-blue-50 border-blue-200",
      description: "Comprehensive study notes for calculus concepts including limits, derivatives, and integrals for Grade 12 students.",
      createdDate: "January 15, 2024",
      notes: [
        {
          id: 1,
          title: "Introduction to Limits",
          content: "Understanding the concept of limits as x approaches a value...",
          lastEdited: "2 days ago",
          tags: ["limits", "calculus"]
        },
        {
          id: 2,
          title: "Derivative Rules",
          content: "Power rule, product rule, quotient rule, and chain rule...",
          lastEdited: "3 days ago",
          tags: ["derivatives", "rules"]
        },
        {
          id: 3,
          title: "Integration Techniques",
          content: "Basic integration, substitution method, integration by parts...",
          lastEdited: "1 week ago",
          tags: ["integrals", "techniques"]
        }
      ]
    },
    2: {
      title: "Physics - Quantum Mechanics",
      class: "Grade 11 Physics",
      section: "Section B",
      tags: ["quantum", "mechanics", "physics", "grade-11"],
      lastModified: "1 week ago",
      noteCount: 15,
      color: "bg-green-50 border-green-200",
      description: "Fundamental concepts of quantum mechanics for advanced physics students.",
      createdDate: "December 20, 2023",
      notes: [
        {
          id: 1,
          title: "Wave-Particle Duality",
          content: "Understanding how matter exhibits both wave and particle properties...",
          lastEdited: "1 week ago",
          tags: ["wave", "particle", "duality"]
        },
        {
          id: 2,
          title: "Heisenberg Uncertainty Principle",
          content: "The fundamental limit to precision of simultaneous measurements...",
          lastEdited: "2 weeks ago",
          tags: ["uncertainty", "heisenberg"]
        }
      ]
    },
    3: {
      title: "Chemistry - Organic Compounds",
      class: "Grade 10 Chemistry",
      section: "Section A",
      tags: ["organic", "compounds", "chemistry", "grade-10"],
      lastModified: "3 days ago",
      noteCount: 31,
      color: "bg-purple-50 border-purple-200",
      description: "Study of organic chemistry focusing on carbon-based compounds and their reactions.",
      createdDate: "November 10, 2023",
      notes: [
        {
          id: 1,
          title: "Hydrocarbon Classification",
          content: "Alkanes, alkenes, and alkynes - structure and naming...",
          lastEdited: "3 days ago",
          tags: ["hydrocarbons", "classification"]
        },
        {
          id: 2,
          title: "Functional Groups",
          content: "Common functional groups in organic chemistry...",
          lastEdited: "5 days ago",
          tags: ["functional-groups", "organic"]
        }
      ]
    },
    4: {
      title: "Literature - Shakespeare Studies",
      class: "Grade 12 English",
      section: "Section C",
      tags: ["shakespeare", "literature", "english", "grade-12"],
      lastModified: "5 days ago",
      noteCount: 18,
      color: "bg-yellow-50 border-yellow-200",
      description: "Analysis of Shakespeare's major works including themes, characters, and literary devices.",
      createdDate: "October 5, 2023",
      notes: [
        {
          id: 1,
          title: "Hamlet - Character Analysis",
          content: "Deep dive into Hamlet's character development and motivations...",
          lastEdited: "5 days ago",
          tags: ["hamlet", "character"]
        },
        {
          id: 2,
          title: "Macbeth - Themes",
          content: "Major themes: ambition, guilt, fate vs. free will...",
          lastEdited: "1 week ago",
          tags: ["macbeth", "themes"]
        }
      ]
    }
  };

  const notebook = notebookData[id as keyof typeof notebookData];

  if (!notebook) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Notebook Not Found</h1>
          <p className="text-gray-600 mb-6">The notebook you're looking for doesn't exist.</p>
          <Link href="/knowledge-base" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Knowledge Base
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/knowledge-base" className="hover:text-gray-700 transition-colors">
              Knowledge Base
            </Link>
            <span>›</span>
            <span className="text-gray-800">{notebook.title}</span>
          </div>
        </nav>

        {/* Notebook Header */}
        <div className={`${notebook.color} rounded-lg p-6 border-2 mb-8`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{notebook.title}</h1>
              <p className="text-lg text-gray-600 mb-1">{notebook.class}</p>
              <p className="text-sm text-gray-500">{notebook.section}</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-white bg-opacity-80 text-gray-700 rounded-lg hover:bg-opacity-100 transition-colors">
                Edit Notebook
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                + Add Note
              </button>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{notebook.description}</p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
            <span><strong>{notebook.noteCount}</strong> notes</span>
            <span>Created: {notebook.createdDate}</span>
            <span>Last modified: {notebook.lastModified}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {notebook.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-1 text-sm bg-white bg-opacity-70 text-gray-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar for Notes */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search notes in this notebook..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Notes</option>
              <option>Recently Modified</option>
              <option>Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Notes ({notebook.notes.length})</h2>
          
          {notebook.notes.map((note) => (
            <div key={note.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                <span className="text-sm text-gray-500">{note.lastEdited}</span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{note.content}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for no notes */}
        {notebook.notes.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No notes yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first note in this notebook.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create First Note
            </button>
          </div>
        )}

        {/* Quick Actions for Notebook */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <div className="text-blue-600 mb-2">
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-800">Add Note</span>
            </button>
            
            <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <div className="text-green-600 mb-2">
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-800">Import</span>
            </button>
            
            <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <div className="text-purple-600 mb-2">
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-800">Share</span>
            </button>
            
            <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <div className="text-yellow-600 mb-2">
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-800">Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 