
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
import { undo, redo, addAction } from './services/historyService';

// Lazy load Chat to isolate heavy dependencies
const GriotChat = React.lazy(() => import('./components/GriotChat'));

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [initialAction, setInitialAction] = useState<string | undefined>(undefined);
  
  // Theme State
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Lifted state for Documents to persist across navigation
  // Removed mock files as requested
  const [docs, setDocs] = useState<Doc[]>([]);

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

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
              e.preventDefault();
              undo();
          } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
              e.preventDefault();
              redo();
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
      setCurrentUserSession(currentUser || { username: 'guest', name: 'Guest User', role: 'Guest' });
  }, [currentUser]);

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

  // Wrap setDocs to include history
  const handleSetDocs = (newDocsOrUpdater: Doc[] | ((prev: Doc[]) => Doc[])) => {
      setDocs(prev => {
          const newDocs = typeof newDocsOrUpdater === 'function' ? newDocsOrUpdater(prev) : newDocsOrUpdater;
          
          // Determine action type roughly by length comparison
          // This is a simplification; ideal way is to have explicit addDoc/removeDoc methods
          let actionName = 'Update Documents';
          let isAdd = newDocs.length > prev.length;
          
          if (newDocs.length !== prev.length) {
              actionName = isAdd ? 'Upload Document' : 'Delete Document';
              // Only add to history if we can infer the change clearly or if it's not an initial load
              // For now, we rely on the specific handlers in Documents.tsx to be more precise if possible,
              // but passing the raw setter makes it hard. 
              // Strategy: The Documents component will handle calling the setter, 
              // but we can intercept the logical "Add/Remove" there if we passed methods instead of setter.
              // However, to keep changes minimal to props interface:
              
              // We will rely on the component to manage history for add/delete, 
              // OR we implement a custom history wrapper here. 
              // Let's modify Documents.tsx to interact with historyService directly or via callbacks? 
              // Simpler: Let Documents.tsx use `setDocs` but we expose a way to register history.
          }
          return newDocs;
      });
  };

  // Explicit methods for history-aware document changes to pass to child
  const addDocWithHistory = (doc: Doc) => {
      setDocs(prev => [doc, ...prev]);
      addAction({
          name: 'Upload Document',
          undo: () => setDocs(prev => prev.filter(d => d.id !== doc.id)),
          redo: () => setDocs(prev => [doc, ...prev])
      });
  };

  const deleteDocWithHistory = (id: string) => {
      let deletedDoc: Doc | undefined;
      setDocs(prev => {
          deletedDoc = prev.find(d => d.id === id);
          return prev.filter(d => d.id !== id);
      });
      
      if (deletedDoc) {
          // Capture the doc in closure
          const doc = deletedDoc; 
          addAction({
              name: 'Delete Document',
              undo: () => setDocs(prev => [doc, ...prev]),
              redo: () => setDocs(prev => prev.filter(d => d.id !== id))
          });
      }
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
        // Pass history-aware wrappers instead of raw state setter where possible
        // But the prop expects `setDocs`. We'll override the behavior in Documents.tsx
        // by passing these as extra props or handling it there. 
        // To minimize breaking changes, we'll pass a modified setDocs-like object or extend the component.
        // Easier: Update Documents.tsx to accept `onAdd` and `onDelete` optional props.
        return <Documents docs={docs} setDocs={setDocs} onAdd={addDocWithHistory} onDelete={deleteDocWithHistory} />;
      case 'chat':
        return (
            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div></div>}>
                <GriotChat />
            </Suspense>
        );
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
      <div className="flex h-screen bg-gray-100 print:h-auto print:block">
        <Sidebar currentView={currentView} onNavigate={(view) => handleNavigate(view)} onSignOut={handleSignOut} />
        <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible print:h-auto print:block">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 print:overflow-visible print:h-auto print:block print:bg-white">
            <div className="container mx-auto px-6 py-8 print:p-0 print:w-full print:max-w-none">
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
