
import React, { useState } from 'react';
import Header from './Header';
import StatCard from './StatCard';
import AddCampaignForm from './AddCampaignForm';
import LogDonationForm from './LogDonationForm';
import ManageCampaign from './ManageCampaign';
import { FundraisingIcon, TrendingUpIcon, UsersIcon } from './icons';

interface Campaign {
    id: number;
    name: string;
    goal: number;
    raised: number;
    donors: number;
    status: string;
    description?: string;
}

interface FundraisingProps {
    initialView?: string;
}

const Fundraising: React.FC<FundraisingProps> = ({ initialView }) => {
    const [view, setView] = useState<'list' | 'add' | 'log-donation' | 'manage'>((initialView as any) || 'list');
    const [campaigns, setCampaigns] = useState<Campaign[]>([
        { id: 1, name: 'Annual Fund 2024', goal: 500000, raised: 325000, donors: 1240, status: 'Active', description: 'Supporting general operations and community outreach.' },
        { id: 2, name: 'New Wing Capital Campaign', goal: 2000000, raised: 850000, donors: 450, status: 'Active', description: 'Raising funds for the new modern art wing construction.' },
        { id: 3, name: 'Education Initiative', goal: 100000, raised: 98000, donors: 310, status: 'Ending Soon', description: 'Funding school trips and educational workshops.' },
        { id: 4, name: 'Preservation Grant Match', goal: 50000, raised: 50000, donors: 125, status: 'Completed', description: 'Matching grant for artifact preservation.' },
    ]);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

    const handleAddCampaign = (data: { name: string; goal: number; description: string }) => {
        const newCampaign: Campaign = {
            id: Date.now(),
            name: data.name,
            goal: data.goal,
            raised: 0,
            donors: 0,
            status: 'Active',
            description: data.description
        };
        setCampaigns([newCampaign, ...campaigns]);
        setView('list');
    };

    const handleLogDonation = (data: { amount: number; campaignId: number }) => {
        setCampaigns(campaigns.map(c => {
            if (c.id === data.campaignId) {
                return {
                    ...c,
                    raised: c.raised + data.amount,
                    donors: c.donors + 1
                };
            }
            return c;
        }));
        setView('list');
    };

    const handleManageClick = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setView('manage');
    };

    const handleSaveCampaign = (updatedCampaign: Campaign) => {
        setCampaigns(campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
        setView('list');
        setSelectedCampaign(null);
    };

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
                        <StatCard title="Total Raised (YTD)" value={`$${campaigns.reduce((acc, c) => acc + c.raised, 0).toLocaleString()}`} icon={FundraisingIcon} />
                        <StatCard title="Total Donors (YTD)" value={campaigns.reduce((acc, c) => acc + c.donors, 0).toLocaleString()} icon={UsersIcon} />
                        <StatCard title="Avg. Donation" value="$599" icon={TrendingUpIcon} />
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Active Campaigns</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {campaigns.map((campaign) => {
                                        const percentage = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
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
                                                    <a 
                                                        href="#" 
                                                        onClick={(e) => { e.preventDefault(); handleManageClick(campaign); }}
                                                        className="text-brand-primary hover:text-brand-secondary"
                                                    >
                                                        Manage
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
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
