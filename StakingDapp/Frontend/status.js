let provider ,signer,userAddress,getstartTime;
const contractAddress ="0x7537ef8aC63C3cCf0751E3Bfe7394E8A144a258e";
const abi = ["function checkYield() view returns(uint)",
    "function stake(uint) payable",
    "function balance(address) view returns(uint)",
    "function startTime(address) view returns(uint)",
    "function endTime(address) view returns(uint)",
    "function daysStaked(address) view returns(uint)",
    "function withdraw()"
];
window.onload = async function (){
    showLoader()
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress,abi,signer);
    userAddress = await signer.getAddress();
    await userStatus();
    document.getElementById("buttons").style.display = "block";
    document.getElementById("logout").style.display = "block";
    document.getElementById("status").style.display = "block";
    hideloader();
}
function showLoader(){
    const loader = document.getElementById("loader");
    if(loader) loader.style.display = "block";
}
function hideloader(){
    const loader = document.getElementById("loader");
    if(loader) loader.style.display = "none";
}
function showPopup(message, type = "info") {
  const popup = document.getElementById("popup");
  popup.innerText = message;
  if (type === "success") popup.style.background = "#4caf50";
  else if (type === "error") popup.style.background = "#f44336";
  else popup.style.background = "#333";

  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}
async function userStatus(){
    console.log(`User Addresss : ${userAddress}`);
    let userBalance = await contract.balance(userAddress);
    getstartTime = await contract.startTime(userAddress);
    let getendTime = await contract.endTime(userAddress);
    let daysStakedUser = await contract.daysStaked(userAddress);
    document.getElementById("userAddress").innerText = `User Address : ${userAddress}`;
    if(getstartTime.eq(0)){
        showPopup("User Not Staked","error");
        document.getElementById("plan").innerText = "Not Staked";
        return;
    }
    let yield = await contract.checkYield();
    document.getElementById("userBalance").innerText = `Staked Balance : ${ethers.utils.formatEther(userBalance)} ETH`;
    let startTime = new Date(getstartTime.toNumber()*1000).toLocaleString();
    let endTime = new Date(getendTime.toNumber()*1000).toLocaleString();
    document.getElementById("plan").innerText = `Locked Days : ${daysStakedUser} Days\n\nAPY(Annual Percentage Yield) : ${yield}%\n\nStart Time : ${startTime}\n\nEnd Time : ${endTime}`;
}
async function back(){
    window.location.href = "dashboard.html";

}
function logout(){
    showPopup("Logging Out","error");
    window.location.href = "index.html";
}
async function withdraw(){
    showPopup("Please Wait");
    try{
        let tx = await contract.withdraw();
        await tx.wait();
        showPopup("Transaction Successful","success");
    }catch(err){
        showPopup(`Error : ${err.reason||err.message}`,"error");
    }
}