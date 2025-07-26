'use client';

import { useState } from 'react';
import DiscoverModal from './DiscoverModal';

interface Source {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'text' | 'url';
  selected: boolean;
  dateAdded: string;
}

interface DiscoverResource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'text' | 'youtube';
  url: string;
  description: string;
  subject: string;
  level: string;
}

interface SourcesPanelProps {
  sources: Source[];
  onSourceToggle: (sourceId: string) => void;
  onSelectAll: () => void;
  onAddSource: () => void;
  onDiscover: () => void;
  onImportResources?: (resources: DiscoverResource[]) => void;
}

export default function SourcesPanel({ 
  sources, 
  onSourceToggle, 
  onSelectAll, 
  onAddSource, 
  onDiscover,
  onImportResources
}: SourcesPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDiscoverModalOpen, setIsDiscoverModalOpen] = useState(false);
  
  const filteredSources = sources.filter(source =>
    source.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allSelected = sources.length > 0 && sources.every(source => source.selected);
  const selectedCount = sources.filter(source => source.selected).length;

  const handleDiscoverClick = () => {
    setIsDiscoverModalOpen(true);
    onDiscover(); // Keep the original callback for any additional logic
  };

  const handleImportResources = (resources: DiscoverResource[]) => {
    if (onImportResources) {
      onImportResources(resources);
    }
    console.log('Importing resources:', resources);
  };

  const getSourceIcon = (type: Source['type']) => {
    switch (type) {
      case 'pdf':
        return (
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12V6l-4-4H4v16zM9 2h2l4 4v1h-6V2z"/>
          </svg>
        );
      case 'doc':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 2h12l4 4v12H4V2zm8 0v4h4l-4-4z"/>
          </svg>
        );
      case 'text':
        return (
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 2h12v16H4V2zm2 2v12h8V4H6z"/>
          </svg>
        );
      case 'url':
        return (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z"/>
          </svg>
        );
    }
  };

  return (
    <>
      <div className="w-80 bg-white text-gray-800 h-full flex flex-col border-r border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Sources</h2>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={onAddSource}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add
            </button>
            <button
              onClick={handleDiscoverClick}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Discover
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Select All */}
          <div className="flex items-center justify-between">
            <button
              onClick={onSelectAll}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <div className={`w-4 h-4 border border-gray-400 rounded flex items-center justify-center ${
                allSelected ? 'bg-blue-600 border-blue-600' : ''
              }`}>
                {allSelected && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              Select all sources
            </button>
            <span className="text-xs text-gray-500">
              {selectedCount} selected
            </span>
          </div>
        </div>

        {/* Sources List */}
        <div className="flex-1 overflow-y-auto">
          {filteredSources.length > 0 ? (
            <div className="p-2">
              {filteredSources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                  onClick={() => onSourceToggle(source.id)}
                >
                  <div className={`w-4 h-4 border border-gray-400 rounded flex items-center justify-center ${
                    source.selected ? 'bg-blue-600 border-blue-600' : ''
                  }`}>
                    {source.selected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  {getSourceIcon(source.type)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {source.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {source.dateAdded}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-4 text-sm font-medium text-gray-800">No sources found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search' : 'Add sources to get started'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Discover Modal */}
      <DiscoverModal
        isOpen={isDiscoverModalOpen}
        onClose={() => setIsDiscoverModalOpen(false)}
        onImport={handleImportResources}
      />
    </>
  );
} 