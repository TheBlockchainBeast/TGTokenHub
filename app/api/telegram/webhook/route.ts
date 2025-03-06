import { NextResponse } from 'next/server';
import { ContractService } from '@/app/services/contracts';
import { TelegramService } from '@/app/services/telegram';
import crypto from 'crypto';

const contractService = new ContractService();
const telegramService = new TelegramService(contractService);

// Function to verify the request is from Telegram
function verifyTelegramWebhook(request: Request, secretToken: string): boolean {
    try {
        // Get the X-Telegram-Bot-Api-Secret-Token header
        const secretHeader = request.headers.get('x-telegram-bot-api-secret-token');

        // If there's no secret token set, accept all requests (not recommended for production)
        if (!secretToken) {
            console.warn('No secret token configured, accepting all requests');
            return true;
        }

        // Verify the secret token matches
        return secretHeader === secretToken;
    } catch (error) {
        console.error('Error verifying webhook:', error);
        return false;
    }
}

export async function POST(request: Request) {
    console.log('Received webhook request');

    // Generate a secret token from the bot token
    const secretToken = crypto
        .createHash('sha256')
        .update(process.env.TELEGRAM_BOT_TOKEN || '')
        .digest('hex')
        .slice(0, 20);

    // Verify the request
    if (!verifyTelegramWebhook(request, secretToken)) {
        console.error('Invalid webhook request');
        return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const update = await request.json();
        console.log('Webhook update:', JSON.stringify(update, null, 2));
        await telegramService.handleUpdate(update);
        console.log('Successfully handled webhook update');
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
    }
} 