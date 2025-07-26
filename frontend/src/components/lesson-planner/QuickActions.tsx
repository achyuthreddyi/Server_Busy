'use client';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  variant: 'primary' | 'secondary';
  onClick?: () => void;
}

interface QuickActionsProps {
  onCreateNew?: () => void;
  onViewCalendar?: () => void;
  onProgressReport?: () => void;
  onImportCurriculum?: () => void;
}

export default function QuickActions({
  onCreateNew,
  onViewCalendar,
  onProgressReport,
  onImportCurriculum
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'create',
      label: '+ Create New Lesson Plan',
      icon: '➕',
      variant: 'primary',
      onClick: onCreateNew
    },
    {
      id: 'calendar',
      label: '📅 View Calendar',
      icon: '📅',
      variant: 'secondary',
      onClick: onViewCalendar
    },
    {
      id: 'report',
      label: '📊 Progress Report',
      icon: '📊',
      variant: 'secondary',
      onClick: onProgressReport
    },
    {
      id: 'import',
      label: '🔄 Import Curriculum',
      icon: '🔄',
      variant: 'secondary',
      onClick: onImportCurriculum
    }
  ];

  const getButtonClasses = (variant: 'primary' | 'secondary') => {
    if (variant === 'primary') {
      return 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors';
    }
    return 'px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors';
  };

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={getButtonClasses(action.variant)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
} 