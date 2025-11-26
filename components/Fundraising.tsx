
import React, { useState, useEffect } from 'react';
import Header from './Header';
import StatCard from './StatCard';
import AddCampaignForm from './AddCampaignForm';
import ManageCampaign from './ManageCampaign';
import LogDonationForm from './LogDonationForm';
import { FundraisingIcon, CurrencyDollarIcon, ChartBarIcon, EyeIcon } from './icons';
import { 
    getCampaigns, 
    getDonations, 
    addCampaignService, 
    updateCampaignService, 
    deleteCampaignService,
    logDonationService 
} from '../services/fundraisingService';
import { Campaign, Donation } from '../types';
import { logActivity } from '../services/activityService';

interface FundraisingProps {
    initialView?: string;
}

const Fundraising: React.FC<FundraisingProps> = ({ initialView }) => {
    const [view, setView] = useState(initialView || 'dashboard');
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [showHidden, setShowHidden] = useState(false);

    // Campaign Filter State
    const [minGoal, setMinGoal] = useState('');
    const [maxGoal, setMaxGoal] = useState('');
    const [minRaised, setMinRaised] = useState('');
    const [maxRaised, setMaxRaised] = useState('');
    const [minDonors, setMinDonors] = useState('');
    const [maxDonors, setMaxDonors] = useState('');
    const [minProgress, setMinProgress] = useState('');
    const [maxProgress, setMaxProgress] = useState('');
    const [campaignSearch, setCampaignSearch] = useState('');
    const [campaignStatusFilter, setCampaignStatusFilter] = useState('All');

    // Donation Filter State
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
    const [campaignFilter, setCampaignFilter] = useState('All');
    const [donorSearch, setDonorSearch] = useState('');
    const [donationStartDate, setDonationStartDate] = useState('');
    const [donationEndDate, setDonationEndDate] = useState('');
    const [donationMinAmount, setDonationMinAmount] = useState('');
    const [donationMaxAmount, setDonationMaxAmount] = useState('');

    // Sorting state
    const [campaignSortKey, setCampaignSortKey] = useState<keyof Campaign | 'progress'>('id');
    const [campaignSortDirection, setCampaignSortDirection] = useState<'asc' | 'desc'>('asc');
    const [donationSortKey, setDonationSortKey] = useState<keyof Donation>('date');
    const [donationSortDirection, setDonationSortDirection] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [cData, dData] = await Promise.all([getCampaigns(), getDonations()]);
            setCampaigns(cData);
            setDonations(dData);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCampaign = async (data: { name: string; goal: number; description: string }) => {
        const newCampaign: Campaign = {
            id: Date.now(),
            ...data,
            raised: 0,
            donors: 0,
            status: 'Active'
        };
        await addCampaignService(newCampaign);
        logActivity('New Campaign', `Created campaign: ${data.name}`, 'fundraising');
        setCampaigns(prev => [newCampaign, ...prev]);
        setView('dashboard'); // Actually means 'campaigns' tab in this context
    };

    const handleUpdateCampaign = async (updated: Campaign) => {
        await updateCampaignService(updated);
        logActivity('Update Campaign', `Updated campaign: ${updated.name}`, 'fundraising');
        setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
        setView('dashboard');
        setSelectedCampaign(null);
    };

    const handleDeleteCampaign = async (id: number) => {
        const campaign = campaigns.find(c => c.id === id);
        await deleteCampaignService(id);
        if (campaign) {
             logActivity('Delete Campaign', `Deleted campaign: ${campaign.name}`, 'fundraising');
        }
        setCampaigns(prev => prev.filter(c => c.id !== id));
    };

    const handleLogDonation = async (data: { donorName: string; amount: number; campaignId: number; paymentMethod: string; date: string }) => {
        await logDonationService(data.amount, data.campaignId, data.donorName, data.paymentMethod, undefined, data.date);
        logActivity('Donation Logged', `$${data.amount} from ${data.donorName}`, 'fundraising');
        loadData(); 
        setView('donations');
    };

    // Calculations based on Donation Log for consistency
    const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);
    // Unique donors from donation log
    const uniqueDonors = new Set(donations.map(d => d.donorName)).size;
    const avgDonation = donations.length > 0 ? totalRaised / donations.length : 0;

    const filteredAndSortedCampaigns = campaigns.filter(c => {
        if (!showHidden && c.status === 'Archived') return false;
        
        const matchesSearch = c.name.toLowerCase().includes(campaignSearch.toLowerCase());
        const matchesStatus = campaignStatusFilter === 'All' || c.status === campaignStatusFilter;
        
        const goal = c.goal;
        const matchesGoal = (!minGoal || goal >= Number(minGoal)) && (!maxGoal || goal <= Number(maxGoal));
        
        const raised = c.raised;
        const matchesRaised = (!minRaised || raised >= Number(minRaised)) && (!maxRaised || raised <= Number(maxRaised));
        
        const donors = c.donors;
        const matchesDonors = (!minDonors || donors >= Number(minDonors)) && (!maxDonors || donors <= Number(maxDonors));
        
        const progress = (c.raised / c.goal) * 100;
        const matchesProgress = (!minProgress || progress >= Number(minProgress)) && (!maxProgress || progress <= Number(maxProgress));

        return matchesSearch && matchesStatus && matchesGoal && matchesRaised && matchesDonors && matchesProgress;
    }).sort((a, b) => {
        let valA: any = a[campaignSortKey as keyof Campaign];
        let valB: any = b[campaignSortKey as keyof Campaign];
        
        if (campaignSortKey === 'progress') {
            valA = (a.raised / a.goal);
            valB = (b.raised / b.goal);
        }

        if (valA < valB) return campaignSortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return campaignSortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredAndSortedDonations = donations.filter(d => {
        const matchesSearch = d.donorName.toLowerCase().includes(donorSearch.toLowerCase());
        const matchesPayment = paymentMethodFilter === 'All' || d.paymentMethod === paymentMethodFilter;
        const matchesCampaign = campaignFilter === 'All' || d.campaignName === campaignFilter;
        
        let matchesDate = true;
        if (donationStartDate) matchesDate = matchesDate && d.date >= donationStartDate;
        if (donationEndDate) matchesDate = matchesDate && d.date <= donationEndDate;

        const matchesAmount = (!donationMinAmount || d.amount >= Number(donationMinAmount)) && 
                              (!donationMaxAmount || d.amount <= Number(donationMaxAmount));

        return matchesSearch && matchesPayment && matchesCampaign && matchesDate && matchesAmount;
    }).sort((a, b) => {
        let valA: any = a[donationSortKey];
        let valB: any = b[donationSortKey];

        if (donationSortKey === 'amount') {
            valA = Number(valA);
            valB = Number(valB);
        }

        if (valA < valB) return donationSortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return donationSortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const handleCampaignSort = (key: keyof Campaign | 'progress') => {
        if (campaignSortKey === key) {
            setCampaignSortDirection(campaignSortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setCampaignSortKey(key);
            setCampaignSortDirection('asc');
        }
    };

    const handleDonationSort = (key: keyof Donation) => {
        if (donationSortKey === key) {
            setDonationSortDirection(donationSortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setDonationSortKey(key);
            setDonationSortDirection('asc');
        }
    };

    const renderSortIcon = (key: string, currentKey: string, direction: 'asc' | 'desc') => {
        if (currentKey !== key) return <span className="ml-1 text-gray-300 opacity-50">↕</span>;
        return <span className="ml-1 text-brand-primary">{direction === 'asc' ? '↑' : '↓'}</span>;
    };

    if (view === 'add') {
        return (
            <div>
                <Header title="New Campaign" />
                <AddCampaignForm onSave={handleAddCampaign} onCancel={() => setView('dashboard')} />
            </div>
        );
    }

    if (view === 'manage') {
        return (
            <div>
                <Header title="Manage Campaign" />
                <ManageCampaign 
                    campaign={selectedCampaign} 
                    onSave={handleUpdateCampaign} 
                    onCancel={() => { setView('dashboard'); setSelectedCampaign(null); }} 
                />
            </div>
        );
    }

    if (view === 'log-donation') {
        return (
            <div>
                <Header title="Log Donation" />
                <LogDonationForm 
                    campaigns={campaigns} 
                    onSave={handleLogDonation} 
                    onCancel={() => setView('dashboard')} 
                />
            </div>
        );
    }

    return (
        <div>
            <Header 
                title="Fundraising" 
                buttonText="+ New Campaign" 
                onButtonClick={() => setView('add')} 
            >
                <button 
                    onClick={() => setView('log-donation')}
                    className="mr-3 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                >
                    Log Donation
                </button>
            </Header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Raised (YTD)" value={`$${totalRaised.toLocaleString()}`} icon={CurrencyDollarIcon} />
                <StatCard title="Total Donors (YTD)" value={uniqueDonors.toLocaleString()} icon={FundraisingIcon} />
                <StatCard title="Avg. Donation" value={`$${avgDonation.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={ChartBarIcon} />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex" aria-label="Tabs">
                        <button
                            onClick={() => setView('dashboard')}
                            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                view === 'dashboard'
                                ? 'border-brand-primary text-brand-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Campaigns
                        </button>
                        <button
                            onClick={() => setView('donations')}
                            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                                view === 'donations'
                                ? 'border-brand-primary text-brand-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Donation Log
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {view === 'dashboard' && (
                        <>
                            <div className="mb-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-800">Active Campaigns</h2>
                                    <button onClick={() => setShowHidden(!showHidden)} className="flex items-center text-sm text-gray-500 hover:text-brand-primary">
                                        <EyeIcon className="w-4 h-4 mr-1" />
                                        {showHidden ? 'Hide Inactive' : 'Show All'}
                                    </button>
                                </div>
                                
                                {/* Campaign Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <input
                                        type="text"
                                        placeholder="Search campaigns..."
                                        value={campaignSearch}
                                        onChange={(e) => setCampaignSearch(e.target.value)}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm bg-white text-black"
                                    />
                                    <select
                                        value={campaignStatusFilter}
                                        onChange={(e) => setCampaignStatusFilter(e.target.value)}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm bg-white text-black"
                                    >
                                        <option value="All">All Statuses</option>
                                        <option value="Active">Active</option>
                                        <option value="Ending Soon">Ending Soon</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Paused">Paused</option>
                                    </select>
                                    <div className="flex space-x-2">
                                        <input type="number" placeholder="Min Goal" value={minGoal} onChange={e => setMinGoal(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"/>
                                        <input type="number" placeholder="Max Goal" value={maxGoal} onChange={e => setMaxGoal(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"/>
                                    </div>
                                    <div className="flex space-x-2">
                                        <input type="number" placeholder="Min Raised" value={minRaised} onChange={e => setMinRaised(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"/>
                                        <input type="number" placeholder="Max Raised" value={maxRaised} onChange={e => setMaxRaised(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"/>
                                    </div>
                                    <div className="flex space-x-2">
                                        <input type="number" placeholder="Min Donors" value={minDonors} onChange={e => setMinDonors(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"/>
                                        <input type="number" placeholder="Max Donors" value={maxDonors} onChange={e => setMaxDonors(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"/>
                                    </div>
                                    <div className="flex space-x-2">
                                        <input type="number" placeholder="Min Progress %" value={minProgress} onChange={e => setMinProgress(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"/>
                                        <input type="number" placeholder="Max Progress %" value={maxProgress} onChange={e => setMaxProgress(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"/>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {filteredAndSortedCampaigns.map(campaign => (
                                    <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                                    {campaign.name}
                                                    <span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${
                                                        campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                                        campaign.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {campaign.status}
                                                    </span>
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">{campaign.description}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => { setSelectedCampaign(campaign); setView('manage'); }}
                                                    className="text-sm font-medium text-brand-primary hover:text-brand-secondary px-3 py-1 border border-brand-primary rounded-md hover:bg-brand-primary hover:text-white transition-colors"
                                                >
                                                    Manage
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { 
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDeleteCampaign(campaign.id);
                                                    }}
                                                    className="text-sm font-medium text-red-600 hover:text-red-900 px-3 py-1 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4 items-end">
                                            <div className="md:col-span-2 cursor-pointer" onClick={() => handleCampaignSort('progress')}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="font-medium text-gray-700">Progress</span>
                                                    <span className="text-gray-500">{Math.min(100, (campaign.raised / campaign.goal) * 100).toFixed(1)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div 
                                                        className="bg-brand-primary h-2.5 rounded-full" 
                                                        style={{ width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="cursor-pointer hover:bg-gray-50 p-1 rounded" onClick={() => handleCampaignSort('raised')}>
                                                <p className="text-xs text-gray-500">Raised {renderSortIcon('raised', campaignSortKey, campaignSortDirection)}</p>
                                                <p className="text-lg font-bold text-gray-900">${campaign.raised.toLocaleString()}</p>
                                            </div>
                                            <div className="cursor-pointer hover:bg-gray-50 p-1 rounded" onClick={() => handleCampaignSort('goal')}>
                                                <p className="text-xs text-gray-500">Goal {renderSortIcon('goal', campaignSortKey, campaignSortDirection)}</p>
                                                <p className="text-lg font-bold text-gray-500">${campaign.goal.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50 p-1 rounded w-fit" onClick={() => handleCampaignSort('donors')}>
                                            <strong>{campaign.donors}</strong>&nbsp;donors {renderSortIcon('donors', campaignSortKey, campaignSortDirection)}
                                        </div>
                                    </div>
                                ))}
                                {filteredAndSortedCampaigns.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">No campaigns found matching filters.</p>
                                )}
                            </div>
                        </>
                    )}

                    {view === 'donations' && (
                        <div className="overflow-x-auto">
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <input
                                    type="text"
                                    placeholder="Search donor name..."
                                    value={donorSearch}
                                    onChange={(e) => setDonorSearch(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm bg-white text-black"
                                />
                                <select
                                    value={campaignFilter}
                                    onChange={(e) => setCampaignFilter(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm bg-white text-black"
                                >
                                    <option value="All">All Campaigns</option>
                                    {campaigns.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                                <select
                                    value={paymentMethodFilter}
                                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm bg-white text-black"
                                >
                                    <option value="All">All Payment Methods</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Check">Check</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                                <div className="flex space-x-2">
                                    <input type="date" value={donationStartDate} onChange={e => setDonationStartDate(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"/>
                                    <input type="date" value={donationEndDate} onChange={e => setDonationEndDate(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"/>
                                </div>
                                <div className="flex space-x-2">
                                    <input type="number" placeholder="Min $" value={donationMinAmount} onChange={e => setDonationMinAmount(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"/>
                                    <input type="number" placeholder="Max $" value={donationMaxAmount} onChange={e => setDonationMaxAmount(e.target.value)} className="w-1/2 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"/>
                                </div>
                            </div>

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleDonationSort('date')}
                                        >
                                            Date {renderSortIcon('date', donationSortKey, donationSortDirection)}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleDonationSort('donorName')}
                                        >
                                            Donor {renderSortIcon('donorName', donationSortKey, donationSortDirection)}
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleDonationSort('amount')}
                                        >
                                            Amount {renderSortIcon('amount', donationSortKey, donationSortDirection)}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAndSortedDonations.map((donation) => (
                                        <tr key={donation.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donation.donorName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">${donation.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.campaignName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.paymentMethod}</td>
                                        </tr>
                                    ))}
                                    {filteredAndSortedDonations.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No donations found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Fundraising;
