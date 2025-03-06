import { NextResponse } from 'next/server';
import { ContractService } from '@/app/services/contracts';
import { TelegramService } from '@/app/services/telegram';

const contractService = new ContractService();
const telegramService = new TelegramService(contractService);

export async function POST(request: Request) {
    try {
        console.log('Received webhook request');
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