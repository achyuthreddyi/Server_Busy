'use client';

import { ClassDetail } from '../types';

interface OverviewTabProps {
  classData: ClassDetail;
}

export default function OverviewTab({ classData }: OverviewTabProps) {
  const { metrics } = classData;

  return (
    <div className="space-y-6">
      {/* Class Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-800">{metrics.totalStudents}</div>
              <div className="text-gray-600 font-medium">Total Students</div>
            </div>
            <div className="text-3xl text-blue-500">👥</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{metrics.presentToday}</div>
              <div className="text-gray-600 font-medium">Present Today</div>
              <div className="text-sm text-gray-500">({metrics.attendancePercentage}%)</div>
            </div>
            <div className="text-3xl text-green-500">✅</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{metrics.averageAttendance}%</div>
              <div className="text-gray-600 font-medium">Avg Attendance</div>
            </div>
            <div className="text-3xl text-blue-500">📊</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{metrics.averagePerformance}%</div>
              <div className="text-gray-600 font-medium">Avg Performance</div>
            </div>
            <div className="text-3xl text-purple-500">📈</div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <span className="text-xl">📋</span>
            <span>Recent Activity</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-600 text-lg">📝</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">Quiz on Algebra completed</div>
                <div className="text-xs text-gray-500">25 students submitted • 2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="text-green-600 text-lg">✅</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">Attendance marked for today</div>
                <div className="text-xs text-gray-500">{metrics.presentToday}/{metrics.totalStudents} students present • 4 hours ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="text-yellow-600 text-lg">📋</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">Assignment on Geometry assigned</div>
                <div className="text-xs text-gray-500">Due next week • Yesterday</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <span className="text-xl">📈</span>
            <span>Performance Insights</span>
          </h3>
          <div className="space-y-4">
            {/* Performance Distribution */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Grade Distribution</span>
                <span>Current Class</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-8">A+/A</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '35%'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">35%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-8">B+/B</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '40%'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">40%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-8">C+/C</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '20%'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">20%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-8">Below</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: '5%'}}></div>
                  </div>
                  <span className="text-sm text-gray-600">5%</span>
                </div>
              </div>
            </div>

            {/* Attendance Trend */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Attendance Trend</span>
                <span className="text-green-600">↗ +2.3% this week</span>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-3">
                <div className="text-lg font-bold text-gray-800">{metrics.averageAttendance}%</div>
                <div className="text-sm text-gray-600">Weekly Average</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Class Schedule & Next Session */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <span className="text-xl">📅</span>
          <span>Upcoming Sessions</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600">Next Class</div>
            <div className="text-lg font-bold text-gray-800">{classData.nextClass}</div>
            <div className="text-sm text-indigo-600">{classData.schedule}</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-sm text-gray-600">Recent Activity</div>
            <div className="text-lg font-bold text-gray-800">Quiz Completed</div>
            <div className="text-sm text-green-600">{classData.recentActivity}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 