
import 'rxjs/Observable/of';
"use strict";

fetchContacts();
let rxjs = require('rxjs');
let addContactButton = document.querySelector(".add-contact");
rxjs.fromEvent(addContactButton, 'click').subscribe(function (x) {
    showAddContactView();
});

let submitContactButton = document.querySelector(".submit-button");
rxjs.fromEvent(submitContactButton, 'click').subscribe(function () {
    createContact();
});


let createContact = function createContact(){
    let firstname = document.querySelector(".firstname").value;
    let lastname = document.querySelector(".lastname").value;
    let phoneNumber = document.querySelector(".phone-number").value;
    let email = document.querySelector(".email").value;
    fetch('http://localhost:3000/contacts', {
        mode: "cors",
        headers: { "Content-Type": "application/json"},
        method: 'POST',
        body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            phonenumber: phoneNumber,
            email: email
        })
    })
            .then(response => console.log("response status", response.status))
            .then(data => console.log("data", JSON.stringify(data)))
            .then(value => clearContacts())
            .then(value => fetchContacts());
}

function fetchContacts() {
    fetch('http://localhost:3000/contacts', {
        mode: "cors",
        headers: { "Content-Type": "application/json"},
        method: 'GET'
    })
        .then(response => response.json().then(json => populateOutput(json)))
        .then(data => console.log(data));
}

function fetchContactById(_id){
    console.log(_id);
    fetch('http://localhost:3000/contacts/' + _id, {
        mode: "cors",
        headers: { "Content-Type": "application/json"},
        method: 'GET'
    })
        .then(response => response.json().then(json => showDetails(json)))
        .then(data => function(){
            console.log("From THEN");
            console.log(data);
        });
}


function showDetails(response_json) {
    console.log(response_json);
    let contactDetailsDiv = document.querySelector(".contact-details");
    let firstName = response_json.firstname;
    let secondName = response_json.lastname;
    let phoneno = response_json.phonenumber;
    let email = response_json.email;
    contactDetailsDiv.innerHTML = '<span>'+firstName + " " + secondName+'<br />'+ phoneno + '<br />'+ email+'</span>';

}

function clearContacts() {
    let body = document.getElementsByTagName("body")[0];
    let table = document.getElementsByTagName("table")[0];
    body.removeChild(table);
}

function populateOutput(json_array) {
    let body = document.getElementsByTagName("body")[0];
    let tbl = document.createElement("table");
    let tblBody = document.createElement("tbody");
    for(let i = 0; i < json_array.length; i++){
        let row = document.createElement("tr");
        //for (let j = 0; j < ; j++) {
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            let url = "http://localhost:3000/contacts/"+json_array[i]._id;
            let cell1 = document.createElement("td");
            let cell2 = document.createElement("td");
            let a = document.createElement('a');
            let cellText = document.createTextNode(json_array[i].firstname + " " + json_array[i].lastname);
            cell1.appendChild(a);
            let button = document.createElement("button");
            button.innerHTML = "view contact";
            button.id = json_array[i]._id;
            button.classList.add("view_button");
            rxjs.fromEvent(button, 'click').subscribe(function () {
                fetchContactById(json_array[i]._id);
            });
            cell1.appendChild(button);
            a.appendChild(cellText);
            a.href = url;
            row.appendChild(cell1);
            row.appendChild(cell2);
        //}
        tblBody.appendChild(row);
    }
    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    body.appendChild(tbl);
    // sets the border attribute of tbl to 2;
    tbl.setAttribute("border", "2");
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