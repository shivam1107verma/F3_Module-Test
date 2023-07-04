let postOfficeList = [];
let getData = document.getElementById("btn_getData");
let divBeforePage = document.getElementById("page_before_btnCick");
let divafterPage = document.getElementById("page_after_btnCick");

getData.addEventListener("click", () => {
  divafterPage.style.display = "block";
  divBeforePage.style.display = "none";
  getIpDetails()
    .then((data) => {
      console.log(data);
      let loc = data.loc.split(",");
      document.getElementById("latName").innerHTML = `<b>Lat:</b> ${loc[0]}`;
      document.getElementById("longName").innerHTML = `<b>Long:</b> ${loc[1]}`;
      document.getElementById(
        "cityName"
      ).innerHTML = `<b>City:</b> ${data.city}`;
      document.getElementById(
        "regionName"
      ).innerHTML = `<b>Region:</b> ${data.region}`;
      document.getElementById(
        "orgName"
      ).innerHTML = `<b>Organization:</b> ${data.org}`;
      document.getElementById(
        "hostName"
      ).innerHTML = `<b>Hostname:</b> ${data.hostname}`;

      //map location
      document.getElementById(
        "map-location"
      ).src = `https://maps.google.com/maps?q=${data.loc}&z=15&output=embed`;

      document.getElementById(
        "time-zone"
      ).innerHTML = `<b>Time Zone:</b> ${data.timezone}`;
      document.getElementById(
        "date-time"
      ).innerHTML = `<b>Date and Time:</b> ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: data.timezone,
        }
      )}`;
      document.getElementById(
        "pin-code"
      ).innerHTML = `<b>Pincode:</b> ${data.postal}`;

      //post office list
      getPostOfficeList(data.postal)
        .then((list) => {
          console.log(list);
          document.getElementById(
            "found-pincode-num"
          ).innerHTML = `<b>Message:</b> ${list[0].Message}`;
          postOfficeList = list[0].PostOffice || [];
          showPostOffices(postOfficeList);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      alert(err);
      console.log(err);
    });
});

//get ip address
async function getIp() {
  let url = "https://api.ipify.org?format=json";
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function getIpDetails() {
  let ipObj = await getIp();
  console.log(ipObj.ip);
  let url = `https://ipinfo.io/${ipObj.ip}/geo?token=b64e2e19585125`;
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

//fetch api to get list of post office
async function getPostOfficeList(pincode) {
  let url = `https://api.postalpincode.in/pincode/${pincode}`;
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.log(err);
    alert(err);
  }
}

function showPostOffices(postOffices) {
  let parentDiv = document.querySelector(".parent");
  parentDiv.innerHTML = "";
  postOffices.forEach((po) => {
    let childDiv = document.createElement("div");
    childDiv.className = "child";
    childDiv.innerHTML = `<div><b>Name:</b> ${po.Name}</div>
  <div><b>Branch Type:</b> ${po.BranchType}</div>
  <div><b>Delivery Status:</b> ${po.DeliveryStatus}</div>
  <div><b>District:</b> ${po.District}</div>
  <div><b>Division:</b> ${po.Division} </div>`;
    parentDiv.appendChild(childDiv);
  });
}

//filter the postoffices by name and branch type

document.getElementById("btn-filter").addEventListener("click", () => {
  let inputValue = document.getElementById("input-filt").value;
  inputValue = inputValue.toLowerCase();
  let filteredList = postOfficeList.filter(
    (postOffice) =>
      postOffice.Name.toLowerCase().indexOf(inputValue) > -1 ||
      postOffice.BranchType.toLowerCase().indexOf(inputValue) > -1
  );
  showPostOffices(filteredList);
});
