
import React, { useState } from 'react';
import Header from './Header';
import { logActivity } from '../services/activityService';

const Feedback: React.FC = () => {
    const [type, setType] = useState('issue');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Log the activity
        logActivity('Feedback Submitted', `User submitted a ${type}: ${subject}`, 'system');
        
        setSubmitted(true);
        
        // Reset form after a delay if needed, or keep success state
        setTimeout(() => {
            setSubmitted(false);
            setSubject('');
            setDescription('');
            setType('issue');
        }, 3000);
    };

    return (
        <div>
            <Header title="User Feedback" />
            
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                {submitted ? (
                    <div className="text-center py-10">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Thank you!</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Your feedback has been successfully submitted. We appreciate your input in making Griot better.
                        </p>
                        <button 
                            onClick={() => setSubmitted(false)}
                            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-brand-primary bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                        >
                            Submit another
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Tell us what you think</h2>
                            <p className="text-gray-600 mt-1">
                                Found a bug? Have a great idea for a new feature? Let us know below.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Type</label>
                                <div className="flex space-x-4">
                                    <label className="inline-flex items-center">
                                        <input 
                                            type="radio" 
                                            className="form-radio text-brand-primary focus:ring-brand-primary" 
                                            name="type" 
                                            value="issue" 
                                            checked={type === 'issue'} 
                                            onChange={() => setType('issue')}
                                        />
                                        <span className="ml-2 text-gray-700">Report an Issue</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input 
                                            type="radio" 
                                            className="form-radio text-brand-primary focus:ring-brand-primary" 
                                            name="type" 
                                            value="feature" 
                                            checked={type === 'feature'} 
                                            onChange={() => setType('feature')}
                                        />
                                        <span className="ml-2 text-gray-700">Feature Request</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    required
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                                    placeholder={type === 'issue' ? "e.g., Error when saving campaign" : "e.g., Add dark mode support"}
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    rows={5}
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                                    placeholder="Please provide as much detail as possible..."
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
                                >
                                    Submit Feedback
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Feedback;
