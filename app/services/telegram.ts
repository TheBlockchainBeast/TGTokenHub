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
        console.log('TelegramService initialized with bot URL:', this.botUrl);
    }

    async handleUpdate(update: any) {
        console.log('TelegramService.handleUpdate called with:', JSON.stringify(update, null, 2));

        if (!update.message) {
            console.log('No message in update');
            return;
        }

        const chatId = update.message.chat.id;
        const text = update.message.text || '';
        const username = update.message.from?.username;

        console.log('Processing message:', { chatId, text, username });

        if (!username) {
            console.log('No username provided, sending error message');
            await this.sendMessage(chatId, 'Please set a username in your Telegram account to use this bot.');
            return;
        }

        try {
            if (text.startsWith('/start')) {
                console.log('Handling /start command');
                await this.handleStart(chatId, username);
            } else if (text.startsWith('/price')) {
                console.log('Handling /price command');
                await this.handlePrice(chatId, username);
            } else if (text.startsWith('/mint')) {
                console.log('Handling /mint command');
                await this.handleMint(chatId, username, text);
            } else if (text.startsWith('/burn')) {
                console.log('Handling /burn command');
                await this.handleBurn(chatId, username, text);
            } else {
                console.log('Unknown command:', text);
                await this.sendMessage(chatId, 'Unknown command. Available commands:\n/start - Get started\n/price - Check token price\n/mint <amount> - Mint tokens\n/burn <amount> - Burn tokens');
            }
        } catch (error) {
            console.error('Error handling Telegram update:', error);
            await this.sendMessage(chatId, 'An error occurred. Please try again later.');
        }
    }

    private async handleStart(chatId: number, username: string) {
        console.log('handleStart called for:', { chatId, username });
        try {
            const tokenAddress = await this.contractService.getTokenAddress(username);
            console.log('Token address for user:', tokenAddress);

            if (tokenAddress === ethers.ZeroAddress) {
                await this.sendMessage(chatId, `Welcome! Your token hasn't been created yet. Visit our website to create your token: https://tgtokenhub.vercel.app`);
            } else {
                const info = await this.contractService.getTokenInfo(tokenAddress);
                const price = await this.contractService.getCurrentPrice(tokenAddress);
                await this.sendMessage(chatId,
                    `Welcome! Your token is already created.\n` +
                    `Name: ${info.name}\n` +
                    `Symbol: ${info.symbol}\n` +
                    `Social Score: ${info.socialScore.toString()}\n` +
                    `Current Price: ${ethers.formatEther(price)} ETH\n\n` +
                    `Use /price to check the current price\n` +
                    `Use /mint <amount> to mint tokens\n` +
                    `Use /burn <amount> to burn tokens`
                );
            }
        } catch (error) {
            console.error('Error in handleStart:', error);
            throw error;
        }
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