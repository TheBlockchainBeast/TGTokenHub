import { ContractService } from './contracts';
import { ethers } from 'ethers';

export class TelegramService {
    private contractService: ContractService;
    private botToken: string;
    private botUrl: string;

    constructor(contractService: ContractService) {
        console.log('Initializing TelegramService');
        this.contractService = contractService;
        this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
        this.botUrl = `https://api.telegram.org/bot${this.botToken}`;
        console.log('TelegramService initialized with URL base:', this.botUrl.split(':')[0] + ':[REDACTED]');
    }

    async handleUpdate(update: any) {
        console.log('Processing update:', JSON.stringify(update, null, 2));

        if (!update.message) {
            console.log('No message in update');
            return;
        }

        const chatId = update.message.chat.id;
        const text = update.message.text || '';
        const username = update.message.from?.username;
        const firstName = update.message.from?.first_name || 'there';

        console.log('Processing message:', { chatId, text, username, firstName });

        if (!username) {
            await this.sendMessage(chatId,
                `Hi ${firstName}! 👋\n\n` +
                `To use this bot, you need to set up a username in your Telegram settings first.\n\n` +
                `Here's how:\n` +
                `1. Go to Telegram Settings\n` +
                `2. Click on 'Edit Profile'\n` +
                `3. Set your username\n` +
                `4. Come back and try again!`
            );
            return;
        }

        try {
            if (text.startsWith('/start')) {
                await this.handleStart(chatId, username, firstName);
            } else if (text.startsWith('/help')) {
                await this.handleHelp(chatId);
            } else if (text.startsWith('/price')) {
                await this.handlePrice(chatId, username);
            } else if (text.startsWith('/mint')) {
                await this.handleMint(chatId, username, text);
            } else if (text.startsWith('/burn')) {
                await this.handleBurn(chatId, username, text);
            } else {
                await this.handleUnknownCommand(chatId);
            }
        } catch (error) {
            console.error('Error handling command:', error);
            await this.sendMessage(chatId,
                `Sorry ${firstName}, something went wrong while processing your request. 😕\n\n` +
                `Please try again later or contact support if the issue persists.`
            );
        }
    }

    private async handleStart(chatId: number, username: string, firstName: string) {
        console.log('Handling /start command:', { chatId, username });

        try {
            const tokenAddress = await this.contractService.getTokenAddress(username);

            if (tokenAddress === ethers.ZeroAddress) {
                await this.sendMessage(chatId,
                    `Welcome ${firstName}! 🚀\n\n` +
                    `I see you haven't created your personal token yet. With TGTokenHub, you can turn your Telegram username into a tradeable token!\n\n` +
                    `To get started:\n` +
                    `1. Visit https://tgtokenhub.vercel.app\n` +
                    `2. Connect your wallet\n` +
                    `3. Create your token\n\n` +
                    `Once created, you can use these commands:\n` +
                    `/price - Check your token's price\n` +
                    `/mint <amount> - Mint new tokens\n` +
                    `/burn <amount> - Burn tokens\n` +
                    `/help - Show all commands`
                );
            } else {
                const info = await this.contractService.getTokenInfo(tokenAddress);
                const price = await this.contractService.getCurrentPrice(tokenAddress);

                await this.sendMessage(chatId,
                    `Welcome back ${firstName}! 👋\n\n` +
                    `Your token is live and trading!\n\n` +
                    `Token Info:\n` +
                    `• Name: ${info.name}\n` +
                    `• Symbol: ${info.symbol}\n` +
                    `• Social Score: ${info.socialScore.toString()}\n` +
                    `• Current Price: ${ethers.formatEther(price)} ETH\n\n` +
                    `Available commands:\n` +
                    `/price - Check current price\n` +
                    `/mint <amount> - Mint tokens\n` +
                    `/burn <amount> - Burn tokens\n` +
                    `/help - Show all commands`
                );
            }
        } catch (error) {
            console.error('Error in handleStart:', error);
            throw error;
        }
    }

    private async handleHelp(chatId: number) {
        await this.sendMessage(chatId,
            `🤖 TGTokenHub Bot Commands:\n\n` +
            `/start - Get started\n` +
            `/price - Check your token's price\n` +
            `/mint <amount> - Mint new tokens\n` +
            `/burn <amount> - Burn tokens\n` +
            `/help - Show this help message\n\n` +
            `Visit https://tgtokenhub.vercel.app to manage your token!`
        );
    }

    private async handleUnknownCommand(chatId: number) {
        await this.sendMessage(chatId,
            `I don't recognize that command. 🤔\n\n` +
            `Here are the available commands:\n` +
            `/start - Get started\n` +
            `/price - Check token price\n` +
            `/mint <amount> - Mint tokens\n` +
            `/burn <amount> - Burn tokens\n` +
            `/help - Show all commands`
        );
    }

    private async handlePrice(chatId: number, username: string) {
        const tokenAddress = await this.contractService.getTokenAddress(username);
        if (tokenAddress === ethers.ZeroAddress) {
            await this.sendMessage(chatId, 'Your token has not been created yet. Visit our website to create it: https://tgtokenhub.vercel.app');
            return;
        }

        const price = await this.contractService.getCurrentPrice(tokenAddress);
        await this.sendMessage(chatId, `Current price: ${ethers.formatEther(price)} ETH`);
    }

    private async handleMint(chatId: number, username: string, text: string) {
        const tokenAddress = await this.contractService.getTokenAddress(username);
        if (tokenAddress === ethers.ZeroAddress) {
            await this.sendMessage(chatId, 'Your token has not been created yet. Visit our website to create it: https://tgtokenhub.vercel.app');
            return;
        }

        const amount = text.split(' ')[1];
        if (!amount || isNaN(Number(amount))) {
            await this.sendMessage(chatId, 'Please provide a valid amount. Example: /mint 1000');
            return;
        }

        const ethAmount = await this.contractService.calculateTokensForEth(tokenAddress, BigInt(amount));
        await this.sendMessage(chatId,
            `To mint ${amount} tokens, you'll need to send ${ethers.formatEther(ethAmount)} ETH.\n` +
            `Please visit our website to complete the transaction: https://tgtokenhub.vercel.app`
        );
    }

    private async handleBurn(chatId: number, username: string, text: string) {
        const tokenAddress = await this.contractService.getTokenAddress(username);
        if (tokenAddress === ethers.ZeroAddress) {
            await this.sendMessage(chatId, 'Your token has not been created yet. Visit our website to create it: https://tgtokenhub.vercel.app');
            return;
        }

        const amount = text.split(' ')[1];
        if (!amount || isNaN(Number(amount))) {
            await this.sendMessage(chatId, 'Please provide a valid amount. Example: /burn 1000');
            return;
        }

        await this.sendMessage(chatId,
            `To burn ${amount} tokens, please visit our website: https://tgtokenhub.vercel.app\n` +
            `You'll receive ETH back based on the current price.`
        );
    }

    private async sendMessage(chatId: number, text: string) {
        console.log('Sending message:', { chatId, text });
        try {
            const response = await fetch(`${this.botUrl}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'HTML',
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to send message:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorText
                });
                throw new Error(`Failed to send message: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Message sent successfully:', result);
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
} 