function showPopup(message, type = "info") {
  const popup = document.getElementById("popup");
  popup.innerText = message;

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

async function connect() {
  if(window.ethereum){
    try{
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts",[]);
      showPopup(`Wallet Connected  `,"success");
      window.location.href = "dashboard.html";
    }catch(err){
       showPopup(`Error Connecting : ${err.reason}`,"error");
    }
  }else{
    showPopup("Please Install Metamask","error");
  }
}
function dark(){
  document.getElementById("bgColor").style.background = "black";
}
function light(){
  document.getElementById("bgColor").style.background = "white";
}