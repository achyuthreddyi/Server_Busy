'use client';

import { TabType, TabInfo } from './types';

interface LessonPlanTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function LessonPlanTabs({ activeTab, onTabChange }: LessonPlanTabsProps) {
  const tabs: TabInfo[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'lessons', label: 'Lessons', icon: '📚' },
    { id: 'resources', label: 'Resources', icon: '📁' },
    { id: 'assessment', label: 'Assessment', icon: '📝' }
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
} 