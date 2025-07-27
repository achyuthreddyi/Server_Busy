'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RecordedSession {
  id: number;
  title: string;
  subject: string;
  className: string;
  date: string;
  duration: string;
  thumbnail: string;
  status: 'analyzed' | 'processing' | 'pending';
  engagementScore: number;
  keyInsights: string[];
  transcriptPreview: string;
}

export default function AIAuditPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'analyzed' | 'processing' | 'pending'>('all');

  // Mock data for recorded sessions
  const recordedSessions: RecordedSession[] = [
    {
      id: 1,
      title: "Introduction to Quadratic Equations",
      subject: "Mathematics",
      className: "Grade 7 A",
      date: "2024-01-15",
      duration: "45:32",
      thumbnail: "📊",
      status: "analyzed",
      engagementScore: 87,
      keyInsights: ["High student participation", "Clear concept delivery", "Good questioning technique"],
      transcriptPreview: "Today we're going to explore quadratic equations. Can anyone tell me what makes an equation quadratic? Great question, Sarah..."
    },
    {
      id: 2,
      title: "Photosynthesis Process",
      subject: "Biology",
      className: "Grade 8 B",
      date: "2024-01-14",
      duration: "38:15",
      thumbnail: "🌱",
      status: "analyzed",
      engagementScore: 92,
      keyInsights: ["Excellent use of visual aids", "Students asking thoughtful questions", "Concept reinforcement effective"],
      transcriptPreview: "Let's start by understanding how plants make their own food. What do you think plants need to create energy?..."
    },
    {
      id: 3,
      title: "World War II Timeline",
      subject: "History",
      className: "Grade 10 A",
      date: "2024-01-13",
      duration: "42:18",
      thumbnail: "📚",
      status: "processing",
      engagementScore: 0,
      keyInsights: [],
      transcriptPreview: "The events leading up to World War II were complex and interconnected. Let's examine the key factors..."
    },
    {
      id: 4,
      title: "Chemical Bonding Basics",
      subject: "Chemistry",
      className: "Grade 9 C",
      date: "2024-01-12",
      duration: "41:45",
      thumbnail: "⚗️",
      status: "analyzed",
      engagementScore: 78,
      keyInsights: ["Students struggled with ionic vs covalent", "Need more visual examples", "Good lab demonstration"],
      transcriptPreview: "Chemical bonds are the forces that hold atoms together. There are three main types of chemical bonds..."
    },
    {
      id: 5,
      title: "Shakespeare's Hamlet Analysis",
      subject: "English Literature",
      className: "Grade 11 A",
      date: "2024-01-11",
      duration: "50:22",
      thumbnail: "🎭",
      status: "analyzed",
      engagementScore: 85,
      keyInsights: ["Deep literary analysis", "Students engaged with themes", "Good discussion facilitation"],
      transcriptPreview: "Today we'll dive into Act III of Hamlet. What do you notice about Hamlet's soliloquy in this scene?..."
    },
    {
      id: 6,
      title: "Trigonometry Applications",
      subject: "Mathematics",
      className: "Grade 11 B",
      date: "2024-01-10",
      duration: "44:10",
      thumbnail: "📐",
      status: "pending",
      engagementScore: 0,
      keyInsights: [],
      transcriptPreview: "Real-world applications of trigonometry are everywhere. Let's explore how architects use these concepts..."
    }
  ];

  // Filter sessions based on search and status
  const filteredSessions = recordedSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            🏠 Home
          </Link>
          <span>›</span>
          <Link href="/dashboard" className="hover:text-gray-700 transition-colors">
            📚 Dashboard
          </Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">🎥 AI Audit</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Audit</h1>
          <p className="text-gray-600">Review and analyze your recorded teaching sessions with AI-powered insights</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">{recordedSessions.length}</div>
                <div className="text-gray-600 font-medium">Total Sessions</div>
              </div>
              <div className="text-3xl text-blue-500">🎥</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{recordedSessions.filter(s => s.status === 'analyzed').length}</div>
                <div className="text-gray-600 font-medium">Analyzed</div>
              </div>
              <div className="text-3xl text-green-500">✅</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{recordedSessions.filter(s => s.status === 'processing').length}</div>
                <div className="text-gray-600 font-medium">Processing</div>
              </div>
              <div className="text-3xl text-yellow-500">⏳</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {Math.round(recordedSessions.filter(s => s.engagementScore > 0).reduce((sum, s) => sum + s.engagementScore, 0) / recordedSessions.filter(s => s.engagementScore > 0).length) || 0}%
                </div>
                <div className="text-gray-600 font-medium">Avg Engagement</div>
              </div>
              <div className="text-3xl text-indigo-500">📊</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sessions by title, subject, or class..."
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex space-x-2">
            {(['all', 'analyzed', 'processing', 'pending'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <Link key={session.id} href={`/ai-audit/${session.id}`}>
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                {/* Thumbnail */}
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center group-hover:from-indigo-50 group-hover:to-blue-50 transition-colors">
                    <div className="text-6xl">{session.thumbnail}</div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {session.duration}
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {session.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span>{session.subject}</span>
                    <span>•</span>
                    <span>{session.className}</span>
                    <span>•</span>
                    <span>{new Date(session.date).toLocaleDateString()}</span>
                  </div>

                  {session.status === 'analyzed' && (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Engagement Score</span>
                        <span className={`text-lg font-bold ${getEngagementColor(session.engagementScore)}`}>
                          {session.engagementScore}%
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">Key Insights</div>
                        <div className="space-y-1">
                          {session.keyInsights.slice(0, 2).map((insight, index) => (
                            <div key={index} className="text-xs text-gray-600 flex items-start space-x-1">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="text-xs text-gray-500 mb-1">Transcript Preview</div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {session.transcriptPreview}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No sessions found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No sessions match "${searchTerm}". Try adjusting your search terms.`
                : "No sessions available for the selected filter."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 