
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock User Database logic
    let user: User | null = null;

    if (username === 'admin' && password === 'admin') {
        // Test Admin User
        user = { username: 'admin', name: 'Administrator', role: 'Admin' };
    } else if (username === 'guest' && password === 'guest') {
        // Test Guest User
        user = { username: 'guest', name: 'Guest User', role: 'Guest' };
    } else if (username === 'member' && password === 'member') {
        // Test Member User
        user = { username: 'member', name: 'Test Member', role: 'Member User' };
    } else if (username === 'sarah' && password === 'password') {
        user = { username: 'sarah', name: 'Sarah Smith', role: 'Box Office Manager' };
    } else if (username === 'john' && password === 'password') {
        user = { username: 'john', name: 'John Donor', role: 'Fundraising Lead' };
    }

    if (user) {
      onLogin(user);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-brand-primary py-6 px-8 text-center">
             <h1 className="text-3xl font-bold text-white uppercase tracking-wider">GRIOT</h1>
             <p className="text-indigo-200 mt-2 text-sm">Operations Management System</p>
        </div>
        <div className="p-8">
            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                        {error}
                    </div>
                )}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="shadow-sm appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition bg-white text-black"
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow-sm appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition bg-white text-black"
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="text-right">
                         <p className="text-gray-400 text-xs">Test Credentials: admin/admin, member/member, guest/guest</p>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors shadow-md"
                        type="submit"
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </div>
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">&copy; 2024 Griot Cultural Center. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
