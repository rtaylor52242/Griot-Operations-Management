
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="p-3 rounded-full bg-brand-primary bg-opacity-10 text-brand-primary">
                <Icon className="w-6 h-6" />
            </div>
            <div className="ml-4">
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
