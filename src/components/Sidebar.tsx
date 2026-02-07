import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Target, HelpCircle, Users, BarChart3, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Campanhas', href: '/campaigns', icon: Target },
  { name: 'Questões', href: '/questions', icon: HelpCircle },
  { name: 'Grupos', href: '/groups', icon: Users },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-100">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3 shadow-sm">
          E
        </div>
        <span className="text-lg font-bold text-gray-900 tracking-tight">ExplicaAI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`mr-3 h-5 w-5 transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section (User/Logout) */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100 mb-3">
          {user?.avatar && !imageError ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-8 h-8 rounded-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Usuário'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'email@exemplo.com'}</p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );
};
