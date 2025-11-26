
import React, { useRef } from 'react';
import Header from './Header';
import { Doc } from '../types';
import { CloudUploadIcon, DocumentIcon, EyeIcon, TrashIcon } from './icons';
import { logActivity } from '../services/activityService';

interface DocumentsProps {
    docs: Doc[];
    setDocs: React.Dispatch<React.SetStateAction<Doc[]>>;
    onAdd?: (doc: Doc) => void;
    onDelete?: (id: string) => void;
}

const Documents: React.FC<DocumentsProps> = ({ docs, setDocs, onAdd, onDelete }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newDoc: Doc = {
                id: `d${Date.now()}`,
                name: file.name,
                type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                date: new Date().toISOString().split('T')[0],
                url: '#' // Mock URL
            };

            if (onAdd) {
                onAdd(newDoc);
            } else {
                setDocs(prev => [newDoc, ...prev]);
            }
            logActivity('Document Uploaded', `Uploaded: ${file.name}`, 'system');
        }
    };

    const handleDelete = (id: string) => {
        if (onDelete) {
            onDelete(id);
        } else {
             const doc = docs.find(d => d.id === id);
             setDocs(prev => prev.filter(d => d.id !== id));
             if (doc) logActivity('Document Deleted', `Deleted: ${doc.name}`, 'system');
        }
    };

    return (
        <div>
            <Header 
                title="Documents & Media" 
                buttonText="Upload File" 
                onButtonClick={handleUploadClick}
            />
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
            />

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {docs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 flex flex-col items-center">
                                    <CloudUploadIcon className="w-12 h-12 text-gray-300 mb-2" />
                                    <p>No documents uploaded yet.</p>
                                    <button onClick={handleUploadClick} className="mt-2 text-brand-primary hover:underline">Upload a file</button>
                                </td>
                            </tr>
                        ) : (
                            docs.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <DocumentIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                                            <span className="ml-4 text-sm font-medium text-gray-900">{doc.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-3">
                                            <button className="text-brand-primary hover:text-brand-secondary" title="View">
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={(e) => { 
                                                    e.preventDefault(); 
                                                    handleDelete(doc.id);
                                                }}
                                                className="text-red-600 hover:text-red-900" 
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Documents;
