'use client';

import { LessonPlan } from '../types';

interface ResourcesTabProps {
  lessonPlan: LessonPlan;
  onAddResource?: () => void;
  onImportFromLibrary?: () => void;
}

export default function ResourcesTab({ 
  lessonPlan, 
  onAddResource, 
  onImportFromLibrary 
}: ResourcesTabProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 text-center">
      <div className="text-gray-400 mb-4">
        <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">Resources Coming Soon</h3>
      <p className="text-gray-600 mb-4">
        This section will contain all your teaching resources, materials, and references for {lessonPlan.subject}.
      </p>
      <div className="flex justify-center space-x-3">
        <button 
          onClick={onAddResource}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Resource
        </button>
        <button 
          onClick={onImportFromLibrary}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Import from Library
        </button>
      </div>
    </div>
  );
} 