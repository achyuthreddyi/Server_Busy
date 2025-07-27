'use client';

import { Student } from '../types';

interface StudentRowProps {
  student: Student;
  onStudentClick: (student: Student) => void;
}

const StudentRow = ({ student, onStudentClick }: StudentRowProps) => {
  const getPerformanceColor = (performance: number) => {
    if (performance >= 85) return 'text-green-600 bg-green-50';
    if (performance >= 75) return 'text-blue-600 bg-blue-50';
    if (performance >= 65) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return 'text-green-600';
    if (attendance >= 85) return 'text-blue-600';
    if (attendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return 'bg-green-100 text-green-800';
    if (grade.includes('B')) return 'bg-blue-100 text-blue-800';
    if (grade.includes('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <tr 
      className="hover:bg-gray-50 cursor-pointer transition-colors group"
      onClick={() => onStudentClick(student)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
            {student.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
              {student.name}
            </div>
            <div className="text-sm text-gray-500">Roll: {student.rollNo}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          student.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {student.status === 'present' ? '✅ Present' : '❌ Absent'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-medium ${getAttendanceColor(student.attendance)}`}>
          {student.attendance}%
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
          <div 
            className={`h-1.5 rounded-full ${
              student.attendance >= 95 ? 'bg-green-500' :
              student.attendance >= 85 ? 'bg-blue-500' :
              student.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${student.attendance}%` }}
          ></div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(student.performance)}`}>
          {student.performance}%
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(student.lastGrade)}`}>
          {student.lastGrade}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-indigo-600 hover:text-indigo-900 transition-colors hover:underline">
          View Details
        </button>
      </td>
    </tr>
  );
};

interface StudentTableProps {
  students: Student[];
  searchTerm: string;
  onStudentClick: (student: Student) => void;
  loading?: boolean;
}

export default function StudentTable({ students, searchTerm, onStudentClick, loading = false }: StudentTableProps) {
  // Filter students based on search
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Student', 'Status', 'Attendance', 'Performance', 'Last Grade', ''].map((header, i) => (
                  <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="ml-4">
                        <div className="h-4 w-24 bg-gray-300 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-16 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </td>
                  {[1, 2, 3, 4, 5].map((j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Student List</h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredStudents.length} of {students.length} students
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
          
          {/* Table Actions */}
          <div className="flex space-x-2">
            <button className="px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              📊 Export Data
            </button>
            <button className="px-3 py-2 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              📧 Send Report
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Grade
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <StudentRow 
                key={student.id} 
                student={student} 
                onStudentClick={onStudentClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredStudents.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-sm font-medium">No students found</p>
          <p className="text-xs text-gray-400 mt-1">
            {searchTerm ? `No students match "${searchTerm}"` : 'No students in this class'}
          </p>
        </div>
      )}
    </div>
  );
} 