
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MembershipDashboard from './components/MembershipDashboard';
import Dashboard from './components/Dashboard';
import Fundraising from './components/Fundraising';
import Ticketing from './components/Ticketing';
import Reports from './components/Reports';
import HelpButton from './components/HelpButton';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'memberships':
        return <MembershipDashboard />;
      case 'fundraising':
        return <Fundraising />;
      case 'ticketing':
        return <Ticketing />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      <HelpButton />
    </>
  );
};

export default App;
