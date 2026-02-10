import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { db } from '../../shared/firebase';
import { collection, query, onSnapshot, addDoc, orderBy, serverTimestamp, doc } from 'firebase/firestore';
import { useAuth } from '../../shared/AuthContext';


const formatTime = (date) => {
    if (!date) return 'Recently';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
};

export default function Chat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!user?.shopId) return;

        const messagesRef = collection(db, 'shops', user.shopId.toString(), 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().createdAt?.toDate() || new Date()
            }));
            setMessages(msgs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user?.shopId]);

    // Group messages by jobId into conversations
    const conversations = Object.values(
        messages.reduce((acc, msg) => {
            const jobId = msg.jobId || 'General';
            if (!acc[jobId]) {
                acc[jobId] = {
                    jobId: jobId,
                    studentName: msg.studentName || 'Student',
                    studentId: msg.studentId || 'Unknown',
                    fileName: msg.fileName || 'General Notification',
                    messages: [],
                    lastTimestamp: msg.timestamp
                };
            }
            acc[jobId].messages.push(msg);
            acc[jobId].lastTimestamp = msg.timestamp;
            return acc;
        }, {})
    ).sort((a, b) => b.lastTimestamp - a.lastTimestamp);

    const activeConversation = conversations.find(c => c.jobId === selectedChatId) || (conversations.length > 0 && !selectedChatId ? conversations[0] : null);

    useEffect(() => {
        if (activeConversation && !selectedChatId) {
            setSelectedChatId(activeConversation.jobId);
        }
    }, [activeConversation, selectedChatId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, selectedChatId]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedChatId) return;

        try {
            const messagesRef = collection(db, 'shops', user.shopId.toString(), 'messages');
            const activeConv = conversations.find(c => c.jobId === selectedChatId);

            await addDoc(messagesRef, {
                jobId: selectedChatId,
                type: 'seller',
                content: messageInput,
                studentName: activeConv?.studentName || 'Student',
                studentId: activeConv?.studentId || 'Unknown',
                fileName: activeConv?.fileName || '',
                createdAt: serverTimestamp()
            });

            setMessageInput('');
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Security Error: Forbidden payload or path.");
        }
    };

    // REMOVED: Blocking loading screen

    return (
        <div className="size-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">Messages</h1>
                <p className="text-gray-500 font-medium">Job-linked real-time conversations</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
                    {/* Conversations List */}
                    <div className="border-r border-gray-200 overflow-y-auto">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="font-semibold text-gray-900">Conversations</h2>
                        </div>
                        <div>
                            {conversations.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    No messages yet.
                                </div>
                            ) : (
                                conversations.map((conv) => (
                                    <button
                                        key={conv.jobId}
                                        onClick={() => setSelectedChatId(conv.jobId)}
                                        className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedChatId === conv.jobId ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-gray-200 p-2 rounded-lg">
                                                    <MessageSquare className="size-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{conv.studentName}</h3>
                                                    <p className="text-xs text-gray-500">{conv.studentId}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FileText className="size-3" />
                                            <span className="font-mono text-xs">{conv.jobId}</span>
                                            <span>•</span>
                                            <span className="truncate text-xs">{conv.fileName}</span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="col-span-2 flex flex-col">
                        {activeConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <FileText className="size-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{activeConversation.studentName}</h3>
                                            <p className="text-sm text-gray-600">
                                                {activeConversation.jobId} • {activeConversation.fileName}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div
                                    className="flex-1 overflow-y-auto p-4 space-y-4"
                                    ref={scrollRef}
                                >
                                    {activeConversation.messages.map((message) => (
                                        <div key={message.id}>
                                            {message.type === 'system' ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600 flex items-center gap-2">
                                                        <CheckCircle2 className="size-4" />
                                                        {message.content}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`flex ${message.type === 'seller' ? 'justify-end' : 'justify-start'
                                                        }`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.type === 'seller'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 text-gray-900'
                                                            }`}
                                                    >
                                                        <p className="text-sm">{message.content}</p>
                                                        <p
                                                            className={`text-xs mt-1 ${message.type === 'seller'
                                                                ? 'text-blue-100'
                                                                : 'text-gray-500'
                                                                }`}
                                                        >
                                                            {formatTime(message.timestamp)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t border-gray-200 bg-gray-50">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type your message..."
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim()}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <Send className="size-4" />
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <MessageSquare className="size-12 mx-auto mb-3 opacity-50" />
                                    <p>Select a conversation to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
