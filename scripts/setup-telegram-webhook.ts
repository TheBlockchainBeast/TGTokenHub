import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://tgtokenhub.vercel.app/api/telegram/webhook';

async function setupWebhook() {
    try {
        // Generate a secret token from the bot token
        const secretToken = crypto
            .createHash('sha256')
            .update(BOT_TOKEN || '')
            .digest('hex')
            .slice(0, 20);

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: WEBHOOK_URL,
                allowed_updates: ['message'],
                secret_token: secretToken
            }),
        });

        const data = await response.json();
        if (data.ok) {
            console.log('Webhook set successfully!');
            console.log('Webhook URL:', WEBHOOK_URL);
            console.log('Secret Token:', secretToken);
        } else {
            console.error('Failed to set webhook:', data.description);
        }
    } catch (error) {
        console.error('Error setting up webhook:', error);
    }
}

setupWebhook(); 