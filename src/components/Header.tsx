import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

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

      {/* Right Section: Search & Notifications */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex relative">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        
        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs md:hidden">
            AD
        </div>
      </div>
    </header>
  );
};
