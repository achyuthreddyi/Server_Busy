'use client';

import { TeacherClass } from './types';
import ClassCard from './ClassCard';

interface ClassGridProps {
  classes: TeacherClass[];
  searchTerm: string;
  loading: boolean;
}

export default function ClassGrid({ classes, searchTerm, loading }: ClassGridProps) {
  // Filter classes based on search
  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Loading skeleton */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-200 rounded-xl p-6 border-2 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded"></div>
                <div>
                  <div className="h-6 w-24 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 w-16 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-8 w-12 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="h-5 w-8 bg-gray-300 rounded mb-1"></div>
                <div className="h-3 w-16 bg-gray-300 rounded"></div>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="h-5 w-12 bg-gray-300 rounded mb-1"></div>
                <div className="h-3 w-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClasses.map((classData) => (
          <ClassCard key={classData.id} classData={classData} />
        ))}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No classes found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? `No classes match "${searchTerm}". Try adjusting your search terms.`
              : "No classes available at the moment."
            }
          </p>
        </div>
      )}
    </>
  );
} 