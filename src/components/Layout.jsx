import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center">
                <CalendarDaysIcon className="h-8 w-8 text-indigo-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">EventChey</span>
              </Link>

              <div className="hidden md:flex gap-6">
                <Link
                  to="/events"
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/events' || location.pathname === '/'
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Events
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Welcome, Guest</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium text-sm">G</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 EventChey. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <button className="hover:text-indigo-600 transition-colors">
                Privacy Policy
              </button>
              <button className="hover:text-indigo-600 transition-colors">
                Terms of Service
              </button>
              <button className="hover:text-indigo-600 transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
