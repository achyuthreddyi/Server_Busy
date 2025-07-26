'use client';

import { useState, useEffect } from 'react';
import { searchResources } from '@/lib/api';

interface DiscoverResource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'text' | 'youtube';
  url: string;
  description: string;
  subject: string;
  level: string;
}

interface DiscoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (resources: DiscoverResource[]) => void;
}

export default function DiscoverModal({ isOpen, onClose, onImport }: DiscoverModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchResults, setSearchResults] = useState<DiscoverResource[]>([]);
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setTypeFilter('all');
      setSearchResults([]);
      setSelectedResources(new Set());
      setError(null);
      setHasSearched(false);
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      console.log('Searching for:', searchQuery, 'with type filter:', typeFilter);

      const data = await searchResources(searchQuery, {
        type: typeFilter,
        limit: 20
      });

      console.log('Search results:', data);
      setSearchResults(data.resources);
    } catch (err) {
      console.error('Error searching resources:', err);
      setError(err instanceof Error ? err.message : 'Failed to search resources');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleResourceSelection = (resourceId: string) => {
    const newSelected = new Set(selectedResources);
    if (newSelected.has(resourceId)) {
      newSelected.delete(resourceId);
    } else {
      newSelected.add(resourceId);
    }
    setSelectedResources(newSelected);
  };

  const selectAllResources = () => {
    if (selectedResources.size === searchResults.length) {
      setSelectedResources(new Set());
    } else {
      setSelectedResources(new Set(searchResults.map(r => r.id)));
    }
  };

  const handleImport = () => {
    const resourcesToImport = searchResults.filter(r => selectedResources.has(r.id));
    console.log('Importing resources from discover modal:', resourcesToImport);
    onImport(resourcesToImport);
    onClose();
  };

  const getResourceIcon = (type: DiscoverResource['type']) => {
    switch (type) {
      case 'pdf':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12V6l-4-4H4v16zM9 2h2l4 4v1h-6V2z"/>
          </svg>
        );
      case 'doc':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 2h12l4 4v12H4V2zm8 0v4h4l-4-4z"/>
          </svg>
        );
      case 'text':
        return (
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 2h12v16H4V2zm2 2v12h8V4H6z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      case 'general':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectBadgeColor = (subject: string) => {
    switch (subject) {
      case 'mathematics':
        return 'bg-blue-100 text-blue-800';
      case 'physics':
        return 'bg-purple-100 text-purple-800';
      case 'chemistry':
        return 'bg-green-100 text-green-800';
      case 'literature':
      case 'english':
        return 'bg-orange-100 text-orange-800';
      case 'technology':
        return 'bg-indigo-100 text-indigo-800';
      case 'education':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] m-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Discover Sources</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Section */}
        <div className="p-6 border-b border-gray-200">
          <p className="text-gray-600 mb-4">
            Search for educational resources across multiple subjects and formats including PDFs, documents, text files, and YouTube videos.
          </p>
          
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for calculus, quantum physics, Shakespeare, programming..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Type Filter Only */}
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700">Filter by type:</label>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Types' },
                { value: 'pdf', label: 'PDF' },
                { value: 'doc', label: 'Documents' },
                { value: 'text', label: 'Text Files' },
                { value: 'youtube', label: 'YouTube' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTypeFilter(option.value)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    typeFilter === option.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="ml-3 text-gray-600">Searching resources...</span>
              </div>
            </div>
          )}

          {hasSearched && !loading && searchResults.length === 0 && !error && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No resources found</h3>
                <p className="mt-2 text-gray-500">Try different search terms or adjust your filters.</p>
              </div>
            </div>
          )}

          {searchResults.length > 0 && (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={selectAllResources}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <div className={`w-4 h-4 border border-gray-400 rounded flex items-center justify-center ${
                      selectedResources.size === searchResults.length ? 'bg-blue-600 border-blue-600' : ''
                    }`}>
                      {selectedResources.size === searchResults.length && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    Select all
                  </button>
                  <span className="text-sm text-gray-500">
                    {searchResults.length} results • {selectedResources.size} selected
                  </span>
                </div>
              </div>

              {/* Results List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {searchResults.map((resource) => (
                    <div
                      key={resource.id}
                      className={`p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedResources.has(resource.id) ? 'border-blue-300 bg-blue-50' : ''
                      }`}
                      onClick={() => toggleResourceSelection(resource.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-4 h-4 border border-gray-400 rounded flex items-center justify-center mt-1 ${
                          selectedResources.has(resource.id) ? 'bg-blue-600 border-blue-600' : ''
                        }`}>
                          {selectedResources.has(resource.id) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        
                        {getResourceIcon(resource.type)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-800 truncate">{resource.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className={`px-2 py-1 rounded-full ${getSubjectBadgeColor(resource.subject)}`}>
                              {resource.subject}
                            </span>
                            <span className={`px-2 py-1 rounded-full ${getLevelBadgeColor(resource.level)}`}>
                              {resource.level}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full uppercase">
                              {resource.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedResources.size > 0 && `${selectedResources.size} resources selected`}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={selectedResources.size === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Import {selectedResources.size > 0 ? `(${selectedResources.size})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 