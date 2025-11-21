
import React from 'react';
import Header from './Header';
import StatCard from './StatCard';
import { FundraisingIcon, TrendingUpIcon, UsersIcon } from './icons';

const Fundraising: React.FC = () => {
    const campaigns = [
        { id: 1, name: 'Annual Fund 2024', goal: 500000, raised: 325000, donors: 1240, status: 'Active' },
        { id: 2, name: 'New Wing Capital Campaign', goal: 2000000, raised: 850000, donors: 450, status: 'Active' },
        { id: 3, name: 'Education Initiative', goal: 100000, raised: 98000, donors: 310, status: 'Ending Soon' },
        { id: 4, name: 'Preservation Grant Match', goal: 50000, raised: 50000, donors: 125, status: 'Completed' },
    ];

    return (
        <div>
            <Header title="Fundraising" buttonText="+ New Campaign" onButtonClick={() => {}} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Raised (YTD)" value="$1,273,000" icon={FundraisingIcon} />
                <StatCard title="Total Donors (YTD)" value="2,125" icon={UsersIcon} />
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
                                            <a href="#" className="text-brand-primary hover:text-brand-secondary">Manage</a>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Fundraising;
