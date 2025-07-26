'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function KnowledgeBase() {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Mock data for demonstration
  const notebooks = [
    {
      id: 1,
      title: "Advanced Mathematics - Calculus",
      class: "Grade 12 Mathematics",
      section: "Section A",
      tags: ["calculus", "derivatives", "integrals", "grade-12"],
      lastModified: "2 days ago",
      noteCount: 23,
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: 2,
      title: "Physics - Quantum Mechanics",
      class: "Grade 11 Physics",
      section: "Section B",
      tags: ["quantum", "mechanics", "physics", "grade-11"],
      lastModified: "1 week ago",
      noteCount: 15,
      color: "bg-green-50 border-green-200"
    },
    {
      id: 3,
      title: "Chemistry - Organic Compounds",
      class: "Grade 10 Chemistry",
      section: "Section A",
      tags: ["organic", "compounds", "chemistry", "grade-10"],
      lastModified: "3 days ago",
      noteCount: 31,
      color: "bg-purple-50 border-purple-200"
    },
    {
      id: 4,
      title: "Literature - Shakespeare Studies",
      class: "Grade 12 English",
      section: "Section C",
      tags: ["shakespeare", "literature", "english", "grade-12"],
      lastModified: "5 days ago",
      noteCount: 18,
      color: "bg-yellow-50 border-yellow-200"
    }
  ];

  // Available filter tags
  const allTags = ["grade-12", "grade-11", "grade-10", "mathematics", "physics", "chemistry", "english", "calculus", "quantum", "organic", "shakespeare", "derivatives", "integrals", "mechanics", "compounds", "literature"];

  // Filter notebooks based on search term and active filters
  const filteredNotebooks = notebooks.filter(notebook => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      notebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notebook.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notebook.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notebook.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Tag filter
    const matchesFilters = activeFilters.length === 0 || 
      activeFilters.every(filter => notebook.tags.includes(filter));

    return matchesSearch && matchesFilters;
  });

  // Handle tag filter toggle
  const toggleFilter = (tag: string) => {
    setActiveFilters(prev => 
      prev.includes(tag) 
        ? prev.filter(f => f !== tag)
        : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Knowledge Base</h1>
          <p className="text-gray-600">Organize your teaching materials and preparation notes by class and subject</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search notebooks, tags, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              + Create New Notebook
            </button>
          </div>
          
          {/* Filter Tags */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Filter by tags:</h3>
              {(activeFilters.length > 0 || searchTerm) && (
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    activeFilters.includes(tag)
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            {/* Active filters display */}
            {activeFilters.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {activeFilters.map((filter) => (
                    <span
                      key={filter}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {filter}
                      <button
                        onClick={() => toggleFilter(filter)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredNotebooks.length} of {notebooks.length} notebooks
            {(searchTerm || activeFilters.length > 0) && (
              <span className="ml-1">
                {searchTerm && `for "${searchTerm}"`}
                {activeFilters.length > 0 && ` with filters: ${activeFilters.join(', ')}`}
              </span>
            )}
          </p>
        </div>

        {/* Notebooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotebooks.length > 0 ? (
            filteredNotebooks.map((notebook) => (
              <Link
                key={notebook.id}
                href={`/knowledge-base/${notebook.id}`}
                className={`${notebook.color} rounded-lg p-6 border-2 hover:shadow-md transition-all cursor-pointer block hover:scale-105`}
              >
                {/* Notebook Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{notebook.title}</h3>
                  <p className="text-sm text-gray-600">{notebook.class}</p>
                  <p className="text-xs text-gray-500">{notebook.section}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">{notebook.noteCount}</span> notes
                    </span>
                    <span className="text-sm text-gray-500">
                      {notebook.lastModified}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {notebook.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`inline-block px-2 py-1 text-xs rounded ${
                          activeFilters.includes(tag)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-white bg-opacity-60 text-gray-600'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                    {notebook.tags.length > 3 && (
                      <span className="inline-block px-2 py-1 text-xs bg-white bg-opacity-60 text-gray-600 rounded">
                        +{notebook.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Click indicator */}
                <div className="flex items-center justify-center pt-2 border-t border-white border-opacity-50">
                  <span className="text-xs text-gray-500">Click to open</span>
                </div>
              </Link>
            ))
          ) : (
            // No results found
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No notebooks found</h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              {(searchTerm || activeFilters.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="text-blue-600 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-800">Create New Class Notebook</h3>
              <p className="text-sm text-gray-500 mt-1">Start a new notebook for your upcoming class</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="text-green-600 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-800">Import Study Materials</h3>
              <p className="text-sm text-gray-500 mt-1">Upload PDFs, documents, and resources</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="text-purple-600 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-800">View Analytics</h3>
              <p className="text-sm text-gray-500 mt-1">Track your preparation progress and insights</p>
            </button>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">🚀 Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-medium text-blue-800">AI-Powered Content Suggestions:</span>
                <span className="text-blue-700"> Get personalized study material recommendations</span>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-medium text-blue-800">Collaborative Notebooks:</span>
                <span className="text-blue-700"> Share and collaborate with other teachers</span>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-medium text-blue-800">Smart Search:</span>
                <span className="text-blue-700"> Advanced semantic search across all your notes</span>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-medium text-blue-800">Auto-Tagging:</span>
                <span className="text-blue-700"> Automatic tag generation based on content</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 