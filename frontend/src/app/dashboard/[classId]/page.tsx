'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchClassDetails } from '@/lib/api';
import { 
  ClassHeader, 
  ClassTabs, 
  OverviewTab, 
  StudentTable,
  ClassDetail,
  Student,
  TabType 
} from '@/components/dashboard';

export default function ClassDetailPage() {
  const params = useParams();
  const classId = parseInt(params?.classId as string);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch class details from API
  useEffect(() => {
    if (!classId) return;
    
    const loadClassDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchClassDetails(classId) as { class: ClassDetail };
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

  // Event handlers
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    console.log('📋 Tab changed to:', tab);
  };

  const handleStudentClick = (student: Student) => {
    console.log('👤 Student clicked:', student);
    // TODO: Open student detail modal or navigate to student page
    alert(`Student Details: ${student.name}\nRoll No: ${student.rollNo}\nPerformance: ${student.performance}%\nAttendance: ${student.attendance}%`);
  };

  const handleTakeAttendance = () => {
    if (!classData) return;
    console.log('📝 Taking attendance for:', classData.name);
    // TODO: Navigate to attendance page or open attendance modal
    alert(`Taking attendance for ${classData.name} - Feature coming soon!`);
  };

  const handleViewReports = () => {
    if (!classData) return;
    console.log('📊 Viewing reports for:', classData.name);
    // TODO: Navigate to reports page or open reports modal
    alert(`Viewing reports for ${classData.name} - Feature coming soon!`);
  };

  // Render tab content
  const renderTabContent = () => {
    if (!classData) return null;

    switch (activeTab) {
      case 'overview':
        return <OverviewTab classData={classData} />;

      case 'students':
        return (
          <div className="space-y-4">
            {/* Search for students */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="relative max-w-md">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students by name or roll number..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            {/* Student Table */}
            <StudentTable 
              students={classData.students}
              searchTerm={searchTerm}
              onStudentClick={handleStudentClick}
              loading={loading}
            />
          </div>
        );

      case 'attendance':
        return (
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Attendance Management</h3>
              <p className="text-gray-600 mb-4">Detailed attendance tracking features coming soon...</p>
              <button 
                onClick={handleTakeAttendance}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                📝 Take Today's Attendance
              </button>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Performance Analytics</h3>
              <p className="text-gray-600 mb-4">Advanced performance analysis features coming soon...</p>
              <button 
                onClick={handleViewReports}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                📊 View Performance Reports
              </button>
            </div>
          </div>
        );

      case 'assignments':
        return (
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Assignments & Assessments</h3>
              <p className="text-gray-600 mb-4">Assignment management features coming soon...</p>
              <div className="space-x-3">
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  ➕ Create Assignment
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  📋 Grade Submissions
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
        <ClassHeader 
          classData={classData}
          onTakeAttendance={handleTakeAttendance}
          onViewReports={handleViewReports}
        />

        {/* Tabs Navigation */}
        <ClassTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          studentCount={classData.students.length}
        />

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
} 