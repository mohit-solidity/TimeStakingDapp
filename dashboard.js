let provider ,signer,userAddress,startTime;
const contractAddress ="0x7537ef8aC63C3cCf0751E3Bfe7394E8A144a258e";
const abi = ["function checkYield() view returns(uint)",
    "function stake(uint) payable",
    "function balance(address) view returns(uint)",
    "function startTime(address) view returns(uint)"
];
window.onload = async function (){
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress,abi,signer);
    userAddress = await signer.getAddress();
    updatePoolBalance();
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
async function staked30days(){
  try{
    checkConnectedOrNot();
    showPopup("Please Confirm The Transaction");
    let amount = document.getElementById("amount").value;
    console.log(`Amount : ${amount}`);
    if(!amount||isNaN(amount)){
        showPopup("Please Input Some Amount","error");
        return;
    }
    let ethParsed= ethers.utils.parseEther(amount);
    console.log(`Parsed ETH  :${ethParsed}`);
    try{
        document.getElementById("30days").innerText = "Waiting";
        let tx = await contract.stake(30,{value : ethParsed});
        showPopup("Transaction Submitted\nWait For Approval");
        await tx.wait();
        document.getElementById("30days").innerText = "30 Days(10%)";
        showPopup("Staking Successful","success");
    }catch(err){
        showPopup(`Error : ${err.reason||err.message}`,"error");
        document.getElementById("30days").innerText = "30 Days(10%)";
    }
  }catch(err){
    showPopup(err.reason||err.message,"error");
  }
}
async function staked60days(){
  try{
    checkConnectedOrNot();
    showPopup("Please Confirm The Transaction");
    let amount = document.getElementById("amount").value;
    console.log(`Amount : ${amount}`);
    if(!amount||isNaN(amount)){
        showPopup("Please Input Some Amount","error");
        return;
    }
    let ethParsed= ethers.utils.parseEther(amount);
    console.log(`Parsed ETH  :${ethParsed}`);
    try{
        document.getElementById("60days").innerText = "Waiting";
        let tx = await contract.stake(60,{value : ethParsed});
        showPopup("Transaction Submitted\nWait For Approval");
        await tx.wait();
        document.getElementById("60days").innerText = "60 Days(20%)";
        showPopup("Staking Successful","success");
    }catch(err){
        showPopup(`Error : ${err.reason||err.message}`,"error");
        document.getElementById("60days").innerText = "60 Days(20%)";
    }
  }catch(err){
    showPopup(err.reason||err.message,"error");
  }
}
async function staked90days(){
  try{
    checkConnectedOrNot();
    showPopup("Please Confirm The Transaction");
    let amount = document.getElementById("amount").value;
    console.log(`Amount : ${amount}`);
    if(!amount||isNaN(amount)){
        showPopup("Please Enter Valid Amount ","error");
        return;
    }
    let ethParsed= ethers.utils.parseEther(amount);
    console.log(`Parsed ETH  :${ethParsed}`);
    try{
        document.getElementById("90days").innerText = "Waiting";
        let tx = await contract.stake(90,{value : ethParsed});
        showPopup("Transaction Submitted\nWait For Approval");
        await tx.wait();
        document.getElementById("90days").innerText = "90 Days(30%)";
        showPopup("Staking Successful","success");
    }catch(err){
        showPopup(`Error : ${err.reason||err.message}`,"error");
        document.getElementById("90days").innerText = "90 Days(30%)";
    }
  }catch(err){
    showPopup(err.reason||err.message,"error");
  }
}
async function staked120days(){
  try{
    checkConnectedOrNot();
    showPopup("Please Confirm The Transaction");
    let amount = document.getElementById("amount").value;
    console.log(`Amount : ${amount}`);
    if(!amount||isNaN(amount)){
        showPopup("Please Input Some Amount","error");
        return;
    }
    let ethParsed= ethers.utils.parseEther(amount);
    console.log(`Parsed ETH  :${ethParsed}`);
    try{
        document.getElementById("120days").innerText = "Waiting";
        let tx = await contract.stake(120,{value : ethParsed});
        showPopup("Transaction Submitted\nWait For Approval");
        await tx.wait();
        document.getElementById("120days").innerText = "120 Days(35%)";
        showPopup("Staking Successful","success");
    }catch(err){
        showPopup(`Error : ${err.reason||err.message}`,"error");
        document.getElementById("120days").innerText = "120 Days(35%)";
    }
  }catch(err){
    showPopup(err.reason||err.message,"error");
  }
}
function updatePoolBalance(){
    document.getElementById("userAddress").innerText = `User Address : ${userAddress}`;
}
function logout(){
    showPopup("Logging Out");
    window.location.href = "index.html";
}
async function userStatus(){
    showPopup("Loading....");
    console.log("WORKING");
    startTime = await contract.startTime(userAddress);
    console.log(`Start Time : ${startTime}`);
    if(startTime.eq(0)){
        showPopup("You Have No Active Staking","error");
        return;
    }
    window.location.href = "status.html";
}
function checkConnectedOrNot(){
  if(!userAddress){
    throw new Error("Please Connect Wallet First");
  }
}