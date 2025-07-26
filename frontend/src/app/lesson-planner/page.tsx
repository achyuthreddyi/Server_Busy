'use client';

import { useState, useEffect } from 'react';
import { fetchLessonPlans } from '@/lib/api';
import type { LessonPlan, LessonPlanStatsType } from '@/components/lesson-planner';
import { 
  LessonPlanGrid,
  LessonPlanSearch,
  LessonPlanStats as StatsComponent,
  QuickActions
} from '@/components/lesson-planner';

export default function LessonPlanner() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadLessonPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: any = await fetchLessonPlans();
        setLessonPlans(data.lessonPlans);
      } catch (err) {
        console.error('Error fetching lesson plans:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lesson plans. Please make sure the server is running.');
      } finally {
        setLoading(false);
      }
    };
    loadLessonPlans();
  }, []);

  // Filter lesson plans based on search term
  const filteredLessonPlans = lessonPlans.filter(plan =>
    plan.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.classes.some(cls => cls.toLowerCase().includes(searchTerm.toLowerCase())) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const stats: LessonPlanStatsType = {
    totalSubjects: lessonPlans.length,
    totalClasses: lessonPlans.reduce((acc, plan) => acc + plan.classes.length, 0),
    averageProgress: lessonPlans.length > 0 
      ? Math.round(lessonPlans.reduce((acc, plan) => acc + plan.progress, 0) / lessonPlans.length)
      : 0
  };

  // Handler functions for quick actions
  const handleCreateNew = () => {
    console.log('Create new lesson plan');
    // TODO: Implement create new lesson plan modal/page
  };

  const handleViewCalendar = () => {
    console.log('View calendar');
    // TODO: Implement calendar view
  };

  const handleProgressReport = () => {
    console.log('View progress report');
    // TODO: Implement progress report
  };

  const handleImportCurriculum = () => {
    console.log('Import curriculum');
    // TODO: Implement curriculum import
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="ml-3 text-gray-600">Loading lesson plans...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load lesson plans</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lesson Planner</h1>
          <p className="text-gray-600">Plan and track your teaching progress across all subjects and classes</p>
        </div>

        {/* Search and Stats */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <LessonPlanSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <StatsComponent stats={stats} />
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <QuickActions
            onCreateNew={handleCreateNew}
            onViewCalendar={handleViewCalendar}
            onProgressReport={handleProgressReport}
            onImportCurriculum={handleImportCurriculum}
          />
        </div>

        {/* Lesson Plans Grid */}
        <LessonPlanGrid 
          lessonPlans={filteredLessonPlans}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
} 