"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://tgtokenhub.vercel.app/api/telegram/webhook';
async function setupWebhook() {
    try {
        // Generate a secret token from the bot token
        const secretToken = crypto_1.default
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
        }
        else {
            console.error('Failed to set webhook:', data.description);
        }
    }
    catch (error) {
        console.error('Error setting up webhook:', error);
    }
}
setupWebhook();
