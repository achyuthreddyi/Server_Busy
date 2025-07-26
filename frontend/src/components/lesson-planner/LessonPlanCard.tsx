'use client';

import Link from 'next/link';
import { LessonPlan } from './types';

interface LessonPlanCardProps {
  lessonPlan: LessonPlan;
}

export default function LessonPlanCard({ lessonPlan }: LessonPlanCardProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (progress: number) => {
    if (progress >= 80) return 'text-green-700';
    if (progress >= 60) return 'text-blue-700';
    if (progress >= 40) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getStatusBadge = (progress: number) => {
    if (progress >= 80) return { text: 'Excellent', bg: 'bg-green-100', color: 'text-green-800' };
    if (progress >= 60) return { text: 'On Track', bg: 'bg-blue-100', color: 'text-blue-800' };
    if (progress >= 40) return { text: 'In Progress', bg: 'bg-yellow-100', color: 'text-yellow-800' };
    return { text: 'Needs Attention', bg: 'bg-red-100', color: 'text-red-800' };
  };

  const statusBadge = getStatusBadge(lessonPlan.progress);

  return (
    <Link
      href={`/lesson-planner/${lessonPlan.id}`}
      className="block group"
    >
      <div className={`bg-white rounded-xl shadow-md border ${lessonPlan.color} p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group-hover:shadow-xl relative overflow-hidden`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{lessonPlan.icon}</span>
            <div>
              <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-lg">
                {lessonPlan.subject}
              </h3>
              <div className="text-sm text-gray-600 font-medium">
                {lessonPlan.classes.join(' • ')}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getProgressTextColor(lessonPlan.progress)}`}>
              {lessonPlan.progress}%
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${statusBadge.bg} ${statusBadge.color} font-medium`}>
              {statusBadge.text}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-2 font-medium">
            <span>{lessonPlan.completedLessons}/{lessonPlan.totalLessons} lessons</span>
            <span>{lessonPlan.totalLessons - lessonPlan.completedLessons} remaining</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(lessonPlan.progress)}`}
              style={{ width: `${lessonPlan.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {lessonPlan.description}
        </p>

        {/* Next Lesson */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1 font-medium">📅 Next Lesson</div>
              <div className="text-sm font-semibold text-gray-800 truncate">
                {lessonPlan.nextLesson}
              </div>
            </div>
            <div className="text-right ml-3">
              <div className="text-xs text-gray-500 mb-1 font-medium">Date</div>
              <div className="text-sm font-semibold text-gray-800">
                {new Date(lessonPlan.nextLessonDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-gray-50 opacity-50 rounded-full transform translate-x-16 -translate-y-16"></div>
      </div>
    </Link>
  );
} 