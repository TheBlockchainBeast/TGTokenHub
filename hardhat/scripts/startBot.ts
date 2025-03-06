import { TelegramBotService } from '../../app/services/telegramBot';

async function main() {
    try {
        const bot = new TelegramBotService();
        await bot.start();
    } catch (error) {
        console.error('Error starting bot:', error);
    }
}

main(); 