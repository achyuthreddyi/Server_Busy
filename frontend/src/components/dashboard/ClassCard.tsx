'use client';

import Link from 'next/link';
import { TeacherClass } from './types';

interface ClassCardProps {
  classData: TeacherClass;
}

export default function ClassCard({ classData }: ClassCardProps) {
  const getPerformanceColor = (performance: number) => {
    if (performance >= 85) return 'text-green-600';
    if (performance >= 75) return 'text-blue-600';
    if (performance >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const attendancePercentage = Math.round((classData.presentToday / classData.totalStudents) * 100);

  const handleTakeClass = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link navigation
    e.stopPropagation();
    window.location.href = `/dashboard/${classData.id}/take-class`;
  };
  
  return (
    <Link href={`/dashboard/${classData.id}`}>
      <div className={`${classData.color} rounded-xl p-6 border-2 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`text-3xl ${classData.iconColor}`}>{classData.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {classData.name}
              </h3>
              <p className="text-gray-600 font-medium">{classData.subject}</p>
              <p className="text-sm text-gray-500">{classData.room}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getPerformanceColor(classData.averagePerformance)}`}>
              {classData.averagePerformance}%
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              {getTrendIcon(classData.performanceTrend)} Performance
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white bg-opacity-60 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-800">{classData.totalStudents}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-800">
              {classData.presentToday}
              <span className="text-sm text-gray-500 ml-1">({attendancePercentage}%)</span>
            </div>
            <div className="text-sm text-gray-600">Present Today</div>
          </div>
        </div>

        {/* Schedule & Next Class */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-700">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {classData.schedule}
          </div>
          <div className="flex items-center text-sm font-medium text-indigo-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Next: {classData.nextClass}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white bg-opacity-40 rounded-lg p-3 mb-4">
          <div className="text-xs text-gray-600 mb-1">Recent Activity</div>
          <div className="text-sm text-gray-800">{classData.recentActivity}</div>
        </div>

        {/* Take Class Button */}
        <div className="mb-4">
          <button
            onClick={handleTakeClass}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Take Class</span>
          </button>
        </div>

        {/* Hover Arrow */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Background Decoration */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white to-transparent opacity-20 rounded-full transform translate-x-16 translate-y-16"></div>
      </div>
    </Link>
  );
} 