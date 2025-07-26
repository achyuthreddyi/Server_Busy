'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchNotebook, updateNotebookSources, sendChatMessage } from '@/lib/api';
import SourcesPanel from '@/components/notebook/SourcesPanel';
import ChatInterface from '@/components/notebook/ChatInterface';
import StudioPanel from '@/components/notebook/StudioPanel';

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

interface Notebook {
  id: number;
  title: string;
  class: string;
  section: string;
  description: string;
  sources: Source[];
}

export default function NotebookDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notebook data from API using the centralized API service
  useEffect(() => {
    if (!id) return;

    const loadNotebook = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchNotebook(id) as { notebook: Notebook };
        setNotebook(data.notebook);
        setSources(data.notebook.sources);
      } catch (err) {
        console.error('Error fetching notebook:', err);
        setError(err instanceof Error ? err.message : 'Failed to load notebook');
      } finally {
        setLoading(false);
      }
    };

    loadNotebook();
  }, [id]);

  // Update sources in backend when changed using the API service
  const updateSourcesInBackend = async (updatedSources: Source[]) => {
    try {
      console.log('Updating sources in backend:', updatedSources.length, 'sources');
      const response = await updateNotebookSources(id, updatedSources);
      console.log('Backend sources update successful:', response);
      return response;
    } catch (err) {
      console.error('Error updating sources in backend:', err);
      // Re-throw the error so calling functions can handle it
      throw err;
    }
  };

  const selectedSourcesCount = sources.filter(source => source.selected).length;

  const handleSourceToggle = async (sourceId: string) => {
    const updatedSources = sources.map(source => 
      source.id === sourceId 
        ? { ...source, selected: !source.selected }
        : source
    );
    setSources(updatedSources);
    await updateSourcesInBackend(updatedSources);
  };

  const handleSelectAll = async () => {
    const allSelected = sources.every(source => source.selected);
    const updatedSources = sources.map(source => ({ ...source, selected: !allSelected }));
    setSources(updatedSources);
    await updateSourcesInBackend(updatedSources);
  };

  const handleAddSource = () => {
    // Placeholder for adding new source
    console.log('Add source clicked');
  };

  const handleDiscover = () => {
    // Placeholder for discover functionality
    console.log('Discover clicked');
  };

  const handleImportResources = async (discoverResources: DiscoverResource[]) => {
    try {
      console.log(`Importing ${discoverResources.length} resources:`, discoverResources);

      // Convert discovered resources to notebook sources
      const newSources: Source[] = discoverResources.map((resource) => ({
        id: `imported_${resource.id}_${Date.now()}`, // Create unique ID for notebook source
        title: resource.title,
        type: resource.type === 'youtube' ? 'url' : resource.type, // Convert youtube to url type
        selected: true, // Auto-select imported resources
        dateAdded: 'Just now'
      }));

      console.log('Converted to notebook sources:', newSources);

      // Add new sources to existing sources (append, don't replace)
      const updatedSources = [...sources, ...newSources];
      console.log(`Total sources after import: ${updatedSources.length} (was ${sources.length})`);

      // Update local state first for immediate UI feedback
      setSources(updatedSources);

      // Update backend with new sources
      const response = await updateSourcesInBackend(updatedSources);
      console.log('Backend update response:', response);

      console.log(`✅ Successfully imported ${newSources.length} resources to notebook "${notebook?.title}"`);
      
      // You could add a toast notification here in the future
      // showToast(`Successfully imported ${newSources.length} resources!`, 'success');
      
    } catch (err) {
      console.error('❌ Error importing resources:', err);
      
      // Revert local state if backend update failed
      // This ensures UI stays in sync with backend
      try {
        const data = await fetchNotebook(id) as { notebook: Notebook };
        setSources(data.notebook.sources);
      } catch (revertErr) {
        console.error('Failed to revert sources after import error:', revertErr);
      }
      
      // Could show an error notification here in the future
      // showToast('Failed to import resources. Please try again.', 'error');
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      const selectedSources = sources.filter(source => source.selected);
      const response = await sendChatMessage(id, message, selectedSources);
      console.log('AI Response:', response);
      // The ChatInterface component will handle the response through its own state
    } catch (err) {
      console.error('Error sending message:', err);
      // Could show an error notification here in the future
    }
  };

  const handleCreateAudioOverview = () => {
    console.log('Creating audio overview...');
  };

  const handleCreateStudyGuide = () => {
    console.log('Creating study guide...');
  };

  const handleCreateBriefingDoc = () => {
    console.log('Creating briefing doc...');
  };

  const handleCreateFAQs = () => {
    console.log('Creating FAQs...');
  };

  const handleCreateTimeline = () => {
    console.log('Creating timeline...');
  };

  const handleAddNote = () => {
    console.log('Adding note...');
  };

  // Retry loading notebook
  const retryLoadNotebook = () => {
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col bg-gray-50" style={{ height: 'calc(100vh - 76px)' }}>
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/knowledge-base" className="hover:text-gray-700 transition-colors">
              Knowledge Base
            </Link>
            <span>›</span>
            <span className="text-gray-800">Loading...</span>
          </div>
        </nav>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="ml-3 text-gray-600">Loading notebook...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !notebook) {
    return (
      <div className="flex flex-col bg-gray-50" style={{ height: 'calc(100vh - 76px)' }}>
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/knowledge-base" className="hover:text-gray-700 transition-colors">
              Knowledge Base
            </Link>
            <span>›</span>
            <span className="text-gray-800">Error</span>
          </div>
        </nav>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-xl font-bold text-red-800 mb-2">
                {error === 'Notebook not found' ? 'Notebook Not Found' : 'Error Loading Notebook'}
              </h1>
              <p className="text-red-700 mb-4">
                {error === 'Notebook not found' 
                  ? "The notebook you're looking for doesn't exist." 
                  : error || 'Failed to load notebook. Please make sure the server is running.'
                }
              </p>
              <div className="flex gap-2 justify-center">
                <Link 
                  href="/knowledge-base" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Knowledge Base
                </Link>
                <button 
                  onClick={retryLoadNotebook}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50" style={{ height: 'calc(100vh - 76px)' }}>
      {/* Breadcrumb - Keep as requested */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/knowledge-base" className="hover:text-gray-700 transition-colors">
            Knowledge Base
          </Link>
          <span>›</span>
          <span className="text-gray-800">{notebook.title}</span>
        </div>
      </nav>

      {/* Main Content - NotebookLM Style Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Panel - Sources */}
        <SourcesPanel
          sources={sources}
          onSourceToggle={handleSourceToggle}
          onSelectAll={handleSelectAll}
          onAddSource={handleAddSource}
          onDiscover={handleDiscover}
          onImportResources={handleImportResources}
        />

        {/* Center Panel - Chat Interface */}
        <ChatInterface
          notebookTitle={notebook.title}
          selectedSourcesCount={selectedSourcesCount}
          onSendMessage={handleSendMessage}
        />

        {/* Right Panel - Studio */}
        <StudioPanel
          onCreateAudioOverview={handleCreateAudioOverview}
          onCreateStudyGuide={handleCreateStudyGuide}
          onCreateBriefingDoc={handleCreateBriefingDoc}
          onCreateFAQs={handleCreateFAQs}
          onCreateTimeline={handleCreateTimeline}
          onAddNote={handleAddNote}
        />
      </div>
    </div>
  );
} 