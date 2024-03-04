import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playgroud-bdd48-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldItem = document.getElementById("input-item");
const inputFieldQuantity = document.getElementById("input-quantity");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValueItem = inputFieldItem.value;
  let inputValueQuantity = inputFieldQuantity.value;

  //push inputValue to firebase DB
  if (
    inputValueItem.length !== 0 && inputValueItem !== null
    &&
    inputValueQuantity.length !== 0 && inputValueQuantity !== null
    ) {

        
  let firebaseObject = {
    item: inputValueItem,
    quantity: inputValueQuantity
  };
    push(shoppingListInDB, firebaseObject);

    //clear inputs
    clearInput(inputFieldItem);
    clearInput(inputFieldQuantity);
    inputFieldItem.focus();
  }

});

const clearInput = (input) => {
  input.value = "";
};

const appendLiToList = (element, listItem, uniqeID) => {
  let newEl = document.createElement("li");
  newEl.textContent = listItem.item + " - " + listItem.quantity;
  
  let closeBtn = document.createElement("span");
  closeBtn.textContent = "X";
  closeBtn.addEventListener("click", () => {
    // create exact location
    let locationInDB = ref(database, `shoppingList/${uniqeID}`);
    //firebase remove from db
    remove(locationInDB);
  });
  newEl.appendChild(closeBtn);

  element.append(newEl);
};

const clearUlList = (element) => {
  element.innerHTML = "";
};

/* A methot we impoerted from firebase, its connecta to DB, reads referance
and returns referance as an object, we use this obj and get data from it.
firebase makes an boradcast to the every client when a change made to the DB
onValue can catch that*/
onValue(shoppingListInDB, (snapshot) => {
  if (snapshot.exists()) {
    let listArr = Object.entries(snapshot.val());

    clearUlList(shoppingListEl);

    // Challenge: Write a for loop where you console log each book.
    for (let i = 0; i < listArr.length; i++) {
      let currentItem = listArr[i];
      let currentID = currentItem[0];
      let listItem = currentItem[1];

      // Challenge: Use the appendBookToBooksListEl() function to append book instead of console logging
      appendLiToList(shoppingListEl, listItem, currentID);
    }
  } else {
    //shoppingListEl.removeChild(shoppingListEl.children[0]);
    clearUlList(shoppingListEl);
  }
});
