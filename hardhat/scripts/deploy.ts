import { ethers } from "hardhat";

async function main() {
    console.log("Deploying BondingCurve...");
    const BondingCurve = await ethers.getContractFactory("BondingCurve");
    const bondingCurve = await BondingCurve.deploy();
    await bondingCurve.waitForDeployment();
    const bondingCurveAddress = await bondingCurve.getAddress();
    console.log("BondingCurve deployed to:", bondingCurveAddress);

    console.log("Deploying TGTokenFactory...");
    const TGTokenFactory = await ethers.getContractFactory("TGTokenFactory");
    const factory = await TGTokenFactory.deploy(bondingCurveAddress as any);
    await factory.waitForDeployment();
    const factoryAddress = await factory.getAddress();
    console.log("TGTokenFactory deployed to:", factoryAddress);

    // Wait for a few block confirmations
    console.log("Waiting for block confirmations...");
    await factory.deploymentTransaction()?.wait(5);
    console.log("Confirmed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 