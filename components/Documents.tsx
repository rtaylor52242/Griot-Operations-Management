
import React, { useRef, useState, useMemo } from 'react';
import Header from './Header';
import { CloudUploadIcon, TrashIcon, EyeIcon, DocumentTextIcon, SearchIcon } from './icons';
import { Doc } from '../types';
import { logActivity } from '../services/activityService';

interface DocumentsProps {
    docs: Doc[];
    setDocs: React.Dispatch<React.SetStateAction<Doc[]>>;
    onAdd?: (doc: Doc) => void;
    onDelete?: (id: string) => void;
}

type SortKey = 'name' | 'type' | 'size' | 'date';
type SortDirection = 'asc' | 'desc';

const Documents: React.FC<DocumentsProps> = ({ docs, setDocs, onAdd, onDelete }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sorting and Filtering State
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newDocs: Doc[] = Array.from(files).map((file: File) => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.type || 'Unknown',
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                date: new Date().toISOString().split('T')[0],
                url: URL.createObjectURL(file)
            }));
            
            if (onAdd) {
                newDocs.forEach(doc => onAdd(doc));
            } else {
                setDocs([...newDocs, ...docs]);
            }
            logActivity('Document Uploaded', `Uploaded ${files.length} file(s)`, 'system');
        }
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = (id: string) => {
        const doc = docs.find(d => d.id === id);
        if (onDelete) {
            onDelete(id);
        } else {
            setDocs(docs.filter(d => d.id !== id));
        }
        if (doc) {
            logActivity('Document Deleted', `Deleted document: ${doc.name}`, 'system');
        }
    };

    const handleView = (doc: Doc) => {
        if (doc.url && doc.url !== '#') {
             window.open(doc.url, '_blank');
        } else {
            alert('This is a mock file and cannot be viewed.');
        }
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const parseSize = (sizeStr: string) => {
        const num = parseFloat(sizeStr.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? 0 : num;
    };

    const uniqueTypes = useMemo(() => {
        const types = new Set(docs.map(d => d.type).filter(Boolean));
        return ['All', ...Array.from(types)];
    }, [docs]);

    const filteredAndSortedDocs = useMemo(() => {
        let result = docs.filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'All' || doc.type === typeFilter;
            return matchesSearch && matchesType;
        });

        return result.sort((a, b) => {
            let aValue: any = a[sortKey];
            let bValue: any = b[sortKey];

            if (sortKey === 'size') {
                aValue = parseSize(a.size);
                bValue = parseSize(b.size);
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [docs, searchTerm, typeFilter, sortKey, sortDirection]);

    const renderSortIcon = (key: SortKey) => {
        if (sortKey !== key) return <span className="ml-1 text-gray-400 opacity-0 group-hover:opacity-50">↕</span>;
        return <span className="ml-1 text-brand-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <div>
            <Header title="Documents & Media" buttonText="Upload File" onButtonClick={handleUploadClick} />
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
                multiple 
            />
            
            {/* Filter and Search Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-black focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                    />
                </div>
                <div className="w-full sm:w-48">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white text-black"
                    >
                        {uniqueTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th 
                                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center">Name {renderSortIcon('name')}</div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                onClick={() => handleSort('type')}
                            >
                                <div className="flex items-center">Type {renderSortIcon('type')}</div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                onClick={() => handleSort('size')}
                            >
                                <div className="flex items-center">Size {renderSortIcon('size')}</div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                                onClick={() => handleSort('date')}
                            >
                                <div className="flex items-center">Date Added {renderSortIcon('date')}</div>
                            </th>
                            <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedDocs.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <DocumentTextIcon className="flex-shrink-0 h-6 w-6 text-gray-400 mr-3" />
                                        <span className="text-base font-medium text-gray-900">{doc.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500 truncate max-w-xs">{doc.type || 'Unknown'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{doc.size}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{doc.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">
                                    <button onClick={() => handleView(doc)} className="text-brand-primary hover:text-brand-secondary mr-4" title="View">
                                        <EyeIcon className="w-6 h-6" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.preventDefault(); handleDelete(doc.id); }}
                                        className="text-red-600 hover:text-red-900" 
                                        title="Delete"
                                    >
                                        <TrashIcon className="w-6 h-6" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredAndSortedDocs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-base text-gray-500">
                                    No documents found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Documents;
