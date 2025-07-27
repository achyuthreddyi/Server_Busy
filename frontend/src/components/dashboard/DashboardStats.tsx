'use client';

import { DashboardStats as StatsType } from './types';

interface DashboardStatsProps {
  stats: StatsType;
  loading: boolean;
}

export default function DashboardStats({ stats, loading }: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-xl p-6 border border-gray-300 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-8 w-12 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      value: stats.totalClasses,
      label: 'Total Classes',
      icon: '🏫',
      color: 'blue',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      labelColor: 'text-blue-600',
      iconColor: 'text-blue-500'
    },
    {
      value: stats.totalStudents,
      label: 'Total Students',
      icon: '👥',
      color: 'green',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      labelColor: 'text-green-600',
      iconColor: 'text-green-500'
    },
    {
      value: `${stats.averageAttendance}%`,
      label: 'Avg Attendance',
      icon: '✅',
      color: 'purple',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      labelColor: 'text-purple-600',
      iconColor: 'text-purple-500',
      subtitle: `Today's overall`
    },
    {
      value: `${stats.averagePerformance}%`,
      label: 'Avg Performance',
      icon: '📈',
      color: 'orange',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800',
      labelColor: 'text-orange-600',
      iconColor: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div key={index} className={`bg-gradient-to-br ${card.bgColor} rounded-xl p-6 border ${card.borderColor} hover:shadow-lg transition-all duration-300`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-2xl font-bold ${card.textColor}`}>{card.value}</div>
              <div className={`${card.labelColor} font-medium`}>{card.label}</div>
              {card.subtitle && (
                <div className={`text-xs ${card.labelColor} opacity-75 mt-1`}>{card.subtitle}</div>
              )}
            </div>
            <div className={`text-3xl ${card.iconColor}`}>{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 