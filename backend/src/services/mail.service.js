/**
 * KGMAO Mail Service
 * Sends transactional emails for: Registration, Password Reset, Account Approval.
 * Bilingual support (EN/FR) on all templates.
 *
 * Provider priority:
 *   1. Resend  — set RESEND_API_KEY=re_xxxx  (recommended)
 *   2. SMTP    — set SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
 *
 * Common env vars (both providers):
 *   MAIL_FROM_ADDRESS=support@kgmao.com
 *   MAIL_FROM_NAME=KGMAO
 *   APP_URL=https://kgmao.com
 */

const nodemailer = require('nodemailer');
const axios = require('axios');
const logger = require('../config/logger');

// ============================================================
// PROVIDER CONFIGURATION
// ============================================================
const resendApiKey = process.env.RESEND_API_KEY || '';

const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
const smtpUser = process.env.SMTP_USER || 'support@kgmao.com';
const smtpPass = process.env.SMTP_PASS || '';

const mailFrom = process.env.MAIL_FROM_ADDRESS || 'support@kgmao.com';
const mailFromName = process.env.MAIL_FROM_NAME || 'KGMAO';
const appUrl = process.env.APP_URL || process.env.LIVE_PRODUCTION || 'https://kgmao.com';

let transporter = null;

const getTransporter = () => {
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { rejectUnauthorized: false },
        pool: true,
        maxConnections: 3,
        maxMessages: 50,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });

    return transporter;
};

// Send via Resend REST API (https://resend.com)
const sendViaResend = async (to, subject, htmlBody) => {
    const response = await axios.post(
        'https://api.resend.com/emails',
        {
            from: `${mailFromName} <${mailFrom}>`,
            to: [to],
            subject,
            html: htmlBody,
        },
        {
            headers: {
                Authorization: `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            timeout: 15000,
        }
    );
    return { success: true, messageId: response.data.id };
};

// ============================================================
// HTML EMAIL WRAPPER TEMPLATE
// ============================================================
const wrapInTemplate = (bodyContent, footerText) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KGMAO</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background:#0f172a; padding:32px 40px; border-radius:24px 24px 0 0; text-align:center;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <div style="display:inline-block; background:#facc15; color:#0f172a; font-size:28px; font-weight:900; letter-spacing:-1px; padding:12px 24px; border-radius:16px; font-style:italic; text-transform:uppercase;">
                                            KGMAO
                                        </div>
                                        <p style="color:#94a3b8; font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; margin:12px 0 0;">
                                            Enterprise Asset Intelligence
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="background:#ffffff; padding:48px 40px;">
                            ${bodyContent}
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#f8fafc; padding:24px 40px; border-radius:0 0 24px 24px; border-top:1px solid #e2e8f0; text-align:center;">
                            <p style="color:#94a3b8; font-size:11px; line-height:1.6; margin:0;">
                                ${footerText}
                            </p>
                            <p style="color:#cbd5e1; font-size:10px; margin:12px 0 0;">
                                © ${new Date().getFullYear()} Kalide Global — KGMAO Platform
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

const ctaButton = (text, url, color = '#0f172a') => `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:32px auto;">
        <tr>
            <td style="background:${color}; border-radius:16px; padding:0;">
                <a href="${url}" target="_blank" style="display:inline-block; padding:16px 40px; color:#ffffff; font-size:13px; font-weight:800; text-decoration:none; text-transform:uppercase; letter-spacing:2px;">
                    ${text}
                </a>
            </td>
        </tr>
    </table>`;

// ============================================================
// CORE SEND FUNCTION
// ============================================================
const sendEmail = async (to, subject, htmlBody) => {
    // ── Provider 1: Resend ──────────────────────────────────
    if (resendApiKey) {
        try {
            const result = await sendViaResend(to, subject, htmlBody);
            logger.info('Email sent via Resend', { to, subject, messageId: result.messageId });
            return result;
        } catch (err) {
            const detail = err.response?.data?.message || err.message;
            logger.error('Resend email failed', { to, subject, error: detail });
            return { success: false, error: detail };
        }
    }

    // ── Provider 2: SMTP (Nodemailer) ───────────────────────
    if (!smtpPass) {
        logger.warn('No email provider configured — set RESEND_API_KEY or SMTP_PASS', { to, subject });
        return { success: false, reason: 'No email provider configured' };
    }

    try {
        const transport = getTransporter();
        const info = await transport.sendMail({
            from: `${mailFromName} <${mailFrom}>`,
            to,
            subject,
            html: htmlBody,
        });

        logger.info('Email sent via SMTP', { to, subject, messageId: info.messageId });
        return { success: true, messageId: info.messageId };
    } catch (err) {
        logger.error('SMTP email failed', { to, subject, error: err.message });
        return { success: false, error: err.message };
    }
};

// ============================================================
// EMAIL TEMPLATES
// ============================================================

/**
 * 1. WELCOME EMAIL — Sent when a user account is directly created (legacy register flow)
 */
exports.sendWelcomeEmail = async (userEmail, languageCode = 'en') => {
    const isFr = languageCode === 'fr';

    const subject = isFr
        ? 'Bienvenue sur KGMAO — Votre GMAO Nouvelle Génération'
        : 'Welcome to KGMAO — Your Next-Gen CMMS';

    const body = wrapInTemplate(`
        <h1 style="color:#0f172a; font-size:28px; font-weight:900; margin:0 0 8px; text-transform:uppercase; font-style:italic; letter-spacing:-0.5px;">
            ${isFr ? 'Bienvenue sur KGMAO!' : 'Welcome to KGMAO!'}
        </h1>
        <div style="width:48px; height:4px; background:#facc15; border-radius:4px; margin:16px 0 24px;"></div>
        <p style="color:#475569; font-size:15px; line-height:1.8; margin:0 0 16px;">
            ${isFr
                ? 'Votre environnement a été créé avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités de maintenance prédictive, IoT en temps réel et gestion intelligente de vos actifs.'
                : 'Your environment has been successfully provisioned. You can now access all predictive maintenance, real-time IoT, and intelligent asset management features.'}
        </p>
        <p style="color:#475569; font-size:15px; line-height:1.8; margin:0 0 8px;">
            ${isFr
                ? 'Connectez-vous pour commencer :'
                : 'Log in to get started:'}
        </p>
        ${ctaButton(
            isFr ? 'ACCÉDER AU TABLEAU DE BORD' : 'GO TO DASHBOARD',
            `${appUrl}/login`
        )}
        <p style="color:#94a3b8; font-size:12px; margin:24px 0 0;">
            ${isFr
                ? 'Si vous avez des questions, contactez notre support à support@kgmao.com'
                : 'If you have any questions, contact our support at support@kgmao.com'}
        </p>
    `, isFr
        ? 'Cet e-mail a été envoyé par la plateforme KGMAO. Si vous n\'avez pas créé de compte, veuillez ignorer cet e-mail.'
        : 'This email was sent by the KGMAO platform. If you did not create an account, please ignore this email.'
    );

    return sendEmail(userEmail, subject, body);
};

/**
 * 2. PASSWORD RESET EMAIL — Sent when user requests a password reset
 */
exports.sendPasswordResetEmail = async (userEmail, resetToken, languageCode = 'en') => {
    const isFr = languageCode === 'fr';
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

    const subject = isFr
        ? 'Réinitialiser votre mot de passe KGMAO'
        : 'Reset Your KGMAO Password';

    const body = wrapInTemplate(`
        <h1 style="color:#0f172a; font-size:28px; font-weight:900; margin:0 0 8px; text-transform:uppercase; font-style:italic; letter-spacing:-0.5px;">
            ${isFr ? 'Réinitialisation du mot de passe' : 'Password Reset'}
        </h1>
        <div style="width:48px; height:4px; background:#facc15; border-radius:4px; margin:16px 0 24px;"></div>
        <p style="color:#475569; font-size:15px; line-height:1.8; margin:0 0 16px;">
            ${isFr
                ? 'Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en créer un nouveau :'
                : 'We received a request to reset your password. Click the button below to create a new one:'}
        </p>
        ${ctaButton(
            isFr ? 'RÉINITIALISER MON MOT DE PASSE' : 'RESET MY PASSWORD',
            resetUrl,
            '#dc2626'
        )}
        <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:12px; padding:16px 20px; margin:24px 0;">
            <p style="color:#991b1b; font-size:12px; font-weight:700; margin:0;">
                ⚠️ ${isFr
                    ? 'Ce lien expire dans 15 minutes. Si vous n\'avez pas fait cette demande, ignorez cet e-mail.'
                    : 'This link expires in 15 minutes. If you did not request this, please ignore this email.'}
            </p>
        </div>
        <p style="color:#94a3b8; font-size:11px; margin:16px 0 0; word-break:break-all;">
            ${isFr ? 'Lien direct :' : 'Direct link:'} <a href="${resetUrl}" style="color:#6366f1;">${resetUrl}</a>
        </p>
    `, isFr
        ? 'Cet e-mail a été envoyé suite à une demande de réinitialisation de mot de passe. Si ce n\'était pas vous, votre compte est en sécurité.'
        : 'This email was sent due to a password reset request. If this wasn\'t you, your account is safe — no action needed.'
    );

    return sendEmail(userEmail, subject, body);
};

/**
 * 3. ACCOUNT APPROVED EMAIL — Sent when super admin approves a registration request
 */
exports.sendAccountApprovedEmail = async (userEmail, firstName, companyName, plan, languageCode = 'en') => {
    const isFr = languageCode === 'fr';

    const planLabels = {
        basic: 'Basic',
        pro: 'Professional',
        enterprise: 'Enterprise'
    };

    const subject = isFr
        ? `✅ Votre compte KGMAO a été approuvé — ${companyName}`
        : `✅ Your KGMAO Account Has Been Approved — ${companyName}`;

    const body = wrapInTemplate(`
        <h1 style="color:#0f172a; font-size:28px; font-weight:900; margin:0 0 8px; text-transform:uppercase; font-style:italic; letter-spacing:-0.5px;">
            ${isFr ? `Félicitations, ${firstName}!` : `Congratulations, ${firstName}!`}
        </h1>
        <div style="width:48px; height:4px; background:#22c55e; border-radius:4px; margin:16px 0 24px;"></div>
        <p style="color:#475569; font-size:15px; line-height:1.8; margin:0 0 16px;">
            ${isFr
                ? `Votre demande d'inscription pour <strong>${companyName}</strong> a été approuvée. Votre environnement est maintenant actif et prêt à être utilisé.`
                : `Your registration request for <strong>${companyName}</strong> has been approved. Your environment is now active and ready to use.`}
        </p>

        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:16px; padding:24px; margin:24px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="padding:8px 0;">
                        <span style="color:#94a3b8; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:2px;">${isFr ? 'Entreprise' : 'Company'}</span><br>
                        <span style="color:#0f172a; font-size:16px; font-weight:800;">${companyName}</span>
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 0;">
                        <span style="color:#94a3b8; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:2px;">${isFr ? 'Plan' : 'Plan'}</span><br>
                        <span style="color:#0f172a; font-size:16px; font-weight:800;">${planLabels[plan] || plan}</span>
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 0;">
                        <span style="color:#94a3b8; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:2px;">${isFr ? 'Rôle' : 'Role'}</span><br>
                        <span style="color:#0f172a; font-size:16px; font-weight:800;">Admin</span>
                    </td>
                </tr>
            </table>
        </div>

        ${ctaButton(
            isFr ? 'SE CONNECTER MAINTENANT' : 'LOG IN NOW',
            `${appUrl}/login`,
            '#16a34a'
        )}
        <p style="color:#94a3b8; font-size:12px; margin:24px 0 0;">
            ${isFr
                ? 'Utilisez l\'adresse e-mail et le mot de passe que vous avez fournis lors de votre inscription.'
                : 'Use the email and password you provided during registration to log in.'}
        </p>
    `, isFr
        ? 'Votre compte a été approuvé par l\'administrateur KGMAO. Bienvenue dans l\'écosystème.'
        : 'Your account has been approved by a KGMAO administrator. Welcome to the ecosystem.'
    );

    return sendEmail(userEmail, subject, body);
};

/**
 * 4. REGISTRATION RECEIVED EMAIL — Sent when someone submits a registration request
 */
exports.sendRegistrationReceivedEmail = async (userEmail, firstName, companyName, languageCode = 'en') => {
    const isFr = languageCode === 'fr';

    const subject = isFr
        ? `📋 Demande reçue — ${companyName}`
        : `📋 Registration Received — ${companyName}`;

    const body = wrapInTemplate(`
        <h1 style="color:#0f172a; font-size:28px; font-weight:900; margin:0 0 8px; text-transform:uppercase; font-style:italic; letter-spacing:-0.5px;">
            ${isFr ? `Merci, ${firstName}!` : `Thank you, ${firstName}!`}
        </h1>
        <div style="width:48px; height:4px; background:#facc15; border-radius:4px; margin:16px 0 24px;"></div>
        <p style="color:#475569; font-size:15px; line-height:1.8; margin:0 0 16px;">
            ${isFr
                ? `Nous avons bien reçu votre demande d'inscription pour <strong>${companyName}</strong>. Notre équipe examine actuellement votre dossier.`
                : `We have received your registration request for <strong>${companyName}</strong>. Our team is currently reviewing your application.`}
        </p>
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:16px 20px; margin:24px 0;">
            <p style="color:#1e40af; font-size:13px; font-weight:600; margin:0;">
                📧 ${isFr
                    ? 'Vous recevrez un e-mail de confirmation dès que votre compte sera activé.'
                    : 'You will receive a confirmation email as soon as your account is activated.'}
            </p>
        </div>
        <p style="color:#94a3b8; font-size:12px; margin:16px 0 0;">
            ${isFr
                ? 'Temps de traitement habituel : 24 à 48 heures ouvrables.'
                : 'Typical processing time: 24–48 business hours.'}
        </p>
    `, isFr
        ? 'Vous recevez cet e-mail car une demande d\'inscription a été soumise avec cette adresse.'
        : 'You are receiving this email because a registration request was submitted with this address.'
    );

    return sendEmail(userEmail, subject, body);
};

/**
 * 5. VERIFICATION EMAIL — Legacy method (kept for compatibility)
 */
exports.sendVerificationEmail = async (userEmail, magicToken, languageCode = 'en') => {
    const isFr = languageCode === 'fr';
    const verifyUrl = `${appUrl}/verify?token=${magicToken}`;

    const subject = isFr
        ? 'Vérifiez votre compte KGMAO'
        : 'Verify your KGMAO Account';

    const body = wrapInTemplate(`
        <h1 style="color:#0f172a; font-size:28px; font-weight:900; margin:0 0 8px; text-transform:uppercase; font-style:italic; letter-spacing:-0.5px;">
            ${isFr ? 'Vérification du compte' : 'Account Verification'}
        </h1>
        <div style="width:48px; height:4px; background:#facc15; border-radius:4px; margin:16px 0 24px;"></div>
        <p style="color:#475569; font-size:15px; line-height:1.8; margin:0 0 16px;">
            ${isFr
                ? 'Cliquez sur le bouton ci-dessous pour activer votre environnement SaaS.'
                : 'Click the button below to activate your SaaS environment.'}
        </p>
        ${ctaButton(
            isFr ? 'VÉRIFIER MON COMPTE' : 'VERIFY MY ACCOUNT',
            verifyUrl,
            '#6366f1'
        )}
    `, isFr
        ? 'Si vous n\'avez pas créé de compte KGMAO, veuillez ignorer cet e-mail.'
        : 'If you did not create a KGMAO account, please ignore this email.'
    );

    return sendEmail(userEmail, subject, body);
};
