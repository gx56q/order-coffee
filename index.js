const MENU = {
    "espresso": "Эспрессо",
    "capuccino": "Капучино",
    "cacao": "Какао",
    "usual": "обычном молоке",
    "no-fat": "обезжиренном молоке",
    "soy": "соевом молоке",
    "coconut": "кокосовом молоке",
    "whipped cream": "взбитых сливок",
    "marshmallow": "зефирок",
    "chocolate": "шоколад",
    "cinnamon": "корицу"
};

// DOM elements
const DARKENING = document.querySelector(".darkening");
const COFFEE_TEMPLATE = String(document.querySelector("fieldset").innerHTML);

// Event listeners
document.querySelector('.add-button').addEventListener("click", addNewCoffee);
document.querySelectorAll("form")[1].onsubmit = submitOrder;
document.querySelectorAll("form")[0].onsubmit = validateOrderTime;

// Functions
function addNewCoffee() {
    const count = document.querySelectorAll("fieldset").length;
    const newCoffee = createNewCoffeeField(count);
    const lastCoffee = document.querySelectorAll("fieldset")[count - 1];
    lastCoffee.after(newCoffee);
}

function createNewCoffeeField(count) {
    const newCoffee = document.createElement('fieldset');
    newCoffee.className = "beverage";
    newCoffee.innerHTML = COFFEE_TEMPLATE
        .replace("Напиток №1", `Напиток №${count + 1}`)
        .replace(/milk1/g, `milk${count + 1}`)
        .replace(/options1/g, `options${count + 1}`)
        .replace("type1", `type${count + 1}`)
        .replace("textarea1", `textarea${count + 1}`);
    return newCoffee;
}

function submitOrder() {
    const count = document.querySelectorAll("fieldset").length;
    document.querySelector(".ammountOfCoffee").innerHTML = generateOrderText(count);
    DARKENING.style.display = "flex";
    generateTable(count);
    return false;
}

function generateOrderText(count) {
    if (count % 10 === 1 && count % 100 !== 11)
        return `Вы заказали ${count} напиток`;
    else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14))
        return `Вы заказали ${count} напитка`;
    else return `Вы заказали ${count} напитков`;
}

function generateTable(count) {
    const formData = new FormData(document.forms[1]);
    let table = document.querySelector("table");
    let rows = '<tr><th>Напиток</th><th>Молоко</th><th>Дополнительно</th><th>Комментарий</th></tr>';
    for (let i = 1; i <= count; i++) {
        rows += "\n<tr><td>" + MENU[formData.get(`type${i}`)] + "</td>" +
            "<td>" + MENU[formData.get(`milk${i}`)] + "</td>" +
            "<td>" + makeListOfOptions(formData.getAll(`options${i}`)) + "</td>" +
            "<td>" + formData.get(`textarea${i}`) + "</td></tr>";
    }
    table.innerHTML = rows;
    return table;
}

function makeListOfOptions(options) {
    return options.map(option => MENU[option]).join(", ");
}

function closeLightbox() {
    DARKENING.style.display = "none";
}

function validateOrderTime() {
    const now = new Date();
    const inputTime = document.querySelector(".order-time");
    const orderTime = inputTime.value.split(":").map(num => +num);
    const nowTime = [now.getHours(), now.getMinutes()];
    if (orderTime[0] < nowTime[0] || (orderTime[0] === nowTime[0] && orderTime[1] < nowTime[1])) {
        inputTime.style.border = "1px red solid";
        alert("Мы не умеем перемещаться во времени. Выберите время позже, чем текущее");
        return false;
    }
}



function replaceCoffeeFields(coffee, coffeeNumber) {
    const milkRegex = new RegExp(`milk${coffeeNumber}`, "g");
    const optionsRegex = new RegExp(`options${coffeeNumber}`, "g");
    const newCoffeeNumber = coffeeNumber - 1;

    coffee.innerHTML = coffee.innerHTML
        .replace(`Напиток №${coffeeNumber}`, `Напиток №${newCoffeeNumber}`)
        .replace(milkRegex, `milk${newCoffeeNumber}`)
        .replace(optionsRegex, `options${newCoffeeNumber}`)
        .replace(`type${coffeeNumber}`, `type${newCoffeeNumber}`)
        .replace(`textarea${coffeeNumber}`, `textarea${newCoffeeNumber}`);
}


function closeCoffee(e) {
    let count = document.querySelectorAll(".beverage").length;
    if (count === 1) {
        return;
    }
    let numOfDelCoffee = getCoffeeNumber(e);
    let listOfCoffee = e.parentNode;
    e.parentNode.removeChild(e);
    for (const coffee of listOfCoffee.querySelectorAll(".beverage")) {
        let numOfCoffee = getCoffeeNumber(coffee);
        if (numOfCoffee > numOfDelCoffee) {
            replaceCoffeeFields(coffee, numOfCoffee);
        }
    }
}

function getCoffeeNumber(element) {
    const pattern = /Напиток №(\d+)/;
    const match = element.innerHTML.match(pattern);
    return match ? parseInt(match[1]) : 0;
}

function copyText(textarea) {
    const keywords = ["срочно", "быстрее", "побыстрее", "скорее", "поскорее", "очень нужно"];
    textarea.parentNode.querySelector("span").innerHTML = textarea.value.replace(new RegExp(keywords.join("|"), "g"), match => `<b>${match}</b>`);
}
