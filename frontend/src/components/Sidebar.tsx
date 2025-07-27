'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: 'Knowledge Base',
      href: '/knowledge-base',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Lesson Planner',
      href: '/lesson-planner',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 012 0v4h6V3a1 1 0 112 0v4h2a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1h2zM4 8v12h16V8H4zm4 6h8m-8 4h4" />
        </svg>
      )
    },
    {
      name: 'AI Audit',
      href: '/ai-audit',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
  ];

  return (
    <>
      {/* Hover trigger zone - keep original behavior */}
      <div 
        className="fixed left-0 top-0 w-6 h-full z-40"
        onMouseEnter={() => {
          setIsVisible(true);
          setIsHovering(true);
        }}
        onMouseLeave={() => setIsHovering(false)}
      />
      
      {/* Enhanced visual indicator - more prominent and noticeable */}
      <div 
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 z-30 transition-all duration-300 ${
          isVisible ? 'opacity-0' : ''
        }`}
      >
        {/* Main indicator bar with gradient and glow */}
        <div className={`w-2 h-24 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500 rounded-r-lg shadow-lg transition-all duration-300 ${
          isHovering ? 'opacity-90 translate-x-0 w-3 h-28' : 'opacity-60 -translate-x-1 pulse'
        }`} />
        
        {/* Floating navigation hint */}
        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
          !isVisible && !isHovering ? 'opacity-80 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}>
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-md shadow-lg whitespace-nowrap">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="font-medium"></span>
            </div>
            <div className="text-xs text-gray-300 mt-1"></div>
          </div>
          {/* Arrow pointing to the indicator */}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
        </div>
        
        {/* Subtle animated dots to draw more attention */}
        <div className={`absolute -right-1 top-1/2 transform -translate-y-1/2 ${
          !isVisible ? 'opacity-40' : 'opacity-0'
        }`}>
          <div className="flex flex-col space-y-1">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
            <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
      
      {/* Sidebar - keep original behavior */}
      <aside 
        className={`fixed left-0 top-0 bg-white border-r border-gray-200 w-64 h-full shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseLeave={() => {
          setIsVisible(false);
          setIsHovering(false);
        }}
      >
        <div className="p-6 pt-20">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsVisible(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
} 