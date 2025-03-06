import { TelegramBotService } from '../app/services/telegramBot';

async function main() {
    try {
        const bot = new TelegramBotService();
        bot.start();
    } catch (error) {
        console.error('Failed to start Telegram bot:', error);
        process.exit(1);
    }
}

main(); 