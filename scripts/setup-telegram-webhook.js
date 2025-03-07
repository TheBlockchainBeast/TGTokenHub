"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BASE_URL = process.env.WEBHOOK_URL || 'https://tgtokenhub.vercel.app';
async function setupWebhook() {
    try {
        // Use a simpler webhook URL
        const webhookUrl = `${BASE_URL}/api/telegram-webhook`;
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: webhookUrl,
                allowed_updates: ['message']
            }),
        });
        const data = await response.json();
        if (data.ok) {
            console.log('Webhook set successfully!');
            console.log('Webhook URL:', webhookUrl);
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
