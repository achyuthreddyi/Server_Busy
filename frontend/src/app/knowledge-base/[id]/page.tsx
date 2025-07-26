'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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

export default function NotebookDetail() {
  const params = useParams();
  const id = params?.id as string;

  // Mock data - in real app this would come from API based on ID
  const notebookData: Record<string, {
    title: string;
    class: string;
    section: string;
    description: string;
    sources: Source[];
  }> = {
    '1': {
      title: "Advanced Mathematics - Calculus",
      class: "Grade 12 Mathematics",
      section: "Section A",
      description: "Comprehensive study notes for calculus concepts including limits, derivatives, and integrals for Grade 12 students.",
      sources: [
        { id: '1', title: 'Calculus Fundamentals.pdf', type: 'pdf' as const, selected: true, dateAdded: '2 days ago' },
        { id: '2', title: 'Derivative Rules Handbook', type: 'doc' as const, selected: true, dateAdded: '1 week ago' },
        { id: '3', title: 'Integration Techniques Notes', type: 'text' as const, selected: false, dateAdded: '3 days ago' },
        { id: '4', title: 'Khan Academy - Calculus Course', type: 'url' as const, selected: true, dateAdded: '5 days ago' }
      ]
    },
    '2': {
      title: "Physics - Quantum Mechanics",
      class: "Grade 11 Physics",
      section: "Section B", 
      description: "Fundamental concepts of quantum mechanics for advanced physics students.",
      sources: [
        { id: '1', title: 'Quantum Physics Introduction.pdf', type: 'pdf' as const, selected: true, dateAdded: '1 week ago' },
        { id: '2', title: 'Wave-Particle Duality Experiments', type: 'doc' as const, selected: false, dateAdded: '2 weeks ago' },
        { id: '3', title: 'Heisenberg Principle Explained', type: 'text' as const, selected: true, dateAdded: '4 days ago' }
      ]
    },
    '3': {
      title: "Chemistry - Organic Compounds",
      class: "Grade 10 Chemistry",
      section: "Section A",
      description: "Study of organic chemistry focusing on carbon-based compounds and their reactions.",
      sources: [
        { id: '1', title: 'Organic Chemistry Basics.pdf', type: 'pdf' as const, selected: true, dateAdded: '3 days ago' },
        { id: '2', title: 'Hydrocarbon Classification Guide', type: 'doc' as const, selected: true, dateAdded: '1 week ago' },
        { id: '3', title: 'Functional Groups Reference', type: 'text' as const, selected: false, dateAdded: '5 days ago' },
        { id: '4', title: 'ChemLibreTexts - Organic Chemistry', type: 'url' as const, selected: true, dateAdded: '2 weeks ago' }
      ]
    },
    '4': {
      title: "Literature - Shakespeare Studies",
      class: "Grade 12 English",
      section: "Section C",
      description: "Analysis of Shakespeare's major works including themes, characters, and literary devices.",
      sources: [
        { id: '1', title: 'Hamlet Complete Text.pdf', type: 'pdf' as const, selected: true, dateAdded: '5 days ago' },
        { id: '2', title: 'Macbeth Analysis Notes', type: 'doc' as const, selected: true, dateAdded: '1 week ago' },
        { id: '3', title: 'Shakespeare Themes Overview', type: 'text' as const, selected: false, dateAdded: '3 days ago' }
      ]
    }
  };

  // Handle case where id is not provided or not found
  if (!id || !notebookData[id]) {
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

  const notebook = notebookData[id];
  const [sources, setSources] = useState<Source[]>(notebook.sources);

  const selectedSourcesCount = sources.filter(source => source.selected).length;

  const handleSourceToggle = (sourceId: string) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, selected: !source.selected }
        : source
    ));
  };

  const handleSelectAll = () => {
    const allSelected = sources.every(source => source.selected);
    setSources(prev => prev.map(source => ({ ...source, selected: !allSelected })));
  };

  const handleAddSource = () => {
    // Placeholder for adding new source
    console.log('Add source clicked');
  };

  const handleDiscover = () => {
    // Placeholder for discover functionality
    console.log('Discover clicked');
  };

  const handleSendMessage = (message: string) => {
    // Placeholder for sending message to LLM
    console.log('Message sent:', message);
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