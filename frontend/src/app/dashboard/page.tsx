'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchTeacherClasses } from '@/lib/api';
import { 
  ClassGrid, 
  DashboardStats, 
  ClassSearch, 
  QuickActions,
  TeacherClass,
  DashboardStatsType
} from '@/components/dashboard';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch classes from API
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTeacherClasses() as { classes: TeacherClass[] };
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
  const calculateStats = (): DashboardStatsType => {
    const totalStudents = classes.reduce((sum, cls) => sum + cls.totalStudents, 0);
    const totalPresent = classes.reduce((sum, cls) => sum + cls.presentToday, 0);
    const averagePerformance = classes.length > 0 ? Math.round(
      classes.reduce((sum, cls) => sum + cls.averagePerformance, 0) / classes.length
    ) : 0;
    const averageAttendance = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;

    return {
      totalClasses: classes.length,
      totalStudents,
      averageAttendance,
      averagePerformance
    };
  };

  const stats = calculateStats();

  // Search handlers
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleViewAnalytics = () => {
    console.log('📊 View Analytics requested');
    // TODO: Navigate to analytics page or open analytics modal
    alert('Analytics dashboard coming soon!');
  };

  const handleScheduleOverview = () => {
    console.log('📅 Schedule Overview requested');
    // TODO: Navigate to schedule page or open schedule modal
    alert('Schedule overview coming soon!');
  };

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
        <DashboardStats stats={stats} loading={loading} />

        {/* Search and Actions */}
        <ClassSearch 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onViewAnalytics={handleViewAnalytics}
          onScheduleOverview={handleScheduleOverview}
        />

        {/* Classes Grid */}
        <ClassGrid 
          classes={classes}
          searchTerm={searchTerm}
          loading={loading}
        />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
} 