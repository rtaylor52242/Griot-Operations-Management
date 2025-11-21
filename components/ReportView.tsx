
import React, { useState } from 'react';
import { ArrowLeftIcon } from './icons';

interface ReportViewProps {
    title: string;
    onBack: () => void;
}

type ChartType = 'Bar' | 'Line' | 'Area' | 'Bubble' | 'Heatmap';

const ReportView: React.FC<ReportViewProps> = ({ title, onBack }) => {
    const [chartType, setChartType] = useState<ChartType>('Bar');
    
    const getReportData = (reportTitle: string) => {
        switch(reportTitle) {
            case 'Daily Sales Summary':
                return {
                    columns: ['Date', 'Ticket Sales', 'Membership', 'Donations', 'Total Revenue'],
                    data: [
                        ['Oct 24, 2024', '$2,450', '$1,200', '$500', '$4,150'],
                        ['Oct 23, 2024', '$1,890', '$950', '$150', '$2,990'],
                        ['Oct 22, 2024', '$2,100', '$600', '$750', '$3,450'],
                        ['Oct 21, 2024', '$1,500', '$1,500', '$200', '$3,200'],
                        ['Oct 20, 2024', '$3,200', '$450', '$1,200', '$4,850'],
                    ]
                };
            case 'Revenue by Category':
                return {
                    columns: ['Category', 'Current Month', 'Previous Month', 'Change', '% of Total'],
                    data: [
                        ['Ticketing', '$45,200', '$42,100', '+$3,100', '45%'],
                        ['Membership', '$32,500', '$30,000', '+$2,500', '32%'],
                        ['Fundraising', '$15,000', '$18,000', '-$3,000', '15%'],
                        ['Retail', '$8,300', '$7,900', '+$400', '8%'],
                    ]
                };
            case 'Monthly Financial Statement':
                return {
                    columns: ['Month', 'Total Income', 'Total Expenses', 'Net Income', 'Cash Flow'],
                    data: [
                        ['Sept 2024', '$101,000', '$85,000', '$16,000', 'Positive'],
                        ['Aug 2024', '$98,500', '$82,000', '$16,500', 'Positive'],
                        ['July 2024', '$105,200', '$88,000', '$17,200', 'Positive'],
                        ['June 2024', '$92,000', '$80,000', '$12,000', 'Positive'],
                    ]
                };
            case 'Donation Analysis':
                return {
                    columns: ['Donor Tier', 'Donor Count', 'Total Amount', 'Avg Donation', 'Top Campaign'],
                    data: [
                        ['Platinum', '12', '$85,000', '$7,083', 'New Wing'],
                        ['Gold', '45', '$68,000', '$1,511', 'Annual Fund'],
                        ['Silver', '250', '$42,000', '$168', 'Education'],
                        ['Bronze', '850', '$21,000', '$24', 'Annual Fund'],
                    ]
                };
            case 'New Member Signups':
                return {
                    columns: ['Date', 'Individual', 'Household', 'Supporter', 'Total New'],
                    data: [
                        ['Oct 24, 2024', '12', '8', '2', '22'],
                        ['Oct 23, 2024', '10', '5', '1', '16'],
                        ['Oct 22, 2024', '15', '10', '0', '25'],
                        ['Oct 21, 2024', '8', '6', '3', '17'],
                    ]
                };
            case 'Renewal Rates':
                return {
                    columns: ['Membership Tier', 'Total Members', 'Renewals', 'Expirations', 'Renewal Rate'],
                    data: [
                        ['Individual', '1,254', '85', '15', '85%'],
                        ['Household', '3,891', '210', '20', '91%'],
                        ['Supporter', '432', '18', '1', '95%'],
                        ['Patron', '128', '5', '0', '100%'],
                    ]
                };
            case 'Member Attendance':
                return {
                    columns: ['Date', 'Member Visits', 'Guest Passes Used', 'Event Attendees', 'Total'],
                    data: [
                        ['Oct 24, 2024', '145', '32', '0', '177'],
                        ['Oct 23, 2024', '110', '25', '45', '180'],
                        ['Oct 22, 2024', '95', '18', '0', '113'],
                        ['Oct 21, 2024', '130', '40', '0', '170'],
                    ]
                };
            case 'Churn Analysis':
                return {
                    columns: ['Month', 'Members at Start', 'New Members', 'Lost Members', 'Churn Rate'],
                    data: [
                        ['Sept 2024', '5,600', '210', '45', '0.8%'],
                        ['Aug 2024', '5,520', '180', '100', '1.8%'],
                        ['July 2024', '5,450', '200', '130', '2.4%'],
                        ['June 2024', '5,400', '150', '100', '1.9%'],
                    ]
                };
            case 'Daily Visitor Count':
                return {
                    columns: ['Date', 'Adults', 'Children', 'Seniors', 'Total Visitors'],
                    data: [
                        ['Oct 24, 2024', '450', '120', '80', '650'],
                        ['Oct 23, 2024', '380', '90', '60', '530'],
                        ['Oct 22, 2024', '410', '150', '75', '635'],
                        ['Oct 21, 2024', '300', '50', '120', '470'],
                    ]
                };
            case 'Event Capacity Utilization':
                return {
                    columns: ['Event Name', 'Date', 'Capacity', 'Tickets Sold', 'Utilization %'],
                    data: [
                        ['Night at Museum', 'Oct 28', '200', '185', '92.5%'],
                        ['Pottery Wkshp', 'Nov 12', '20', '20', '100%'],
                        ['Art History', 'Nov 05', '100', '45', '45%'],
                        ['Gen Admin', 'Daily', 'Unlimited', '452', 'N/A'],
                    ]
                };
            case 'Ticket Type Breakdown':
                return {
                    columns: ['Ticket Type', 'Qty Sold', 'Revenue', '% of Sales'],
                    data: [
                        ['Adult', '1,200', '$30,000', '55%'],
                        ['Child', '800', '$12,000', '22%'],
                        ['Senior', '400', '$8,000', '15%'],
                        ['Student', '150', '$2,700', '5%'],
                        ['Guest', '100', '$1,200', '3%'],
                    ]
                };
            case 'Peak Hours':
                return {
                    columns: ['Time Block', 'Avg Visitors', 'Weekend Avg', 'Staffing Level'],
                    data: [
                        ['09-11 AM', '85', '250', 'Medium'],
                        ['11-01 PM', '220', '550', 'High'],
                        ['01-03 PM', '180', '480', 'High'],
                        ['03-05 PM', '120', '300', 'Medium'],
                    ]
                };
            default:
                return { columns: ['Detail'], data: [['No data available']] };
        }
    };

    const { columns, data } = getReportData(title);

    // Logic to parse data for charts
    const parseValue = (val: string): number => {
        if (!val) return 0;
        const cleanVal = val.replace(/[^0-9.-]/g, ''); 
        const num = parseFloat(cleanVal);
        return isNaN(num) ? 0 : num;
    };

    // Determine which column contains the main value for the chart
    let valueIndex = 1;
    switch(title) {
        case 'Daily Sales Summary': valueIndex = 4; break; 
        case 'Revenue by Category': valueIndex = 1; break;
        case 'Monthly Financial Statement': valueIndex = 1; break; 
        case 'Donation Analysis': valueIndex = 2; break;
        case 'New Member Signups': valueIndex = 4; break;
        case 'Renewal Rates': valueIndex = 4; break;
        case 'Member Attendance': valueIndex = 4; break;
        case 'Churn Analysis': valueIndex = 4; break;
        case 'Daily Visitor Count': valueIndex = 4; break;
        case 'Event Capacity Utilization': valueIndex = 4; break;
        case 'Ticket Type Breakdown': valueIndex = 2; break;
        case 'Peak Hours': valueIndex = 1; break; 
        default: valueIndex = 1;
    }

    // Reports that are time-based usually come Latest -> Oldest in tables, 
    // but should be Oldest -> Latest in charts.
    const timeSeriesReports = [
        'Daily Sales Summary',
        'Monthly Financial Statement',
        'New Member Signups',
        'Member Attendance',
        'Churn Analysis',
        'Daily Visitor Count'
    ];

    let chartRows = [...data];
    if (timeSeriesReports.includes(title)) {
        chartRows.reverse();
    }

    // Prepare Chart Data
    const chartLabels = chartRows.map(row => row[0]); // Assuming first column is label
    const chartValuesRaw = chartRows.map(row => row[valueIndex]);
    const chartValues = chartValuesRaw.map(parseValue);
    
    const maxVal = Math.max(...chartValues, 1);
    
    const getX = (i: number, length: number) => {
        if (length <= 1) return 50;
        return i * (100 / (length - 1));
    }

    const renderChart = () => {
        if (chartValues.length === 0) return <div className="h-64 flex items-center justify-center text-gray-500">No data to chart</div>;

        switch(chartType) {
            case 'Bar':
                return (
                    <div className="h-64 flex items-end justify-around p-4 pb-0 bg-gray-50 rounded border border-gray-200">
                        {chartValues.map((val, i) => {
                             const h = (val / maxVal) * 100;
                             return (
                                 <div key={i} className="w-full mx-1 max-w-[60px] bg-brand-primary bg-opacity-80 hover:bg-opacity-100 rounded-t transition-all relative group" style={{ height: `${Math.max(h, 2)}%` }}>
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {chartLabels[i]}: {chartValuesRaw[i]}
                                    </div>
                                 </div>
                             )
                        })}
                    </div>
                );
            case 'Line':
                const points = chartValues.map((val, i) => {
                    const x = getX(i, chartValues.length);
                    const y = 100 - ((val / maxVal) * 100);
                    return `${x} ${y}`;
                }).join(',');
                
                return (
                    <div className="h-64 bg-gray-50 rounded border border-gray-200 p-4">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                             {/* Grid lines */}
                             {[0, 25, 50, 75, 100].map(y => (
                                 <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
                             ))}
                             
                             <polyline points={points} fill="none" stroke="#4f46e5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                             {chartValues.map((val, i) => {
                                 const x = getX(i, chartValues.length);
                                 const y = 100 - ((val / maxVal) * 100);
                                 return (
                                     <circle key={i} cx={x} cy={y} r="1.5" fill="#4f46e5" className="hover:r-4 transition-all cursor-pointer">
                                         <title>{chartLabels[i]}: {chartValuesRaw[i]}</title>
                                     </circle>
                                 )
                             })}
                        </svg>
                    </div>
                );
            case 'Area':
                const areaPoints = chartValues.map((val, i) => {
                    const x = getX(i, chartValues.length);
                    const y = 100 - ((val / maxVal) * 100);
                    return `${x},${y}`;
                }).join(' ');
                
                return (
                    <div className="h-64 bg-gray-50 rounded border border-gray-200 p-4">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <polygon points={`0,100 ${areaPoints} 100,100`} fill="#4f46e5" fillOpacity="0.2" stroke="none" />
                            <polyline points={areaPoints} fill="none" stroke="#4f46e5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                             {chartValues.map((val, i) => {
                                 const x = getX(i, chartValues.length);
                                 const y = 100 - ((val / maxVal) * 100);
                                 return <circle key={i} cx={x} cy={y} r="1.5" fill="#4f46e5"><title>{chartLabels[i]}: {chartValuesRaw[i]}</title></circle>
                             })}
                        </svg>
                    </div>
                );
            case 'Bubble':
                 return (
                    <div className="h-64 bg-gray-50 rounded border border-gray-200 p-4 relative">
                         <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                             <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                            {chartValues.map((val, i) => {
                                const x = getX(i, chartValues.length);
                                // Bubble size relative to value, capped at reasonable display size
                                const r = Math.max(2, (val / maxVal) * 15);
                                return (
                                     <circle 
                                        key={i} 
                                        cx={x} 
                                        cy={50} // Align on center line for simple bubble view 
                                        r={r} 
                                        fill="#4f46e5" 
                                        fillOpacity="0.6"
                                        className="hover:fill-opacity-80 transition-all cursor-pointer"
                                    >
                                        <title>{chartLabels[i]}: {chartValuesRaw[i]}</title>
                                    </circle>
                                )
                             })}
                        </svg>
                    </div>
                );
            case 'Heatmap':
                return (
                    <div className="h-64 bg-gray-50 rounded border border-gray-200 p-4 flex flex-col justify-center">
                        <div className="grid grid-flow-col auto-cols-fr gap-1 h-16">
                            {chartValues.map((val, i) => {
                                const intensity = val / maxVal;
                                return (
                                    <div 
                                        key={i} 
                                        className="rounded hover:opacity-75 transition-opacity relative group" 
                                        style={{ backgroundColor: `rgba(79, 70, 229, ${Math.max(0.1, intensity)})` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {chartLabels[i]}: {chartValuesRaw[i]}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                         <div className="text-center text-sm text-gray-400 mt-4">
                            Intensity based on relative value
                        </div>
                    </div>
                );
        }
    };

    const handleDownloadCSV = () => {
        const csvContent = [
            columns.map(c => `"${c}"`).join(','),
            ...data.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${title.replace(/\s+/g, '_')}_Report.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <button 
                    onClick={onBack}
                    className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-2 sm:mb-0">
                        Visualization: {columns[valueIndex]}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {(['Bar', 'Line', 'Area', 'Bubble', 'Heatmap'] as ChartType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => setChartType(type)}
                                className={`px-3 py-1 text-xs font-medium rounded border transition-colors ${
                                    chartType === type 
                                        ? 'bg-brand-primary text-white border-brand-primary' 
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                
                {renderChart()}
                
                {/* X-Axis Labels for Non-Heatmap */}
                {chartType !== 'Heatmap' && (
                    <div className="flex justify-around mt-2 px-4 text-xs text-gray-500 overflow-hidden">
                        {chartLabels.map((l, i) => (
                            <span key={i} className="truncate text-center w-full px-1" title={l}>{l}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Detailed Data</h2>
                    <button 
                        onClick={handleDownloadCSV}
                        className="text-sm text-brand-primary hover:underline"
                    >
                        Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((col, i) => (
                                    <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    {row.map((cell, j) => (
                                        <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportView;
