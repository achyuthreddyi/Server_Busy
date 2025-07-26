'use client';

import { useState, useEffect } from 'react';
import { LessonPlan, Lesson } from '../types';

interface LessonsTabProps {
  lessonPlan: LessonPlan;
  onEditLesson?: (lesson: Lesson) => void;
}

interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  color: string;
  icon: string;
  bgColor: string;
  borderColor: string;
}

interface NewLessonForm {
  title: string;
  date: string;
  duration: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

const kanbanColumns: KanbanColumn[] = [
  {
    id: 'scheduled',
    title: 'Scheduled',
    status: 'scheduled',
    color: 'text-blue-700',
    icon: '📅',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    status: 'in-progress',
    color: 'text-yellow-700',
    icon: '🔄',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  {
    id: 'completed',
    title: 'Completed',
    status: 'completed',
    color: 'text-green-700',
    icon: '✅',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  }
];

export default function LessonsTab({ lessonPlan, onEditLesson }: LessonsTabProps) {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [draggedLesson, setDraggedLesson] = useState<Lesson | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createInColumn, setCreateInColumn] = useState<string>('scheduled');
  const [newLessonForm, setNewLessonForm] = useState<NewLessonForm>({
    title: '',
    date: '',
    duration: '45 minutes',
    status: 'scheduled'
  });

  // Initialize and update lessons when lessonPlan changes
  useEffect(() => {
    const initializeLessons = () => {
      const allLessons: Lesson[] = [];
      const seenIds = new Set<number>();

      // Get lessons from consolidated data first
      const upcoming = lessonPlan.upcomingLessons || [];
      const recent = lessonPlan.recentLessons || [];
      
      // Add upcoming lessons
      upcoming.forEach(lesson => {
        if (!seenIds.has(lesson.id)) {
          allLessons.push(lesson);
          seenIds.add(lesson.id);
        }
      });

      // Add recent lessons (avoid duplicates)
      recent.forEach(lesson => {
        if (!seenIds.has(lesson.id)) {
          allLessons.push(lesson);
          seenIds.add(lesson.id);
        }
      });

      // Also get lessons from class-specific data if available
      if (lessonPlan.classData) {
        lessonPlan.classData.forEach(classData => {
          // Add upcoming lessons from class data
          (classData.upcomingLessons || []).forEach(lesson => {
            if (!seenIds.has(lesson.id)) {
              allLessons.push(lesson);
              seenIds.add(lesson.id);
            }
          });

          // Add recent lessons from class data
          (classData.recentLessons || []).forEach(lesson => {
            if (!seenIds.has(lesson.id)) {
              allLessons.push(lesson);
              seenIds.add(lesson.id);
            }
          });
        });
      }

      console.log('Initialized lessons:', allLessons.length, 'unique lessons');
      setLessons(allLessons);
    };

    initializeLessons();
  }, [lessonPlan]);

  // Get lessons filtered by selected class - ALWAYS use local state
  const getFilteredLessons = (): Lesson[] => {
    if (selectedClass === 'all') {
      return lessons;
    }

    // For class-specific filtering, we'll show all lessons
    // (In a real app, lessons would have class associations in the data model)
    // For now, we'll show all lessons regardless of class selection
    return lessons;
  };

  // Group lessons by status from filtered lessons
  const getLessonsByStatus = (status: string): Lesson[] => {
    const filteredLessons = getFilteredLessons();
    const statusLessons = filteredLessons.filter(lesson => lesson.status === status);
    
    // Remove any duplicates based on ID (extra safety)
    const uniqueLessons = statusLessons.filter((lesson, index, array) => 
      array.findIndex(l => l.id === lesson.id) === index
    );

    console.log(`Status ${status} has ${uniqueLessons.length} lessons for class ${selectedClass}`);
    return uniqueLessons;
  };

  // Create new lesson functionality
  const handleCreateLesson = (columnStatus: string) => {
    setCreateInColumn(columnStatus);
    setNewLessonForm({
      title: '',
      date: '',
      duration: '45 minutes',
      status: columnStatus as 'scheduled' | 'in-progress' | 'completed'
    });
    setShowCreateModal(true);
  };

  const handleSaveNewLesson = () => {
    if (!newLessonForm.title.trim() || !newLessonForm.date) {
      alert('Please fill in the lesson title and date');
      return;
    }

    // Generate a unique ID (in a real app, this would come from the backend)
    const newId = Math.max(...lessons.map(l => l.id), 0) + 1;

    const newLesson: Lesson = {
      id: newId,
      title: newLessonForm.title.trim(),
      date: newLessonForm.date,
      duration: newLessonForm.duration,
      status: newLessonForm.status
    };

    // Add the new lesson to local state
    setLessons(prevLessons => [...prevLessons, newLesson]);

    console.log('✅ Created new lesson:', newLesson);

    // TODO: Make API call to save to backend
    // await createLesson(newLesson);

    // Reset form and close modal
    setNewLessonForm({
      title: '',
      date: '',
      duration: '45 minutes',
      status: 'scheduled'
    });
    setShowCreateModal(false);
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
    setNewLessonForm({
      title: '',
      date: '',
      duration: '45 minutes',
      status: 'scheduled'
    });
  };

  // Drag and drop handlers - FIXED
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, lesson: Lesson) => {
    console.log('🔥 Drag started for lesson:', lesson.title, 'ID:', lesson.id);
    setDraggedLesson(lesson);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', lesson.id.toString());
    
    // Add visual feedback
    setTimeout(() => {
      (e.target as HTMLElement).style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('🔚 Drag ended');
    (e.target as HTMLElement).style.opacity = '1';
    setDraggedLesson(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, columnStatus: string) => {
    e.preventDefault();
    setDragOverColumn(columnStatus);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Only clear drag over if we're actually leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    console.log('📍 Drop event triggered, target status:', targetStatus);
    
    if (draggedLesson && draggedLesson.status !== targetStatus) {
      console.log(`🚀 Moving lesson "${draggedLesson.title}" (ID: ${draggedLesson.id}) from ${draggedLesson.status} to ${targetStatus}`);
      
      // Update the lesson status in local state
      setLessons(prevLessons => {
        const updatedLessons = prevLessons.map(lesson => 
          lesson.id === draggedLesson.id 
            ? { ...lesson, status: targetStatus as 'scheduled' | 'in-progress' | 'completed' }
            : lesson
        );
        
        console.log('📊 Updated lessons state:', updatedLessons.length, 'total lessons');
        return updatedLessons;
      });
      
      // TODO: Make API call to update in backend
      // await updateLessonStatus(draggedLesson.id, targetStatus);
      
      console.log('✅ Lesson status updated successfully!');
    }
    
    setDraggedLesson(null);
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (onEditLesson) {
      onEditLesson(lesson);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 h-full">
      {/* Header with Class Selector */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 flex-shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📋</div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Lesson Management Board</h2>
              <p className="text-gray-600">Drag lessons between columns to update their status</p>
              {/* Debug info */}
              <p className="text-xs text-gray-500 mt-1">
                Total lessons: {lessons.length} | Filtered: {getFilteredLessons().length} | Class: {selectedClass}
              </p>
            </div>
          </div>

          {/* Class Selector */}
          {lessonPlan.classes.length > 1 && (
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 min-w-64">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎯 Select Class:
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium bg-white"
              >
                <option value="all">📚 All Classes</option>
                {lessonPlan.classes.map((className) => (
                  <option key={className} value={className}>
                    🎓 {className}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {kanbanColumns.map((column) => {
            const count = getLessonsByStatus(column.status).length;
            return (
              <div key={column.id} className={`${column.bgColor} rounded-lg p-3 border ${column.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{column.icon}</span>
                    <span className={`font-semibold ${column.color}`}>{column.title}</span>
                  </div>
                  <span className={`text-lg font-bold ${column.color}`}>{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanban Board - Fixed Height with Scrollable Columns */}
      <div className="flex-1 max-h-[calc(100vh-400px)] min-h-[500px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {kanbanColumns.map((column) => {
            const columnLessons = getLessonsByStatus(column.status);
            const isDragOver = dragOverColumn === column.status;
            
            return (
              <div
                key={column.id}
                className={`${column.bgColor} rounded-xl border-2 ${column.borderColor} transition-all duration-200 ${
                  isDragOver ? 'border-indigo-400 bg-indigo-100 shadow-lg scale-105' : ''
                } flex flex-col h-full`}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, column.status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                {/* Column Header - Fixed */}
                <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{column.icon}</span>
                    <h3 className={`font-bold text-lg ${column.color}`}>{column.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full bg-white ${column.color} text-sm font-semibold border ${column.borderColor}`}>
                      {columnLessons.length}
                    </div>
                    {/* Create Lesson Button */}
                    <button
                      onClick={() => handleCreateLesson(column.status)}
                      className={`p-2 bg-white ${column.color} rounded-lg border ${column.borderColor} hover:shadow-md transition-all duration-200 group`}
                      title={`Create new ${column.title.toLowerCase()} lesson`}
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Drop Zone Indicator - Fixed */}
                {isDragOver && draggedLesson && (
                  <div className="mx-4 mb-3 p-4 border-2 border-dashed border-indigo-400 rounded-lg bg-indigo-50 flex-shrink-0">
                    <div className="text-center text-indigo-600 font-medium">
                      🎯 Drop "{draggedLesson.title}" here to mark as {column.title.toLowerCase()}
                    </div>
                  </div>
                )}

                {/* Lesson Cards - Scrollable */}
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                  <div className="space-y-3 min-h-full">
                    {columnLessons.length > 0 ? (
                      columnLessons.map((lesson, index) => (
                        <div
                          key={`lesson-${lesson.id}-${column.status}-${index}`}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, lesson)}
                          onDragEnd={handleDragEnd}
                          className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-all duration-200 group select-none flex-shrink-0 ${
                            draggedLesson?.id === lesson.id ? 'opacity-50 scale-95' : ''
                          }`}
                        >
                          {/* Drag Handle */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors mb-1">
                                {lesson.title}
                                <span className="text-xs text-gray-500 ml-2">(ID: {lesson.id})</span>
                              </h4>
                              <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <span className="flex items-center space-x-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{lesson.duration}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012 0v4h6V3a1 1 0 112 0v4h2a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1h2z" />
                                  </svg>
                                  <span>{formatTime(lesson.date)}</span>
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {/* Status Indicator */}
                              <div className={`w-3 h-3 rounded-full ${
                                lesson.status === 'completed' ? 'bg-green-500' :
                                lesson.status === 'in-progress' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}></div>
                              {/* Drag Handle Icon */}
                              <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Lesson Date - Formatted nicely */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500 font-medium">
                              {formatDate(lesson.date)}
                            </div>
                            {selectedClass !== 'all' && (
                              <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {selectedClass}
                              </div>
                            )}
                          </div>

                          {/* Click to edit indicator */}
                          <div 
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLessonClick(lesson);
                            }}
                          >
                            <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded transition-colors">
                              ✏️ Edit
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 h-full flex flex-col justify-center">
                        <div className="text-4xl mb-2">{column.icon}</div>
                        <p className="text-sm font-medium">No {column.title.toLowerCase()} lessons</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {selectedClass !== 'all' ? `for ${selectedClass}` : 'in any class'}
                        </p>
                        
                        {/* Create lesson button for empty columns */}
                        <button 
                          onClick={() => handleCreateLesson(column.status)}
                          className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                        >
                          ➕ Create {column.title} Lesson
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Column Footer - Fixed */}
                {columnLessons.length > 0 && (
                  <div className="px-4 pb-4 pt-3 border-t border-gray-200 flex-shrink-0">
                    <div className="text-xs text-gray-500 text-center">
                      {columnLessons.length} lesson{columnLessons.length !== 1 ? 's' : ''} • 
                      Drag to move between columns
                      {columnLessons.length > 5 && (
                        <span className="block mt-1 text-indigo-600">
                          ↕️ Scroll to see more lessons
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Lesson Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                ➕ Create New Lesson
              </h3>
              <button
                onClick={handleCancelCreate}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-4">
              {/* Lesson Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Lesson Title *
                </label>
                <input
                  type="text"
                  value={newLessonForm.title}
                  onChange={(e) => setNewLessonForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter lesson title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Lesson Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Lesson Date *
                </label>
                <input
                  type="datetime-local"
                  value={newLessonForm.date}
                  onChange={(e) => setNewLessonForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⏱️ Duration
                </label>
                <select
                  value={newLessonForm.duration}
                  onChange={(e) => setNewLessonForm(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="30 minutes">30 minutes</option>
                  <option value="45 minutes">45 minutes</option>
                  <option value="60 minutes">60 minutes</option>
                  <option value="90 minutes">90 minutes</option>
                  <option value="120 minutes">120 minutes</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📊 Status
                </label>
                <select
                  value={newLessonForm.status}
                  onChange={(e) => setNewLessonForm(prev => ({ ...prev, status: e.target.value as 'scheduled' | 'in-progress' | 'completed' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="scheduled">📅 Scheduled</option>
                  <option value="in-progress">🔄 In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancelCreate}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNewLesson}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  ✅ Create Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Help Text - Fixed at bottom */}
      {/* <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex-shrink-0">
        <div className="flex items-start space-x-3">
          <div className="text-xl">💡</div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">How to use the Lesson Board</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Create:</strong> Click the "+" button in any column header to create a new lesson in that status</li>
              <li>• <strong>Scheduled:</strong> Lessons planned for future dates</li>
              <li>• <strong>In Progress:</strong> Lessons currently being taught or prepared</li>
              <li>• <strong>Completed:</strong> Lessons that have been finished</li>
              <li>• <strong>Drag & Drop:</strong> Click and drag lesson cards between columns to update status</li>
              <li>• <strong>Edit:</strong> Hover over a card and click the "Edit" button to modify lesson details</li>
              <li>• <strong>Scroll:</strong> When columns have many lessons, scroll within each column to see more</li>
            </ul>
          </div>
        </div>
      </div> */}
    </div>
  );
} 