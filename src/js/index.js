const axios = require("axios");
const fromCardNumber = document.getElementById("fromCardNumber");
const toCardNumber = document.getElementById("toCardNumber");
const balance = document.getElementById("balance");
const btnGetInfo = document.getElementById("btnGetInfo");
const btnTransform = document.getElementById("btnTransform");
const cardTranactions = document.querySelectorAll(".card-transaction");
const btnIsOK = document.getElementById("isOk");
const modal = document.querySelector(".modal");
modal.style.display = "flex";
btnIsOK.addEventListener("click", async () => {
  modal.style.display = "none";
});
async function inputNumberHandler(event) {
  if (event.target.value.length < this.max) {
    this.element.innerHTML = `<spam>${this.label}</spam><span>${event.target.value}</span>`;
  } else {
    event.target.value = event.target.value.substr(
      0,
      event.target.value.length - 1
    );
  }
}
fromCardNumber.addEventListener(
  "keyup",
  inputNumberHandler.bind({
    element: cardTranactions[0].querySelector(".card-number"),
    max: 17,
    label: "Card Number",
  })
);
fromCardNumber.addEventListener(
  "keydown",
  inputNumberHandler.bind({
    element: cardTranactions[0].querySelector(".card-number"),
    max: 17,
    label: "Card Number",
  })
);
toCardNumber.addEventListener(
  "keyup",
  inputNumberHandler.bind({
    element: cardTranactions[1].querySelector(".card-number"),
    max: 17,
    label: "Card Number",
  })
);
toCardNumber.addEventListener(
  "keydown",
  inputNumberHandler.bind({
    element: cardTranactions[1].querySelector(".card-number"),
    max: 17,
    label: "Card Number",
  })
);

async function afterGetInfoCard() {
  const eEMF = document.getElementById("eEM");
  const eEYF = document.getElementById("eEY");
  const cvvForm = document.getElementById("cvv");
  cvvForm.addEventListener(
    "keydown",
    inputNumberHandler.bind({
      element: cardTranactions[0].querySelector(".cvv"),
      max: 5,
      label: "CVV",
    })
  );
  cvvForm.addEventListener(
    "keyup",
    inputNumberHandler.bind({
      element: cardTranactions[0].querySelector(".cvv"),
      max: 5,
      label: "CVV",
    })
  );

  eEYF.addEventListener(
    "change",
    inputDateHandler.bind({
      element: cardTranactions[0].querySelector(".expires-end"),
      max: 3,
      index: 1,
    })
  );
  eEMF.addEventListener(
    "change",
    inputDateHandler.bind({
      element: cardTranactions[0].querySelector(".expires-end"),
      max: 3,
      index: 0,
    })
  );
}
async function inputDateHandler(event) {
  if (event.target.value.length < this.max) {
    const arr = this.element.getElementsByTagName("span");
    if (this.index == 1) {
      arr[1].innerText =
        arr[1].innerText.split("/")[0] + "/" + event.target.value;
    } else if (this.index == 0) {
      arr[1].innerText =
        event.target.value + "/" + arr[1].innerText.split("/")[1];
    }
  } else {
    event.target.value = event.target.value.substr(
      0,
      event.target.value.length - 1
    );
  }
}

async function getCardInfo(data, path) {
  const url = `http://localhost:8081/api/transform/${path}`;
  return await axios.post(url, data);
}

btnGetInfo.addEventListener("click", async () => {
  const data = {
    cardFrom: {
      cardNumber: fromCardNumber.value,
    },
    cardToCardNumber: toCardNumber.value,
    balance: balance.value,
  };
  const res = await getCardInfo(data, "getInfo");
  if (res.status === 200) {
    const nameElements = document.querySelectorAll(".name");
    nameElements[0].innerHTML = `<span>Name</span><span>${res.data.nameFrom}</span>`;
    nameElements[1].innerHTML = `<span>Name</span><span>${res.data.nameTo}</span>`;
  }
});
btnTransform.addEventListener("click", async () => {
  const eEMF = document.getElementById("eEM");
  const eEYF = document.getElementById("eEY");
  const cvvFrom = document.getElementById("cvv");
  const password = document.getElementById("password");
  const data = {
    cardFrom: {
      cardNumber: fromCardNumber.value,
      cvv: cvvFrom.value,
      validityTime: parseInt(eEMF.value + eEYF.value),
      password: password.value,
    },
    cardToCardNumber: toCardNumber.value,
    balance: balance.value,
  };
  const res = await getCardInfo(data, "save");
  if (res.status == 200) {
    console.log(res.data);
    modal.style.display = "flex";
    const transactionNumber = document.getElementById("transactionNumber");
    const fromName = document.getElementById("fromName");
    const toName = document.getElementById("toName");
    const balance = document.getElementById("balanceTransform");
    transactionNumber.innerText = res.data.transactionNumber;
    fromName.innerText = res.data.fromName;
    toName.innerText = res.data.toName;
    balance.innerText = res.data.balance;
  }
});

(async () => {
  await afterGetInfoCard();
})();
