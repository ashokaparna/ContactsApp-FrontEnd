
import 'rxjs/Observable/of';
"use strict";


let rxjs = require('rxjs');
let nextNode = document.querySelector(".add-contact");
const event$ = rxjs.fromEvent(nextNode, 'click');
let subscription = event$.subscribe(function (x) {
    createContact();
});

let createContact = function createContact(){
    fetch('http://localhost:3000/contacts', {
        mode: "cors",
        headers: { "Content-Type": "application/json"},
        method: 'POST',
        body: JSON.stringify({
            name: 'Nikola Tesla'
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