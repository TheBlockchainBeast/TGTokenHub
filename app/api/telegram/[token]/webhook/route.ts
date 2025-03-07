import { NextResponse } from 'next/server';
import { ContractService } from '@/app/services/contracts';
import { TelegramService } from '@/app/services/telegram';

const contractService = new ContractService();
const telegramService = new TelegramService(contractService);

export async function POST(request: Request, { params }: { params: { token: string } }) {
    console.log('Received webhook request');
    console.log('Token from URL:', params.token);
    console.log('Bot token from env:', process.env.TELEGRAM_BOT_TOKEN);
    console.log('Headers:', Object.fromEntries(request.headers.entries()));

    // Verify the token from the URL matches our bot token
    if (params.token !== process.env.TELEGRAM_BOT_TOKEN) {
        console.error('Invalid bot token');
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