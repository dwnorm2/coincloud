document.querySelector("button").addEventListener("click", changeCoin);
document.querySelector("button").addEventListener("click", search);

let input = document.querySelector("input");

let coinName = document.querySelector("input").value.toLowerCase();

function changeCoin() {
  coinName = document
    .querySelector("input")
    .value.toLowerCase()
    .replaceAll(" ", "");
}

input.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    changeCoin();
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.querySelector("button").click();
  }
});

function search() {
  fetch(`https://rest.coincap.io/v3/assets/${coinName}`, {
    headers: {
      Authorization: `Bearer 73a828abcf14d386c1dcbe6a2146164e44773501136411c1060c8f3e6a3324e7`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.data) {
        // Valid response for cryptocurrency name
        updateUI(data.data);
      } else {
        // Invalid response for cryptocurrency name, try searching by ticker
        return fetch(`https://rest.coincap.io/v3/assets?search=${coinName}`, {
          headers: {
            Authorization: `Bearer 73a828abcf14d386c1dcbe6a2146164e44773501136411c1060c8f3e6a3324e7`,
          },
        });
      }
    })
    .then((secondResponse) => {
      if (secondResponse) {
        return secondResponse.json();
      }
    })
    .then((data) => {
      if (data.data && data.data.length > 0) {
        // Valid response for ticker search
        updateUI(data.data[0]);
        document.getElementById("err").textContent = "";
      } else {
        document.getElementById("err").textContent = "Cryptocurrency not found";
      }
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}

function updateUI(data) {
  console.log(data);

  document.getElementById("coin").textContent = data.name;
  document.getElementById("symbol").textContent = data.symbol;
  document.getElementById("price").textContent = formatNumber(
    data.priceUsd,
    data.priceUsd > 1 ? 2 : 4
  );
  document.getElementById("cap").textContent = formatNumber(
    data.marketCapUsd /
      (data.marketCapUsd >= 1000000000 ? 1000000000 : 1000000),
    2
  );
  document.getElementById("bOrM").textContent =
    data.marketCapUsd >= 1000000000 ? "B" : "M";
  document.getElementById("24hr").textContent = formatNumber(
    data.changePercent24Hr,
    2
  );
  if (Number(data.changePercent24Hr).toFixed(2) > 0) {
    document.querySelector(".change").style.background = "#39daa2";
  }
  if (Number(data.changePercent24Hr).toFixed(2) < 0) {
    document.querySelector(".change").style.background = "rgb(254, 46, 46)";
  }
  let ticker = data.symbol;
  document.getElementById("logo").src =
    ticker == "IOTA"
      ? "./img/iota.png"
      : `https://assets.coincap.io/assets/icons/${ticker.toLowerCase()}@2x.png`;
}

function formatNumber(value, decimalPlaces) {
  return `$${Number(value).toFixed(decimalPlaces)}`;
}

function getAssets() {
  fetch(`https://rest.coincap.io/v3/assets`, {
    headers: {
      Authorization: `Bearer 73a828abcf14d386c1dcbe6a2146164e44773501136411c1060c8f3e6a3324e7`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      updateAssetsUI(data.data);
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });
}

function updateAssetsUI(data) {
  let table = document.getElementById("coinTable");

  for (let i = 0; i < data.length; i++) {
    let row = table.insertRow(-1);

    let cellNum = row.insertCell(0);
    let cellName = row.insertCell(1);
    let cellTicker = row.insertCell(2);
    let cellPrice = row.insertCell(3);
    let cell24hr = row.insertCell(4);
    let cellCap = row.insertCell(5);

    cellNum.className = "num";
    cellCap.className = "cap";
    cellTicker.className = "ticker";

    cellNum.textContent = i + 1;

    let logoDiv = document.createElement("div");
    logoDiv.className = "center";

    let logoImg = document.createElement("img");
    logoImg.id = `logo${i}`;
    data[i].symbol == "IOTA"
      ? (logoImg.src = "./img/iota.png")
      : (logoImg.src = `https://assets.coincap.io/assets/icons/${data[
          i
        ].symbol.toLowerCase()}@2x.png`);

    logoImg.alt = `${data[i].symbol} logo`;

    let coinSpan = document.createElement("span");
    coinSpan.id = `coin${i}`;
    coinSpan.textContent = data[i].name;

    logoDiv.appendChild(logoImg);
    logoDiv.appendChild(coinSpan);

    cellName.appendChild(logoDiv);
    cellTicker.textContent = data[i].symbol;
    cellPrice.textContent = formatNumber(
      data[i].priceUsd,
      data[i].priceUsd > 1 ? 2 : 4
    );
    cell24hr.textContent = Number(data[i].changePercent24Hr).toFixed(2) + "%";
    cellCap.textContent = `${formatNumber(
      data[i].marketCapUsd /
        (data[i].marketCapUsd >= 1000000000 ? 1000000000 : 1000000),
      2
    )}${data[i].marketCapUsd >= 1000000000 ? "B" : "M"}`;

    let percent = Number(data[i].changePercent24Hr).toFixed(2);
    if (percent > 0) {
      cell24hr.style.background = "#39daa2";
    }
    if (percent < 0) {
      cell24hr.style.background = "rgb(254, 46, 46)";
    }
  }
}

getAssets();
search();
