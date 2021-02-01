'use strict';
const BASE_URL = 'https://mortgage-calculator-a37be-default-rtdb.europe-west1.firebasedatabase.app';
let bankList = document.getElementById('js-bankList');
let database = firebase.database();
let newId;
let bankEmptyFormFields = {
  "bankName": "Bank",
  "interestRate": "Interest rate",
  "loanTerm": "Loan term",
  "maximumLoan": "Maximum loan",
  "minimumDownPayment": "Minimum down dayment"
}


let config = {
  apiKey: "*********",
  authDomain: "mortgage-calculator-a37be-default-rtdb.europe-west1.firebaseapp.com",
  projectId: "mortgage-calculator-a37be-default-rtdb.europe-west1",
  databaseURL: "https://mortgage-calculator-a37be-default-rtdb.europe-west1.firebaseio.com",
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
  console.log(config)
}


const getBanks = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/Banks.json`);
    const banks = res.data;
    newId = banks.length;
    banks.map((element, i) => createBankElement(element, i))
    createAddBankBlock();
    return banks;
  } catch (e) {
    console.error(e);
  }
};


const createAddBankBlock = () => {
  let addBut = document.createElement('button');
  let banksListItem = document.createElement('div');
  addBut.innerText = 'Add new';
  addBut.id = "js-addBut";
  banksListItem.classList.add('banks__listItem');
  bankList.appendChild(addBut);
  bankList.appendChild(banksListItem);
  addBut.addEventListener('click', function (e) {
    let target = e.target;
    target.classList.add('hide');
    generateAddForm(bankEmptyFormFields, 7, banksListItem);
  })
}


const generateAddForm = (bank, i, banksListItem) => {
  console.log(banksListItem);
  let banksListItemForm = document.createElement('form');
  let bankName = document.createElement('input');
  let interestRate = document.createElement('input');
  let loanTerm = document.createElement('input');
  let maximumLoan = document.createElement('input');
  let minimumDownPayment = document.createElement('input');
  let addBut = document.createElement('button');
  bankName.placeholder = bank.bankName;
  interestRate.placeholder = bank.interestRate;
  loanTerm.placeholder = bank.loanTerm;
  maximumLoan.placeholder = bank.maximumLoan;
  minimumDownPayment.placeholder = bank.minimumDownPayment;
  addBut.innerText = 'Add';
  banksListItemForm.classList.add('banks__form');
  banksListItem.appendChild(banksListItemForm);
  banksListItemForm.appendChild(bankName);
  banksListItemForm.appendChild(interestRate);
  banksListItemForm.appendChild(loanTerm);
  banksListItemForm.appendChild(maximumLoan);
  banksListItemForm.appendChild(minimumDownPayment);
  banksListItemForm.appendChild(addBut);
  addBut.addEventListener('click', function (e) {
    let userRef = database.ref(`Banks/${newId}`);
    let newBank = {
      "bankName": bankName.value.toString(),
      "interestRate": interestRate.value.toString(),
      "loanTerm": loanTerm.value.toString(),
      "maximumLoan": maximumLoan.value.toString(),
      "minimumDownPayment": minimumDownPayment.value.toString()
    }
    newId++;
    userRef.set(newBank).then(() => {
      banksListItemForm.classList.add('hide');
      createBankElement(newBank, newId);
      let addBut = document.getElementById('js-addBut');
      addBut.classList.remove('hide');
      console.log("Success, bank added to list");
    }).catch(() => {
      console.log("Error, bank not added to list");
    });
  })
}


const createBankElement = (bank, i) => {
  console.log(i)
  if (bank == null || i == null) return;
  let bankItem = document.createElement('div');
  let bankName = document.createElement('div');
  let bankRemoveDiv = document.createElement('div');
  let bankEditDiv = document.createElement('div');
  let bankRemoveDivIcon = document.createElement('i');
  let bankEditDivIcon = document.createElement('i');
  bankName.innerText = bank.bankName;
  bankItem.classList.add('banks__listItem');
  bankName.classList.add('banks__listItem__name');
  bankRemoveDiv.classList.add('banks__but');
  bankEditDiv.classList.add('banks__but');
  bankEditDiv.classList.add('banks__but--edit');
  bankEditDivIcon.classList.add('far');
  bankRemoveDivIcon.classList.add('far');
  bankRemoveDivIcon.classList.add('fa-trash-alt');
  bankEditDivIcon.classList.add('fa-edit');
  bankList.appendChild(bankItem);
  bankItem.appendChild(bankName);
  bankItem.appendChild(bankEditDiv);
  bankItem.appendChild(bankRemoveDiv);
  bankEditDiv.appendChild(bankEditDivIcon);
  bankRemoveDiv.appendChild(bankRemoveDivIcon);
  bankRemoveDiv.addEventListener('click', function (e) {
    let banksListItem = this.parentElement;
    banksListItem.remove();
    let userRef = database.ref('Banks/' + i);
    userRef.remove()
  });
  bankEditDiv.addEventListener('click', function (e) {
    this.classList.add('banks__but--active')
    let banksListItem = this.parentElement;
    if (banksListItem.childNodes.length === 3) {
      generateAddEditForm(bank, i, banksListItem);
    }
  });
};

getBanks();

