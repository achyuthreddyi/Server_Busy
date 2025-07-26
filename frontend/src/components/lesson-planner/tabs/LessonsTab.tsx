'use client';

import { useState } from 'react';
import { LessonPlan, Lesson, ClassData } from '../types';

interface LessonsTabProps {
  lessonPlan: LessonPlan;
  onEditLesson?: (lesson: Lesson) => void;
}

export default function LessonsTab({ lessonPlan, onEditLesson }: LessonsTabProps) {
  const [selectedClass, setSelectedClass] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="text-green-500">✅</span>;
      case 'in-progress':
        return <span className="text-yellow-500">🔄</span>;
      case 'scheduled':
        return <span className="text-blue-500">📅</span>;
      default:
        return <span className="text-gray-500">📝</span>;
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (onEditLesson) {
      onEditLesson(lesson);
    }
  };

  // Get the lessons to display based on selected class
  const getDisplayLessons = (): { upcoming: Lesson[], recent: Lesson[] } => {
    if (selectedClass === 'all') {
      return {
        upcoming: lessonPlan.upcomingLessons || [],
        recent: lessonPlan.recentLessons || []
      };
    }

    const classData = lessonPlan.classData?.find(cd => cd.className === selectedClass);
    return {
      upcoming: classData?.upcomingLessons || [],
      recent: classData?.recentLessons || []
    };
  };

  const { upcoming, recent } = getDisplayLessons();

  return (
    <div className="space-y-6">
      {/* Class Selector */}
      {lessonPlan.classes.length > 1 && (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">View Options</h3>
            <div className="flex items-center space-x-3">
              <label htmlFor="class-selector-lessons" className="text-sm font-medium text-gray-700">
                Select Class:
              </label>
              <select
                id="class-selector-lessons"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Classes</option>
                {lessonPlan.classes.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Lessons */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Upcoming Lessons
          {selectedClass !== 'all' && (
            <span className="text-sm font-normal text-gray-600 ml-2">({selectedClass})</span>
          )}
        </h3>
        <div className="space-y-3">
          {upcoming && upcoming.length > 0 ? (
            upcoming.map((lesson) => (
              <div 
                key={lesson.id} 
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(lesson.status)}
                  <div>
                    <div className="font-medium text-gray-800">{lesson.title}</div>
                    <div className="text-sm text-gray-600">{lesson.duration}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(lesson.date).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming lessons scheduled{selectedClass !== 'all' ? ` for ${selectedClass}` : ''}</p>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Schedule New Lesson
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Lessons */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Lessons
          {selectedClass !== 'all' && (
            <span className="text-sm font-normal text-gray-600 ml-2">({selectedClass})</span>
          )}
        </h3>
        <div className="space-y-3">
          {recent && recent.length > 0 ? (
            recent.map((lesson) => (
              <div 
                key={lesson.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(lesson.status)}
                  <div>
                    <div className="font-medium text-gray-800">{lesson.title}</div>
                    <div className="text-sm text-gray-600">{lesson.duration}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(lesson.date).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent lessons found{selectedClass !== 'all' ? ` for ${selectedClass}` : ''}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 