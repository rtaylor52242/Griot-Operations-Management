
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MembershipDashboard from './components/MembershipDashboard';
import Dashboard from './components/Dashboard';
import Fundraising from './components/Fundraising';
import Ticketing from './components/Ticketing';
import Reports from './components/Reports';
import HelpButton from './components/HelpButton';
import Settings from './components/Settings';
import ActivityLog from './components/ActivityLog';
import Login from './components/Login';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [initialAction, setInitialAction] = useState<string | undefined>(undefined);

  const handleNavigate = (view: string, action?: string) => {
    setInitialAction(action);
    setCurrentView(view);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
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
        <Sidebar currentView={currentView} onNavigate={(view) => handleNavigate(view)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      <HelpButton currentView={currentView} />
    </>
  );
};

export default App;
