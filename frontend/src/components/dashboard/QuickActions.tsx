'use client';

import { QuickAction } from './types';

interface QuickActionsProps {
  actions?: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  // Default actions if none provided
  const defaultActions: QuickAction[] = [
    {
      id: 'attendance',
      title: 'Take Attendance',
      description: 'Mark today\'s attendance',
      icon: '📝',
      onClick: () => {
        console.log('📝 Take Attendance clicked');
        alert('Attendance feature coming soon!');
      }
    },
    {
      id: 'grade',
      title: 'Grade Assignments',
      description: 'Review pending work',
      icon: '📊',
      onClick: () => {
        console.log('📊 Grade Assignments clicked');
        alert('Assignment grading feature coming soon!');
      }
    },
    {
      id: 'plan',
      title: 'Plan Lessons',
      description: 'Create lesson plans',
      icon: '📚',
      onClick: () => {
        console.log('📚 Plan Lessons clicked');
        // Navigate to lesson planner
        window.location.href = '/lesson-planner';
      }
    }
  ];

  const actionItems = actions || defaultActions;

  return (
    <div className="mt-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <div className="text-2xl">⚡</div>
        <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actionItems.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all duration-300 group transform hover:scale-105"
          >
            <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
              {action.icon}
            </div>
            <div className="text-left flex-1">
              <div className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                {action.title}
              </div>
              <div className="text-sm text-gray-600 group-hover:text-indigo-500 transition-colors">
                {action.description}
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Additional Actions Row */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            📈 View Reports
          </button>
          <button className="px-4 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            📧 Send Updates
          </button>
          <button className="px-4 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            📋 Create Assignment
          </button>
          <button className="px-4 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
            📞 Contact Parents
          </button>
        </div>
      </div>
    </div>
  );
} 