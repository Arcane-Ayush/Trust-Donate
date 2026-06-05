import hre from "hardhat";

async function main() {
  // Use a placeholder admin wallet if not provided, for testing/mock purposes.
  // In a real deployment, this should be an environment variable.
  const adminWallet = process.env.ADMIN_WALLET || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

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
