import React, { useState, useMemo, useEffect } from 'react';
import Header from './Header';
import StatCard from './StatCard';
import AddCampaignForm from './AddCampaignForm';
import LogDonationForm from './LogDonationForm';
import ManageCampaign from './ManageCampaign';
import { FundraisingIcon, TrendingUpIcon, UsersIcon, SearchIcon, EyeIcon, DocumentTextIcon } from './icons';
import { Campaign, Donation } from '../types';
import { 
    getCampaigns, 
    getDonations,
    addCampaignService, 
    updateCampaignService, 
    deleteCampaignService, 
    logDonationService 
} from '../services/fundraisingService';
import { logActivity } from '../services/activityService';

interface FundraisingProps {
    initialView?: string;
}

type SortKey = 'name' | 'goal' | 'raised' | 'status' | 'progress' | 'date' | 'amount' | 'donorName';
type SortDirection = 'asc' | 'desc';

const Fundraising: React.FC<FundraisingProps> = ({ initialView }) => {
    const [view, setView] = useState<'list' | 'add' | 'log-donation' | 'manage'>((initialView as any) || 'list');
    const [activeTab, setActiveTab] = useState<'campaigns' | 'donations'>('campaigns');
    
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    
    // State for hiding individual rows
    const [hiddenCampaignIds, setHiddenCampaignIds] = useState<number[]>([]);
    const [showHidden, setShowHidden] = useState(false);

    // Sorting and Filtering State for Campaigns
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortKey, setSortKey] = useState<SortKey>('status');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Filtering State for Donation Log
    const [donationPaymentFilter, setDonationPaymentFilter] = useState('All');
    const [donationCampaignFilter, setDonationCampaignFilter] = useState('All');
    const [donationStartDate, setDonationStartDate] = useState('');
    const [donationEndDate, setDonationEndDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [campaignsData, donationsData] = await Promise.all([getCampaigns(), getDonations()]);
                setCampaigns(campaignsData);
                setDonations(donationsData);
            } catch (error) {
                console.error("Failed to fetch fundraising data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddCampaign = async (data: { name: string; goal: number; description: string }) => {
        const newCampaign: Campaign = {
            id: Date.now(),
            name: data.name,
            goal: data.goal,
            raised: 0,
            donors: 0,
            status: 'Active',
            description: data.description
        };
        await addCampaignService(newCampaign);
        setCampaigns(prev => [newCampaign, ...prev]);
        logActivity('Campaign Created', `Launched new campaign: ${data.name}`, 'fundraising');
        setView('list');
        setActiveTab('campaigns');
    };

    const handleLogDonation = async (data: { amount: number; campaignId: number; donorName: string; paymentMethod: string; date: string; notes?: string }) => {
        await logDonationService(data.amount, data.campaignId, data.donorName, data.paymentMethod, data.notes, data.date);
        
        // Refresh data
        const [campaignsData, donationsData] = await Promise.all([getCampaigns(), getDonations()]);
        setCampaigns(campaignsData);
        setDonations(donationsData);
        
        logActivity('Donation Received', `$${data.amount} from ${data.donorName}`, 'fundraising');
        setView('list');
        setActiveTab('donations');
    };

    const handleManageClick = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setView('manage');
    };

    const handleHideCampaign = (id: number) => {
        setHiddenCampaignIds(prev => [...prev, id]);
    };

    const handleUnhideCampaign = (id: number) => {
        setHiddenCampaignIds(prev => prev.filter(hiddenId => hiddenId !== id));
        if (hiddenCampaignIds.length === 1) {
            setShowHidden(false);
        }
    };

    const handleDeleteCampaign = async (id: number) => {
        const campaign = campaigns.find(c => c.id === id);

        // Optimistic update
        setCampaigns(prev => prev.filter(c => c.id !== id));

        try {
            await deleteCampaignService(id);
            if (campaign) {
                logActivity('Campaign Deleted', `Deleted campaign: ${campaign.name}`, 'fundraising');
            }
        } catch (error) {
            console.error("Failed to delete campaign", error);
            const data = await getCampaigns();
            setCampaigns(data);
            alert("Failed to delete campaign. Data has been refreshed.");
        }
    };

    const handleSaveCampaign = async (updatedCampaign: Campaign) => {
        await updateCampaignService(updatedCampaign);
        setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
        logActivity('Campaign Updated', `Updated campaign details: ${updatedCampaign.name}`, 'fundraising');
        setView('list');
        setSelectedCampaign(null);
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const filteredAndSortedCampaigns = useMemo(() => {
        let result = campaigns.filter(c => {
            // Logic for hidden/shown views
            const isHidden = hiddenCampaignIds.includes(c.id);
            if (showHidden) {
                if (!isHidden) return false;
            } else {
                if (isHidden) return false;
            }

            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        return result.sort((a, b) => {
            let aValue: any = a[sortKey as keyof Campaign];
            let bValue: any = b[sortKey as keyof Campaign];

            if (sortKey === 'progress') {
                aValue = a.raised / (a.goal || 1);
                bValue = b.raised / (b.goal || 1);
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [campaigns, searchTerm, statusFilter, sortKey, sortDirection, hiddenCampaignIds, showHidden]);

    const filteredAndSortedDonations = useMemo(() => {
        let result = donations.filter(d => {
             // Search Term matches Donor Name
             const matchesSearch = d.donorName.toLowerCase().includes(searchTerm.toLowerCase());
             
             // Payment Method Filter
             const matchesPayment = donationPaymentFilter === 'All' || d.paymentMethod === donationPaymentFilter;
             
             // Campaign Filter
             const matchesCampaign = donationCampaignFilter === 'All' || d.campaignName === donationCampaignFilter;

             // Date Range
             let matchesDate = true;
             if (donationStartDate) {
                 matchesDate = matchesDate && new Date(d.date) >= new Date(donationStartDate);
             }
             if (donationEndDate) {
                 matchesDate = matchesDate && new Date(d.date) <= new Date(donationEndDate);
             }

             return matchesSearch && matchesPayment && matchesCampaign && matchesDate;
        });

        return result.sort((a, b) => {
            let aValue: any = a[sortKey as keyof Donation];
            let bValue: any = b[sortKey as keyof Donation];

            // Fallback for sorting keys not in Donation
            if (aValue === undefined) aValue = '';
            if (bValue === undefined) bValue = '';

            if (sortKey === 'date') {
                aValue = new Date(a.date).getTime();
                bValue = new Date(b.date).getTime();
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [donations, searchTerm, sortKey, sortDirection, donationPaymentFilter, donationCampaignFilter, donationStartDate, donationEndDate]);

    const renderSortIcon = (key: SortKey) => {
        if (sortKey !== key) return <span className="ml-1 text-gray-400 opacity-0 group-hover:opacity-50">↕</span>;
        return <span className="ml-1 text-brand-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };

    // Calculate Statistics
    const totalRaised = campaigns.reduce((acc, c) => acc + c.raised, 0);
    // Calculate unique donors from the actual donations log
    const uniqueDonors = new Set(donations.map(d => d.donorName.toLowerCase().trim())).size;
    const avgDonation = uniqueDonors > 0 ? totalRaised / uniqueDonors : 0;

    // Unique Payment Methods for dropdown
    const uniquePaymentMethods = useMemo(() => {
        return ['All', ...Array.from(new Set(donations.map(d => d.paymentMethod)))];
    }, [donations]);

    // Unique Campaign Names for dropdown
    const uniqueCampaignNames = useMemo(() => {
        return ['All', ...Array.from(new Set(campaigns.map(c => c.name)))];
    }, [campaigns]);

    return (
        <div>
            {view === 'list' && (
                <>
                    <Header 
                        title="Fundraising" 
                        buttonText="+ New Campaign" 
                        onButtonClick={() => setView('add')}
                    >
                         <button 
                            onClick={() => setView('log-donation')}
                            className="px-4 py-2 text-brand-primary bg-white border border-brand-primary rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
                        >
                            Log Donation
                        </button>
                    </Header>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Total Raised (YTD)" value={`$${totalRaised.toLocaleString()}`} icon={FundraisingIcon} />
                        <StatCard title="Total Donors (YTD)" value={uniqueDonors.toLocaleString()} icon={UsersIcon} />
                        <StatCard title="Avg. Donation" value={`$${Math.round(avgDonation).toLocaleString()}`} icon={TrendingUpIcon} />
                    </div>

                    {/* Tabs */}
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('campaigns')}
                                className={`${
                                    activeTab === 'campaigns'
                                        ? 'border-brand-primary text-brand-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Campaigns
                            </button>
                            <button
                                onClick={() => setActiveTab('donations')}
                                className={`${
                                    activeTab === 'donations'
                                        ? 'border-brand-primary text-brand-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Donation Log
                            </button>
                        </nav>
                    </div>

                    {activeTab === 'campaigns' ? (
                        <>
                            {/* Filter and Search Bar */}
                            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                                <div className="flex gap-4 flex-grow w-full sm:w-auto">
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <SearchIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search campaigns..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-black focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                                        />
                                    </div>
                                    <div className="w-full sm:w-48">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white text-black"
                                        >
                                            <option value="All">All Statuses</option>
                                            <option value="Active">Active</option>
                                            <option value="Ending Soon">Ending Soon</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Paused">Paused</option>
                                        </select>
                                    </div>
                                </div>

                                {hiddenCampaignIds.length > 0 && (
                                    <button
                                        onClick={() => setShowHidden(!showHidden)}
                                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${showHidden ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <EyeIcon className="w-4 h-4 mr-2" />
                                        {showHidden ? 'View Active Campaigns' : `View Hidden (${hiddenCampaignIds.length})`}
                                    </button>
                                )}
                            </div>

                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        {showHidden ? 'Hidden Campaigns' : 'Active Campaigns'}
                                    </h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th 
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                                    onClick={() => handleSort('name')}
                                                >
                                                    <div className="flex items-center">Campaign Name {renderSortIcon('name')}</div>
                                                </th>
                                                <th 
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                                    onClick={() => handleSort('goal')}
                                                >
                                                        <div className="flex items-center">Goal {renderSortIcon('goal')}</div>
                                                </th>
                                                <th 
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                                    onClick={() => handleSort('raised')}
                                                >
                                                        <div className="flex items-center">Raised {renderSortIcon('raised')}</div>
                                                </th>
                                                <th 
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                                    onClick={() => handleSort('progress')}
                                                >
                                                        <div className="flex items-center">Progress {renderSortIcon('progress')}</div>
                                                </th>
                                                <th 
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                                    onClick={() => handleSort('status')}
                                                >
                                                        <div className="flex items-center">Status {renderSortIcon('status')}</div>
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                                                        Loading campaigns...
                                                    </td>
                                                </tr>
                                            ) : (
                                            <>
                                            {filteredAndSortedCampaigns.map((campaign) => {
                                                const percentage = campaign.goal > 0 ? Math.min(100, Math.round((campaign.raised / campaign.goal) * 100)) : 0;
                                                return (
                                                    <tr key={campaign.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                                                            <div className="text-sm text-gray-500">{campaign.donors} Donors</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            ${campaign.goal.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                            ${campaign.raised.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap align-middle">
                                                            <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-xs">
                                                                <div 
                                                                    className={`bg-brand-primary h-2.5 rounded-full`} 
                                                                    style={{ width: `${percentage}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs text-gray-500 mt-1 block">{percentage}%</span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                ${campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                                                    campaign.status === 'Ending Soon' ? 'bg-yellow-100 text-yellow-800' : 
                                                                    'bg-blue-100 text-blue-800'}`}>
                                                                {campaign.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { 
                                                                    e.preventDefault(); 
                                                                    handleManageClick(campaign); 
                                                                }}
                                                                className="text-brand-primary hover:text-brand-secondary mr-4 font-medium"
                                                            >
                                                                Manage
                                                            </button>
                                                            {showHidden ? (
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => handleUnhideCampaign(campaign.id)}
                                                                    className="text-gray-500 hover:text-gray-700 mr-4 font-medium"
                                                                >
                                                                    Unhide
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => handleHideCampaign(campaign.id)}
                                                                    className="text-gray-500 hover:text-gray-700 mr-4 font-medium"
                                                                >
                                                                    Hide
                                                                </button>
                                                            )}
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => { 
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleDeleteCampaign(campaign.id); 
                                                                }}
                                                                className="text-red-600 hover:text-red-900 font-medium inline-block p-1 rounded hover:bg-red-50 transition-colors"
                                                                aria-label={`Delete ${campaign.name}`}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {filteredAndSortedCampaigns.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                                                        {showHidden ? 'No hidden campaigns found.' : 'No active campaigns found.'}
                                                    </td>
                                                </tr>
                                            )}
                                            </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Donations Log View with Filters */}
                            <div className="mb-6 space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <SearchIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search donor name..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-black focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                                        <select
                                            value={donationPaymentFilter}
                                            onChange={(e) => setDonationPaymentFilter(e.target.value)}
                                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white text-black"
                                        >
                                            {uniquePaymentMethods.map(method => (
                                                <option key={method} value={method}>{method}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Campaign</label>
                                        <select
                                            value={donationCampaignFilter}
                                            onChange={(e) => setDonationCampaignFilter(e.target.value)}
                                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white text-black"
                                        >
                                            {uniqueCampaignNames.map(name => (
                                                <option key={name} value={name}>{name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Date From</label>
                                        <input
                                            type="date"
                                            value={donationStartDate}
                                            onChange={(e) => setDonationStartDate(e.target.value)}
                                            className="block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white text-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Date To</label>
                                        <input
                                            type="date"
                                            value={donationEndDate}
                                            onChange={(e) => setDonationEndDate(e.target.value)}
                                            className="block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white text-black"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th 
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('date')}
                                                >
                                                     <div className="flex items-center">Date {renderSortIcon('date')}</div>
                                                </th>
                                                <th 
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('donorName')}
                                                >
                                                     <div className="flex items-center">Donor {renderSortIcon('donorName')}</div>
                                                </th>
                                                <th 
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleSort('amount')}
                                                >
                                                     <div className="flex items-center">Amount {renderSortIcon('amount')}</div>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Campaign
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Payment Method
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {loading ? (
                                                 <tr>
                                                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">Loading donations...</td>
                                                </tr>
                                            ) : filteredAndSortedDonations.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">No donations found matching your filters.</td>
                                                </tr>
                                            ) : (
                                                filteredAndSortedDonations.map((donation) => (
                                                    <tr key={donation.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(donation.date).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {donation.donorName}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                                            ${donation.amount.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {donation.campaignName}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {donation.paymentMethod}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
            
            {view === 'add' && (
                <>
                    <Header title="New Campaign" />
                    <AddCampaignForm 
                        onSave={handleAddCampaign} 
                        onCancel={() => setView('list')} 
                    />
                </>
            )}

            {view === 'log-donation' && (
                <>
                    <Header title="Log Donation" />
                    <LogDonationForm 
                        campaigns={campaigns}
                        onSave={handleLogDonation} 
                        onCancel={() => setView('list')} 
                    />
                </>
            )}

            {view === 'manage' && selectedCampaign && (
                <>
                    <Header title="Manage Campaign" />
                    <ManageCampaign
                        campaign={selectedCampaign}
                        onSave={handleSaveCampaign}
                        onCancel={() => { setView('list'); setSelectedCampaign(null); }}
                    />
                </>
            )}
        </div>
    );
};

export default Fundraising;