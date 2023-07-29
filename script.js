import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-888f3-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById('input-field');
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById('shopping-list');

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;

    if (inputValue != "") {
        push(shoppingListInDB, inputValue);   
        
        console.log(`${inputValue} added to database`);

        clearInputFieldEl();
    }

})

onValue(shoppingListInDB, function(snapshot) {

    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearShoppingListEl();
    
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];
    
            appendItemToShoppingListEl(currentItem);
        }
    } else {
        shoppingListEl.innerHTML = "No Notices here..."
    }


}) 

function appendItemToShoppingListEl(item) {
    // shoppingListEl.innerHTML += `<li>${inputValue}</li>`;

    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li");

    let listOfLines = itemValue.split("\\n");

    itemValue = "";
    for(let i = 0; i < listOfLines.length - 1; i++) {
        itemValue += listOfLines[i];
        itemValue += "<br />";
    }

    newEl.innerHTML = itemValue;

    console.log(itemValue);


    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl);
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

