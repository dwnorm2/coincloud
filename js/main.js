//add conditions for css styling of green/red depending on + or - 24hr change

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
  fetch(`https://api.coincap.io/v2/assets/${coinName}`)
    .then((red) => red.json())
    .then((data) => {
      if (data.data) {
        // Valid response for cryptocurrency name
        updateUI(data.data);
      } else {
        // Invalid response for cryptocurrency name, try searching by ticker
        return fetch(`https://api.coincap.io/v2/assets?search=${coinName}`);
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
      } else {
        console.log("Cryptocurrency not found");
      }
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });

  // setTimeout(search, 1000);
}

function updateUI(data) {
  console.log(data);

  document.getElementById("coin").textContent = data.name;
  document.getElementById("symbol").textContent = data.symbol;
  document.getElementById("price").textContent = Number(data.priceUsd).toFixed(
    data.priceUsd > 1 ? 2 : 4
  );
  document.getElementById("cap").textContent = Number(
    data.marketCapUsd / (data.marketCapUsd >= 1000000000 ? 1000000000 : 1000000)
  ).toFixed(2);
  document.getElementById("bOrM").textContent =
    data.marketCapUsd >= 1000000000 ? "B" : "M";
  document.getElementById("24hr").textContent = Number(
    data.changePercent24Hr
  ).toFixed(2);
  if (Number(data.changePercent24Hr).toFixed(2) > 0) {
    document.querySelector(".change").style.background = "#39daa2";
  }
  if (Number(data.changePercent24Hr).toFixed(2) < 0) {
    document.querySelector(".change").style.background = "rgb(254, 46, 46)";
  }
  let ticker = data.symbol;
  document.getElementById(
    "logo"
  ).src = `https://assets.coincap.io/assets/icons/${ticker.toLowerCase()}@2x.png`;
}

function getAssets() {
  fetch(`https://api.coincap.io/v2/assets`)
    .then((red) => red.json())
    .then((data) => {
      updateAssetsUI(data.data);
    })
    .catch((err) => {
      console.log(`error ${err}`);
    });

  // setTimeout(search, 1000);
}

function updateAssetsUI(data) {
  for (let i = 0; i < 10; i++) {
    document.getElementById(`coin${i}`).textContent = data[i].name;
    document.getElementById(`symbol${i}`).textContent = data[i].symbol;
    document.getElementById(`price${i}`).textContent = Number(
      data[i].priceUsd
    ).toFixed(data[i].priceUsd > 1 ? 2 : 4);
    document.getElementById(`cap${i}`).textContent = Number(
      data[i].marketCapUsd /
        (data[i].marketCapUsd >= 1000000000 ? 1000000000 : 1000000)
    ).toFixed(2);
    document.getElementById(`bOrM${i}`).textContent =
      data[i].marketCapUsd >= 1000000000 ? "B" : "M";
    document.getElementById(`24hr${i}`).textContent = Number(
      data[i].changePercent24Hr
    ).toFixed(2);
    let percent = Number(data[i].changePercent24Hr).toFixed(2);
    console.log(percent);
    if (percent > 0) {
      document.getElementById(`change${i}`).style.background = "#39daa2";
    }
    if (percent < 0) {
      document.getElementById(`change${i}`).style.background =
        "rgb(254, 46, 46)";
    }
    let ticker = data[i].symbol;
    document.getElementById(
      `logo${i}`
    ).src = `https://assets.coincap.io/assets/icons/${ticker.toLowerCase()}@2x.png`;
  }
  // console.log(assets);
}

getAssets();
search();

// Add conditions for CSS styling of green/red depending on + or - 24hr change
