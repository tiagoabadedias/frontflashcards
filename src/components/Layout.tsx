import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { OnboardingTour } from './OnboardingTour';
import { X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Home, Target, HelpCircle, Users, BarChart3, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Trilhas', href: '/campaigns', icon: Target },
  { name: 'Questões', href: '/questions', icon: HelpCircle },
  { name: 'Grupos', href: '/groups', icon: Users },
  { name: 'Estatísticas', href: '/stats', icon: BarChart3 },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <OnboardingTour />
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 flex flex-col w-72 bg-white shadow-xl transform transition-transform">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
               <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3 shadow-sm">
                    F
                  </div>
                  <span className="text-lg font-bold text-gray-900">FlashManager</span>
               </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="mr-4 h-6 w-6 text-gray-400" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
            
            <div className="p-4 border-t border-gray-100">
               <button className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors">
                  <LogOut className="mr-4 h-6 w-6" />
                  Sair
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-200">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
