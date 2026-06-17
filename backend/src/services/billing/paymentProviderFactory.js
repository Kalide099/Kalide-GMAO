/**
 * Abstract Payment Factory
 * This allows swapping out providers seamlessly globally mapping Stripe for USA/EU,
 * Razorpay for India, and abstracted Mobile Money APIs for Africa dynamically.
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
const axios = require('axios');

class StripeProvider {
    async createCheckoutSession(companyId, amount, currency, returnUrl) {
        if (!process.env.STRIPE_SECRET_KEY) {
            console.warn(`[STRIPE MOCK] No secret key. Returning mock URL.`);
            return { 
                provider: 'stripe_mock',
                sessionUrl: `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substring(7)}`,
                transactionRef: `tx_stripe_mock_${Date.now()}`
            };
        }

        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: 'KGMAO SaaS Subscription',
                            description: 'Billed per organization setup'
                        },
                        unit_amount: Math.round(amount * 100), // Stripe expects cents
                    },
                    quantity: 1,
                }],
                mode: 'payment', // Change to 'subscription' for recurring later if needed
                success_url: `${returnUrl}?status=success&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${returnUrl}?status=cancel`,
                client_reference_id: companyId,
            });

            console.log(`[STRIPE] Initiated real checkout session for ${companyId}`);
            return { 
                provider: 'stripe',
                sessionUrl: session.url,
                transactionRef: session.id
            };
        } catch (error) {
            console.error('[STRIPE ERROR]', error);
            throw new Error('Failed to create Stripe checkout session');
        }
    }
}

class RazorpayProvider {
    async createCheckoutSession(companyId, amount, currency, returnUrl) {
        // Mock Razorpay API
        console.log(`[RAZORPAY] Initiating Checkout for ${companyId} - ${amount} ${currency}`);
        return { 
            provider: 'razorpay',
            sessionUrl: `https://checkout.razorpay.com/v1/checkout_${Math.random().toString(36).substring(7)}`,
            transactionRef: `tx_rzp_${Date.now()}`
        };
    }
}

class MobileMoneyProvider {
    async createCheckoutSession(companyId, amount, currency, returnUrl) {
        if (!process.env.PAYSTACK_SECRET_KEY) {
            console.warn(`[PAYSTACK MOCK] No secret key. Returning mock URL for Mobile Money.`);
            return { 
                provider: 'paystack_mock',
                sessionUrl: `https://checkout.paystack.com/mock_${Math.random().toString(36).substring(7)}`,
                transactionRef: `tx_momo_mock_${Date.now()}`
            };
        }

        try {
            const response = await axios.post(
                'https://api.paystack.co/transaction/initialize',
                {
                    email: `admin_${companyId}@kalide.tenant.com`, // Usually we pass the user's email here
                    amount: Math.round(amount * 100), // Paystack uses kobo/cents
                    currency: currency.toUpperCase(),
                    callback_url: returnUrl,
                    metadata: {
                        company_id: companyId
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log(`[PAYSTACK] Initiated checkout for ${companyId}`);
            return {
                provider: 'paystack',
                sessionUrl: response.data.data.authorization_url,
                transactionRef: response.data.data.reference
            };
        } catch (error) {
            console.error('[PAYSTACK ERROR]', error?.response?.data || error.message);
            throw new Error('Failed to create Paystack/MobileMoney checkout session');
        }
    }
}

class PaymentFactory {
    static getProvider(currency) {
        // Route dynamically based on standard currency regions
        switch (currency.toUpperCase()) {
            case 'INR':
                return new RazorpayProvider();
            case 'XOF':
            case 'XAF':
            case 'KES':
                return new MobileMoneyProvider();
            case 'USD':
            case 'EUR':
            default:
                return new StripeProvider();
        }
    }
}

module.exports = PaymentFactory;
