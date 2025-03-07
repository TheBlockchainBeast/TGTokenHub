import { NextResponse } from 'next/server';
import { ContractService } from '@/app/services/contracts';
import { TelegramService } from '@/app/services/telegram';

const contractService = new ContractService();
const telegramService = new TelegramService(contractService);

export async function POST(request: Request) {
    try {
        // Log the incoming request
        console.log('Webhook received:', {
            url: request.url,
            method: request.method,
            headers: Object.fromEntries(request.headers.entries())
        });

        // Parse the update
        const update = await request.json();
        console.log('Update data:', JSON.stringify(update, null, 2));

        // Basic validation
        if (!update || !update.message) {
            console.log('Invalid update format:', update);
            return NextResponse.json({ ok: true }); // Always return 200 OK to Telegram
        }

        // Extract basic info
        const {
            message: {
                chat: { id: chatId },
                text,
                from: { username, first_name }
            }
        } = update;

        console.log('Processing message:', {
            chatId,
            username,
            first_name,
            text
        });

        // Handle the update
        await telegramService.handleUpdate(update);
        console.log('Update handled successfully');

        return NextResponse.json({ ok: true });
    } catch (error) {
        // Log the error but don't expose it
        console.error('Error processing webhook:', error);

        // Always return success to Telegram
        return NextResponse.json({ ok: true });
    }
} 