const contractAddress = "0x33E8d75fbA68527FD23F4c94d2B913012b02E0C3"; 
const contractABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "candidatesCount",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{"name": "", "type": "uint256"}],
        "name": "candidates",
        "outputs": [
            {"name": "id", "type": "uint256"},
            {"name": "name", "type": "string"},
            {"name": "voteCount", "type": "uint256"}
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{"name": "_candidateId", "type": "uint256"}],
        "name": "vote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let web3;
let contract;

window.addEventListener("load", async () => {
    if (typeof window.ethereum !== "undefined") {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(contractABI, contractAddress);

        document.getElementById("connectWallet").addEventListener("click", async () => {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
                alert("Wallet connected!");
                loadCandidates();
            } catch (error) {
                console.error("Connection Error:", error);
                alert("Failed to connect wallet.");
            }
        });
    } else {
        alert("Please install MetaMask!");
    }
});

async function loadCandidates() {
    try {
        const count = await contract.methods.candidatesCount().call();
        const container = document.getElementById("candidates");
        container.innerHTML = "";

        for (let i = 1; i <= count; i++) {
            const candidate = await contract.methods.candidates(i).call();
            container.innerHTML += `
                <div class="candidate">
                    <h2>${candidate.name}</h2>
                    <p>Votes: ${candidate.voteCount}</p>
                    <button onclick="vote(${candidate.id})" id="voteButton${candidate.id}">Vote</button>
                </div>
            `;
        }
    } catch (error) {
        console.error("Loading Candidates Error:", error);
    }
}

async function vote(candidateId) {
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.vote(candidateId).send({ from: accounts[0] });

        alert("Vote cast successfully!");

        // Disable the vote button after voting
        document.getElementById(`voteButton${candidateId}`).disabled = true;

        // Reload candidates to update vote count
        loadCandidates();
    } catch (error) {
        console.error("Voting Error:", error);
        alert("Voting failed. Check console for details.");
    }
}