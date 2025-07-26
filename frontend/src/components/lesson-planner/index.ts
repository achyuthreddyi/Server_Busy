// Lesson Planner Components Index
export { default as LessonPlanCard } from './LessonPlanCard';
export { default as LessonPlanGrid } from './LessonPlanGrid';
export { default as LessonPlanSearch } from './LessonPlanSearch';
export { default as LessonPlanStats } from './LessonPlanStats';
export { default as QuickActions } from './QuickActions';
export { default as LessonPlanHeader } from './LessonPlanHeader';
export { default as LessonPlanTabs } from './LessonPlanTabs';

// Tab Components
export { default as OverviewTab } from './tabs/OverviewTab';
export { default as LessonsTab } from './tabs/LessonsTab';
export { default as ResourcesTab } from './tabs/ResourcesTab';
export { default as AssessmentTab } from './tabs/AssessmentTab';

// Types - using different names to avoid conflicts with component names
export type { 
  LessonPlan, 
  Lesson, 
  LessonPlanStats as LessonPlanStatsType, 
  TabType, 
  TabInfo 
} from './types'; 