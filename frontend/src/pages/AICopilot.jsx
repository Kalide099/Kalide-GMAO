import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, Terminal, Sparkles, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSocket } from '../utils/socketClient';

const AICopilot = () => {
    const { t } = useTranslation();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'system', content: 'AI Copilot initialized. Live telemetry and predictive models are online. Waiting for signals...' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [liveDataStatus, setLiveDataStatus] = useState('Standby');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // WebSocket Integration
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleTelemetry = (data) => {
            setLiveDataStatus(`Ingesting: ${data.assetName} (${Object.keys(data.sensorData).join(', ')})`);
        };

        const handleAIPrediction = (data) => {
            const { prediction, assetName, model_archetype } = data;
            
            // Only alert if it's critical
            const isCritical = 
                prediction.anomaly === -1 || 
                (prediction.rul !== undefined && prediction.rul < 15) ||
                (prediction.failure_probability !== undefined && prediction.failure_probability > 0.80);

            if (isCritical) {
                const message = `🚨 CRITICAL ALERT [${model_archetype.toUpperCase()}]: Imminent anomaly detected on ${assetName}. Probability of failure: ${((prediction.failure_probability || 0.95)*100).toFixed(1)}%. Initiating auto-remediation protocol.`;
                setMessages(prev => [...prev, { role: 'system', content: message }]);
            }
        };

        const handleWODrafted = (data) => {
            const message = `✅ AUTO-ACTION: Corrective Work Order [${data.woId}] successfully drafted for ${data.assetId}. Technician dispatch is pending approval.`;
            setMessages(prev => [...prev, { role: 'system', content: message }]);
        };

        socket.on('telemetry_update', handleTelemetry);
        socket.on('ai_prediction', handleAIPrediction);
        socket.on('wo_auto_drafted', handleWODrafted);

        return () => {
            socket.off('telemetry_update', handleTelemetry);
            socket.off('ai_prediction', handleAIPrediction);
            socket.off('wo_auto_drafted', handleWODrafted);
        };
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setIsTyping(true);

        // Standard chat response fallback
        setTimeout(() => {
            let reply = "The predictive models are actively monitoring. No immediate manual action required.";
            
            if (userText.toLowerCase().includes('status')) {
                reply = "All edge ML pipelines are running nominal. The fleet simulator is currently generating telemetry for real-time analysis.";
            }

            setMessages(prev => [...prev, { role: 'system', content: reply }]);
            setIsTyping(false);
        }, 1000);
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
                        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold mt-1">Live Python Predictor Engine</p>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-4 text-slate-400 z-10">
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{t('copilot.model', 'Model: KGMAO-ML-EDGE')}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 overflow-hidden max-w-[200px]">
                        <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest truncate">{liveDataStatus}</span>
                    </div>
                </div>
                
                {/* Background Decor */}
                <Bot className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-5" />
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-slate-50 space-y-8 custom-scrollbar">
                <div className="text-center mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 bg-emerald-50 px-6 py-2 rounded-full shadow-sm border border-emerald-100 inline-block animate-pulse">
                        ● Live Telemetry Socket Connected
                    </span>
                </div>
                
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm font-bold leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                                ? 'bg-slate-900 text-white rounded-tr-sm' 
                                : msg.content.includes('CRITICAL') 
                                    ? 'bg-rose-50 text-rose-900 border-2 border-rose-200 rounded-tl-sm'
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
                            <span className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">{t('copilot.parsing', 'Processing...')}</span>
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
                        placeholder="Request manual diagnostic override..."
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-base rounded-[2rem] pl-8 pr-16 py-6 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all placeholder:text-slate-400 placeholder:font-medium font-medium shadow-inner"
                    />
                    <button type="submit" 
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
