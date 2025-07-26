'use client';

import { useState } from 'react';

interface StudioPanelProps {
  onCreateAudioOverview: () => void;
  onCreateStudyGuide: () => void;
  onCreateBriefingDoc: () => void;
  onCreateFAQs: () => void;
  onCreateTimeline: () => void;
  onAddNote: () => void;
}

export default function StudioPanel({
  onCreateAudioOverview,
  onCreateStudyGuide,
  onCreateBriefingDoc,
  onCreateFAQs,
  onCreateTimeline,
  onAddNote
}: StudioPanelProps) {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleGenerate = async (type: string, action: () => void) => {
    setIsGenerating(type);
    // Simulate generation process
    setTimeout(() => {
      action();
      setIsGenerating(null);
    }, 2000);
  };

  const studioItems = [
    {
      id: 'study-guide',
      title: 'Study guide',
      description: 'Comprehensive study material from your sources',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      action: onCreateStudyGuide
    },
    {
      id: 'briefing-doc',
      title: 'Briefing doc',
      description: 'Executive summary of key points',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      action: onCreateBriefingDoc
    },
    {
      id: 'faqs',
      title: 'FAQs',
      description: 'Frequently asked questions and answers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: onCreateFAQs
    },
    {
      id: 'timeline',
      title: 'Timeline',
      description: 'Chronological overview of events',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      action: onCreateTimeline
    }
  ];

  return (
    <div className="w-80 bg-white text-gray-800 h-full flex flex-col border-l border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Studio</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Audio Overview Section */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium mb-3 text-gray-700">Audio Overview</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794l-4-3.2A1 1 0 014 13V7a1 1 0 01.383-.924l4-3.2z" />
                  <path d="M14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800">Create an Audio Overview in more languages!</h4>
                <p className="text-xs text-gray-600 mt-1">Generate a podcast-style discussion of your materials</p>
              </div>
              <button className="text-blue-600 text-xs hover:text-blue-700">
                Learn more
              </button>
            </div>
            <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  A
                </div>
                <span className="text-sm font-medium text-gray-800">Deep Dive conversation</span>
              </div>
              <p className="text-xs text-gray-600">Two hosts</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm transition-colors text-gray-700">
                Customise
              </button>
              <button
                onClick={() => handleGenerate('audio-overview', onCreateAudioOverview)}
                disabled={isGenerating === 'audio-overview'}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-lg text-sm transition-colors disabled:cursor-not-allowed text-white"
              >
                {isGenerating === 'audio-overview' ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Notes</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          <button
            onClick={onAddNote}
            className="w-full flex items-center gap-2 p-3 mb-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm text-gray-700">Add note</span>
          </button>

          {/* Studio Items Grid */}
          <div className="grid grid-cols-2 gap-2">
            {studioItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleGenerate(item.id, item.action)}
                disabled={isGenerating === item.id}
                className="p-3 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 border border-gray-200 rounded-lg transition-colors text-left group disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-gray-500 group-hover:text-gray-700 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium truncate text-gray-800">{item.title}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                {isGenerating === item.id && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-blue-600">Generating...</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Additional Quick Actions */}
          <div className="mt-4 space-y-2">
            <button className="w-full p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-left">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-800">Quiz Generator</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 ml-6">Create practice questions</p>
            </button>
            
            <button className="w-full p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-left">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-sm text-gray-800">Lesson Planner</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 ml-6">Structure your teaching content</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 