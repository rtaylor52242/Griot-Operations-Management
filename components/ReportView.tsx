
import React, { useState } from 'react';
import { ArrowLeftIcon } from './icons';

interface ReportViewProps {
    title: string;
    onBack: () => void;
}

type ChartType = 'Bar' | 'Line' | 'Area' | 'Bubble' | 'Heatmap' | 'Pie';

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

    const getDefaultValueIndex = () => {
        switch(title) {
            case 'Daily Sales Summary': return 4; 
            case 'Revenue by Category': return 1;
            case 'Monthly Financial Statement': return 1; 
            case 'Donation Analysis': return 2;
            case 'New Member Signups': return 4;
            case 'Renewal Rates': return 4;
            case 'Member Attendance': return 4;
            case 'Churn Analysis': return 4;
            case 'Daily Visitor Count': return 4;
            case 'Event Capacity Utilization': return 4;
            case 'Ticket Type Breakdown': return 2;
            case 'Peak Hours': return 1; 
            default: return 1;
        }
    };

    const [valueIndex, setValueIndex] = useState<number>(getDefaultValueIndex());
    const [showLabels, setShowLabels] = useState<boolean>(false);
    const [is3D, setIs3D] = useState<boolean>(false);

    const parseValue = (val: string): number => {
        if (!val) return 0;
        const cleanVal = val.replace(/[^0-9.-]/g, ''); 
        const num = parseFloat(cleanVal);
        return isNaN(num) ? 0 : num;
    };

    const numericColumnOptions = columns.map((col, index) => {
        if (index === 0) return null;
        return { label: col, index };
    }).filter((item): item is {label: string, index: number} => item !== null);

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

    const chartLabels = chartRows.map(row => row[0]);
    const chartValuesRaw = chartRows.map(row => row[valueIndex]);
    const chartValues = chartValuesRaw.map(parseValue);
    
    const maxVal = Math.max(...chartValues, 1);
    
    const colors = [
        '#4f46e5', '#7c3aed', '#db2777', '#ea580c', '#059669', '#0891b2', '#2563eb', '#9333ea'
    ];

    // Safe zone settings for SVG charts
    const safePaddingTop = 15;
    const safePaddingBottom = 10;
    const safePaddingX = 5;
    
    const getSafeX = (i: number, length: number) => {
        if (length <= 1) return 50;
        const usableWidth = 100 - (safePaddingX * 2);
        return safePaddingX + (i * (usableWidth / (length - 1)));
    };

    const getSafeY = (val: number, max: number) => {
        const usableHeight = 100 - (safePaddingTop + safePaddingBottom);
        if (max === 0) return 100 - safePaddingBottom;
        return (100 - safePaddingBottom) - ((val / max) * usableHeight);
    };

    const renderChart = () => {
        if (chartValues.length === 0) return <div className="h-64 flex items-center justify-center text-gray-500">No data to chart</div>;

        switch(chartType) {
            case 'Bar':
                return (
                    <div className="h-64 flex items-end justify-around px-4 pb-0 pt-12 bg-gray-50 rounded border border-gray-200 relative">
                        {chartValues.map((val, i) => {
                             const h = (val / maxVal) * 100;
                             return (
                                 <div 
                                    key={i} 
                                    className={`w-full mx-1 max-w-[60px] rounded-t transition-all relative group ${is3D ? 'shadow-[4px_4px_5px_rgba(0,0,0,0.3)]' : ''}`}
                                    style={{ 
                                        height: `${Math.max(h, 2)}%`,
                                        background: is3D ? 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' : '#4f46e5',
                                        opacity: is3D ? 1 : 0.8,
                                    }}
                                 >
                                    <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap z-10 ${showLabels ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        {showLabels ? chartValuesRaw[i] : `${chartLabels[i]}: ${chartValuesRaw[i]}`}
                                    </div>
                                 </div>
                             )
                        })}
                    </div>
                );
            case 'Line':
                const points = chartValues.map((val, i) => {
                    const x = getSafeX(i, chartValues.length);
                    const y = getSafeY(val, maxVal);
                    return `${x} ${y}`;
                }).join(',');
                
                return (
                    <div className="h-64 bg-gray-50 rounded border border-gray-200 p-4">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                             {/* Grid lines */}
                             {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                                 const y = getSafeY(ratio * maxVal, maxVal);
                                 return <line key={ratio} x1={safePaddingX} y1={y} x2={100-safePaddingX} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />;
                             })}
                             
                             <polyline 
                                points={points} 
                                fill="none" 
                                stroke="#4f46e5" 
                                strokeWidth="2" 
                                vectorEffect="non-scaling-stroke" 
                                style={{ filter: is3D ? 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))' : 'none' }}
                             />
                             {chartValues.map((val, i) => {
                                 const x = getSafeX(i, chartValues.length);
                                 const y = getSafeY(val, maxVal);
                                 return (
                                     <g key={i}>
                                        <circle cx={x} cy={y} r={is3D ? 2 : 1.5} fill="#4f46e5" className="hover:r-4 transition-all cursor-pointer">
                                            <title>{chartLabels[i]}: {chartValuesRaw[i]}</title>
                                        </circle>
                                        {showLabels && (
                                            <text x={x} y={y - 5} textAnchor="middle" fontSize="4" fill="#374151" fontWeight="bold">
                                                {chartValuesRaw[i]}
                                            </text>
                                        )}
                                     </g>
                                 )
                             })}
                        </svg>
                    </div>
                );
            case 'Area':
                const areaBaseY = getSafeY(0, maxVal);
                const areaPoints = chartValues.map((val, i) => {
                    const x = getSafeX(i, chartValues.length);
                    const y = getSafeY(val, maxVal);
                    return `${x},${y}`;
                }).join(' ');
                
                const firstX = getSafeX(0, chartValues.length);
                const lastX = getSafeX(chartValues.length - 1, chartValues.length);

                return (
                    <div className="h-64 bg-gray-50 rounded border border-gray-200 p-4">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {is3D ? (
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8"/>
                                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1"/>
                                    </linearGradient>
                                </defs>
                            ) : null}
                            <polygon 
                                points={`${firstX},${areaBaseY} ${areaPoints} ${lastX},${areaBaseY}`} 
                                fill={is3D ? "url(#areaGradient)" : "#4f46e5"} 
                                fillOpacity={is3D ? 1 : 0.2} 
                                stroke="none" 
                                style={{ filter: is3D ? 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))' : 'none' }}
                            />
                            <polyline points={areaPoints} fill="none" stroke="#4f46e5" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                             {chartValues.map((val, i) => {
                                 const x = getSafeX(i, chartValues.length);
                                 const y = getSafeY(val, maxVal);
                                 return (
                                    <g key={i}>
                                        <circle cx={x} cy={y} r="1.5" fill="#4f46e5">
                                            <title>{chartLabels[i]}: {chartValuesRaw[i]}</title>
                                        </circle>
                                        {showLabels && (
                                            <text x={x} y={y - 5} textAnchor="middle" fontSize="4" fill="#374151" fontWeight="bold">
                                                {chartValuesRaw[i]}
                                            </text>
                                        )}
                                    </g>
                                 )
                             })}
                        </svg>
                    </div>
                );
            case 'Bubble':
                const centerY = 50;
                 return (
                    <div className="h-64 bg-gray-50 rounded border border-gray-200 p-4 relative">
                         <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                             <line x1={safePaddingX} y1={centerY} x2={100-safePaddingX} y2={centerY} stroke="#e5e7eb" strokeWidth="1" />
                             {is3D && (
                                 <defs>
                                    <radialGradient id="bubbleGradient" cx="30%" cy="30%" r="70%">
                                        <stop offset="0%" stopColor="#a5b4fc" />
                                        <stop offset="100%" stopColor="#4f46e5" />
                                    </radialGradient>
                                 </defs>
                             )}
                            {chartValues.map((val, i) => {
                                const x = getSafeX(i, chartValues.length);
                                // Bubble size relative to value, capped at reasonable display size
                                const r = Math.max(2, (val / maxVal) * 15);
                                return (
                                    <g key={i}>
                                        <circle 
                                            cx={x} 
                                            cy={centerY} 
                                            r={r} 
                                            fill={is3D ? "url(#bubbleGradient)" : "#4f46e5"} 
                                            fillOpacity={is3D ? 1 : 0.6}
                                            className="hover:fill-opacity-80 transition-all cursor-pointer"
                                            style={{ filter: is3D ? 'drop-shadow(2px 2px 2px rgba(0,0,0,0.4))' : 'none' }}
                                        >
                                            <title>{chartLabels[i]}: {chartValuesRaw[i]}</title>
                                        </circle>
                                        {showLabels && (
                                            <text x={x} y={centerY + r + 6} textAnchor="middle" fontSize="4" fill="#374151" fontWeight="bold">
                                                {chartValuesRaw[i]}
                                            </text>
                                        )}
                                    </g>
                                )
                             })}
                        </svg>
                    </div>
                );
            case 'Heatmap':
                return (
                    <div className="h-64 bg-gray-50 rounded border border-gray-200 px-4 pt-10 pb-2 flex flex-col justify-center">
                        <div className="grid grid-flow-col auto-cols-fr gap-1 h-16">
                            {chartValues.map((val, i) => {
                                const intensity = val / maxVal;
                                return (
                                    <div 
                                        key={i} 
                                        className={`rounded hover:opacity-75 transition-opacity relative group ${is3D ? 'shadow-inner' : ''}`} 
                                        style={{ 
                                            backgroundColor: `rgba(79, 70, 229, ${Math.max(0.1, intensity)})`,
                                            transform: is3D ? 'scale(0.95)' : 'scale(1)',
                                            boxShadow: is3D ? '2px 2px 5px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >
                                        <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap z-10 ${showLabels ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {showLabels ? chartValuesRaw[i] : `${chartLabels[i]}: ${chartValuesRaw[i]}`}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                         <div className="text-center text-sm text-gray-400 mt-4">
                            Intensity based on relative value of {columns[valueIndex]}
                        </div>
                    </div>
                );
            case 'Pie':
                const total = chartValues.reduce((sum, val) => sum + val, 0);
                let cumulativePercent = 0;

                const getSlicePath = (startPercent: number, endPercent: number) => {
                    const startX = Math.cos(2 * Math.PI * startPercent - Math.PI / 2);
                    const startY = Math.sin(2 * Math.PI * startPercent - Math.PI / 2);
                    const endX = Math.cos(2 * Math.PI * endPercent - Math.PI / 2);
                    const endY = Math.sin(2 * Math.PI * endPercent - Math.PI / 2);
                    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;
                    return `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
                };

                return (
                    <div className="h-64 bg-gray-50 rounded border border-gray-200 p-4 flex items-center justify-center">
                        <div style={{ 
                            width: '200px', 
                            height: '200px', 
                            transform: is3D ? 'rotateX(60deg) rotateZ(-45deg)' : 'none',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.5s ease'
                        }}>
                            <svg viewBox="-1.2 -1.2 2.4 2.4" style={{ overflow: 'visible', filter: is3D ? 'drop-shadow(0px 10px 5px rgba(0,0,0,0.3))' : 'none' }}>
                                {chartValues.map((val, i) => {
                                    const percent = val / total;
                                    const startPercent = cumulativePercent;
                                    const endPercent = cumulativePercent + percent;
                                    cumulativePercent += percent;
                                    
                                    // Determine label position (midpoint of slice)
                                    const midPercent = startPercent + percent / 2;
                                    const labelX = Math.cos(2 * Math.PI * midPercent - Math.PI / 2) * 0.7;
                                    const labelY = Math.sin(2 * Math.PI * midPercent - Math.PI / 2) * 0.7;

                                    const color = colors[i % colors.length];

                                    return (
                                        <g key={i} className="group">
                                            <path 
                                                d={getSlicePath(startPercent, endPercent)} 
                                                fill={color} 
                                                stroke="white" 
                                                strokeWidth={is3D ? "0.02" : "0.01"}
                                                className="hover:opacity-90 transition-all cursor-pointer origin-center hover:scale-105"
                                            >
                                                 <title>{chartLabels[i]}: {chartValuesRaw[i]} ({(percent * 100).toFixed(1)}%)</title>
                                            </path>
                                             {showLabels && (
                                                <text 
                                                    x={labelX} 
                                                    y={labelY} 
                                                    textAnchor="middle" 
                                                    dominantBaseline="middle" 
                                                    fontSize="0.12" 
                                                    fill="white" 
                                                    fontWeight="bold"
                                                    style={{ pointerEvents: 'none' }}
                                                >
                                                    {chartValuesRaw[i]}
                                                </text>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
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
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex bg-gray-100 p-1 rounded mr-2">
                             {(['Bar', 'Line', 'Area', 'Bubble', 'Heatmap', 'Pie'] as ChartType[]).map(type => (
                                <button
                                    key={type}
                                    onClick={() => setChartType(type)}
                                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                        chartType === type 
                                            ? 'bg-white text-brand-primary shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center">
                        <span className="mr-2 text-gray-600">Data Metric:</span>
                        <select 
                            value={valueIndex}
                            onChange={(e) => setValueIndex(Number(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1 focus:ring-brand-primary focus:border-brand-primary bg-white text-black cursor-pointer outline-none"
                        >
                            {numericColumnOptions.map(opt => (
                                <option key={opt.index} value={opt.index}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    
                    <label className="flex items-center cursor-pointer select-none">
                        <input 
                            type="checkbox" 
                            checked={showLabels} 
                            onChange={(e) => setShowLabels(e.target.checked)}
                            className="form-checkbox h-4 w-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                        />
                        <span className="ml-2 text-gray-600">Show Value Labels</span>
                    </label>

                    <label className="flex items-center cursor-pointer select-none">
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input 
                                type="checkbox" 
                                name="toggle" 
                                id="toggle" 
                                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                checked={is3D}
                                onChange={(e) => setIs3D(e.target.checked)}
                                style={{ 
                                    right: is3D ? '0' : 'auto', 
                                    left: is3D ? 'auto' : '0',
                                    borderColor: is3D ? '#4f46e5' : '#d1d5db'
                                }}
                            />
                            <label 
                                htmlFor="toggle" 
                                className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${is3D ? 'bg-brand-primary' : 'bg-gray-300'}`}
                            ></label>
                        </div>
                        <span className="text-gray-600">3D Mode</span>
                    </label>
                </div>

                {renderChart()}
                
                {/* X-Axis Labels for Non-Heatmap/Pie */}
                {chartType !== 'Heatmap' && chartType !== 'Pie' && (
                    <div className="flex justify-around mt-2 px-4 text-xs text-gray-500 overflow-hidden">
                        {chartLabels.map((l, i) => (
                            <span key={i} className="truncate text-center w-full px-1" title={l}>{l}</span>
                        ))}
                    </div>
                )}
                {/* Legend for Pie */}
                {chartType === 'Pie' && (
                     <div className="flex flex-wrap justify-center mt-4 gap-4">
                         {chartLabels.map((l, i) => (
                             <div key={i} className="flex items-center text-xs">
                                 <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colors[i % colors.length] }}></span>
                                 <span className="text-gray-600">{l}</span>
                             </div>
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
