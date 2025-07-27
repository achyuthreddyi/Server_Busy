// Dashboard Types - TypeScript interfaces for Dashboard components

export interface TeacherClass {
  id: number;
  name: string;
  subject: string;
  totalStudents: number;
  presentToday: number;
  averagePerformance: number;
  color: string;
  iconColor: string;
  icon: string;
  schedule: string;
  room: string;
  nextClass: string;
  recentActivity: string;
  performanceTrend: 'up' | 'down' | 'stable';
  teacher: string;
}

export interface Student {
  id: number;
  name: string;
  rollNo: string;
  attendance: number;
  performance: number;
  lastGrade: string;
  status: 'present' | 'absent';
  parentContact: string;
  email: string;
}

export interface ClassMetrics {
  totalStudents: number;
  presentToday: number;
  attendancePercentage: number;
  averagePerformance: number;
  averageAttendance: number;
}

export interface ClassDetail extends TeacherClass {
  students: Student[];
  metrics: ClassMetrics;
}

export interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  averageAttendance: number;
  averagePerformance: number;
}

export type TabType = 'overview' | 'students' | 'attendance' | 'performance' | 'assignments';

export interface TabInfo {
  id: TabType;
  label: string;
  icon: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

// Take Class Flow Types (simplified)
export interface LessonPlan {
  id: string;
  title: string;
  duration: string;
  objectives: string[];
  materials: string[];
  activities: string[];
  assessment: string;
  notes?: string;
}

export interface QuickViewData {
  lessonPlan: LessonPlan;
  presentStudents: Student[];
  absentStudents: Student[];
  importantNotes: string[];
  reminders: string[];
  materialsNeeded: string[];
}

export interface LiveAssistData {
  sessionStartTime?: Date;
  currentActivity?: string;
  engagementLevel?: number;
  pollActive?: boolean;
  notesCount?: number;
} 