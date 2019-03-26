
import 'rxjs/Observable/of';
"use strict";


let rxjs = require('rxjs');
let addContactButton = document.querySelector(".add-contact");
const event$ = rxjs.fromEvent(addContactButton, 'click');
let subscription1 = event$.subscribe(function (x) {
    showAddContactView();
    //createContact();
});

let submitContactButton = document.querySelector(".submit-button");
const event1$ = rxjs.fromEvent(submitContactButton, 'click');
let subscription2 = event1$.subscribe(function () {
    createContact();
});

let createContact = function createContact(){
    let firstname = document.querySelector(".firstname").value;
    let lastname = document.querySelector(".lastname").value;
    let phoneNumber = document.querySelector(".phone-number").value;
    let email = document.querySelector(".phone-email").value;

    fetch('http://localhost:3000/contacts', {
        mode: "cors",
        headers: { "Content-Type": "application/json"},
        method: 'POST',
        body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            phoneNumber: phoneNumber,
            email: email
        })
    })
            .then(response => console.log("response status", response.status))
            .then(data => console.log("data", JSON.stringify(data)));
}

let fetchContacts = function fetchContacts() {
    fetch('http://localhost:3000/contacts', {
        mode: "cors",
        headers: { "Content-Type": "application/json"},
        method: 'GET',

    })
        .then(response => response.json())
        .then(data => console.log(data))
}

let showAddContactView = function showAddContactView() {
    let addContactView = document.querySelector(".contact-form");
    addContactView.style.display = "block";

}

let hideAddContactView = function hideAddContactView() {
    let addContactView = document.querySelector(".contact-form");
    addContactView.style.display = "none";

}


// function getAllContacts(oFormElement)
// {
//     var xhr = new XMLHttpRequest();
//     xhr.setRequestHeader('Content-type', 'application/json');
//     xhr.onload = function(){ alert (xhr.responseText); } // success case
//     xhr.onerror = function(){ alert (xhr.responseText); } // failure case
//     xhr.open (oFormElement.method, oFormElement.action, true);
//     xhr.send (new FormData (oFormElement));
//     return false;
// }