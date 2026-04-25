import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, Terminal, Sparkles, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AICopilot = () => {
    const { t } = useTranslation();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'system', content: 'Industrial Generative AI Copilot v3.0 Initialized. Welcome to the Nexus Intelligence Hub. How can I assist with your Enterprise operations today?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setIsTyping(true);

        // Simulate AI thinking and responding
        setTimeout(() => {
            let reply = "I have analyzed the telemetry matrix.";
            
            if (userText.toLowerCase().includes('vibration') || userText.toLowerCase().includes('pump')) {
                reply = "Based on the historical FMEA logic, a vibration of 40mm/s on Pump #4 indicates a critical bearing failure. I recommend dispatching a corrective work order immediately. Would you like me to draft it?";
            } else if (userText.toLowerCase().includes('order') || userText.toLowerCase().includes('draft')) {
                reply = "Work Order drafted for Pump #4 (Bearing Replacement). Estimated MTTR: 2 Hours. Required Part: Bearing Kit K7. Status: Pending Approval.";
            } else if (userText.toLowerCase().includes('esg') || userText.toLowerCase().includes('carbon')) {
                reply = "Your current industrial cluster is operating at 12% higher energy intensity than the global baseline. Suggesting an automated optimization of HVAC Node A to save 140kg CO2/day.";
            } else {
                reply = "I am cross-referencing your request with the global CMMS knowledge base. Please specify the asset or module you are inquiring about.";
            }

            setMessages(prev => [...prev, { role: 'system', content: reply }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-slate-900 p-8 flex items-center justify-between shrink-0 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
                <div className="flex items-center gap-6 z-10">
                    <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                        <Terminal className="w-7 h-7 text-slate-950" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">{t('copilot.title', 'AI Copilot')}</h1>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mt-1">{t('copilot.subtitle', 'Generative Nexus Engine')}</p>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-4 text-slate-400 z-10">
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{t('copilot.model', 'Model: GPT-4.5 Nexus')}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{t('copilot.telemetry', 'Telemetry: Active')}</span>
                    </div>
                </div>
                
                {/* Background Decor */}
                <Bot className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-5" />
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-slate-50 space-y-8 custom-scrollbar">
                <div className="text-center mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100 inline-block">
                        {t('copilot.secure_session', 'Secure Enterprise Session Initialized')}
                    </span>
                </div>
                
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-6 rounded-[2rem] text-base font-medium leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                                ? 'bg-slate-900 text-white rounded-tr-sm' 
                                : 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-100 p-6 rounded-[2rem] rounded-tl-sm shadow-sm flex items-center gap-4">
                            <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
                            <span className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">{t('copilot.parsing', 'Parsing Industrial Data...')}</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                <form onSubmit={handleSend} className="relative flex items-center max-w-5xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('copilot.placeholder', 'Ask AI Copilot for diagnostics, ESG insights, or draft work orders...')}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-base rounded-[2rem] pl-8 pr-16 py-6 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-slate-400 placeholder:font-medium font-medium shadow-inner"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isTyping}
                        className="absolute right-3 w-12 h-12 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md group"
                    >
                        <Send className="w-5 h-5 ml-1 group-hover:scale-110 transition-transform" />
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                        {t('copilot.disclaimer', 'AI-generated insights must be verified before physical asset intervention.')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AICopilot;
