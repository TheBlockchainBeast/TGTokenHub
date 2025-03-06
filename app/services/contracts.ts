import { ethers } from 'ethers';
import { TGTokenFactory__factory, TGToken__factory, BondingCurve__factory } from '../types';

const TG_TOKEN_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_TG_TOKEN_FACTORY_ADDRESS || '';
const BONDING_CURVE_ADDRESS = process.env.NEXT_PUBLIC_BONDING_CURVE_ADDRESS || '';

export class ContractService {
    private provider: ethers.Provider;
    private factory: ReturnType<typeof TGTokenFactory__factory.connect>;
    private bondingCurve: ReturnType<typeof BondingCurve__factory.connect>;
    private signer: ethers.Signer | null = null;

    constructor() {
        console.log('Initializing ContractService with:', {
            rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
            factoryAddress: TG_TOKEN_FACTORY_ADDRESS,
            bondingCurveAddress: BONDING_CURVE_ADDRESS
        });

        this.provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        this.factory = TGTokenFactory__factory.connect(TG_TOKEN_FACTORY_ADDRESS, this.provider);
        this.bondingCurve = BondingCurve__factory.connect(BONDING_CURVE_ADDRESS, this.provider);

        console.log('ContractService initialized successfully');
    }

    async connect(signer: ethers.Signer) {
        this.signer = signer;
        this.factory = TGTokenFactory__factory.connect(TG_TOKEN_FACTORY_ADDRESS, signer);
        this.bondingCurve = BondingCurve__factory.connect(BONDING_CURVE_ADDRESS, signer);
    }

    async createToken(username: string) {
        if (!this.signer) throw new Error('Wallet not connected');

        const mintFee = await this.factory.MINT_FEE();
        const tx = await this.factory.createToken(username, { value: mintFee });
        return await tx.wait();
    }

    async getTokenAddress(username: string) {
        console.log('Getting token address for username:', username);
        try {
            const address = await this.factory.getTokenAddress(username);
            console.log('Token address:', address);
            return address;
        } catch (error) {
            console.error('Error getting token address:', error);
            throw error;
        }
    }

    async getTelegramUsername(tokenAddress: string) {
        return await this.factory.getTelegramUsername(tokenAddress);
    }

    async getTokenInfo(tokenAddress: string) {
        console.log('Getting token info for address:', tokenAddress);
        try {
            const token = TGToken__factory.connect(tokenAddress, this.provider);
            const [name, symbol, creator, socialScore, lastUpdate] = await Promise.all([
                token.name(),
                token.symbol(),
                token.creator(),
                token.socialScore(),
                token.lastUpdate()
            ]);

            const info = {
                name,
                symbol,
                creator,
                socialScore,
                lastUpdate
            };
            console.log('Token info:', info);
            return info;
        } catch (error) {
            console.error('Error getting token info:', error);
            throw error;
        }
    }

    async getTokenBalance(tokenAddress: string, address: string) {
        const token = TGToken__factory.connect(tokenAddress, this.provider);
        return await token.balanceOf(address);
    }

    async updateSocialScore(tokenAddress: string, newScore: bigint) {
        if (!this.signer) throw new Error('Wallet not connected');

        const token = TGToken__factory.connect(tokenAddress, this.signer);
        const tx = await token.updateSocialScore(newScore);
        return await tx.wait();
    }

    // Bonding Curve Functions
    async getCurrentPrice(tokenAddress: string) {
        console.log('Getting current price for token:', tokenAddress);
        try {
            const token = TGToken__factory.connect(tokenAddress, this.provider);
            const price = await token.getCurrentPrice();
            console.log('Current price:', price.toString());
            return price;
        } catch (error) {
            console.error('Error getting current price:', error);
            throw error;
        }
    }

    async calculateTokensForEth(tokenAddress: string, ethAmount: bigint) {
        const token = TGToken__factory.connect(tokenAddress, this.provider);
        return await token.calculateTokensForEth(ethAmount);
    }

    async mintTokens(tokenAddress: string, amount: bigint, ethAmount: bigint) {
        if (!this.signer) throw new Error('Wallet not connected');

        const token = TGToken__factory.connect(tokenAddress, this.signer);
        const tx = await token.mint(amount, { value: ethAmount });
        return await tx.wait();
    }

    async burnTokens(tokenAddress: string, amount: bigint) {
        if (!this.signer) throw new Error('Wallet not connected');

        const token = TGToken__factory.connect(tokenAddress, this.signer);
        const tx = await token.burn(amount);
        return await tx.wait();
    }
} 