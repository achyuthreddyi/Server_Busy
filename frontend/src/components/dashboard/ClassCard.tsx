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