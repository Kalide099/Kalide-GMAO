// Pre-defined module templates for each industry and tier (Basic, Pro, Enterprise)

const commonBasic = ['dms', 'inventory'];
const commonPro = [...commonBasic, 'predictive', 'skills', 'safety', 'rca'];
const commonEnterprise = [...commonPro, 'global', 'command', 'esg', 'finance', 'hub', 'offline', 'ar', 'twin'];

const industryTemplates = {
    manufacturing: {
        basic: [...commonBasic, 'tpm'],
        pro: [...commonPro, 'tpm', 'iot', 'fmea'],
        enterprise: [...commonEnterprise, 'tpm', 'iot', 'fmea', 'warehouse', 'vision', 'copilot', 'procurement', 'workflow', 'reporting', 'tenant_settings', 'micro_grid']
    },
    hospitality: {
        basic: [...commonBasic],
        pro: [...commonPro, 'iot'],
        enterprise: [...commonEnterprise, 'iot', 'copilot', 'workflow', 'reporting', 'tenant_settings', 'procurement', 'off_grid']
    },
    energy: {
        basic: [...commonBasic, 'loto'],
        pro: [...commonPro, 'loto', 'iot'],
        enterprise: [...commonEnterprise, 'loto', 'iot', 'drone', 'copilot', 'workflow', 'reporting', 'tenant_settings', 'procurement', 'leak_detection']
    },
    oil_gas: {
        basic: [...commonBasic, 'loto'],
        pro: [...commonPro, 'loto', 'iot', 'fmea'],
        enterprise: [...commonEnterprise, 'loto', 'iot', 'fmea', 'drone', 'vision', 'copilot', 'workflow', 'reporting', 'tenant_settings', 'procurement', 'leak_detection', 'pipeline_integrity']
    },
    logistics: {
        basic: [...commonBasic],
        pro: [...commonPro, 'warehouse'],
        enterprise: [...commonEnterprise, 'warehouse', 'vision', 'procurement', 'workflow', 'reporting', 'tenant_settings', 'copilot', 'route_risk']
    },
    mining: {
        basic: [...commonBasic, 'safety'],
        pro: [...commonPro, 'loto', 'fmea', 'iot'],
        enterprise: [...commonEnterprise, 'loto', 'fmea', 'iot', 'drone', 'vision', 'copilot', 'workflow', 'reporting', 'tenant_settings', 'procurement', 'dust_predictive']
    },
    healthcare: {
        basic: [...commonBasic, 'calibration'],
        pro: [...commonPro, 'calibration', 'iot'],
        enterprise: [...commonEnterprise, 'calibration', 'iot', 'vision', 'copilot', 'workflow', 'reporting', 'tenant_settings', 'procurement', 'solar_cold']
    },
    construction: {
        basic: [...commonBasic, 'safety'],
        pro: [...commonPro, 'bim'],
        enterprise: [...commonEnterprise, 'bim', 'warehouse', 'drone', 'vision', 'copilot', 'workflow', 'reporting', 'tenant_settings', 'procurement', 'mobile_money']
    },
    retail: {
        basic: [...commonBasic],
        pro: [...commonPro, 'warehouse'],
        enterprise: [...commonEnterprise, 'warehouse', 'vision', 'copilot', 'reporting', 'tenant_settings', 'procurement', 'inflation_sync']
    },
    agrifood: {
        basic: [...commonBasic, 'calibration'],
        pro: [...commonPro, 'calibration', 'iot'],
        enterprise: [...commonEnterprise, 'calibration', 'iot', 'warehouse', 'drone', 'vision', 'copilot', 'reporting', 'tenant_settings', 'procurement', 'ussd_offline']
    },
    public_works: {
        basic: [...commonBasic, 'safety'],
        pro: [...commonPro, 'bim', 'iot'],
        enterprise: [...commonEnterprise, 'bim', 'iot', 'drone', 'copilot', 'workflow', 'reporting', 'tenant_settings', 'community_fault']
    },
    environment: {
        basic: [...commonBasic],
        pro: [...commonPro, 'iot'],
        enterprise: [...commonEnterprise, 'iot', 'drone', 'copilot', 'reporting', 'tenant_settings', 'anti_poaching']
    },
    education: {
        basic: [...commonBasic],
        pro: [...commonPro],
        enterprise: [...commonEnterprise, 'copilot', 'reporting', 'tenant_settings', 'low_bandwidth_twin']
    }
};

/**
 * Get modules for a specific industry and plan.
 * Falls back to 'manufacturing' if industry is not found.
 */
function getModulesForPlan(industry, plan) {
    const safeIndustry = industryTemplates[industry] ? industry : 'manufacturing';
    const safePlan = ['basic', 'pro', 'enterprise'].includes(plan) ? plan : 'basic';
    
    // De-duplicate array just in case
    return [...new Set(industryTemplates[safeIndustry][safePlan])];
}

module.exports = {
    industryTemplates,
    getModulesForPlan
};
