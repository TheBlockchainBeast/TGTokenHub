import { Telegraf, Context } from 'telegraf';
import { ethers } from 'ethers';
import { TGTokenFactory__factory } from '../../typechain-types';

const TG_TOKEN_FACTORY_ADDRESS = process.env.TG_TOKEN_FACTORY_ADDRESS || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

export class TelegramBotService {
    private bot: Telegraf;
    private provider: ethers.Provider;
    private factory: ReturnType<typeof TGTokenFactory__factory.connect>;

    constructor() {
        this.bot = new Telegraf(TELEGRAM_BOT_TOKEN);
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        this.factory = TGTokenFactory__factory.connect(TG_TOKEN_FACTORY_ADDRESS, this.provider);

        this.setupCommands();
    }

    private setupCommands() {
        // Start command
        this.bot.command('start', async (ctx) => {
            await ctx.reply(
                'Welcome to TGTokenHub! 🚀\n\n' +
                'Create your own token tied to your Telegram username.\n\n' +
                'Commands:\n' +
                '/create - Create a new token\n' +
                '/price @username - Check token price\n' +
                '/buy @username amount - Buy tokens\n' +
                '/sell @username amount - Sell tokens'
            );
        });

        // Create token command
        this.bot.command('create', async (ctx) => {
            const username = ctx.from?.username;
            if (!username) {
                await ctx.reply('Please set a username in your Telegram settings first!');
                return;
            }

            try {
                const tokenAddress = await this.factory.getTokenAddress(username);
                if (tokenAddress !== ethers.ZeroAddress) {
                    await ctx.reply(`You already have a token at ${tokenAddress}`);
                    return;
                }

                await ctx.reply(
                    'To create your token, please:\n\n' +
                    '1. Connect your wallet\n' +
                    '2. Send 0.01 ETH to the factory contract\n' +
                    '3. Call createToken() with your username\n\n' +
                    'Contract address: ' + TG_TOKEN_FACTORY_ADDRESS
                );
            } catch (error) {
                console.error('Error creating token:', error);
                await ctx.reply('Failed to create token. Please try again later.');
            }
        });

        // Price command
        this.bot.command('price', async (ctx) => {
            const args = ctx.message?.text.split(' ');
            if (!args || args.length < 2) {
                await ctx.reply('Usage: /price @username');
                return;
            }

            const username = args[1].replace('@', '');
            try {
                const tokenAddress = await this.factory.getTokenAddress(username);
                if (tokenAddress === ethers.ZeroAddress) {
                    await ctx.reply('Token not found!');
                    return;
                }

                // TODO: Implement price fetching from DEX
                await ctx.reply(`Price for @${username} token: Coming soon!`);
            } catch (error) {
                console.error('Error fetching price:', error);
                await ctx.reply('Failed to fetch price. Please try again later.');
            }
        });

        // Buy command
        this.bot.command('buy', async (ctx) => {
            const args = ctx.message?.text.split(' ');
            if (!args || args.length < 3) {
                await ctx.reply('Usage: /buy @username amount');
                return;
            }

            const username = args[1].replace('@', '');
            const amount = args[2];

            try {
                const tokenAddress = await this.factory.getTokenAddress(username);
                if (tokenAddress === ethers.ZeroAddress) {
                    await ctx.reply('Token not found!');
                    return;
                }

                // TODO: Implement DEX integration for buying
                await ctx.reply(`Buying ${amount} tokens from @${username}: Coming soon!`);
            } catch (error) {
                console.error('Error buying tokens:', error);
                await ctx.reply('Failed to buy tokens. Please try again later.');
            }
        });

        // Sell command
        this.bot.command('sell', async (ctx) => {
            const args = ctx.message?.text.split(' ');
            if (!args || args.length < 3) {
                await ctx.reply('Usage: /sell @username amount');
                return;
            }

            const username = args[1].replace('@', '');
            const amount = args[2];

            try {
                const tokenAddress = await this.factory.getTokenAddress(username);
                if (tokenAddress === ethers.ZeroAddress) {
                    await ctx.reply('Token not found!');
                    return;
                }

                // TODO: Implement DEX integration for selling
                await ctx.reply(`Selling ${amount} tokens from @${username}: Coming soon!`);
            } catch (error) {
                console.error('Error selling tokens:', error);
                await ctx.reply('Failed to sell tokens. Please try again later.');
            }
        });
    }

    public start() {
        this.bot.launch();
        console.log('Telegram bot started');
    }
} 