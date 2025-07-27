'use client';

import { ClassDetail } from '../types';

interface QuickViewStepProps {
  classData: ClassDetail;
  onNext: () => void;
  onComplete: () => void;
}

export default function QuickViewStep({ classData, onNext, onComplete }: QuickViewStepProps) {
  // Mock lesson plan data - this would come from API in real implementation
  const todaysLesson = {
    id: 'lesson-001',
    title: 'Introduction to Quadratic Equations',
    duration: '45 minutes',
    objectives: [
      'Understand what quadratic equations are',
      'Learn the standard form of quadratic equations',
      'Identify coefficients in quadratic equations',
      'Practice solving simple quadratic equations'
    ],
    materials: [
      'Whiteboard/Smart board',
      'Scientific calculators',
      'Worksheet: Quadratic Basics',
      'Graph paper',
      'Colored markers'
    ],
    activities: [
      'Warm-up: Review linear equations (5 min)',
      'Introduction to quadratic form (15 min)',
      'Examples and guided practice (15 min)',
      'Student practice problems (8 min)',
      'Wrap-up and homework assignment (2 min)'
    ],
    assessment: 'Exit ticket with 3 quadratic identification problems',
    notes: 'Focus on students who struggled with linear equations. Have extra examples ready.'
  };

  const importantNotes = [
    'Sarah Kim needs extra support with algebra concepts',
    'Remember to check homework from last class',
    'Lab equipment setup required for next week',
    'Parent-teacher conference scheduled with John\'s parents'
  ];

  const presentStudents = classData.students.filter(s => s.status === 'present');
  const absentStudents = classData.students.filter(s => s.status === 'absent');

  const handleContinue = () => {
    console.log('📋 Quick View completed, moving to Live Assist');
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-3">📋</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick View</h2>
        <p className="text-gray-600">Review your lesson plan and class preparation details</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Lesson Plan */}
        <div className="space-y-6">
          {/* Today's Lesson */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <span className="text-xl">📚</span>
              <span>Today's Lesson</span>
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Title</div>
                <div className="text-lg font-bold text-gray-800">{todaysLesson.title}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-semibold text-gray-800">{todaysLesson.duration}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Assessment</div>
                  <div className="font-semibold text-gray-800 text-sm">{todaysLesson.assessment}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <span className="text-lg">🎯</span>
              <span>Learning Objectives</span>
            </h4>
            <ul className="space-y-2">
              {todaysLesson.objectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lesson Activities */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <span className="text-lg">⏱️</span>
              <span>Lesson Timeline</span>
            </h4>
            <div className="space-y-3">
              {todaysLesson.activities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 flex-1">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Class Info */}
        <div className="space-y-6">
          {/* Attendance Overview */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <span className="text-lg">👥</span>
              <span>Expected Attendance</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                <div className="text-2xl font-bold text-green-600">{presentStudents.length}</div>
                <div className="text-sm text-green-700">Present</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
                <div className="text-2xl font-bold text-red-600">{absentStudents.length}</div>
                <div className="text-sm text-red-700">Absent</div>
              </div>
            </div>
            
            {absentStudents.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Expected Absent Students:</div>
                <div className="flex flex-wrap gap-2">
                  {absentStudents.slice(0, 4).map((student) => (
                    <span 
                      key={student.id}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs"
                    >
                      {student.name}
                    </span>
                  ))}
                  {absentStudents.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{absentStudents.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Materials Needed */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <span className="text-lg">📦</span>
              <span>Materials Needed</span>
            </h4>
            <div className="space-y-2">
              {todaysLesson.materials.map((material, index) => (
                <label key={index} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    defaultChecked={index < 2} // First 2 items checked by default
                  />
                  <span className="text-gray-700">{material}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <span className="text-lg">⚠️</span>
              <span>Important Notes</span>
            </h4>
            <div className="space-y-3">
              {importantNotes.map((note, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span className="text-gray-700 text-sm">{note}</span>
                </div>
              ))}
            </div>
            
            {todaysLesson.notes && (
              <div className="mt-4 pt-4 border-t border-yellow-200">
                <div className="text-sm text-gray-600 mb-1">Lesson Notes:</div>
                <p className="text-gray-700 text-sm italic">{todaysLesson.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={onComplete}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ✅ Mark as Reviewed
        </button>
        
        <button
          onClick={handleContinue}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <span>Continue to Live Assist</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
} 