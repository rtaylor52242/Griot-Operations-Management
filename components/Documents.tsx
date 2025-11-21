
import React, { useRef } from 'react';
import Header from './Header';
import { CloudUploadIcon, TrashIcon, EyeIcon, DocumentTextIcon } from './icons';
import { Doc } from '../types';

interface DocumentsProps {
    docs: Doc[];
    setDocs: React.Dispatch<React.SetStateAction<Doc[]>>;
}

const Documents: React.FC<DocumentsProps> = ({ docs, setDocs }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newDocs: Doc[] = Array.from(files).map((file: File) => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.type,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                date: new Date().toISOString().split('T')[0],
                url: URL.createObjectURL(file)
            }));
            setDocs([...newDocs, ...docs]);
        }
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = (id: string) => {
        setDocs(docs.filter(d => d.id !== id));
    };

    const handleView = (doc: Doc) => {
        if (doc.url && doc.url !== '#') {
             window.open(doc.url, '_blank');
        } else {
            alert('This is a mock file and cannot be viewed.');
        }
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
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Size</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                            <th className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {docs.map((doc) => (
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
                                    <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-900" title="Delete">
                                        <TrashIcon className="w-6 h-6" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {docs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-base text-gray-500">
                                    No documents uploaded yet. Click "Upload File" to get started.
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
