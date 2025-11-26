
import React, { useState, useMemo } from 'react';
import { ArrowLeftIcon } from './icons';
import { logActivity } from '../services/activityService';

interface ReportViewProps {
    title: string;
    onBack: () => void;
}

type ChartType = 'Bar' | 'Line' | 'Pie';
type SortDirection = 'asc' | 'desc';

const ReportView: React.FC<ReportViewProps> = ({ title, onBack }) => {
    const [chartType, setChartType] = useState<ChartType>('Bar');
    
    // Sorting state for detailed data
    const [sortColIndex, setSortColIndex] = useState<number | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const { columns, data } = useMemo(() => {
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
        return getReportData(title);
    }, [title]);

    const sortedData = useMemo(() => {
        if (sortColIndex === null) return data;

        return [...data].sort((a, b) => {
            const valA = a[sortColIndex];
            const valB = b[sortColIndex];

            // Try to extract number for numeric sort
            const numA = parseFloat(valA.replace(/[^0-9.-]/g, ''));
            const numB = parseFloat(valB.replace(/[^0-9.-]/g, ''));

            const isNumA = !isNaN(numA) && valA.includes(numA.toString());
            const isNumB = !isNaN(numB) && valB.includes(numB.toString());

            if (isNumA && isNumB) {
                return sortDirection === 'asc' ? numA - numB : numB - numA;
            }

            return sortDirection === 'asc' 
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        });
    }, [data, sortColIndex, sortDirection]);

    const handleSort = (index: number) => {
        if (sortColIndex === index) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColIndex(index);
            setSortDirection('asc');
        }
    };

    const renderSortIcon = (index: number) => {
        if (sortColIndex !== index) return <span className="ml-1 text-gray-300 opacity-50 hover:opacity-100">↕</span>;
        return <span className="ml-1 text-brand-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };

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
    const [is3D, setIs3D] = useState<boolean>(true);

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
        '#6366f1', '#14b8a6', '#f43f5e', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#ec4899'
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
                    <div className="h-64 flex items-end justify-around px-4 pb-0 pt-12 bg-gray-50 rounded border border-gray-200 relative print:border-gray-300">
                        {chartValues.map((val, i) => {
                             const h = (val / maxVal) * 100;
                             const color = colors[i % colors.length];
                             return (
                                 <div 
                                    key={i} 
                                    className={`w-full mx-1 max-w-[60px] rounded-t-md transition-all relative group ${is3D ? 'shadow-[3px_3px_6px_rgba(0,0,0,0.25)]' : ''}`}
                                    style={{ 
                                        height: `${Math.max(h, 2)}%`,
                                        background: is3D 
                                            ? `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` 
                                            : color,
                                        opacity: 0.9,
                                        printColorAdjust: 'exact',
                                        WebkitPrintColorAdjust: 'exact'
                                    }}
                                 >
                                    <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap z-10 pointer-events-none ${showLabels ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        {showLabels ? chartValuesRaw[i] : `${chartLabels[i]}: ${chartValuesRaw[i]}`}
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                                    </div>
                                 </div>
                             )
                        })}
                    </div>
                );
            case 'Line':
                const getControlPoint = (current: number[], previous: number[], next: number[], reverse?: boolean) => {
                    const p = previous || current;
                    const n = next || current;
                    const smoothing = 0.2;
                    const line = [n[0] - p[0], n[1] - p[1]];
                    const angle = Math.atan2(line[1], line[0]) + (reverse ? Math.PI : 0);
                    const length = Math.sqrt(Math.pow(line[0], 2) + Math.pow(line[1], 2)) * smoothing;
                    return [current[0] + Math.cos(angle) * length, current[1] + Math.sin(angle) * length];
                };

                const coordinates = chartValues.map((val, i) => [getSafeX(i, chartValues.length), getSafeY(val, maxVal)]);
                
                const pathData = coordinates.reduce((acc, point, i, a) => {
                    if (i === 0) return `M ${point[0]},${point[1]}`;
                    const [cpsX, cpsY] = getControlPoint(a[i - 1], a[i - 2], point);
                    const [cpeX, cpeY] = getControlPoint(point, a[i - 1], a[i + 1], true);
                    return `${acc} C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
                }, '');
                
                return (
                    <div className="h-64 bg-gray-50 rounded border border-gray-200 p-4 print:border-gray-300">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                             {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                                 const y = getSafeY(ratio * maxVal, maxVal);
                                 return <line key={ratio} x1={safePaddingX} y1={y} x2={100-safePaddingX} y2={y} stroke="#e5e7eb" strokeWidth="0.3" strokeDasharray="1,1" />;
                             })}
                             
                             <path 
                                d={pathData} 
                                fill="none" 
                                stroke={colors[0]} 
                                strokeWidth="1.5" 
                                vectorEffect="non-scaling-stroke" 
                                style={{ filter: is3D ? 'drop-shadow(2px 4px 3px rgb(0 0 0 / 0.2))' : 'none' }}
                             />
                             {coordinates.map((point, i) => (
                                 <g key={i} className="group">
                                    <circle cx={point[0]} cy={point[1]} r={is3D ? 1.8 : 1.2} fill="white" stroke={colors[0]} strokeWidth="0.5" className="hover:r-2 transition-all cursor-pointer" />
                                    <rect x={point[0]-3} y={point[1]-3} width="6" height="6" fill="transparent" />
                                    <g className={`opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${showLabels ? 'opacity-100' : ''}`}>
                                        {/* Improved Tooltip/Label */}
                                        <rect x={point[0] - 8} y={point[1] - 12} width="16" height="5" rx="1" fill="#1f2937" opacity="0.9" />
                                        <path d={`M${point[0]-1.5},${point[1]-7} L${point[0]},${point[1]-5} L${point[0]+1.5},${point[1]-7} Z`} fill="#1f2937" opacity="0.9" />
                                        <text x={point[0]} y={point[1] - 8.5} textAnchor="middle" dominantBaseline="middle" fontSize="2.5" fill="white" fontWeight="600">
                                            {chartValuesRaw[i]}
                                        </text>
                                    </g>
                                 </g>
                             ))}
                        </svg>
                    </div>
                );
            case 'Pie':
                const total = chartValues.reduce((sum, val) => sum + val, 0);
                let cumulativePercent = 0;
                const innerRadius = 0.6; 

                const getSlicePath = (startPercent: number, endPercent: number, innerRadius: number) => {
                    const startX = Math.cos(2 * Math.PI * startPercent - Math.PI / 2);
                    const startY = Math.sin(2 * Math.PI * startPercent - Math.PI / 2);
                    const endX = Math.cos(2 * Math.PI * endPercent - Math.PI / 2);
                    const endY = Math.sin(2 * Math.PI * endPercent - Math.PI / 2);
                    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;
                    const startX2 = Math.cos(2 * Math.PI * endPercent - Math.PI / 2) * innerRadius;
                    const startY2 = Math.sin(2 * Math.PI * endPercent - Math.PI / 2) * innerRadius;
                    const endX2 = Math.cos(2 * Math.PI * startPercent - Math.PI / 2) * innerRadius;
                    const endY2 = Math.sin(2 * Math.PI * startPercent - Math.PI / 2) * innerRadius;

                    return `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L ${startX2} ${startY2} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endX2} ${endY2} Z`;
                };

                return (
                    <div className="h-64 bg-gray-50 rounded border border-gray-200 p-4 flex items-center justify-center print:border-gray-300">
                        <div style={{ 
                            width: '240px', 
                            height: '240px', 
                            transform: is3D ? 'perspective(500px) rotateX(40deg)' : 'none',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.5s ease'
                        }}>
                            <svg viewBox="-1.2 -1.2 2.4 2.4" style={{ overflow: 'visible', filter: is3D ? 'drop-shadow(0px 12px 6px rgba(0,0,0,0.2))' : 'none' }}>
                                {chartValues.map((val, i) => {
                                    const percent = val / total;
                                    const startPercent = cumulativePercent;
                                    const endPercent = cumulativePercent + percent;
                                    cumulativePercent += percent;
                                    const color = colors[i % colors.length];

                                    // Label placement calculation
                                    const midPercent = startPercent + (percent / 2);
                                    const midAngle = 2 * Math.PI * midPercent - Math.PI / 2;
                                    const labelRadius = (innerRadius + 1) / 2;
                                    const labelX = Math.cos(midAngle) * labelRadius;
                                    const labelY = Math.sin(midAngle) * labelRadius;

                                    return (
                                        <g key={i} className="group">
                                            <path 
                                                d={getSlicePath(startPercent, endPercent, innerRadius)} 
                                                fill={color} 
                                                stroke="white" 
                                                strokeWidth="0.01"
                                                className="hover:opacity-90 transition-all cursor-pointer origin-center hover:scale-105"
                                                style={{ 
                                                    transformBox: 'fill-box', 
                                                    printColorAdjust: 'exact',
                                                    WebkitPrintColorAdjust: 'exact' 
                                                }}
                                            >
                                                 <title>{chartLabels[i]}: {chartValuesRaw[i]} ({(percent * 100).toFixed(1)}%)</title>
                                            </path>
                                            {/* Render labels if showLabels is true and slice is large enough */}
                                            {showLabels && percent > 0.05 && (
                                                <text
                                                    x={labelX}
                                                    y={labelY}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fontSize="0.1"
                                                    fill="white"
                                                    fontWeight="bold"
                                                    style={{ 
                                                        textShadow: '0px 0px 3px rgba(0,0,0,0.5)', 
                                                        pointerEvents: 'none'
                                                    }}
                                                >
                                                    {chartValuesRaw[i]}
                                                </text>
                                            )}
                                        </g>
                                    );
                                })}
                                <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="0.25" fill="#374151" fontWeight="bold">
                                    {total.toLocaleString()}
                                </text>
                                <text x="0" y="0.2" textAnchor="middle" dominantBaseline="middle" fontSize="0.1" fill="#6b7280">
                                    Total
                                </text>
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
        logActivity('Report Exported', `Downloaded CSV for report: ${title}`, 'system');
    };

    const handleExportPDF = () => {
        window.print();
        logActivity('Report Exported', `Exported PDF (Print) for report: ${title}`, 'system');
    };

    const handleExportWord = () => {
        const tableRows = sortedData.map(row =>
            `<tr>${row.map(cell => `<td style="border:1px solid #ddd; padding:8px;">${cell}</td>`).join('')}</tr>`
        ).join('');

        const tableHeader = `<tr>${columns.map(col => `<th style="border:1px solid #ddd; padding:8px; background-color:#f2f2f2;">${col}</th>`).join('')}</tr>`;

        const htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset="utf-8">
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    h1 { color: #333; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <p><strong>Visualization Type:</strong> ${chartType}</p>
                <p><em>Note: Charts are rendered dynamically in the web app and cannot be directly embedded in this simple Word export. Please reference the Detailed Data below.</em></p>
                <h2>Detailed Data</h2>
                <table>
                    <thead>${tableHeader}</thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </body>
            </html>
        `;

        const blob = new Blob(['\ufeff', htmlContent], {
            type: 'application/msword'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/\s+/g, '_')}_Report.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        logActivity('Report Exported', `Downloaded Word Doc for report: ${title}`, 'system');
    };

    return (
        <div>
            <style>{`
                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>
            <div className="flex items-center mb-6 print:hidden">
                <button 
                    onClick={onBack}
                    className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            </div>
            
            {/* Title for print view only */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6 hidden print:block">{title}</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8 print:shadow-none print:border print:border-gray-300 break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 print:hidden">
                    <h3 className="text-lg font-medium text-gray-700 mb-2 sm:mb-0">
                        Visualization: {columns[valueIndex]}
                    </h3>
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex bg-gray-100 p-1 rounded mr-2">
                             {(['Bar', 'Line', 'Pie'] as ChartType[]).map(type => (
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
                
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm print:hidden">
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
                                    borderColor: is3D ? '#6366f1' : '#d1d5db'
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
                
                {chartType !== 'Pie' && (
                    <div className="flex justify-around mt-2 px-4 text-xs text-gray-500 overflow-hidden">
                        {chartLabels.map((l, i) => (
                            <span key={i} className="truncate text-center w-full px-1" title={l}>{l}</span>
                        ))}
                    </div>
                )}
                {chartType === 'Pie' && (
                     <div className="flex flex-wrap justify-center mt-4 gap-4">
                         {chartLabels.map((l, i) => (
                             <div key={i} className="flex items-center text-xs">
                                 <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colors[i % colors.length], printColorAdjust: 'exact' }}></span>
                                 <span className="text-gray-600">{l}: {chartValuesRaw[i]}</span>
                             </div>
                         ))}
                     </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden print:shadow-none print:border print:border-gray-300">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 print:bg-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Detailed Data</h2>
                    <div className="flex space-x-4 print:hidden">
                        <button 
                            onClick={handleExportWord}
                            className="text-sm text-brand-primary hover:underline"
                        >
                            Export Word
                        </button>
                        {/* Removed PDF button as functionality is broken/removed in context */}
                        <button 
                            onClick={handleDownloadCSV}
                            className="text-sm text-brand-primary hover:underline"
                        >
                            Export CSV
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 print:bg-gray-100">
                            <tr>
                                {columns.map((col, i) => (
                                    <th 
                                        key={i} 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none"
                                        onClick={() => handleSort(i)}
                                    >
                                        <div className="flex items-center">
                                            {col}
                                            {renderSortIcon(i)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedData.map((row, i) => (
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
