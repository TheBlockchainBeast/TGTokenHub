import { NextResponse } from 'next/server';
import { ContractService } from '@/app/services/contracts';
import { TelegramService } from '@/app/services/telegram';

const contractService = new ContractService();
const telegramService = new TelegramService(contractService);

export async function POST(request: Request) {
    console.log('Received webhook request');
    console.log('Request URL:', request.url);
    console.log('Headers:', Object.fromEntries(request.headers.entries()));

    try {
        const update = await request.json();
        console.log('Webhook update:', JSON.stringify(update, null, 2));

        // Always respond with 200 OK to Telegram
        try {
            await telegramService.handleUpdate(update);
            console.log('Successfully handled webhook update');
        } catch (error) {
            console.error('Error in handleUpdate:', error);
            // Don't throw the error, just log it
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        // Still return 200 OK to Telegram
        return NextResponse.json({ ok: true });
    }
} 