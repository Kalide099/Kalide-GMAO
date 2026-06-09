import { useEffect, useState } from 'react';
import { ShieldCheck, RefreshCcw, Lock, AlertTriangle, CheckCircle2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';

const MfaSecurity = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ enabled: false, hasPendingSetup: false, remainingBackupCodes: 0 });
    const [setupData, setSetupData] = useState(null);
    const [verifyCode, setVerifyCode] = useState('');
    const [disableCode, setDisableCode] = useState('');
    const [disableBackupCode, setDisableBackupCode] = useState('');
    const [regenCode, setRegenCode] = useState('');
    const [backupCodes, setBackupCodes] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });

    const loadStatus = async () => {
        try {
            const res = await api.get('/auth/mfa/status');
            if (res.data?.success) {
                setStatus(res.data.data);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || t('mfaSecurity.unableLoadStatus') });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStatus();
    }, []);

    const beginSetup = async () => {
        setMessage({ type: '', text: '' });
        try {
            const res = await api.post('/auth/mfa/setup');
            if (res.data?.success) {
                setSetupData(res.data.data);
                setMessage({ type: 'success', text: t('mfaSecurity.scanQrVerify') });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || t('mfaSecurity.unableInitSetup') });
        }
    };

    const verifySetup = async () => {
        setMessage({ type: '', text: '' });
        try {
            const res = await api.post('/auth/mfa/verify', { code: verifyCode });
            if (res.data?.success) {
                const codes = res.data.data?.backupCodes || [];
                setBackupCodes(codes);
                setSetupData(null);
                setVerifyCode('');
                setMessage({ type: 'success', text: t('mfaSecurity.mfaEnabled') });
                await loadStatus();
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || t('mfaSecurity.verifyFailed') });
        }
    };

    const disableMfa = async () => {
        setMessage({ type: '', text: '' });
        try {
            await api.post('/auth/mfa/disable', {
                ...(disableCode ? { mfaCode: disableCode } : {}),
                ...(disableBackupCode ? { backupCode: disableBackupCode } : {})
            });
            setDisableCode('');
            setDisableBackupCode('');
            setBackupCodes([]);
            setMessage({ type: 'success', text: t('mfaSecurity.mfaDisabled') });
            await loadStatus();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || t('mfaSecurity.unableDisable') });
        }
    };

    const regenerateBackupCodes = async () => {
        setMessage({ type: '', text: '' });
        try {
            const res = await api.post('/auth/mfa/backup-codes/regenerate', { mfaCode: regenCode });
            if (res.data?.success) {
                setBackupCodes(res.data.data?.backupCodes || []);
                setRegenCode('');
                setMessage({ type: 'success', text: t('mfaSecurity.codesRegenerated') });
                await loadStatus();
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || t('mfaSecurity.unableRegenerate') });
        }
    };

    const copyBackupCodes = async () => {
        try {
            await navigator.clipboard.writeText(backupCodes.join('\n'));
            setMessage({ type: 'success', text: t('mfaSecurity.codesCopied') });
        } catch (error) {
            setMessage({ type: 'error', text: t('mfaSecurity.copyFailed') });
        }
    };

    if (loading) {
        return <div className="text-sm font-bold uppercase tracking-widest text-slate-400">{t('mfaSecurity.loading')}</div>;
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
                <div className="flex items-start sm:items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-yellow-400 flex items-center justify-center">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight italic">{t('mfaSecurity.title')}</h1>
                        <p className="text-xs font-bold uppercase tracking-[0.08em] sm:tracking-widest text-slate-500">{t('mfaSecurity.subtitle')}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('mfaSecurity.mfaStatus')}</p>
                        <p className={`mt-2 text-sm font-black uppercase ${status.enabled ? 'text-emerald-600' : 'text-rose-600'}`}>{status.enabled ? t('mfaSecurity.enabled') : t('mfaSecurity.disabled')}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('mfaSecurity.pendingSetup')}</p>
                        <p className="mt-2 text-sm font-black uppercase text-slate-900">{status.hasPendingSetup ? t('mfaSecurity.yes') : t('mfaSecurity.no')}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('mfaSecurity.backupCodesLeft')}</p>
                        <p className="mt-2 text-sm font-black uppercase text-slate-900">{status.remainingBackupCodes}</p>
                    </div>
                </div>
            </div>

            {message.text ? (
                <div className={`rounded-2xl border p-4 flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    <p className="text-xs font-bold uppercase tracking-[0.08em] sm:tracking-wider break-words">{message.text}</p>
                </div>
            ) : null}

            {!status.enabled ? (
                <div className="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-8 shadow-sm space-y-6">
                    <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">{t('mfaSecurity.enableMfa')}</h2>
                    <button
                        onClick={beginSetup}
                        className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-black transition-colors"
                    >
                        {t('mfaSecurity.initializeSetup')}
                    </button>

                    {setupData ? (
                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 overflow-hidden">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{t('mfaSecurity.qrCode')}</p>
                                <img src={setupData.qrCodeDataUrl} alt="MFA QR Code" className="w-full max-w-56 aspect-square object-contain bg-white rounded-xl p-2 border border-slate-200" />
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 space-y-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('mfaSecurity.manualEntryKey')}</p>
                                    <p className="mt-2 text-xs font-bold break-all text-slate-800">{setupData.manualEntryKey}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('mfaSecurity.verificationCode')}</label>
                                    <input
                                        value={verifyCode}
                                        onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="123456"
                                        className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold"
                                    />
                                </div>
                                <button
                                    onClick={verifySetup}
                                    className="px-6 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors"
                                >
                                    {t('mfaSecurity.verifyEnable')}
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-8 shadow-sm space-y-4">
                        <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">{t('mfaSecurity.disableMfa')}</h2>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('mfaSecurity.provideCode')}</p>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('mfaSecurity.authenticatorCode')}</label>
                            <input
                                value={disableCode}
                                onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('mfaSecurity.backupCode')}</label>
                            <input
                                value={disableBackupCode}
                                onChange={(e) => setDisableBackupCode(e.target.value.toUpperCase())}
                                placeholder="ABCD1234"
                                className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold"
                            />
                        </div>
                        <button
                            onClick={disableMfa}
                            className="px-6 py-3 rounded-2xl bg-rose-600 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-colors"
                        >
                            <span className="inline-flex items-center gap-2"><Lock size={14} /> {t('mfaSecurity.disableMfa')}</span>
                        </button>
                    </div>

                    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-8 shadow-sm space-y-4">
                        <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">{t('mfaSecurity.backupCodes')}</h2>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('mfaSecurity.regenerateWarning')}</p>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('mfaSecurity.authenticatorCode')}</label>
                            <input
                                value={regenCode}
                                onChange={(e) => setRegenCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="123456"
                                className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold"
                            />
                        </div>
                        <button
                            onClick={regenerateBackupCodes}
                            className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-black transition-colors"
                        >
                            <span className="inline-flex items-center gap-2"><RefreshCcw size={14} /> {t('mfaSecurity.regenerateCodes')}</span>
                        </button>

                        {backupCodes.length > 0 ? (
                            <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-700">{t('mfaSecurity.storeSecurely')}</p>
                                    <button onClick={copyBackupCodes} className="text-xs font-black uppercase tracking-widest text-slate-900 inline-flex items-center gap-1"><Copy size={14} /> {t('mfaSecurity.copy')}</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {backupCodes.map((code) => (
                                        <div key={code} className="px-3 py-2 rounded-xl bg-white border border-yellow-200 text-xs font-black tracking-wider text-slate-900">{code}</div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('mfaSecurity.operationalNote')}</p>
                <p className="mt-2 text-xs font-semibold text-slate-700">{t('mfaSecurity.operationalNoteDesc')}</p>
            </div>
        </div>
    );
};

export default MfaSecurity;
