'use client';

import { ClassDetail } from '../types';

interface ClassHeaderProps {
  classData: ClassDetail;
  onTakeAttendance?: () => void;
  onViewReports?: () => void;
}

export default function ClassHeader({ classData, onTakeAttendance, onViewReports }: ClassHeaderProps) {
  const handleTakeAttendance = () => {
    console.log('📝 Take Attendance clicked for class:', classData.name);
    if (onTakeAttendance) {
      onTakeAttendance();
    } else {
      alert(`Take attendance for ${classData.name} - Feature coming soon!`);
    }
  };

  const handleViewReports = () => {
    console.log('📊 View Reports clicked for class:', classData.name);
    if (onViewReports) {
      onViewReports();
    } else {
      alert(`View reports for ${classData.name} - Feature coming soon!`);
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
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {classData.name}
            </h1>
            <p className="text-xl text-gray-600 font-medium mb-2">
              {classData.subject}
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="text-lg">🏫</span>
                <span className="font-medium">{classData.room}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-lg">📅</span>
                <span className="font-medium">{classData.schedule}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-lg">👥</span>
                <span className="font-medium">{classData.metrics.totalStudents} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-lg">👨‍🏫</span>
                <span className="font-medium">{classData.teacher}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button 
            onClick={handleTakeAttendance}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-300 flex items-center space-x-2 group"
          >
            <span className="group-hover:scale-110 transition-transform">📝</span>
            <span className="font-medium">Take Attendance</span>
          </button>
          <button 
            onClick={handleViewReports}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:shadow-md transition-all duration-300 flex items-center space-x-2 group"
          >
            <span className="group-hover:scale-110 transition-transform">📊</span>
            <span className="font-medium">View Reports</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="mt-6 pt-6 border-t border-gray-200 border-opacity-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-800">{classData.metrics.presentToday}</div>
            <div className="text-xs text-gray-600">Present Today</div>
            <div className="text-xs text-gray-500">({classData.metrics.attendancePercentage}%)</div>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-800">{classData.metrics.averageAttendance}%</div>
            <div className="text-xs text-gray-600">Avg Attendance</div>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-800">{classData.metrics.averagePerformance}%</div>
            <div className="text-xs text-gray-600">Avg Performance</div>
          </div>
          <div className="bg-white bg-opacity-60 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-800">{classData.nextClass}</div>
            <div className="text-xs text-gray-600">Next Class</div>
          </div>
        </div>
      </div>
    </div>
  );
} 