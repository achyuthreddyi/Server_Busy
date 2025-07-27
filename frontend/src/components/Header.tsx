import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
            {/* Logo Icon */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              {/* Small dot indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Kaksha
                </span>
                <span className="px-2 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-semibold rounded-full">
                  LM
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium tracking-wide">
                {/* Learning Management */}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5L15 17zm-6 0H4l3.5-3.5L9 17zm6-9a6 6 0 11-12 0 6 6 0 0112 0zM15 8v1a6 6 0 01-6 6v-1a6 6 0 016-6z" />
            </svg>
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-gray-800">Sarah Johnson</div>
              <div className="text-xs text-gray-500">Mathematics Teacher</div>
            </div>
            <button className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm hover:shadow-lg transition-shadow">
              SJ
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 