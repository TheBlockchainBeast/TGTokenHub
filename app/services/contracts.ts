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
        this.provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        this.factory = TGTokenFactory__factory.connect(TG_TOKEN_FACTORY_ADDRESS, this.provider);
        this.bondingCurve = BondingCurve__factory.connect(BONDING_CURVE_ADDRESS, this.provider);
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
        return await this.factory.getTokenAddress(username);
    }

    async getTelegramUsername(tokenAddress: string) {
        return await this.factory.getTelegramUsername(tokenAddress);
    }

    async getTokenInfo(tokenAddress: string) {
        const token = TGToken__factory.connect(tokenAddress, this.provider);
        const [name, symbol, creator, socialScore, lastUpdate] = await Promise.all([
            token.name(),
            token.symbol(),
            token.creator(),
            token.socialScore(),
            token.lastUpdate()
        ]);

        return {
            name,
            symbol,
            creator,
            socialScore,
            lastUpdate
        };
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
        const token = TGToken__factory.connect(tokenAddress, this.provider);
        return await token.getCurrentPrice();
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