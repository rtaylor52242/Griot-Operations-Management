
import React from 'react';
import { HomeIcon, UsersIcon, FundraisingIcon, TicketIcon, ChartBarIcon, CogIcon } from './icons';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: HomeIcon, label: 'Dashboard', active: false },
    { icon: UsersIcon, label: 'Memberships', active: true },
    { icon: FundraisingIcon, label: 'Fundraising', active: false },
    { icon: TicketIcon, label: 'Ticketing', active: false },
    { icon: ChartBarIcon, label: 'Reports', active: false },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <span className="text-white font-bold uppercase text-lg">GRIOT</span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 bg-gray-800">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-4 py-2 mt-2 text-gray-100 rounded-lg transition-colors duration-300 ${
                item.active
                  ? 'bg-gray-700'
                  : 'hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="mx-4 font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
       <div className="px-2 py-4">
            <a href="#" className="flex items-center px-4 py-2 mt-2 text-gray-100 rounded-lg hover:bg-gray-700">
                <CogIcon className="w-6 h-6" />
                <span className="mx-4 font-medium">Settings</span>
            </a>
        </div>
    </div>
  );
};

export default Sidebar;
