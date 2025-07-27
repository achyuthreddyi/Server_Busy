'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchClassDetails } from '@/lib/api';
import { 
  TakeClassHeader,
  QuickViewStep,
  LiveAssistStep,
  ClassDetail
} from '@/components/dashboard/take-class';

export default function TakeClassPage() {
  const params = useParams();
  const classId = parseInt(params?.classId as string);
  const [currentView, setCurrentView] = useState<'quick-view' | 'live-assist'>('quick-view');
  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch class details from API
  useEffect(() => {
    if (!classId) return;
    
    const loadClassDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchClassDetails(classId) as { class: ClassDetail };
        setClassData(data.class);
        console.log('✅ Loaded class details for take-class:', data.class);
      } catch (err) {
        console.error('❌ Error fetching class details for take-class:', err);
        setError(err instanceof Error ? err.message : 'Failed to load class details. Please make sure the server is running.');
      } finally {
        setLoading(false);
      }
    };

    loadClassDetails();
  }, [classId]);

  // Navigation handlers
  const handleGoToLiveAssist = () => {
    setCurrentView('live-assist');
    console.log('🎯 Moving to Live Assist');
  };

  const handleBackToQuickView = () => {
    setCurrentView('quick-view');
    console.log('🔙 Moving back to Quick View');
  };

  const handleEndPrep = () => {
    console.log('✅ Class preparation completed');
    // TODO: Could navigate back to dashboard
    alert('Class preparation completed! You\'re ready to teach.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Preparing your class...</h3>
            <p className="text-gray-600">Loading class information and lesson details</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {error ? 'Failed to load class' : 'Class not found'}
            </h3>
            <p className="text-gray-600 mb-4">{error || 'The requested class could not be found.'}</p>
            <div className="space-x-3">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                ← Back to Dashboard
              </Link>
              {error && (
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  🔄 Retry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            🏠 Home
          </Link>
          <span>›</span>
          <Link href="/dashboard" className="hover:text-gray-700 transition-colors">
            📚 My Classes
          </Link>
          <span>›</span>
          <Link href={`/dashboard/${classData.id}`} className="hover:text-gray-700 transition-colors">
            {classData.name}
          </Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">
            📖 {currentView === 'quick-view' ? 'Quick View' : 'Live Assist'}
          </span>
        </nav>

        {/* Header */}
        <TakeClassHeader classData={classData} currentView={currentView} />

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {currentView === 'quick-view' && (
            <QuickViewStep 
              classData={classData}
              onNext={handleGoToLiveAssist}
              onComplete={handleEndPrep}
            />
          )}
          
          {currentView === 'live-assist' && (
            <LiveAssistStep 
              classData={classData}
              onPrevious={handleBackToQuickView}
            />
          )}
        </div>
      </div>
    </div>
  );
} 