'use client';

import { ClassDetail } from '../types';

interface TakeClassHeaderProps {
  classData: ClassDetail;
  currentView: 'quick-view' | 'live-assist';
}

export default function TakeClassHeader({ classData, currentView }: TakeClassHeaderProps) {
  const getViewTitle = (view: 'quick-view' | 'live-assist') => {
    switch (view) {
      case 'quick-view':
        return 'Quick View';
      case 'live-assist':
        return 'Live Assist';
      default:
        return 'Take Class';
    }
  };

  const getViewDescription = (view: 'quick-view' | 'live-assist') => {
    switch (view) {
      case 'quick-view':
        return 'Review lesson plan and prepare for class';
      case 'live-assist':
        return 'AI-powered teaching assistance for live class';
      default:
        return 'Prepare and conduct your class';
    }
  };

  return (
    <div className={`${classData.color} rounded-xl p-6 border-2 mb-8 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className={`text-4xl ${classData.iconColor} drop-shadow-sm`}>
            {classData.icon}
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">
                {classData.name}
              </h1>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                {getViewTitle(currentView)}
              </span>
            </div>
            <p className="text-xl text-gray-600 font-medium mb-2">
              {classData.subject}
            </p>
            <p className="text-gray-600 mb-3">
              {getViewDescription(currentView)}
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="text-lg">🏫</span>
                <span className="font-medium">{classData.room}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-lg">👥</span>
                <span className="font-medium">{classData.metrics.totalStudents} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-lg">⏰</span>
                <span className="font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-lg">📅</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="flex flex-col space-y-3">
          <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center min-w-[120px]">
            <div className="text-lg font-bold text-green-600">{classData.metrics.presentToday}</div>
            <div className="text-xs text-gray-600">Expected Present</div>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center min-w-[120px]">
            <div className="text-lg font-bold text-gray-800">{classData.metrics.averagePerformance}%</div>
            <div className="text-xs text-gray-600">Class Average</div>
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="mt-6 pt-6 border-t border-gray-200 border-opacity-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-60 rounded-lg p-3">
            <div className="text-sm text-gray-600">Next Class</div>
            <div className="font-semibold text-gray-800">{classData.nextClass}</div>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-3">
            <div className="text-sm text-gray-600">Schedule</div>
            <div className="font-semibold text-gray-800">{classData.schedule}</div>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-3">
            <div className="text-sm text-gray-600">Recent Activity</div>
            <div className="font-semibold text-gray-800 truncate">{classData.recentActivity}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 