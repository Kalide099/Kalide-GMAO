/**
 * Abstract Payment Factory
 * This allows swapping out providers seamlessly globally mapping Stripe for USA/EU,
 * Razorpay for India, and abstracted Mobile Money APIs for Africa dynamically.
 */

class StripeProvider {
    async createCheckoutSession(companyId, amount, currency, returnUrl) {
        // Mock Stripe API interaction
        console.log(`[STRIPE] Initiating Checkout for ${companyId} - ${amount} ${currency}`);
        return { 
            provider: 'stripe',
            sessionUrl: `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substring(7)}`,
            transactionRef: `tx_stripe_${Date.now()}`
        };
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
        // Mock Mobile Money (MTN MoMo, Orange Money) abstraction
        console.log(`[MOBILE_MONEY] Initiating USSD Push / Checkout for ${companyId} - ${amount} ${currency}`);
        return { 
            provider: 'mobile_money',
            sessionUrl: `https://momo.africa/pay/session_${Math.random().toString(36).substring(7)}`,
            transactionRef: `tx_momo_${Date.now()}`
        };
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
