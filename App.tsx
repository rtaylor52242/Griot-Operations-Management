
import React, { useState, Suspense, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MembershipDashboard from './components/MembershipDashboard';
import Dashboard from './components/Dashboard';
import Fundraising from './components/Fundraising';
import Ticketing from './components/Ticketing';
import Reports from './components/Reports';
import Settings from './components/Settings';
import ActivityLog from './components/ActivityLog';
import Login from './components/Login';
import Documents from './components/Documents';
import Help from './components/Help';
import Feedback from './components/Feedback';
import ThemeSelector, { themes } from './components/ThemeSelector';
import { Doc, User } from './types';
import { logActivity, setCurrentUserSession } from './services/activityService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [initialAction, setInitialAction] = useState<string | undefined>(undefined);
  
  // Theme State
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Lifted state for Documents to persist across navigation
  const [docs, setDocs] = useState<Doc[]>([
      { id: '1', name: 'Membership_Guidelines_2024.pdf', type: 'application/pdf', size: '2.4 MB', date: '2024-10-01', url: '#' },
      { id: '2', name: 'Exhibit_Layout_Plan_v2.jpg', type: 'image/jpeg', size: '4.1 MB', date: '2024-10-15', url: '#' },
      { id: '3', name: 'Fundraising_Deck_Q4.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', size: '8.5 MB', date: '2024-10-20', url: '#' },
  ]);

  // Apply Theme Effect
  useEffect(() => {
    const theme = themes.find(t => t.id === currentTheme) || themes[0];
    const root = document.documentElement;
    
    // Apply Brand Colors
    root.style.setProperty('--color-brand-primary', theme.primary);
    root.style.setProperty('--color-brand-secondary', theme.secondary);

    // Apply Dark Mode Colors
    if (isDarkMode) {
        root.style.setProperty('--color-gray-50', '17 24 39');     
        root.style.setProperty('--color-gray-100', '31 41 55');    
        root.style.setProperty('--color-gray-200', '55 65 81');    
        root.style.setProperty('--color-gray-300', '75 85 99');    
        root.style.setProperty('--color-gray-400', '107 114 128'); 
        root.style.setProperty('--color-gray-500', '156 163 175'); 
        root.style.setProperty('--color-gray-600', '209 213 219'); 
        root.style.setProperty('--color-gray-700', '229 231 235'); 
        root.style.setProperty('--color-gray-800', '243 244 246'); 
        root.style.setProperty('--color-gray-900', '249 250 251'); 
        root.style.setProperty('--color-white', '31 41 55');       
        root.style.setProperty('--color-black', '255 255 255');    
    } else {
        root.style.setProperty('--color-gray-50', '249 250 251');
        root.style.setProperty('--color-gray-100', '243 244 246');
        root.style.setProperty('--color-gray-200', '229 231 235');
        root.style.setProperty('--color-gray-300', '209 213 219');
        root.style.setProperty('--color-gray-400', '156 163 175');
        root.style.setProperty('--color-gray-500', '107 114 128');
        root.style.setProperty('--color-gray-600', '75 85 99');
        root.style.setProperty('--color-gray-700', '55 65 81');
        root.style.setProperty('--color-gray-800', '31 41 55');
        root.style.setProperty('--color-gray-900', '17 24 39');
        root.style.setProperty('--color-white', '255 255 255');
        root.style.setProperty('--color-black', '0 0 0');
    }

  }, [currentTheme, isDarkMode]);

  const handleNavigate = (view: string, action?: string) => {
    setInitialAction(action);
    setCurrentView(view);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentUserSession(user); // Update service state
    setIsAuthenticated(true);
    logActivity('Login', `User ${user.username} logged in`, 'system');
  };

  const handleSignOut = () => {
    logActivity('Logout', `User ${currentUser?.username || 'Unknown'} logged out`, 'system');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'memberships':
        return <MembershipDashboard initialView={initialAction} />;
      case 'fundraising':
        return <Fundraising initialView={initialAction} />;
      case 'ticketing':
        return <Ticketing initialView={initialAction} />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'activity':
        return <ActivityLog />;
      case 'documents':
        return <Documents docs={docs} setDocs={setDocs} />;
      case 'help':
        return <Help />;
      case 'feedback':
        return <Feedback />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar currentView={currentView} onNavigate={(view) => handleNavigate(view)} onSignOut={handleSignOut} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      <ThemeSelector 
        currentTheme={currentTheme} 
        onThemeSelect={setCurrentTheme}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
    </>
  );
};

export default App;
