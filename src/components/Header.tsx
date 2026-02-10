import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
      {/* Mobile Menu Button & Title */}
      <div className="flex items-center">
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Mobile Logo (only visible on mobile) */}
        <div className="md:hidden ml-4 flex items-center">
           <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-2 shadow-sm">
            E
          </div>
          <span className="text-lg font-bold text-gray-900">ExplicaAI</span>
        </div>

        {/* Desktop Page Title / Breadcrumbs (Optional) */}
        <div className="hidden md:block text-sm text-gray-500">
           {/* Could be breadcrumbs here */}
        </div>
      </div>

      {/* Right Section: User Avatar */}
      <div className="flex items-center space-x-4">
        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs md:hidden">
            AD
        </div>
      </div>
    </header>
  );
};
