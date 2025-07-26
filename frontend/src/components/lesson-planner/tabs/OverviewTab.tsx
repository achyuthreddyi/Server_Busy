'use client';

import { useState } from 'react';
import { LessonPlan, ClassData } from '../types';

interface OverviewTabProps {
  lessonPlan: LessonPlan;
  onStartPlanning?: () => void;
}

export default function OverviewTab({ lessonPlan, onStartPlanning }: OverviewTabProps) {
  const [selectedClass, setSelectedClass] = useState<string>('all');

  // Get the data to display based on selected class
  const getDisplayData = (): ClassData & { className: string } => {
    if (selectedClass === 'all') {
      return {
        className: 'All Classes',
        totalLessons: lessonPlan.totalLessons,
        completedLessons: lessonPlan.completedLessons,
        progress: lessonPlan.progress,
        nextLesson: lessonPlan.nextLesson,
        nextLessonDate: lessonPlan.nextLessonDate,
        upcomingLessons: lessonPlan.upcomingLessons,
        recentLessons: lessonPlan.recentLessons
      };
    }

    const classData = lessonPlan.classData?.find(cd => cd.className === selectedClass);
    return classData ? { ...classData } : {
      className: selectedClass,
      totalLessons: 0,
      completedLessons: 0,
      progress: 0,
      nextLesson: 'No lessons scheduled',
      nextLessonDate: new Date().toISOString(),
      upcomingLessons: [],
      recentLessons: []
    };
  };

  const displayData = getDisplayData();

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

  return (
    <div className="space-y-8">
      {/* Header Section with Class Selector */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Subject Info */}
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{lessonPlan.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{lessonPlan.subject}</h2>
              <p className="text-gray-600">{lessonPlan.classes.join(' • ')}</p>
              <p className="text-sm text-gray-500">Academic Year: {lessonPlan.academicYear}</p>
            </div>
          </div>

          {/* Class Selector (Prominent) */}
          {lessonPlan.classes.length > 1 && (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 min-w-72">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📊 View Class Progress:
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium bg-white"
              >
                <option value="all">📈 All Classes (Consolidated View)</option>
                {lessonPlan.classes.map((className) => (
                  <option key={className} value={className}>
                    🎯 {className}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Current Progress Status Bar */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-800">
                Progress Status - {displayData.className}
              </h3>
              <p className="text-sm text-gray-600">
                {displayData.completedLessons} of {displayData.totalLessons} lessons completed
              </p>
            </div>
            <div className={`text-2xl font-bold ${getProgressTextColor(displayData.progress)}`}>
              {displayData.progress}%
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(displayData.progress)}`}
              style={{ width: `${displayData.progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Class Progress Comparison - Redesigned */}
      {lessonPlan.classes.length > 1 && selectedClass === 'all' && lessonPlan.classData && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="text-2xl mr-3">📊</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Class Performance Overview</h3>
              <p className="text-gray-600">Compare progress across all your classes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(lessonPlan.classData || []).map((classData) => (
              <div key={classData.className} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-lg">{classData.className}</h4>
                    <p className="text-sm text-gray-600">{classData.completedLessons}/{classData.totalLessons} lessons</p>
                  </div>
                  <div className={`text-xl font-bold ${getProgressTextColor(classData.progress)}`}>
                    {classData.progress}%
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(classData.progress)}`}
                    style={{ width: `${classData.progress}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Next: {classData.nextLesson}</span>
                  <span className="text-gray-500">
                    {new Date(classData.nextLessonDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                {/* Quick action button */}
                <button 
                  onClick={() => setSelectedClass(classData.className)}
                  className="w-full mt-3 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{displayData.totalLessons}</div>
          <div className="text-sm text-gray-600 font-medium">Total Lessons</div>
          <div className="text-xs text-gray-500 mt-1">{displayData.className}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">{displayData.completedLessons}</div>
          <div className="text-sm text-gray-600 font-medium">Completed</div>
          <div className="text-xs text-gray-500 mt-1">{displayData.className}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-1">{displayData.totalLessons - displayData.completedLessons}</div>
          <div className="text-sm text-gray-600 font-medium">Remaining</div>
          <div className="text-xs text-gray-500 mt-1">{displayData.className}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">{lessonPlan.topics?.length || 0}</div>
          <div className="text-sm text-gray-600 font-medium">Topics</div>
          <div className="text-xs text-gray-500 mt-1">All Classes</div>
        </div>
      </div>

      {/* Description & Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="text-xl mr-2">📝</div>
            <h3 className="text-lg font-semibold text-gray-800">Description</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">{lessonPlan.description}</p>
          {lessonPlan.createdDate && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">
                <strong>Created:</strong> {new Date(lessonPlan.createdDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="text-xl mr-2">🎯</div>
            <h3 className="text-lg font-semibold text-gray-800">Topics Covered</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lessonPlan.topics?.map((topic, index) => (
              <span 
                key={index}
                className="px-3 py-2 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200 font-medium hover:bg-blue-100 transition-colors"
              >
                {topic}
              </span>
            )) || (
              <span className="text-gray-500 text-sm italic">No topics defined yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Next Lesson - Enhanced */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="text-xl mr-2">📅</div>
          <h3 className="text-lg font-semibold text-gray-800">
            Next Scheduled Lesson
            {selectedClass !== 'all' && (
              <span className="text-sm font-normal text-blue-600 ml-2">({selectedClass})</span>
            )}
          </h3>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-semibold text-gray-800 text-lg mb-1">{displayData.nextLesson}</div>
              <div className="text-gray-600">
                📅 {new Date(displayData.nextLessonDate).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Class: {selectedClass === 'all' ? 'Multiple Classes' : selectedClass}
              </div>
            </div>
            <button 
              onClick={onStartPlanning}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              🚀 Start Planning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 