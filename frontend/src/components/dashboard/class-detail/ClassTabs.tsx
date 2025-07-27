'use client';

import { TabType, TabInfo } from '../types';

const tabs: TabInfo[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'students', label: 'Students', icon: '👥' },
  { id: 'attendance', label: 'Attendance', icon: '✅' },
  { id: 'performance', label: 'Performance', icon: '📈' },
  { id: 'assignments', label: 'Assignments', icon: '📝' }
];

interface ClassTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  studentCount?: number;
}

export default function ClassTabs({ activeTab, onTabChange, studentCount }: ClassTabsProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={`text-lg transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.id === 'students' && studentCount && (
                  <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                    isActive 
                      ? 'bg-indigo-100 text-indigo-600' 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                  }`}>
                    {studentCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
} 