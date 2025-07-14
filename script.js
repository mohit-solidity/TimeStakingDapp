let provider ,signer,userAddress,contract;
const contractAddress ="0x67889E5E3FAC38DA8379325190aC219325e511AB";
const abi = ["function checkYield() view returns(uint)",
    "function stake(uint) payable",
    "function balance(address) view returns(uint)",
    "function startTime(address) view returns(uint)",
    "function endTime(address) view returns(uint)",
    "function daysStaked(address) view returns(uint)",
    "function withdraw()",
    "function emergencyWithdraw()",
    "function calculateReward() view returns(uint)"
];
async function connect(){
    if(window.ethereum){
        try{
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts",[]);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            contract = new ethers.Contract(contractAddress,abi,signer);
            showPopup(`Wallet Connected To : ${userAddress}`,"success");
            window.location.href = "dashboard.html";
        }catch(err){
            showPopup(`Error : ${err.reason||err.message}`,"error");
        }
    }else{
        showPopup(`Please Install Metamask`,"error");
    }
}
function showPopup(message, type = "info") {
  const popup = document.getElementById("popup");
  popup.innerText = message;
  popup.style.textAlign = "center";

  // Set background color based on type
  if (type === "success") popup.style.background = "#4caf50";  // Green
  else if (type === "error") popup.style.background = "#f44336"; // Red
  else popup.style.background = "#333"; // Default (info)

  // Show popup
  popup.style.display = "block";

  // Hide after 3 seconds
  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}
function dark(){
    document.getElementById("bgColor").style.background = "black";
}
function light(){
    document.getElementById("bgColor").style.background = "white";
}
