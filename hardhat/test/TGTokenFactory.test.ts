import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { TGTokenFactory, TGToken } from "../typechain-types";

describe("TGTokenFactory", function () {
    let factory: TGTokenFactory;
    let owner: SignerWithAddress;
    let user: SignerWithAddress;
    let username: string;

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();
        username = "testuser";

        const TGTokenFactory = await ethers.getContractFactory("TGTokenFactory");
        factory = await TGTokenFactory.deploy();
        await factory.waitForDeployment();
    });

    describe("createToken", function () {
        it("should create a new token with correct parameters", async function () {
            const mintFee = await factory.MINT_FEE();
            await factory.connect(user).createToken(username, { value: mintFee });

            const tokenAddress = await factory.getTokenAddress(username);
            expect(tokenAddress).to.not.equal(ethers.ZeroAddress);

            const token = await ethers.getContractAt("TGToken", tokenAddress);
            expect(await token.creator()).to.equal(user.address);
            expect(await token.name()).to.equal(username);
            expect(await token.symbol()).to.equal(`TG_${username}`);
        });

        it("should fail if username is already taken", async function () {
            const mintFee = await factory.MINT_FEE();
            await factory.connect(user).createToken(username, { value: mintFee });

            await expect(
                factory.connect(user).createToken(username, { value: mintFee })
            ).to.be.revertedWith("Username already taken");
        });

        it("should fail if insufficient mint fee is provided", async function () {
            const mintFee = await factory.MINT_FEE();
            await expect(
                factory.connect(user).createToken(username, { value: mintFee - 1n })
            ).to.be.revertedWith("Insufficient mint fee");
        });
    });

    describe("getTokenAddress", function () {
        it("should return zero address for non-existent token", async function () {
            const tokenAddress = await factory.getTokenAddress(username);
            expect(tokenAddress).to.equal(ethers.ZeroAddress);
        });

        it("should return correct address for existing token", async function () {
            const mintFee = await factory.MINT_FEE();
            await factory.connect(user).createToken(username, { value: mintFee });

            const tokenAddress = await factory.getTokenAddress(username);
            expect(tokenAddress).to.not.equal(ethers.ZeroAddress);
        });
    });

    describe("getTelegramUsername", function () {
        it("should return empty string for non-existent token", async function () {
            const username = await factory.getTelegramUsername(ethers.ZeroAddress);
            expect(username).to.equal("");
        });

        it("should return correct username for existing token", async function () {
            const mintFee = await factory.MINT_FEE();
            await factory.connect(user).createToken(username, { value: mintFee });

            const tokenAddress = await factory.getTokenAddress(username);
            const returnedUsername = await factory.getTelegramUsername(tokenAddress);
            expect(returnedUsername).to.equal(username);
        });
    });

    describe("withdrawFees", function () {
        it("should allow owner to withdraw fees", async function () {
            const mintFee = await factory.MINT_FEE();
            await factory.connect(user).createToken(username, { value: mintFee });

            const balanceBefore = await ethers.provider.getBalance(owner.address);
            await factory.connect(owner).withdrawFees();
            const balanceAfter = await ethers.provider.getBalance(owner.address);

            expect(balanceAfter).to.be.gt(balanceBefore);
        });

        it("should fail if non-owner tries to withdraw fees", async function () {
            await expect(
                factory.connect(user).withdrawFees()
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
}); 