
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Upload, Folder, FileCode, FileImage, FileStack, QrCode, ExternalLink } from 'lucide-react';
import SimulatedProcessModal from '../../components/SimulatedProcessModal';
import toast from 'react-hot-toast';

const DocumentVault = () => {
    const { t } = useTranslation();
    const [simModal, setSimModal] = useState({ isOpen: false, type: null });
    const docs = [
        { id: 1, name: 'MainPump_Blueprint.dwg', type: 'CAD', size: '12.4 MB', date: '2024-03-12' },
        { id: 2, name: 'Electrical_Schematics_V4.pdf', type: 'PDF', size: '4.8 MB', date: '2024-04-01' },
        { id: 3, name: 'Safety_Manual_FR.pdf', type: 'PDF', size: '2.1 MB', date: '2023-11-20' },
    ];

    return (
        <div className="space-y-12 animate-fade-in-up pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-200">
                        <FileText className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('nexus.dms.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            {t('nexus.dms.subtitle')}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setSimModal({ isOpen: true, type: 'upload' })} className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 active:scale-95">
                        <Upload size={18} /> {t('nexus.dms.upload')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats */}
                <div className="bg-slate-50 p-10 rounded-[3rem] space-y-4">
                    <Folder className="text-blue-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('nexus.dms.total_storage')}</p>
                    <p className="text-3xl font-black text-slate-900">{"1.2 GB / 50 GB"}</p>
                </div>
                <div className="bg-slate-50 p-10 rounded-[3rem] space-y-4">
                    <FileStack className="text-indigo-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('nexus.dms.total_files')}</p>
                    <p className="text-3xl font-black text-slate-900">{"248"}</p>
                </div>
                <div onClick={() => setSimModal({ isOpen: true, type: 'qr' })} className="bg-slate-50 p-10 rounded-[3rem] flex flex-col items-center justify-center space-y-4 group cursor-pointer hover:bg-blue-600 transition-colors">
                     <QrCode className="text-slate-400 group-hover:text-white" size={40} />
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{t('nexus.dms.gen_qr')}</p>
                </div>
                <div className="bg-slate-50 p-10 rounded-[3rem] flex flex-col items-center justify-center space-y-4">
                     <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200"></div>)}
                     </div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t('nexus.dms.shared')}</p>
                </div>
            </div>

            {/* File List */}
            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {docs.map((doc) => (
                        <div key={doc.id} className="p-8 rounded-[2.5rem] bg-slate-50/50 border border-transparent hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all group flex flex-col justify-between h-64">
                            <div className="flex justify-between items-start">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${doc.type === 'CAD' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {doc.type === 'CAD' ? <FileCode /> : <FileImage />}
                                </div>
                                <button onClick={() => setSimModal({ isOpen: true, type: 'preview' })} className="p-3 text-slate-300 hover:text-slate-900 transition-colors">
                                    <ExternalLink size={18} />
                                </button>
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-slate-800 tracking-tight truncate">{doc.name}</h4>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{doc.size}</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{doc.date}</span>
                                </div>
                            </div>
                            <button onClick={() => setSimModal({ isOpen: true, type: 'preview' })} className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                                {t('nexus.dms.open_preview')}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <SimulatedProcessModal 
                isOpen={simModal.isOpen} 
                onClose={() => setSimModal({ isOpen: false, type: null })} 
                title={simModal.type === 'upload' ? 'Encrypting Upload' : simModal.type === 'qr' ? 'Generating AR Tag' : 'Fetching Rendering Context'} 
                processingText={simModal.type === 'upload' ? 'Executing AES-256 block cipher...' : simModal.type === 'qr' ? 'Hashing asset locator...' : 'Decompressing vector assets...'} 
                successText="Action Complete"
                onSuccessCallback={() => {
                    toast.success(simModal.type === 'upload' ? 'File uploaded securely to vault.' : simModal.type === 'qr' ? 'QR Code ready for printing.' : 'Document opened in secure sandbox.');
                }}
            />
        </div>
    );
};

export default DocumentVault;
