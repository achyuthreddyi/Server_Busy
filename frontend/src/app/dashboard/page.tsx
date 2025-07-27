'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchTeacherClasses } from '@/lib/api';

interface ClassCardProps {
  classData: any;
}

const ClassCard = ({ classData }: ClassCardProps) => {
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
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch classes from API
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTeacherClasses() as { classes: any[] };
        setClasses(data.classes);
        console.log('✅ Loaded teacher classes:', data.classes.length, 'classes');
      } catch (err) {
        console.error('❌ Error fetching teacher classes:', err);
        setError(err instanceof Error ? err.message : 'Failed to load classes. Please make sure the server is running.');
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, []);

  // Calculate overall statistics from API data
  const totalStudents = classes.reduce((sum, cls) => sum + cls.totalStudents, 0);
  const totalPresent = classes.reduce((sum, cls) => sum + cls.presentToday, 0);
  const averagePerformance = classes.length > 0 ? Math.round(
    classes.reduce((sum, cls) => sum + cls.averagePerformance, 0) / classes.length
  ) : 0;
  const overallAttendance = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

  // Filter classes based on search
  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading your classes...</h3>
            <p className="text-gray-600">Please wait while we fetch your class data</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to load classes</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            🏠 Home
          </Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">📚 My Classes</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Classes</h1>
          <p className="text-gray-600">Manage and monitor your teaching classes</p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-800">{classes.length}</div>
                <div className="text-blue-600 font-medium">Total Classes</div>
              </div>
              <div className="text-3xl text-blue-500">🏫</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-800">{totalStudents}</div>
                <div className="text-green-600 font-medium">Total Students</div>
              </div>
              <div className="text-3xl text-green-500">👥</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-800">{overallAttendance}%</div>
                <div className="text-purple-600 font-medium">Avg Attendance</div>
                <div className="text-xs text-purple-500">{totalPresent}/{totalStudents} present</div>
              </div>
              <div className="text-3xl text-purple-500">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-800">{averagePerformance}%</div>
                <div className="text-orange-600 font-medium">Avg Performance</div>
              </div>
              <div className="text-3xl text-orange-500">📈</div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search classes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              📊 View Analytics
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              📅 Schedule Overview
            </button>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClasses.map((classData) => (
            <ClassCard key={classData.id} classData={classData} />
          ))}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No classes found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
              <div className="text-2xl">📝</div>
              <div className="text-left">
                <div className="font-medium text-gray-800">Take Attendance</div>
                <div className="text-sm text-gray-600">Mark today's attendance</div>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
              <div className="text-2xl">📊</div>
              <div className="text-left">
                <div className="font-medium text-gray-800">Grade Assignments</div>
                <div className="text-sm text-gray-600">Review pending work</div>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
              <div className="text-2xl">📚</div>
              <div className="text-left">
                <div className="font-medium text-gray-800">Plan Lessons</div>
                <div className="text-sm text-gray-600">Create lesson plans</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 