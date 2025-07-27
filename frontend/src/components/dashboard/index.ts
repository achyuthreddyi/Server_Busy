// Dashboard Components Index

// Main Dashboard Components
export { default as ClassCard } from './ClassCard';
export { default as ClassGrid } from './ClassGrid';
export { default as DashboardStats } from './DashboardStats';
export { default as ClassSearch } from './ClassSearch';
export { default as QuickActions } from './QuickActions';

// Class Detail Components
export { default as StudentTable } from './class-detail/StudentTable';
export { default as ClassHeader } from './class-detail/ClassHeader';
export { default as ClassTabs } from './class-detail/ClassTabs';
export { default as OverviewTab } from './class-detail/OverviewTab';

// Types
export type { 
  TeacherClass,
  Student,
  ClassDetail,
  ClassMetrics,
  DashboardStats as DashboardStatsType,
  TabType,
  TabInfo,
  QuickAction
} from './types'; 