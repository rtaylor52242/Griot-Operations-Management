
import React, { useEffect, useState } from 'react';
import { HomeIcon, UsersIcon, FundraisingIcon, TicketIcon, ChartBarIcon, CogIcon, LogoutIcon, DocumentIcon, QuestionMarkCircleIcon, MessageIcon, ChatIcon } from './icons';
import { subscribe, undo, redo, getUndoStack, getRedoStack } from '../services/historyService';

interface SidebarProps {
    currentView: string;
    onNavigate: (view: string) => void;
    onSignOut: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onSignOut }) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [undoLabel, setUndoLabel] = useState('');
  const [redoLabel, setRedoLabel] = useState('');

  useEffect(() => {
      // Subscribe to history changes to update button states
      const unsubscribe = subscribe(() => {
          const undoStack = getUndoStack();
          const redoStack = getRedoStack();
          setCanUndo(undoStack.length > 0);
          setCanRedo(redoStack.length > 0);
          setUndoLabel(undoStack.length > 0 ? `Undo ${undoStack[undoStack.length - 1].name}` : 'Undo');
          setRedoLabel(redoStack.length > 0 ? `Redo ${redoStack[redoStack.length - 1].name}` : 'Redo');
      });
      return unsubscribe;
  }, []);

  const navItems = [
    { id: 'dashboard', icon: HomeIcon, label: 'Dashboard' },
    { id: 'memberships', icon: UsersIcon, label: 'Memberships' },
    { id: 'fundraising', icon: FundraisingIcon, label: 'Fundraising' },
    { id: 'ticketing', icon: TicketIcon, label: 'Ticketing' },
    { id: 'reports', icon: ChartBarIcon, label: 'Reports' },
    { id: 'documents', icon: DocumentIcon, label: 'Documents' },
    { id: 'chat', icon: ChatIcon, label: 'Ask a Griot' },
    { id: 'feedback', icon: MessageIcon, label: 'Feedback' },
    { id: 'help', icon: QuestionMarkCircleIcon, label: 'Help' },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800 print:hidden">
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
       
       {/* Undo/Redo Controls */}
       <div className="px-4 py-2 border-t border-gray-700 flex space-x-2">
           <button
                onClick={undo}
                disabled={!canUndo}
                className={`flex-1 py-1 text-xs rounded border border-gray-600 transition-colors ${canUndo ? 'text-white hover:bg-gray-700' : 'text-gray-500 cursor-not-allowed'}`}
                title={undoLabel}
           >
               ↶ Undo
           </button>
           <button
                onClick={redo}
                disabled={!canRedo}
                className={`flex-1 py-1 text-xs rounded border border-gray-600 transition-colors ${canRedo ? 'text-white hover:bg-gray-700' : 'text-gray-500 cursor-not-allowed'}`}
                title={redoLabel}
           >
               redo ↷
           </button>
       </div>

       <div className="px-2 py-4 border-t border-gray-700">
            <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigate('settings'); }}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-300 ${
                    currentView === 'settings'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-100 hover:bg-gray-700 hover:text-white'
                  }`}
            >
                <CogIcon className="w-6 h-6" />
                <span className="mx-4 font-medium">Settings</span>
            </a>
            <button 
                onClick={(e) => { e.preventDefault(); onSignOut(); }}
                className="flex w-full items-center px-4 py-2 mt-2 rounded-lg transition-colors duration-300 text-gray-100 hover:bg-red-600 hover:text-white"
            >
                <LogoutIcon className="w-6 h-6" />
                <span className="mx-4 font-medium">Sign Out</span>
            </button>
        </div>
    </div>
  );
};

export default Sidebar;
