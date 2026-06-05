import hre from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const adminWallet = process.env.ADMIN_WALLET;
  if (!adminWallet) {
    throw new Error("ADMIN_WALLET is not defined in .env");
  }

  const TrustDonate = await hre.ethers.getContractFactory("TrustDonate");
  const trustDonate = await TrustDonate.deploy(adminWallet);

  await trustDonate.waitForDeployment();

  console.log(`TrustDonate deployed to: ${await trustDonate.getAddress()}`);
  console.log(`Admin Wallet: ${adminWallet}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
