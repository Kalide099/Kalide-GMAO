const PaymentFactory = require('../services/billing/paymentProviderFactory');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const axios = require('axios');

exports.upgradeSubscription = async (req, res, next) => {
    try {
        const { planId } = req.body;
        const companyId = req.user.company_id;

        // Fetch Plan logic
        const [plans] = await pool.query('SELECT price, currency FROM subscription_plans WHERE id = ?', [planId]);
        if (plans.length === 0) {
            return errorResponse(res, 404, 'Invalid Subscription Plan ID');
        }
        const plan = plans[0];

        // Ensure company is natively matching the plan currency (or convert via a utility)
        const [companies] = await pool.query('SELECT currency FROM companies WHERE id = ?', [companyId]);
        const companyCurrency = companies[0].currency;

        let amountToCharge = plan.price;
        let chargeCurrency = plan.currency;

        if (companyCurrency && companyCurrency !== plan.currency) {
            try {
                // Trigger dynamic exchange rate API utility
                const response = await axios.get(`https://open.er-api.com/v6/latest/${plan.currency}`);
                const rates = response.data.rates;
                if (rates && rates[companyCurrency]) {
                    amountToCharge = amountToCharge * rates[companyCurrency];
                    chargeCurrency = companyCurrency;
                    console.log(`[EXCHANGE] Converted ${plan.price} ${plan.currency} to ${amountToCharge.toFixed(2)} ${chargeCurrency}`);
                }
            } catch (err) {
                console.warn('[EXCHANGE API ERROR] Falling back to base plan currency', err.message);
            }
        }

        // Initialize Dynamic Abstract Provider
        const provider = PaymentFactory.getProvider(chargeCurrency);
        
        // Generate Abstract Checkout Session URL
        const checkoutInfo = await provider.createCheckoutSession(companyId, amountToCharge, chargeCurrency, 'https://kgmao.com/billing');

        // Track intended pending payment in database to reconcile Webhooks securely later
        await pool.query(
            `INSERT INTO payments (id, company_id, amount, currency, provider, status, transaction_reference) 
             VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
            [uuidv4(), companyId, amountToCharge, chargeCurrency, checkoutInfo.provider, checkoutInfo.transactionRef]
        );

        return successResponse(res, 200, 'Initiated Payment successfully', {
            paymentUrl: checkoutInfo.sessionUrl,
            transactionReference: checkoutInfo.transactionRef,
            provider: checkoutInfo.provider
        });

    } catch (err) {
        next(err);
    }
};

exports.getSubscriptionStatus = async (req, res, next) => {
    try {
        const query = `
            SELECT c.subscription_status, c.timezone, c.currency, s.end_date, s.plan_id
            FROM companies c
            LEFT JOIN subscriptions s ON c.id = s.company_id AND s.status = 'active'
            WHERE c.id = ?
        `;
        const [rows] = await pool.query(query, [req.user.company_id]);

        return successResponse(res, 200, 'Subscription checked', rows[0]);
    } catch(err) {
        next(err);
    }
}
