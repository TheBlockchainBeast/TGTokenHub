import { NextResponse } from 'next/server';
import { ContractService } from '@/app/services/contracts';
import { TelegramService } from '@/app/services/telegram';

const contractService = new ContractService();
const telegramService = new TelegramService(contractService);

// Simple authentication check
function isValidTelegramRequest(request: Request): boolean {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) return true; // Accept all requests if no token is set (not recommended for production)

    // Get the token from the URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const tokenFromPath = pathParts[pathParts.length - 2]; // Get the second to last part of the path

    return tokenFromPath === botToken;
}

export async function POST(request: Request) {
    console.log('Received webhook request');
    console.log('Request URL:', request.url);
    console.log('Headers:', Object.fromEntries(request.headers.entries()));

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