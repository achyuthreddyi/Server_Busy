'use client';

import { useState } from 'react';

interface ClassSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onViewAnalytics?: () => void;
  onScheduleOverview?: () => void;
}

export default function ClassSearch({ 
  searchTerm, 
  onSearchChange, 
  onViewAnalytics, 
  onScheduleOverview 
}: ClassSearchProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleViewAnalytics = () => {
    console.log('📊 View Analytics clicked');
    if (onViewAnalytics) {
      onViewAnalytics();
    } else {
      // Default action
      alert('Analytics view coming soon!');
    }
  };

  const handleScheduleOverview = () => {
    console.log('📅 Schedule Overview clicked');
    if (onScheduleOverview) {
      onScheduleOverview();
    } else {
      // Default action
      alert('Schedule overview coming soon!');
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className={`relative flex-1 max-w-md transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
        <svg 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
            isFocused ? 'text-indigo-500' : 'text-gray-400'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search classes by name or subject..."
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ${
            isFocused 
              ? 'border-indigo-300 shadow-lg' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button 
          onClick={handleViewAnalytics}
          className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
        >
          <span>📊</span>
          <span className="hidden sm:inline">View Analytics</span>
        </button>
        <button 
          onClick={handleScheduleOverview}
          className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
        >
          <span>📅</span>
          <span className="hidden sm:inline">Schedule Overview</span>
        </button>
      </div>
    </div>
  );
} 