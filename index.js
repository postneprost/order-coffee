addButton.addEventListener("click", addDrink);
formOrderDrink.addEventListener("click", deleteDrink);
submitButton.addEventListener("click", on);
formOrderDrink.addEventListener("input", showInputText);
orderButton.addEventListener("click", checkTime);

let countForms = 1;

let arrayOfWords = ["срочно", "побыстрее", "быстрее", "поскорее", "скорее", "очень нужно"];

let typesOfMilk = {
    "usual": "обычное",
    "no-fat": "обезжиренное",
    "soy": "соевое",
    "coconut": "кокосовое"
};

let additionOfDrink = {
    "whipped cream": "взбитые сливки",
    "marshmallow": "зефирки",
    "chocolate": "шоколад",
    "cinnamon": "корица"
};

let typeOfDrink = `<label class="field">
<span class="label-text">Я буду</span>
<select class="type-of-drink">
    <option value="espresso">Эспрессо</option>
    <option value="capuccino" selected>Капучино</option>
    <option value="cacao">Какао</option>
</select>
</label>`;

let addition = `<div class="field">
<span class="checkbox-label">Добавьте к напитку:</span>
<label class="checkbox-field">
    <input type="checkbox" name="options" value="whipped cream" />
    <span>взбитых сливок</span>
    <span hidden>взбитые сливки</span>
</label>
<label class="checkbox-field">
    <input type="checkbox" name="options" value="marshmallow" />
    <span>зефирок</span>
    <span hidden>зефирки</span>
</label>
<label class="checkbox-field">
    <input type="checkbox" name="options" value="chocolate" />
    <span>шоколад</span>
    <span hidden>шоколад</span>
</label>
<label class="checkbox-field">
    <input type="checkbox" name="options" value="cinnamon" />
    <span>корицу</span>
    <span hidden>корица</span>
</label>
</div>`;

let text = `<div class="field">
<label for="text">И еще вот что</label><br>
<textarea id="text" class="user-textarea" name="text" rows="5" cols="30"></textarea>
<span class="user-text"></span>
</div>`;

let deleteButton = `<div>
<button type="button" class="delete-button">Удалить напиток</button></div>`;

function getHtmlMilk(count) {
    return `<div class="field">
    <span class="checkbox-label">Сделайте напиток на</span>
    <label class="checkbox-field">
        <input type="radio" name="milk-${count}" value="usual" checked />
        <span>обычном молоке</span>
    </label>
    <label class="checkbox-field">
        <input type="radio" name="milk-${count}" value="no-fat" />
        <span>обезжиренном молоке</span>
    </label>
    <label class="checkbox-field">
        <input type="radio" name="milk-${count}" value="soy" />
        <span>соевом молоке</span>
    </label>
    <label class="checkbox-field">
        <input type="radio" name="milk-${count}" value="coconut" />
        <span>кокосовом молоке</span>
    </label>
    </div>`;
};

function getHtmlNumberOfDrink(count) {
    return `<h4 class="beverage-count">Напиток №${count}</h4>`;
};

function addDrink() {
    ++countForms;
    let typeOfMilk = getHtmlMilk(countForms)
    let numberOfDrink = getHtmlNumberOfDrink(countForms);
    let newDrink = document.createElement("fieldset");
    newDrink.classList.add("beverage");
    newDrink.innerHTML = numberOfDrink +  typeOfDrink + typeOfMilk + addition + text + deleteButton;
    addButton.before(newDrink);
    document.querySelector(".delete-button").disabled = false;
    newDrink.querySelector(".delete-button").addEventListener("click", deleteDrink);
    newDrink.querySelector(".user-textarea").addEventListener("input", showInputText);
};

function deleteDrink(event) {
    if (event.target.className != "delete-button") return;
    event.target.closest(".beverage").remove();
    if (document.querySelectorAll(".beverage").length == 1)
        document.querySelector(".delete-button").disabled = true;
}

function showInputText() {
    if (event.target.className != "user-textarea") return;
    event.target.nextElementSibling.innerHTML = formatUserText(event.target.value);
}

function formatUserText(text) {
    let formattedText = text;
    for (let i = 0; i < arrayOfWords.length; i++) {
        if (text.includes(arrayOfWords[i])) {
            regexp = new RegExp(`${arrayOfWords[i]}`, 'ig');
            let bword = `<b>${arrayOfWords[i]}</b>`
            formattedText = formattedText.replace(regexp, bword);
        }
    }
    return formattedText;
}

function on() {
    overlay.style.display = "block";
    event.preventDefault();
    let countOfDrinks = document.querySelectorAll(".beverage").length;
    let orderAcceptedMessage = `Вы заказали ${countOfDrinks} ${declination(countOfDrinks)}`;
    document.querySelector(".order-accepted-message").textContent = orderAcceptedMessage;
    document.querySelector(".order-accepted-message").after(createTable());
}

function off() {
    overlay.style.display = "none";
    document.querySelector(".final-order-table").remove();
}

function createTable() {
    let tableContent = "<tr><th>Напиток</th><th>Молоко</th><th>Дополнительно</th><th>Пожелания</th></tr>";
    let drinks = document.querySelectorAll(".beverage");
    for (let drink of drinks) {
        let type = drink.querySelector(".type-of-drink");
        let selectedType = type.options[type.selectedIndex].textContent;

        let checkedMilk = "";
        let milks = drink.querySelectorAll("[name^='milk-']");
        for (let elem of milks) {
            if (elem.checked) checkedMilk = typesOfMilk[elem.value];
        }

        let selectedAdditions = "";
        let additions = drink.querySelectorAll("[name='options']");
        for (let elem of additions) {
             if (elem.checked) selectedAdditions += `${additionOfDrink[elem.value]}, `;
        }

        let userText = drink.querySelector(".user-text").innerHTML;

        tableContent += `<tr><td>${selectedType}</td><td>${checkedMilk}</td><td>${selectedAdditions.substring(0, selectedAdditions.length - 2)}</td><td>${userText}</td></tr>`;
    }
    let tableOrder = document.createElement("table");
    tableOrder.classList.add("final-order-table");
    tableOrder.innerHTML = tableContent;
    return tableOrder;
}

function declination(count) {
    if ((count%10 == 1) && (count%100 != 11)) return "напиток";
        else  if ((count%10 == 2 || count%10 == 3 || count%10 == 4)
        && (count%100 != 12)
        && (count%100 != 13)
        && (count%100 != 14))
        return "напитка";
            else return "напитков";
}

function checkTime() {
     let time = document.querySelector(".input-time");
     let nowTime = new Date();
     if ((time.value.split(":")[0] < nowTime.getHours()) ||
        (time.value.split(":")[0] == nowTime.getHours()
        && time.value.split(":")[1] <= nowTime.getMinutes()))
            {
                event.preventDefault();
                time.classList.add("wrong-time");
                alert("Мы не умеем перемещаться во времени. Выберите время позже, чем текущее");
            }
}
