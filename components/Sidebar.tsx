
import React from 'react';
import { HomeIcon, UsersIcon, FundraisingIcon, TicketIcon, ChartBarIcon, CogIcon } from './icons';

interface SidebarProps {
    currentView: string;
    onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', icon: HomeIcon, label: 'Dashboard' },
    { id: 'memberships', icon: UsersIcon, label: 'Memberships' },
    { id: 'fundraising', icon: FundraisingIcon, label: 'Fundraising' },
    { id: 'ticketing', icon: TicketIcon, label: 'Ticketing' },
    { id: 'reports', icon: ChartBarIcon, label: 'Reports' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white font-bold uppercase text-lg">GRIOT</span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 bg-gray-800">
          {navItems.map((item) => (
            <a
              key={item.id}
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
              className={`flex items-center px-4 py-2 mt-2 rounded-lg transition-colors duration-300 ${
                currentView === item.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-100 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="mx-4 font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
       <div className="px-2 py-4">
            <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigate('settings'); }}
                className={`flex items-center px-4 py-2 mt-2 rounded-lg transition-colors duration-300 ${
                    currentView === 'settings'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-100 hover:bg-gray-700 hover:text-white'
                  }`}
            >
                <CogIcon className="w-6 h-6" />
                <span className="mx-4 font-medium">Settings</span>
            </a>
        </div>
    </div>
  );
};

export default Sidebar;
