const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../config/db');
const { config } = require('../config/env');

exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
        console.warn('[STRIPE WEBHOOK] Secret not configured.');
        return res.status(400).send('Webhook secret not configured.');
    }

    let event;

    try {
        // req.body is the raw buffer thanks to express.raw()
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error('[STRIPE WEBHOOK ERROR]', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const transactionRef = session.id;

        try {
            // Find the pending payment
            const [payments] = await pool.query('SELECT * FROM payments WHERE transaction_reference = ? LIMIT 1', [transactionRef]);
            
            if (payments.length > 0) {
                const payment = payments[0];
                const companyId = payment.company_id;

                // Update payment status
                await pool.query('UPDATE payments SET status = "success" WHERE id = ?', [payment.id]);

                // We assume basic plan logic for now, but a real app would extract the plan from the session's line items
                // Upgrading the user's plan logic here
                await pool.query(`
                    INSERT INTO subscriptions (id, company_id, plan_id, start_date, end_date, status)
                    VALUES (UUID(), ?, 'pro', NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), 'active')
                    ON DUPLICATE KEY UPDATE end_date = DATE_ADD(NOW(), INTERVAL 1 MONTH), status = 'active'
                `, [companyId]);
                
                await pool.query('UPDATE companies SET subscription_status = "active", plan = "pro" WHERE id = ?', [companyId]);
                
                console.log(`[WEBHOOK] Successfully upgraded company ${companyId}`);
            }
        } catch (err) {
            console.error('[WEBHOOK DB ERROR]', err.message);
            return res.status(500).send('Database error during webhook processing.');
        }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({received: true});
};
