import { useState } from 'react';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';
import { ScrollText, Shield, FileText, Gavel } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SimulatedProcessModal from '../../components/SimulatedProcessModal';
import toast from 'react-hot-toast';

const TermsOfUse = () => {
    const { t } = useTranslation();
    const [simModalOpen, setSimModalOpen] = useState({ isOpen: false, type: null });

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <PublicNavbar />
            <div className="flex-1">
            
            {/* Minimal High-End Header */}
            <div className="bg-slate-950 py-32 px-6 lg:px-24 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-[80px]"></div>
                <div className="relative z-10 space-y-4">
                    <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic">
                        {t('legal.termsTitle').split(' ')[0]} {t('legal.termsTitle').split(' ')[1]} <span className="text-yellow-400">{t('legal.termsTitle').split(' ')[2]}</span>
                    </h1>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.5em] italic">{t('legal.lastUpdate')}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-24 px-6 lg:px-24 grid grid-cols-1 lg:grid-cols-4 gap-20">
                
                {/* Protocol Sidebar */}
                <div className="hidden lg:block space-y-10 sticky top-32 h-fit">
                    <div className="space-y-4">
                        <h4 className="text-slate-900 font-black text-xs uppercase tracking-[0.4em] italic">{t('legal.structure')}</h4>
                        {[
                            t('legal.terms.sections.s1'),
                            t('legal.terms.sections.s2'),
                            t('legal.terms.sections.s3'),
                            t('legal.terms.sections.s4'),
                            t('legal.terms.sections.s5')
                        ].map((item, idx) => (
                            <p key={idx} className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-yellow-600 cursor-pointer transition-colors p-2 border-l-2 border-transparent hover:border-yellow-400">{item}</p>
                        ))}
                    </div>

                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                        <Gavel className="text-slate-900" size={24} />
                        <p className="text-xs font-bold text-slate-800 leading-relaxed uppercase tracking-tight">
                            {t('legal.terms.frameworkDesc')}
                        </p>
                    </div>
                </div>

                {/* Content Matrix */}
                <div className="lg:col-span-3 space-y-16">
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                            <ScrollText className="text-yellow-500" />
                            {t('legal.terms.acceptance.title')}
                        </h2>
                        <div className="text-slate-600 font-medium leading-loose space-y-4">
                            <p>{t('legal.terms.acceptance.p1')}</p>
                            <p>{t('legal.terms.acceptance.p2')}</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                            <Shield className="text-indigo-500" />
                            {t('legal.terms.sovereignty.title')}
                        </h2>
                        <div className="text-slate-600 font-medium leading-loose space-y-4">
                            <p>{t('legal.terms.sovereignty.p1')}</p>
                            <p>{t('legal.terms.sovereignty.p2')}</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                            <FileText className="text-emerald-500" />
                            {t('legal.terms.ip.title')}
                        </h2>
                        <div className="text-slate-600 font-medium leading-loose space-y-4">
                            <p>{t('legal.terms.ip.p1')}</p>
                        </div>
                    </section>
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 py-6 px-12 hidden md:flex justify-between items-center z-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{t('legal.protocolDoc')}</p>
                <div className="flex gap-4">
                     <button onClick={() => setSimModalOpen({ isOpen: true, type: 'pdf' })} className="px-6 py-2 text-[10px] font-black text-slate-900 uppercase tracking-widest border border-slate-200 rounded-xl hover:bg-slate-50">{t('legal.downloadPdf')}</button>
                     <button onClick={() => setSimModalOpen({ isOpen: true, type: 'print' })} className="px-6 py-2 text-[10px] font-black text-white bg-slate-900 uppercase tracking-widest rounded-xl hover:bg-black">{t('legal.printDoc')}</button>
                </div>
            </div>
            </div>
            <PublicFooter />

            <SimulatedProcessModal 
                isOpen={simModalOpen.isOpen} 
                onClose={() => setSimModalOpen({ isOpen: false, type: null })} 
                title={simModalOpen.type === 'pdf' ? t('legal.pdf.title') : t('legal.print.title')} 
                processingText={simModalOpen.type === 'pdf' ? t('legal.pdf.processing') : t('legal.print.processing')} 
                successText={simModalOpen.type === 'pdf' ? t('legal.pdf.success') : t('legal.print.success')}
                onSuccessCallback={() => toast.success(simModalOpen.type === 'pdf' ? t('legal.pdf.toast') : t('legal.print.toast'))}
            />
        </div>
    );
};

export default TermsOfUse;
