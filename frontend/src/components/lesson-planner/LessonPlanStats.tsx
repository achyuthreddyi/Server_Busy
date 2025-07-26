'use client';

import { LessonPlanStats } from './types';

interface LessonPlanStatsProps {
  stats: LessonPlanStats;
}

export default function LessonPlanStats({ stats }: LessonPlanStatsProps) {
  return (
    <div className="flex items-center space-x-6 text-sm text-gray-600">
      <div className="flex items-center space-x-2">
        <span className="font-medium">{stats.totalSubjects}</span>
        <span>Total Subjects</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="font-medium">{stats.totalClasses}</span>
        <span>Classes</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="font-medium">{stats.averageProgress}%</span>
        <span>Avg Progress</span>
      </div>
    </div>
  );
} 