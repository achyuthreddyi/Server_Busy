'use client';

import { LessonPlan } from '../types';

interface AssessmentTabProps {
  lessonPlan: LessonPlan;
  onCreateQuiz?: () => void;
  onGradeAssignment?: () => void;
  onViewGradebook?: () => void;
}

export default function AssessmentTab({ 
  lessonPlan, 
  onCreateQuiz, 
  onGradeAssignment, 
  onViewGradebook 
}: AssessmentTabProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 text-center">
      <div className="text-gray-400 mb-4">
        <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">Assessment Tools Coming Soon</h3>
      <p className="text-gray-600 mb-4">
        Create and manage assessments, quizzes, and grading for your {lessonPlan.subject} classes.
      </p>
      <div className="flex justify-center space-x-3">
        <button 
          onClick={onCreateQuiz}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Create Quiz
        </button>
        <button 
          onClick={onGradeAssignment}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Grade Assignment
        </button>
        <button 
          onClick={onViewGradebook}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View Gradebook
        </button>
      </div>
    </div>
  );
} 