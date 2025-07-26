'use client';

import { LessonPlan } from './types';

interface LessonPlanHeaderProps {
  lessonPlan: LessonPlan;
}

export default function LessonPlanHeader({ lessonPlan }: LessonPlanHeaderProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className={`rounded-lg p-6 mb-8 ${lessonPlan.color}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-4xl">{lessonPlan.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{lessonPlan.subject}</h1>
            <p className="text-gray-600 mt-1">{lessonPlan.classes.join(' • ')}</p>
            {lessonPlan.academicYear && (
              <p className="text-gray-600 text-sm mt-1">Academic Year: {lessonPlan.academicYear}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">{lessonPlan.progress}%</div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      {/* <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{lessonPlan.completedLessons} of {lessonPlan.totalLessons} lessons completed</span>
          <span>{lessonPlan.totalLessons - lessonPlan.completedLessons} lessons remaining</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(lessonPlan.progress)}`}
            style={{ width: `${lessonPlan.progress}%` }}
          ></div>
        </div>
      </div> */}
    </div>
  );
} 