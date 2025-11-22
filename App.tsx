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
import ThemeSelector, { themes } from './components/ThemeSelector';
import { Doc } from './types';

// Lazy load HelpButton to isolate @google/genai dependency
const HelpButton = React.lazy(() => import('./components/HelpButton'));
const GriotChat = React.lazy(() => import('./components/GriotChat'));

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [initialAction, setInitialAction] = useState<string | undefined>(undefined);
  
  // Theme State
  const [currentTheme, setCurrentTheme] = useState('default');

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
    root.style.setProperty('--color-brand-primary', theme.primary);
    root.style.setProperty('--color-brand-secondary', theme.secondary);
  }, [currentTheme]);

  const handleNavigate = (view: string, action?: string) => {
    setInitialAction(action);
    setCurrentView(view);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
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
      case 'chat':
          return (
            <Suspense fallback={
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
                </div>
            }>
                <GriotChat />
            </Suspense>
          );
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
      <Suspense fallback={null}>
        <HelpButton currentView={currentView} />
      </Suspense>
      <ThemeSelector currentTheme={currentTheme} onThemeSelect={setCurrentTheme} />
    </>
  );
};

export default App;