import { createWalletClient, custom, createPublicClient, parseEther, defineChain } from 'https://esm.sh/viem'
import { contractAddress, coffeeAbi } from './constants-js.js'

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById('fundButton');
const ethAmountInput = document.getElementById('ethAmount');

let walletClient;
let publicClient;

async function connect(){
    // Check to see if MetaMask is installed (window.ethereum would not be on the window object if it is not installed)
    if(typeof window.ethereum !== 'undefined'){
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        // Request the user's addresses from MetaMask (pauses)
        await walletClient.requestAddresses();
        // Promise resolves and it's connected
        connectButton.innerHTML = "Connected!"
    } else {
        connectButton.innerHTML = "Please install MetaMask!";
    }
}

async function fund(){
    const ethAmount = ethAmountInput.value;
    console.log(`Funding with ${ethAmount}...`)

    // Just in case someone hasn't called connect() again recently
    if(typeof window.ethereum !== 'undefined'){
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        const [connectedAccount] = await walletClient.requestAddresses()
        const currentChain = await getCurrentChain(walletClient)

        // Create a public client to interact with the blockchain
        // The transport or the node/blockchain node we are connecting to is inside window.ethereum
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })

        // Simulate the contract call to see if the user has enough funds
        await publicClient.simulateContract({
            address: contractAddress,
            abi: coffeeAbi,
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount) // Convert the amount of ETH to wei
        })
    } else {
        connectButton.innerHTML = "Please install MetaMask!";
    }
}
async function getCurrentChain(client) {
    const chainId = await client.getChainId()
    const currentChain = defineChain({
      id: chainId,
      name: "Custom Chain",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: {
        default: {
          http: ["http://localhost:8545"],
        },
      },
    })
    return currentChain
  }

connectButton.onclick = connect;
fundButton.onclick = fund;