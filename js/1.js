'use strict';
const BASE_URL = 'https://mortgage-calculator-a37be-default-rtdb.europe-west1.firebasedatabase.app';
let bankList = document.getElementById('js-bankInfo');
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
        banks.map((element, i) => createBankElement(element, i))
        return banks;
    } catch (e) {
        console.error(e);
    }
};


const createBankElement = (bank, i) => {
    console.log(i)
    if (bank == null || i == null) return;
    let bankItem = document.createElement('div');
    let bankName = document.createElement('div');
    let bankInfoBut = document.createElement('div');
    bankName.innerText = bank.bankName;
    bankItem.classList.add('banks__listItem');
    bankName.classList.add('banks__listItem__info');
    bankInfoBut.classList.add('banks__but');
    bankInfoBut.classList.add('banks__but--open');
    bankList.appendChild(bankItem);
    bankItem.appendChild(bankName);
    bankItem.appendChild(bankInfoBut);
    bankInfoBut.addEventListener('click', function (e) {
        e.preventDefault();
        let banksListItem = this.parentElement;
        banksListItem.classList.add('banks__listItem--opened')
        generateBankInfo(bank, i, banksListItem);
    });
};



const generateBankInfo = (bank, i, banksListItem) => {
    console.log(banksListItem);
    let banksListItemForm = document.createElement('form');
    let bankName = document.createElement('input');
    let interestRate = document.createElement('input');
    let loanTerm = document.createElement('input');
    let maximumLoan = document.createElement('input');
    let minimumDownPayment = document.createElement('input');
    let saveBut = document.createElement('button');
    bankName.placeholder = `Bank name: ${bank.bankName}`;
    interestRate.placeholder = `Interest rate: ${bank.interestRate}`;
    loanTerm.placeholder = `Loan term: ${bank.loanTerm}`;
    maximumLoan.placeholder = `Maximum loan: ${bank.maximumLoan}`;
    minimumDownPayment.placeholder = `Minimum down payment: ${bank.minimumDownPayment}`;
    saveBut.innerText = 'Save';
    banksListItemForm.classList.add('banks__form');
    banksListItem.appendChild(banksListItemForm);
    banksListItemForm.appendChild(bankName);
    banksListItemForm.appendChild(interestRate);
    banksListItemForm.appendChild(loanTerm);
    banksListItemForm.appendChild(maximumLoan);
    banksListItemForm.appendChild(minimumDownPayment);
    banksListItemForm.appendChild(saveBut);
    saveBut.addEventListener('click', function (e) {
        e.preventDefault();
        let userRef = database.ref(`Banks/3`);
        let editedBank = {
            "bankName": 'updated',
            "interestRate": 'updated',
            "loanTerm": 'updated',
            "maximumLoan": 'updated',
            "minimumDownPayment": 'updated'
        }
        userRef.update(editedBank)
            .then(() => {
                banksListItemForm.classList.add('hide');
                let temp = banksListItem.parentElement;
                temp.childNodes.classList.remove('banks__but--active')
                console.log("Success, bank attributes was changed");
            })
            .catch(() => {
                console.log("Error, bank attributes was not changed");
            });
    })
}


getBanks();

