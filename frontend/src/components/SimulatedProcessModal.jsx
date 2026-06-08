import { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SimulatedProcessModal = ({ 
    isOpen, 
    onClose, 
    title = "System Override", 
    processingText = "Starting process...", 
    successText = "Completed successfully", 
    duration = 2000,
    onSuccessCallback
}) => {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('processing');

    useEffect(() => {
        if (!isOpen) {
            setProgress(0);
            setStatus('processing');
            return;
        }

        const intervalTime = duration / 100;
        let currentProgress = 0;

        const interval = setInterval(() => {
            currentProgress += 1;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(interval);
                setStatus('success');
                if (onSuccessCallback) {
                    setTimeout(() => {
                        onSuccessCallback();
                        onClose();
                    }, 1000);
                }
            }
        }, intervalTime);

        return () => clearInterval(interval);
    }, [isOpen, duration, onSuccessCallback, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-[3rem] w-full max-w-lg shadow-[0_0_50px_rgba(79,70,229,0.2)] overflow-hidden animate-scale-in">
                <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <div className="flex items-center gap-4">
                        <Terminal className="text-indigo-500 w-8 h-8" />
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">{title}</h3>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mt-1">{t('simulatedProcess.processing')}</p>
                        </div>
                    </div>
                    {!onSuccessCallback && status === 'success' && (
                        <button onClick={onClose} className="p-3 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                            <X size={24} />
                        </button>
                    )}
                </div>
                
                <div className="p-10 space-y-8">
                    {status === 'processing' ? (
                        <>
                            <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                <span className="text-slate-400 animate-pulse">{processingText}</span>
                                <span className="text-indigo-400">{progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-500 transition-all duration-75 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="font-mono text-[9px] text-slate-500 tracking-widest mt-4">
                                {'>'} LOG: Executing block 0x{Math.floor(Math.random() * 100000).toString(16)}...
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-6 animate-fade-in-up">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="text-emerald-500 w-10 h-10" />
                            </div>
                            <h4 className="text-xl font-black text-white uppercase tracking-widest mb-2">{successText}</h4>
                            <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">{t('simulatedProcess.done')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimulatedProcessModal;
