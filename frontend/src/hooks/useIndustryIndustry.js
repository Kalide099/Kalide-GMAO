import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

/**
 * Advanced industry-specific terminology mapper.
 * Returns localized strings depending on the company's industrial sector.
 */
const useIndustryIndustry = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const industry = user?.industry || 'manufacturing';

    const dictionary = {
        manufacturing: {
            assetName: t('industry.mfg.assetName', 'Production Line'),
            throughput: t('industry.mfg.throughput', 'Output Units'),
            health: t('industry.mfg.health', 'Operation Load'),
            mainMetric: t('industry.mfg.mainMetric', 'OEE Status')
        },
        oil_gas: {
            assetName: t('industry.oil.assetName', 'Rig / Pipeline'),
            throughput: t('industry.oil.throughput', 'Flow Rate (BPD)'),
            health: t('industry.oil.health', 'Pressure Stability'),
            mainMetric: t('industry.oil.mainMetric', 'Integrity Index')
        },
        energy: {
            assetName: t('industry.nrg.assetName', 'Generator / Grid'),
            throughput: t('industry.nrg.throughput', 'Load (MW)'),
            health: t('industry.nrg.health', 'Frequency Core'),
            mainMetric: t('industry.nrg.mainMetric', 'Grid Stability')
        },
        mining: {
            assetName: t('industry.min.assetName', 'Excavator / Shaft'),
            throughput: t('industry.min.throughput', 'Tons Extracted'),
            health: t('industry.min.health', 'Mechanical Stress'),
            mainMetric: t('industry.min.mainMetric', 'Safety Clearance')
        },
        logistics: {
            assetName: t('industry.log.assetName', 'Fleet / Hub'),
            throughput: t('industry.log.throughput', 'Parcel Volume'),
            health: t('industry.log.health', 'Fleet Utilization'),
            mainMetric: t('industry.log.mainMetric', 'Delivery Accuracy')
        }
    };

    return dictionary[industry] || dictionary.manufacturing;
};

export default useIndustryIndustry;
