import { useState } from 'react';
import { FileText, Download, Calendar, PieChart, CheckSquare, BarChart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const ReportGenerator = () => {
    const { t } = useTranslation();
    const [dateRange] = useState('Last 30 Days');
    const [dataSource, setDataSource] = useState('Work Orders');
    const [exportFormat, setExportFormat] = useState('PDF Document');

    const templates = [
        { id: 'RPT-1', name: 'Monthly Maintenance SLA', format: 'PDF', icon: <PieChart size={24} />, desc: 'Work order completion rates and response times.' },
        { id: 'RPT-2', name: 'Compliance Audit Log', format: 'PDF / CSV', icon: <CheckSquare size={24} />, desc: 'Historical record of safety checklists and compliance approvals.' },
        { id: 'RPT-3', name: 'Asset Depreciation', format: 'CSV', icon: <BarChart size={24} />, desc: 'Financial export of equipment lifecycle and value.' }
    ];

    const triggerDownload = (filename, content, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    const handleTemplateDownload = (template) => {
        const timestamp = new Date().toISOString();
        if (template.format.includes('CSV')) {
            const csv = `report_id,template,generated_at\n${template.id},${template.name},${timestamp}\n`;
            triggerDownload(`${template.id.toLowerCase()}-template.csv`, csv, 'text/csv;charset=utf-8');
        } else {
            const text = `${template.name}\nGenerated at: ${timestamp}\n\n${template.desc}`;
            triggerDownload(`${template.id.toLowerCase()}-template.txt`, text, 'text/plain;charset=utf-8');
        }
        toast.success('Template export generated.');
    };

    const handleGenerateCustomReport = () => {
        const payload = {
            generated_at: new Date().toISOString(),
            date_range: dateRange,
            data_source: dataSource,
            format: exportFormat
        };

        const wantsCsv = exportFormat.toLowerCase().includes('csv');
        const wantsJson = exportFormat.toLowerCase().includes('json');

        if (wantsCsv) {
            const csv = `generated_at,date_range,data_source,format\n${payload.generated_at},${payload.date_range},${payload.data_source},${payload.format}\n`;
            triggerDownload('custom-report.csv', csv, 'text/csv;charset=utf-8');
        } else if (wantsJson) {
            triggerDownload('custom-report.json', JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
        } else {
            const text = `Custom Report\nGenerated at: ${payload.generated_at}\nDate Range: ${payload.date_range}\nData Source: ${payload.data_source}\nFormat: ${payload.format}`;
            triggerDownload('custom-report.txt', text, 'text/plain;charset=utf-8');
        }

        toast.success('Custom report generated.');
    };

    return (
        <div className="space-y-8 animate-fade-in font-sans pb-12">
            <div className="bg-emerald-950 p-10 rounded-[3rem] text-emerald-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-emerald-900/50">
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                        <FileText size={32} className="text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.nexus.reportgenerator.reporting_studio_1", "Reporting Studio")}</h1>
                        <p className="text-emerald-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.nexus.reportgenerator.generate_audits_exports_2", "Generate Audits & Exports")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((tpl, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-all group flex flex-col justify-between h-full">
                        <div>
                            <div className="w-12 h-12 bg-slate-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {tpl.icon}
                            </div>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight">{tpl.name}</h4>
                            <p className="text-sm text-slate-500 mt-2 font-semibold line-clamp-2">{tpl.desc}</p>
                        </div>
                        <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{tpl.format} Export</span>
                            <button onClick={() => handleTemplateDownload(tpl)} className="text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-colors" aria-label={`Download ${tpl.name}`}>
                                <Download size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.nexus.reportgenerator.custom_report_generator_3", "Custom Report Generator")}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t("generated.pages.nexus.reportgenerator.date_range_4", "Date Range")}</label>
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900">
                            <Calendar size={18} className="text-slate-400" />
                            <span>{dateRange}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t("generated.pages.nexus.reportgenerator.data_source_5", "Data Source")}</label>
                        <select
                            value={dataSource}
                            onChange={(e) => setDataSource(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
                        >
                            <option>{t("generated.pages.nexus.reportgenerator.work_orders_6", "Work Orders")}</option>
                            <option>{t("generated.pages.nexus.reportgenerator.assets_inventory_7", "Assets & Inventory")}</option>
                            <option>{t("generated.pages.nexus.reportgenerator.iot_telemetry_8", "IoT Telemetry")}</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t("generated.pages.nexus.reportgenerator.export_format_9", "Export Format")}</label>
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
                        >
                            <option>{t("generated.pages.nexus.reportgenerator.pdf_document_10", "PDF Document")}</option>
                            <option>{t("generated.pages.nexus.reportgenerator.csv_spreadsheet_11", "CSV Spreadsheet")}</option>
                            <option>{t("generated.pages.nexus.reportgenerator.json_data_12", "JSON Data")}</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100">
                    <button onClick={handleGenerateCustomReport} className="bg-emerald-600 text-white font-bold uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30 flex items-center gap-2">
                        <Download size={16} />{t("generated.pages.nexus.reportgenerator.generate_download_13", "Generate & Download")}</button>
                </div>
            </div>
        </div>
    );
};

export default ReportGenerator;
