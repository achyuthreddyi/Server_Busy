'use client';

import { LessonPlan } from './types';
import LessonPlanCard from './LessonPlanCard';

interface LessonPlanGridProps {
  lessonPlans: LessonPlan[];
  searchTerm: string;
}

export default function LessonPlanGrid({ lessonPlans, searchTerm }: LessonPlanGridProps) {
  if (lessonPlans.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessonPlans.map((plan) => (
          <LessonPlanCard key={plan.id} lessonPlan={plan} />
        ))}
      </div>
    );
  }

  // Empty state
  return (
    <div className="text-center py-12">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012 0v4h6V3a1 1 0 112 0v4h2a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1h2z" />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No lesson plans found</h3>
      <p className="mt-2 text-gray-500">
        {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first lesson plan'}
      </p>
      {!searchTerm && (
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create First Lesson Plan
        </button>
      )}
    </div>
  );
} 