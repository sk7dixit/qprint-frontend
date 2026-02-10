import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Paperclip, Store, MessageSquare } from 'lucide-react';

const mockConversations = [
    {
        id: '1',
        shopName: 'Campus Copy Center',
        lastMessage: 'Your print job is ready for pickup',
        timestamp: new Date(Date.now() - 3600000),
        unread: 1,
        orderId: 'ORD-2026-1847',
    },
    {
        id: '2',
        shopName: 'QuickPrint Express',
        lastMessage: "We'll start printing in 5 minutes",
        timestamp: new Date(Date.now() - 7200000),
        unread: 0,
        orderId: 'ORD-2026-1846',
    },
];

const mockMessages = [
    {
        id: '1',
        sender: 'student',
        content: 'Hi, I just placed an order. Can you confirm?',
        timestamp: new Date(Date.now() - 7200000),
        type: 'text',
    },
    {
        id: '2',
        sender: 'seller',
        content: "Yes, I received your order for Data_Structures_Notes.pdf. We'll start printing shortly.",
        timestamp: new Date(Date.now() - 7000000),
        type: 'text',
    },
    {
        id: '3',
        sender: 'student',
        content: 'Great! Can you use spiral binding instead of staple?',
        timestamp: new Date(Date.now() - 6800000),
        type: 'text',
    },
    {
        id: '4',
        sender: 'seller',
        content: "Sure, I've updated your order. The total will be ₹126 instead of ₹96.",
        timestamp: new Date(Date.now() - 6600000),
        type: 'text',
    },
    {
        id: '5',
        sender: 'seller',
        content: 'Your print job is ready for pickup!',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
    },
];

export function Chat() {
    const [selectedConversation, setSelectedConversation] = useState('1');
    const [messages, setMessages] = useState(mockMessages);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message = {
            id: Date.now().toString(),
            sender: 'student',
            content: newMessage,
            timestamp: new Date(),
            type: 'text',
        };

        setMessages([...messages, message]);
        setNewMessage('');

        setTimeout(() => {
            const response = {
                id: (Date.now() + 1).toString(),
                sender: 'seller',
                content: "Thank you for your message. We'll get back to you shortly.",
                timestamp: new Date(),
                type: 'text',
            };
            setMessages((prev) => [...prev, response]);
        }, 1000);
    };

    const formatTime = (date) => {
        const diff = new Date().getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-14rem)] min-h-[600px]">
            <div className="bg-white border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 flex h-full border-gray-100">
                <div className="w-full md:w-[380px] border-r border-gray-50 flex flex-col bg-[#F9FAFB]/50 backdrop-blur-md">
                    <div className="p-8 border-b border-gray-100/50">
                        <h3 className="text-2xl font-black text-gray-900 leading-tight">Sync Station</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                            {mockConversations.length} Active Channels
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {mockConversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv.id)}
                                className={`w-full p-6 border-2 rounded-3xl transition-all text-left relative group active:scale-[0.98] ${selectedConversation === conv.id
                                        ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100/50'
                                        : 'bg-transparent border-transparent hover:bg-white hover:shadow-lg hover:shadow-gray-200/50'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-lg shadow-indigo-50 group-hover:scale-110 transition-transform">
                                            <Store className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-md font-black text-gray-900 truncate max-w-[150px]">{conv.shopName}</h4>
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">#{conv.orderId}</p>
                                        </div>
                                    </div>
                                    {conv.unread > 0 && (
                                        <span className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black shadow-lg shadow-indigo-200 animate-pulse">
                                            NEW
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-gray-500 truncate leading-relaxed">{conv.lastMessage}</p>
                                <div className="absolute bottom-6 right-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                    {formatTime(conv.timestamp)}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-white">
                    {mockConversations.find(c => c.id === selectedConversation) ? (
                        <>
                            <div className="p-6 md:px-10 md:py-8 border-b border-gray-50 flex items-center justify-between bg-white z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-lg shadow-indigo-50">
                                        <Store className="w-7 h-7 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900">{mockConversations.find(c => c.id === selectedConversation).shopName}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Verified Seller Online</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 scrollbar-hide">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex flex-col ${message.sender === 'student' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-3xl px-8 py-5 shadow-sm leading-relaxed text-sm ${message.sender === 'student'
                                                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-100 font-medium'
                                                    : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100 font-medium'
                                                }`}
                                        >
                                            {message.content}
                                        </div>
                                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mt-3 mx-2">
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-8 md:px-12 md:py-10 bg-white border-t border-gray-50">
                                <form
                                    onSubmit={handleSendMessage}
                                    className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-3 pl-6 rounded-3xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all"
                                >
                                    <div className="flex gap-2">
                                        <button type="button" className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm active:scale-90">
                                            <Paperclip className="w-5 h-5" />
                                        </button>
                                        <button type="button" className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm active:scale-90">
                                            <ImageIcon className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a secure message to shopkeeper..."
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium"
                                    />

                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.9] disabled:opacity-20 disabled:grayscale"
                                    >
                                        <Send className="w-6 h-6" />
                                    </button>
                                </form>

                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <div className="w-1 h-1 bg-indigo-200 rounded-full"></div>
                                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.4em]">
                                        End-to-End Secure Terminal
                                    </p>
                                    <div className="w-1 h-1 bg-indigo-200 rounded-full"></div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-20 text-center bg-gray-50/20">
                            <div className="max-w-xs">
                                <div className="w-24 h-24 bg-white border border-gray-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-gray-200/50">
                                    <MessageSquare className="w-12 h-12 text-gray-200" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Comms Offline</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
                                    Select a secure frequency from the left terminal to initialize shop communication.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
