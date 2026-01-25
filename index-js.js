import { createWalletClient, custom } from 'https://esm.sh/viem'

const connectButton = document.getElementById('connectButton');

let walletClient;

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

connectButton.onclick = connect;