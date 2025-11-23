
import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import { PaperAirplaneIcon, ChatIcon } from './icons';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const GriotChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'model', text: 'Hello! I am your Griot assistant. How can I help you with your operations today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: inputValue
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setError(null);

        try {
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                throw new Error("API Key not found. Please check your environment configuration.");
            }
            
            // Dynamic import to handle potential loading issues gracefully
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey });
            
            // Filter out the initial greeting from history to prevent confusion for the model
            const history = messages.filter(m => m.id !== '1').map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                history: history,
                config: {
                    systemInstruction: "You are a helpful assistant for the Griot Operations Management app. You help museum and zoo staff manage memberships, fundraising, tickets, and reports. Keep answers concise and professional."
                }
            });

            const result = await chat.sendMessage({ message: userMessage.text });
            const responseText = result.text;

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText || "I didn't have a response."
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (err) {
            console.error("Error sending message:", err);
            if (err instanceof Error) {
                 setError(`Error: ${err.message}`);
            } else {
                setError("Sorry, I encountered an unexpected error. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            <Header title="Ask a Griot" />
            
            <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden flex flex-col border border-gray-200">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div 
                                className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-brand-primary text-white rounded-br-none' 
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                }`}
                            >
                                <div className="flex items-center mb-1 opacity-80 text-xs">
                                    {msg.role === 'model' && <ChatIcon className="w-3 h-3 mr-1" />}
                                    <span className="font-bold uppercase">{msg.role === 'user' ? 'You' : 'Griot'}</span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-3 shadow-sm">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && (
                         <div className="flex justify-center">
                            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-xs font-semibold shadow-sm border border-red-200">
                                {error}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your question here..."
                            className="flex-1 border border-gray-300 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-gray-50 text-black shadow-inner transition-all"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className="bg-brand-primary text-white p-3 rounded-full hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all transform hover:scale-110 active:scale-95"
                        >
                            <PaperAirplaneIcon className="w-5 h-5 transform rotate-90" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GriotChat;
