'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchClassDetails } from '@/lib/api';

interface TabType {
  id: string;
  label: string;
  icon: string;
}

const tabs: TabType[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'students', label: 'Students', icon: '👥' },
  { id: 'attendance', label: 'Attendance', icon: '✅' },
  { id: 'performance', label: 'Performance', icon: '📈' },
  { id: 'assignments', label: 'Assignments', icon: '📝' }
];

interface StudentRowProps {
  student: any;
  onStudentClick: (student: any) => void;
}

const StudentRow = ({ student, onStudentClick }: StudentRowProps) => {
  const getPerformanceColor = (performance: number) => {
    if (performance >= 85) return 'text-green-600 bg-green-50';
    if (performance >= 75) return 'text-blue-600 bg-blue-50';
    if (performance >= 65) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return 'text-green-600';
    if (attendance >= 85) return 'text-blue-600';
    if (attendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <tr 
      className="hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onStudentClick(student)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {student.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">Roll: {student.rollNo}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          student.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {student.status === 'present' ? '✅ Present' : '❌ Absent'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-medium ${getAttendanceColor(student.attendance)}`}>
          {student.attendance}%
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(student.performance)}`}>
          {student.performance}%
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900 font-medium">{student.lastGrade}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-indigo-600 hover:text-indigo-900 transition-colors">
          View Details
        </button>
      </td>
    </tr>
  );
};

export default function ClassDetail() {
  const params = useParams();
  const classId = parseInt(params?.classId as string);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch class details from API
  useEffect(() => {
    if (!classId) return;
    
    const loadClassDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchClassDetails(classId) as { class: any };
        setClassData(data.class);
        console.log('✅ Loaded class details:', data.class);
      } catch (err) {
        console.error('❌ Error fetching class details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load class details. Please make sure the server is running.');
      } finally {
        setLoading(false);
      }
    };

    loadClassDetails();
  }, [classId]);

  // Filter students based on search
  const filteredStudents = classData?.students?.filter((student: any) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleStudentClick = (student: any) => {
    console.log('Student clicked:', student);
    // TODO: Open student detail modal or navigate to student page
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading class details...</h3>
            <p className="text-gray-600">Please wait while we fetch class information</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {error ? 'Failed to load class' : 'Class not found'}
            </h3>
            <p className="text-gray-600 mb-4">{error || 'The requested class could not be found.'}</p>
            <div className="space-x-3">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                ← Back to Dashboard
              </Link>
              {error && (
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  🔄 Retry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { students, metrics } = classData;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Class Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{metrics.totalStudents}</div>
                    <div className="text-gray-600">Total Students</div>
                  </div>
                  <div className="text-3xl text-blue-500">👥</div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{metrics.presentToday}</div>
                    <div className="text-gray-600">Present Today</div>
                    <div className="text-sm text-gray-500">({metrics.attendancePercentage}%)</div>
                  </div>
                  <div className="text-3xl text-green-500">✅</div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{metrics.averageAttendance}%</div>
                    <div className="text-gray-600">Avg Attendance</div>
                  </div>
                  <div className="text-3xl text-blue-500">📊</div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{metrics.averagePerformance}%</div>
                    <div className="text-gray-600">Avg Performance</div>
                  </div>
                  <div className="text-3xl text-purple-500">📈</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600">📝</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Quiz on Algebra completed</div>
                    <div className="text-xs text-gray-500">25 students submitted • 2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="text-green-600">✅</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Attendance marked for today</div>
                    <div className="text-xs text-gray-500">{metrics.presentToday}/{metrics.totalStudents} students present • 4 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="text-yellow-600">📋</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">Assignment on Geometry assigned</div>
                    <div className="text-xs text-gray-500">Due next week • Yesterday</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-800">Student List</h3>
                <div className="relative max-w-md">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search students..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Grade
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student: any) => (
                    <StudentRow 
                      key={student.id} 
                      student={student} 
                      onStudentClick={handleStudentClick}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-sm font-medium">No students found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        );

      case 'attendance':
        return (
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Overview</h3>
            <p className="text-gray-600">Attendance tracking features coming soon...</p>
          </div>
        );

      case 'performance':
        return (
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Analytics</h3>
            <p className="text-gray-600">Performance analysis features coming soon...</p>
          </div>
        );

      case 'assignments':
        return (
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Assignments & Assessments</h3>
            <p className="text-gray-600">Assignment management features coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            🏠 Home
          </Link>
          <span>›</span>
          <Link href="/dashboard" className="hover:text-gray-700 transition-colors">
            📚 My Classes
          </Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">{classData.name} - {classData.subject}</span>
        </nav>

        {/* Class Header */}
        <div className={`${classData.color} rounded-xl p-6 border-2 mb-8`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className={`text-4xl ${classData.iconColor}`}>{classData.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{classData.name}</h1>
                <p className="text-xl text-gray-600 font-medium">{classData.subject}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>🏫 {classData.room}</span>
                  <span>📅 {classData.schedule}</span>
                  <span>👥 {metrics.totalStudents} students</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                📝 Take Attendance
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                📊 View Reports
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
} 