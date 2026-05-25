/* =========================
   SELECTORS
========================= */

const calculationPreview = document.getElementById("calculationPreview");
const resultScreen = document.getElementById("resultScreen");

const calcButtons = document.querySelectorAll(".calc-btn");
const equalBtn = document.getElementById("equalBtn");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const converterBtn = document.getElementById("converterBtn");
const historyBtn = document.getElementById("historyBtn");

const calculatorSection = document.getElementById("calculatorSection");
const converterSection = document.getElementById("converterSection");
const historySection = document.getElementById("historySection");

const homeNav = document.getElementById("homeNav");
const calculatorNav = document.getElementById("calculatorNav");
const converterNav = document.getElementById("converterNav");
const historyNav = document.getElementById("historyNav");

const fromAmount = document.getElementById("fromAmount");
const toAmount = document.getElementById("toAmount");
const exchangeRateText = document.getElementById("exchangeRateText");

const swapBtn = document.getElementById("swapBtn");

/* =========================
   VARIABLES
========================= */

let currentInput = "";
let historyArray = [];

/* =========================
   SHOW SECTIONS
========================= */

function hideAllSections() {

    calculatorSection.style.display = "none";
    converterSection.style.display = "none";
    historySection.style.display = "none";

}

function showCalculator() {

    hideAllSections();

    calculatorSection.style.display = "block";

}

function showConverter() {

    hideAllSections();

    converterSection.style.display = "block";

}

function showHistory() {

    hideAllSections();

    historySection.style.display = "block";

}

/* =========================
   NAVIGATION EVENTS
========================= */

converterBtn.addEventListener("click", showConverter);

historyBtn.addEventListener("click", showHistory);

homeNav.addEventListener("click", showCalculator);

calculatorNav.addEventListener("click", showCalculator);

converterNav.addEventListener("click", showConverter);

historyNav.addEventListener("click", showHistory);

/* =========================
   UPDATE DISPLAY
========================= */

function updateDisplay() {

    if(currentInput === ""){

        calculationPreview.textContent = "0";

    }else{

        calculationPreview.textContent = currentInput;

    }

}

/* =========================
   CALCULATOR BUTTONS
========================= */

calcButtons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;

        /* CLEAR */

        if(value === "C"){

            currentInput = "";
            resultScreen.textContent = "0";

            updateDisplay();

            return;
        }

        /* DELETE */

        if(value === "DEL"){

            currentInput = currentInput.slice(0,-1);

            updateDisplay();

            return;
        }

        /* PLUS MINUS */

        if(value === "+/-"){

            if(currentInput.startsWith("-")){

                currentInput = currentInput.substring(1);

            }else{

                currentInput = "-" + currentInput;

            }

            updateDisplay();

            return;
        }

        /* APPEND VALUES */

        currentInput += value;

        updateDisplay();

    });

});

/* =========================
   CALCULATE
========================= */

function calculateResult() {

    if(currentInput.trim() === ""){

        return;
    }

    try{

        /* REPLACE SYMBOLS */

        let expression = currentInput
        .replace(/÷/g,"/")
        .replace(/×/g,"*");

        /* CHECK DIVISION BY ZERO */

        if(expression.includes("/0")){

            resultScreen.textContent =
            "Cannot divide by zero";

            return;
        }

        /* EVALUATE */

        let result = eval(expression);

        /* INVALID */

        if(!isFinite(result)){

            resultScreen.textContent =
            "Invalid Calculation";

            return;
        }

        /* DISPLAY RESULT */

        resultScreen.textContent = result;

        /* SAVE HISTORY */

        saveHistory(currentInput,result);

        /* UPDATE INPUT */

        currentInput = result.toString();

        updateDisplay();

    }

    catch(error){

        resultScreen.textContent =
        "Syntax Error";

    }

}

/* =========================
   EQUAL BUTTON
========================= */

equalBtn.addEventListener("click", calculateResult);

/* =========================
   ENTER KEY SUPPORT
========================= */

document.addEventListener("keydown", (event) => {

    /* NUMBERS */

    if(
        event.key >= "0" &&
        event.key <= "9"
    ){

        currentInput += event.key;

        updateDisplay();
    }

    /* OPERATORS */

    if(
        event.key === "+" ||
        event.key === "-" ||
        event.key === "*" ||
        event.key === "/" ||
        event.key === "."
    ){

        currentInput += event.key;

        updateDisplay();
    }

    /* ENTER */

    if(event.key === "Enter"){

        calculateResult();
    }

    /* BACKSPACE */

    if(event.key === "Backspace"){

        currentInput = currentInput.slice(0,-1);

        updateDisplay();
    }

});

/* =========================
   HISTORY
========================= */

function saveHistory(expression,result){

    const historyItem = {

        expression: expression,
        result: result

    };

    historyArray.unshift(historyItem);

    renderHistory();

}

function renderHistory(){

    historyList.innerHTML = "";

    if(historyArray.length === 0){

        historyList.innerHTML = `
        <p style="
        color:white;
        text-align:center;
        ">
        No history yet
        </p>
        `;

        return;
    }

    historyArray.forEach(item => {

        const div = document.createElement("div");

        div.classList.add("recent-item");

        div.innerHTML = `

            <div class="recent-left">

                <p>${item.expression}</p>

                <span>Saved Calculation</span>

            </div>

            <div class="recent-right">

                ${item.result}

            </div>

        `;

        historyList.appendChild(div);

    });

}

/* =========================
   CLEAR HISTORY
========================= */

clearHistoryBtn.addEventListener("click", () => {

    historyArray = [];

    renderHistory();

});

/* =========================
   CURRENCY CONVERTER
========================= */

/* DEMO STATIC RATES */

const exchangeRates = {

    USD: {
        EUR: 0.92,
        GBP: 0.79,
        JPY: 156
    },

    EUR: {
        USD: 1.08,
        GBP: 0.86,
        JPY: 169
    }

};

let currentFromCurrency = "USD";
let currentToCurrency = "EUR";

/* CONVERT */

function convertCurrency(){

    let amount = parseFloat(fromAmount.value);

    if(isNaN(amount)){

        toAmount.value = "0";

        return;
    }

    let rate =
    exchangeRates[currentFromCurrency][currentToCurrency];

    let converted = amount * rate;

    toAmount.value = converted.toFixed(2);

    exchangeRateText.textContent =
    `1 ${currentFromCurrency} = ${rate} ${currentToCurrency}`;

}

/* INPUT EVENT */

fromAmount.addEventListener("input", convertCurrency);

/* SWAP */

swapBtn.addEventListener("click", () => {

    let temp = currentFromCurrency;

    currentFromCurrency = currentToCurrency;

    currentToCurrency = temp;

    convertCurrency();

});

/* =========================
   INITIALIZE
========================= */

renderHistory();

convertCurrency();

showCalculator();

/* =========================
   THEME TOGGLE
========================= */

const themeToggle = document.querySelector(".theme-toggle");
const moonIcon = themeToggle.querySelector("i");

let darkMode = true;

themeToggle.addEventListener("click", () => {

    darkMode = !darkMode;

    if(darkMode){

        document.body.style.background =
        "linear-gradient(135deg,#ffb6d9,#f4a8ff)";

        document.querySelector(".calculator-phone").style.background =
        "linear-gradient(180deg,#241132 0%,#130b1d 100%)";

        moonIcon.classList.remove("fa-sun");
        moonIcon.classList.add("fa-moon");

    }else{

        document.body.style.background =
        "linear-gradient(135deg,#ffffff,#ffd6ea)";

        document.querySelector(".calculator-phone").style.background =
        "linear-gradient(180deg,#ffe3f1 0%,#ffc2df 100%)";

        moonIcon.classList.remove("fa-moon");
        moonIcon.classList.add("fa-sun");

    }

});

/* =========================
   HAMBURGER MENU
========================= */

const menuIcon = document.querySelector(".menu-icon");

menuIcon.addEventListener("click", () => {

    alert(
        "Ajiri Calculator Menu\n\nCalculator App Version 1.0"
    );

});

if("serviceWorker" in navigator){

    window.addEventListener("load", () => {

        navigator.serviceWorker
        .register("./service-worker.js")
        .then(() => {

            console.log("Service Worker Registered");

        });

    });

}