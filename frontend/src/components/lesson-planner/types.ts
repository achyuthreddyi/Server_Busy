// Shared TypeScript interfaces for Lesson Planner components

export interface Lesson {
  id: number;
  title: string;
  date: string;
  duration: string;
  status: 'completed' | 'scheduled' | 'in-progress';
}

export interface ClassData {
  className: string;
  totalLessons: number;
  completedLessons: number;
  nextLesson: string;
  nextLessonDate: string;
  progress: number;
  upcomingLessons?: Lesson[];
  recentLessons?: Lesson[];
}

export interface LessonPlan {
  id: number;
  subject: string;
  classes: string[];
  color: string;
  icon: string;
  description: string;
  topics?: string[];
  academicYear?: string;
  createdDate?: string;
  
  // Consolidated data (for backward compatibility and overview)
  totalLessons: number;
  completedLessons: number;
  nextLesson: string;
  nextLessonDate: string;
  progress: number;
  upcomingLessons?: Lesson[];
  recentLessons?: Lesson[];
  
  // Class-specific data
  classData?: ClassData[];
}

export interface LessonPlanStats {
  totalSubjects: number;
  totalClasses: number;
  averageProgress: number;
}

export type TabType = 'overview' | 'lessons' | 'resources' | 'assessment';

export interface TabInfo {
  id: TabType;
  label: string;
  icon: string;
} 