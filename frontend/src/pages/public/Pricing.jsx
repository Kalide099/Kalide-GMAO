import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

const Pricing = () => {
    const { t } = useTranslation();
    const [billingCycle, setBillingCycle] = useState('monthly');

    const tiers = [
        {
            id: 'basic', name: t('pricing.tiers.basic.name'), priceMonthly: 49, priceYearly: 39,
            description: t('pricing.tiers.basic.description'),
            features: t('pricing.tiers.basic.features', { returnObjects: true })
        },
        {
            id: 'pro', name: t('pricing.tiers.pro.name'), priceMonthly: 129, priceYearly: 99,
            description: t('pricing.tiers.pro.description'), isPopular: true,
            features: t('pricing.tiers.pro.features', { returnObjects: true })
        },
        {
            id: 'enterprise', name: t('pricing.tiers.enterprise.name'), priceMonthly: t('pricing.custom'), priceYearly: t('pricing.custom'),
            description: t('pricing.tiers.enterprise.description'),
            features: t('pricing.tiers.enterprise.features', { returnObjects: true })
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <PublicNavbar />
            <div className="flex-1 py-24 px-8 max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{t('pricing.title')}</h2>
                <p className="mt-4 text-xl text-slate-500">{t('pricing.subtitle')}</p>

                <div className="mt-12 flex justify-center items-center gap-3">
                    <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>{t('pricing.monthly')}</span>
                    <button 
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className="w-14 h-7 bg-indigo-600 rounded-full relative transition-colors focus:outline-none"
                    >
                        <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${billingCycle === 'monthly' ? 'left-1' : 'left-8'}`} />
                    </button>
                    <span className={`text-sm font-semibold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>{t('pricing.yearly')} <span className="text-emerald-500 ml-1 text-xs bg-emerald-100 px-2 py-0.5 rounded-full">{t('pricing.save20')}</span></span>
                </div>

                <div className="mt-16 grid lg:grid-cols-3 gap-8 text-left">
                    {tiers.map(tier => (
                        <div key={tier.id} className={`bg-white rounded-3xl p-8 border ${tier.isPopular ? 'border-indigo-600 shadow-xl shadow-indigo-100 relative' : 'border-slate-200'}`}>
                            {tier.isPopular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full">{t('pricing.mostPopular')}</span>
                            )}
                            <h3 className="text-2xl font-bold text-slate-900">{tier.name}</h3>
                            <p className="mt-4 text-slate-500 text-sm">{tier.description}</p>
                            
                            <div className="mt-8 flex items-baseline gap-1">
                                <span className="text-5xl font-extrabold text-slate-900">
                                    {typeof tier.priceMonthly === 'number' ? `$${billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly}` : tier.priceMonthly}
                                </span>
                                {typeof tier.priceMonthly === 'number' && <span className="text-slate-500 font-medium">{t('marketing.perMonth')}</span>}
                            </div>
                            
                            <Link 
                                to={`/register?plan=${tier.id}`}
                                className={`mt-8 block w-full py-3 px-4 rounded-xl text-center font-bold transition-all ${tier.isPopular ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
                            >
                                {t('marketing.startTrialBtn')}
                            </Link>

                            <ul className="mt-8 space-y-4">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-slate-700">
                                        <Check className="w-5 h-5 text-indigo-600 shrink-0" /> {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <PublicFooter />
        </div>
    );
};

export default Pricing;
