
import React, { useState } from 'react';
import Header from './Header';
import { UsersIcon, BellIcon, CreditCardIcon, LockClosedIcon } from './icons';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: UsersIcon },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
        { id: 'billing', label: 'Billing', icon: CreditCardIcon },
        { id: 'security', label: 'Security', icon: LockClosedIcon },
    ];

    return (
        <div>
            <Header title="Settings" />
            <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[600px] flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200">
                    <nav className="p-4 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-brand-primary text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <tab.icon className="w-5 h-5 mr-3" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8">
                    {activeTab === 'general' && (
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">General Information</h3>
                            <div className="grid grid-cols-1 gap-6 max-w-2xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                                    <input type="text" defaultValue="Griot Cultural Center" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                                    <input type="email" defaultValue="admin@griot.org" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Timezone</label>
                                    <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black">
                                        <option>Eastern Standard Time (EST)</option>
                                        <option>Central Standard Time (CST)</option>
                                        <option>Pacific Standard Time (PST)</option>
                                    </select>
                                </div>
                                <div className="pt-4">
                                    <button className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-secondary transition-colors">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Notification Preferences</h3>
                            <div className="space-y-4">
                                {['New member signups', 'Ticket sales reports', 'System alerts', 'Daily digest'].map((item, idx) => (
                                    <div key={idx} className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id={`notify-${idx}`} type="checkbox" defaultChecked className="focus:ring-brand-primary h-4 w-4 text-brand-primary border-gray-300 rounded" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor={`notify-${idx}`} className="font-medium text-gray-700">{item}</label>
                                            <p className="text-gray-500">Receive notifications about {item.toLowerCase()}.</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4">
                                    <button className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-secondary transition-colors">Update Preferences</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                         <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Plan & Billing</h3>
                            <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Current Plan</p>
                                        <p className="text-lg font-bold text-gray-900">Enterprise Plan</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">Active</span>
                                </div>
                            </div>
                            <h4 className="text-md font-medium text-gray-900 mb-3">Payment Method</h4>
                            <div className="flex items-center mb-4">
                                <CreditCardIcon className="w-8 h-8 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                                    <p className="text-xs text-gray-500">Expires 12/25</p>
                                </div>
                                <button className="ml-auto text-sm text-brand-primary hover:text-brand-secondary">Edit</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div>
                             <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Security Settings</h3>
                             <div className="max-w-2xl">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input type="password" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black" />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input type="password" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black" />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input type="password" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black" />
                                </div>
                                <button className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-secondary transition-colors">Update Password</button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
