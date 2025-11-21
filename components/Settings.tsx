
import React, { useState } from 'react';
import Header from './Header';
import { UsersIcon, BellIcon, CreditCardIcon, LockClosedIcon, ChartBarIcon } from './icons';

interface PaymentMethod {
    last4: string;
    expiry: string;
    brand: string;
    nameOnCard: string;
}

interface AppPermissions {
    dashboard: boolean;
    memberships: boolean;
    fundraising: boolean;
    ticketing: boolean;
    reports: boolean;
    settings: boolean;
}

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: AppPermissions;
}

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');

    // General Settings State
    const [generalSettings, setGeneralSettings] = useState({
        orgName: 'Griot Cultural Center',
        contactEmail: 'admin@griot.org',
        timezone: 'Eastern Standard Time (EST)'
    });

    // Payment Method State
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
        brand: 'Visa',
        last4: '4242',
        expiry: '12/25',
        nameOnCard: 'Griot Operations'
    });
    const [isEditingPayment, setIsEditingPayment] = useState(false);
    const [editPaymentForm, setEditPaymentForm] = useState({ number: '', expiry: '', cvc: '', nameOnCard: '' });

    // Team/Permissions State
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        {
            id: 'u1',
            name: 'Admin User',
            email: 'admin@griot.org',
            role: 'Administrator',
            permissions: { dashboard: true, memberships: true, fundraising: true, ticketing: true, reports: true, settings: true }
        },
        {
            id: 'u2',
            name: 'Sarah Smith',
            email: 'sarah@griot.org',
            role: 'Box Office Manager',
            permissions: { dashboard: true, memberships: true, fundraising: false, ticketing: true, reports: true, settings: false }
        },
        {
            id: 'u3',
            name: 'John Donor',
            email: 'john@griot.org',
            role: 'Fundraising Lead',
            permissions: { dashboard: true, memberships: true, fundraising: true, ticketing: false, reports: true, settings: false }
        }
    ]);
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

    const tabs = [
        { id: 'general', label: 'General', icon: UsersIcon },
        { id: 'team', label: 'Team & Permissions', icon: ChartBarIcon },
        { id: 'notifications', label: 'Email Notifications', icon: BellIcon },
        { id: 'billing', label: 'Billing', icon: CreditCardIcon },
        { id: 'security', label: 'Security', icon: LockClosedIcon },
    ];

    const handleEditPayment = () => {
        setEditPaymentForm({ 
            number: `**** **** **** ${paymentMethod.last4}`, 
            expiry: paymentMethod.expiry, 
            cvc: '***',
            nameOnCard: paymentMethod.nameOnCard 
        });
        setIsEditingPayment(true);
    };

    const handleSavePayment = () => {
        // In a real app, validation and API call would happen here.
        const last4 = editPaymentForm.number.slice(-4) || paymentMethod.last4;
        setPaymentMethod({ 
            ...paymentMethod, 
            last4: last4.replace(/\D/g, '') || '1111', 
            expiry: editPaymentForm.expiry,
            nameOnCard: editPaymentForm.nameOnCard 
        });
        setIsEditingPayment(false);
        alert("Payment method updated successfully.");
    };

    const handleSaveGeneral = () => {
        alert(`Settings Saved:\nOrganization: ${generalSettings.orgName}\nEmail: ${generalSettings.contactEmail}\nTimezone: ${generalSettings.timezone}`);
    };

    const togglePermission = (memberId: string, screen: keyof AppPermissions) => {
        setTeamMembers(teamMembers.map(member => {
            if (member.id === memberId) {
                return {
                    ...member,
                    permissions: {
                        ...member.permissions,
                        [screen]: !member.permissions[screen]
                    }
                };
            }
            return member;
        }));
    };

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
                <div className="flex-1 p-8 overflow-y-auto">
                    {activeTab === 'general' && (
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">General Information</h3>
                            <div className="grid grid-cols-1 gap-6 max-w-2xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                                    <input 
                                        type="text" 
                                        value={generalSettings.orgName} 
                                        onChange={(e) => setGeneralSettings({...generalSettings, orgName: e.target.value})}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                                    <input 
                                        type="email" 
                                        value={generalSettings.contactEmail}
                                        onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Timezone</label>
                                    <select 
                                        value={generalSettings.timezone}
                                        onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                                    >
                                        <option>Eastern Standard Time (EST)</option>
                                        <option>Central Standard Time (CST)</option>
                                        <option>Pacific Standard Time (PST)</option>
                                        <option>Mountain Standard Time (MST)</option>
                                        <option>Greenwich Mean Time (GMT)</option>
                                    </select>
                                </div>
                                <div className="pt-4">
                                    <button 
                                        onClick={handleSaveGeneral}
                                        className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-secondary transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'team' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">Team & Permissions</h3>
                                <button className="text-sm bg-brand-primary text-white px-3 py-2 rounded hover:bg-brand-secondary">
                                    + Add User
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {teamMembers.map(member => (
                                    <div key={member.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900">{member.name}</h4>
                                                <p className="text-xs text-gray-500">{member.email} • {member.role}</p>
                                            </div>
                                            <button 
                                                onClick={() => setEditingMemberId(editingMemberId === member.id ? null : member.id)}
                                                className="text-xs font-medium text-brand-primary hover:underline"
                                            >
                                                {editingMemberId === member.id ? 'Done' : 'Edit Permissions'}
                                            </button>
                                        </div>
                                        
                                        {editingMemberId === member.id ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-200">
                                                {(Object.keys(member.permissions) as Array<keyof AppPermissions>).map(screen => (
                                                    <label key={screen} className="inline-flex items-center">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={member.permissions[screen]} 
                                                            onChange={() => togglePermission(member.id, screen)}
                                                            className="form-checkbox h-4 w-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700 capitalize">{screen}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {(Object.entries(member.permissions) as [keyof AppPermissions, boolean][])
                                                    .filter(([_, enabled]) => enabled)
                                                    .map(([screen]) => (
                                                        <span key={screen} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                            {screen}
                                                        </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Email Notification Preferences</h3>
                            <div className="space-y-4">
                                {['New member signups', 'Ticket sales reports', 'System alerts', 'Daily digest'].map((item, idx) => (
                                    <div key={idx} className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id={`notify-${idx}`} type="checkbox" defaultChecked className="focus:ring-brand-primary h-4 w-4 text-brand-primary border-gray-300 rounded" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor={`notify-${idx}`} className="font-medium text-gray-700">{item}</label>
                                            <p className="text-gray-500">Receive email notifications about {item.toLowerCase()}.</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4">
                                    <button 
                                        onClick={() => alert("Notification preferences updated.")}
                                        className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-secondary transition-colors"
                                    >
                                        Update Preferences
                                    </button>
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
                            {isEditingPayment ? (
                                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-w-md">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Name on Card</label>
                                            <input 
                                                type="text" 
                                                value={editPaymentForm.nameOnCard} 
                                                onChange={(e) => setEditPaymentForm({...editPaymentForm, nameOnCard: e.target.value})}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm bg-white text-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Card Number</label>
                                            <input 
                                                type="text" 
                                                value={editPaymentForm.number} 
                                                onChange={(e) => setEditPaymentForm({...editPaymentForm, number: e.target.value})}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm bg-white text-black"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700">Expiry (MM/YY)</label>
                                                <input 
                                                    type="text" 
                                                    value={editPaymentForm.expiry} 
                                                    onChange={(e) => setEditPaymentForm({...editPaymentForm, expiry: e.target.value})}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm bg-white text-black"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700">CVC</label>
                                                <input 
                                                    type="text" 
                                                    value={editPaymentForm.cvc} 
                                                    onChange={(e) => setEditPaymentForm({...editPaymentForm, cvc: e.target.value})}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm bg-white text-black"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-2">
                                            <button 
                                                onClick={() => setIsEditingPayment(false)}
                                                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={handleSavePayment}
                                                className="px-3 py-1 text-sm bg-brand-primary text-white rounded hover:bg-brand-secondary"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center mb-4 p-4 border border-gray-200 rounded-lg">
                                    <CreditCardIcon className="w-8 h-8 text-gray-400 mr-3" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{paymentMethod.brand} ending in {paymentMethod.last4}</p>
                                        <p className="text-xs text-gray-500">Expires {paymentMethod.expiry}</p>
                                        <p className="text-xs text-gray-500 mt-1">Name: {paymentMethod.nameOnCard}</p>
                                    </div>
                                    <button 
                                        onClick={handleEditPayment}
                                        className="ml-auto text-sm text-brand-primary hover:text-brand-secondary font-medium"
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
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
