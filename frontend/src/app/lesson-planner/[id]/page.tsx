'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchLessonPlan } from '@/lib/api';
import type { LessonPlan, TabType, Lesson } from '@/components/lesson-planner/types';
import { 
  LessonPlanHeader,
  LessonPlanTabs,
  OverviewTab,
  LessonsTab,
  ResourcesTab,
  AssessmentTab
} from '@/components/lesson-planner';

export default function LessonPlanDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    if (!id) return;
    const loadLessonPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: any = await fetchLessonPlan(id);
        setLessonPlan(data.lessonPlan);
      } catch (err) {
        console.error('Error fetching lesson plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lesson plan');
      } finally {
        setLoading(false);
      }
    };
    loadLessonPlan();
  }, [id]);

  // Handler functions for various actions
  const handleStartPlanning = () => {
    console.log('Start planning lesson');
    // TODO: Implement lesson planning interface
  };

  const handleEditLesson = (lesson: Lesson) => {
    console.log('Edit lesson:', lesson);
    // TODO: Implement lesson editing modal/page
  };

  const handleAddResource = () => {
    console.log('Add resource');
    // TODO: Implement resource addition
  };

  const handleImportFromLibrary = () => {
    console.log('Import from library');
    // TODO: Implement library import
  };

  const handleCreateQuiz = () => {
    console.log('Create quiz');
    // TODO: Implement quiz creation
  };

  const handleGradeAssignment = () => {
    console.log('Grade assignment');
    // TODO: Implement assignment grading
  };

  const handleViewGradebook = () => {
    console.log('View gradebook');
    // TODO: Implement gradebook view
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="ml-3 text-gray-600">Loading lesson plan...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lessonPlan) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Lesson plan not found</h3>
            <p className="text-gray-500 mb-4">{error || 'The requested lesson plan could not be found.'}</p>
            <Link 
              href="/lesson-planner"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Back to Lesson Planner
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            lessonPlan={lessonPlan} 
            onStartPlanning={handleStartPlanning}
          />
        );
      case 'lessons':
        return (
          <LessonsTab 
            lessonPlan={lessonPlan} 
            onEditLesson={handleEditLesson}
          />
        );
      case 'resources':
        return (
          <ResourcesTab 
            lessonPlan={lessonPlan}
            onAddResource={handleAddResource}
            onImportFromLibrary={handleImportFromLibrary}
          />
        );
      case 'assessment':
        return (
          <AssessmentTab 
            lessonPlan={lessonPlan}
            onCreateQuiz={handleCreateQuiz}
            onGradeAssignment={handleGradeAssignment}
            onViewGradebook={handleViewGradebook}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/lesson-planner" className="hover:text-gray-700 transition-colors">
            Lesson Planner
          </Link>
          <span>›</span>
          <span className="text-gray-800">{lessonPlan.subject}</span>
        </nav>

        {/* Header Component */}
        <LessonPlanHeader lessonPlan={lessonPlan} />

        {/* Tabs Component */}
        <LessonPlanTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Dynamic Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
} 