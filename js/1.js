"use strict";
const BASE_URL =
  "https://mortgage-calculator-a37be-default-rtdb.europe-west1.firebasedatabase.app";
let bankList = document.getElementById("js-bankInfo");
let calculateForm = document.getElementById("js-calculator");
let calculateFormBank = document.getElementById("js-calculatorBank");
let calculatedRes = document.getElementById("js-calculatedRes");
let calculateBut = document.getElementById("js-calculateBut");
let initLoan = document.getElementById("js-initLoan");
let downPayment = document.getElementById("js-downPayment");

let config = {
  apiKey: "*********",
  authDomain:
    "mortgage-calculator-a37be-default-rtdb.europe-west1.firebaseapp.com",
  projectId: "mortgage-calculator-a37be-default-rtdb.europe-west1",
  databaseURL:
    "https://mortgage-calculator-a37be-default-rtdb.europe-west1.firebaseio.com",
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
  console.log(config);
}

const getBanks = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/Banks.json`);
    const banks = res.data;
    banks.map((element, i) => createBankElement(element, i));
    return banks;
  } catch (e) {
    console.error(e);
  }
};

const createBankElement = (bank, i) => {
  if (bank == null || i == null) return;
  let bankItem = document.createElement("div");
  let bankName = document.createElement("div");
  let bankInfoWrap = document.createElement("div");
  let interestRate = document.createElement("div");
  let loanTerm = document.createElement("div");
  let maximumLoan = document.createElement("div");
  let minimumDownPayment = document.createElement("div");
  bankName.innerText = bank.bankName;
  bankItem.classList.add("banks__listItem");
  bankName.classList.add("listItem__descr");
  interestRate.innerText = `Interest rate: ${bank.interestRate}`;
  loanTerm.innerText = `Loan term: ${bank.loanTerm}`;
  maximumLoan.innerText = `Maximum loan: ${bank.maximumLoan}`;
  minimumDownPayment.innerText = `Minimum down payment: ${bank.minimumDownPayment}`;
  bankList.appendChild(bankItem);
  bankItem.appendChild(bankName);
  bankName.appendChild(bankInfoWrap);
  bankInfoWrap.appendChild(interestRate);
  bankInfoWrap.appendChild(loanTerm);
  bankInfoWrap.appendChild(maximumLoan);
  bankInfoWrap.appendChild(minimumDownPayment);
  bankName.addEventListener("click", function (e) {
    let parent = this.parentNode;
    let siblings = parent.parentNode.querySelectorAll("div");
    siblings.forEach((el) => el.classList.remove("listItem__descr--opened"));
    this.classList.toggle("listItem__descr--opened");
    calculateFunk(bank);
  });
};

const calculateFunk = (bank) => {
  calculateFormBank.innerText = bank.bankName;
  calculateBut.addEventListener("click", function (e) {
    const monthInYear = 12;
    let monthyPayment;
    let x = Math.pow(1 + bank.interestRate / monthInYear, bank.loanTerm);
    monthyPayment =
      (amountBorrowed * (bank.interestRate / monthInYear) * x) / x - 1;
  });
  return monthyPayment;
};

getBanks();
