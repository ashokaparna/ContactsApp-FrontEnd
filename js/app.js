
import {fromEvent} from "rxjs";

"use strict";

fromEvent(window,'load').subscribe(function () {
    fetchContacts();
})


let addContactButton = document.querySelector(".add-contact");
fromEvent(addContactButton, 'click').subscribe(function () {
    showAddContactView();
});

let submitContactButton = document.querySelector(".submit-button");
fromEvent(submitContactButton, 'click').subscribe(function () {
    createContact();
});

let createContact = function createContact(){
    let firstname = document.querySelector(".firstname").value;
    let lastname = document.querySelector(".lastname").value;
    let phoneNumber = document.querySelector(".phone-number").value;
    let email = document.querySelector(".email").value;
    let phonenoRegex = /^\d{10}$/;
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(firstname === "" || firstname === null){
        alert("Please enter the first name");
        return;
    }else if(lastname === "" || lastname === null){
        alert("Please enter the last name");
        return;
    }else if(phoneNumber === "" || phoneNumber === null){
        alert("Please enter the phone number");
        return;
    }else if (!(phoneNumber.match(phonenoRegex))){
        alert("Please enter a valid phone number");
        return;
    }else if (!(email.match(emailRegex))) {
        alert("Please enter a valid email");
        return;
    }
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
            .then(response => handleErrors(response))
            .then(response => console.log("response status", response.status))
            .then(data => console.log("data", JSON.stringify(data)))
            .then(value => clearContacts())
            .then(value => fetchContacts())
            .catch(error => console.error('Error:', error));
}

function fetchContacts() {
    fetch('http://localhost:3000/contacts', {
        mode: "cors",
        headers: { "Content-Type": "application/json"},
        method: 'GET'
    })
        .then(response => handleErrors(response))
        .then(response => response.json().then(json => populateOutput(json)))
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}


function fetchContactById(_id){
    console.log(_id);
    fetch('http://localhost:3000/contacts/' + _id, {
        mode: "cors",
        headers: { "Content-Type": "application/json"},
        method: 'GET'
    })
        .then(response => handleErrors(response))
        .then(response => response.json().then(json => showDetails(json)))
        .then(data => function(){
            console.log("From THEN");
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
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
    let div = document.querySelector(".contact-list");
    let table = document.getElementsByTagName("table")[0];
    div.removeChild(table);
}

function populateOutput(json_array) {
    let div = document.querySelector(".contact-list");
    let tbl = document.createElement("table");
    tbl.classList.add("contacts_table");
    let tblBody = document.createElement("tbody");
    for(let i = 0; i < json_array.length; i++){
        let row = document.createElement("tr");
        // Create a <td> element and a text node, make the text
        // node the contents of the <td>, and put the <td> at
        // the end of the table row
        let cell1 = document.createElement("td");
        let cell1inside = document.createElement("span");
        cell1.classList.add("all-tds");
        let cellText = document.createTextNode(json_array[i].firstname + " " + json_array[i].lastname);
        cell1inside.appendChild(cellText);
        //cell1.appendChild(cellText);
        let button = document.createElement("button");
        button.innerHTML = "View";
        button.id = json_array[i]._id;
        button.classList.add("view_button");
        fromEvent(button, 'click').subscribe(function () {
            fetchContactById(json_array[i]._id);
        });
        cell1.appendChild(cell1inside);
        cell1.appendChild(button);
        row.appendChild(cell1);
        tblBody.appendChild(row);
    }
    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    div.appendChild(tbl);
    // sets the border attribute of tbl to 2;
    tbl.setAttribute("border", "2");
}

let showAddContactView = function showAddContactView() {
    let addContactView = document.querySelector(".contact-form");
    addContactView.style.display = "block";

}

let hideAddContactView = function hideAddContactView() {
    document.querySelector(".firstname").value = "";
    document.querySelector(".lastname").value = "";
    document.querySelector(".phone-number").value = "";
    document.querySelector(".email").value = "";
    let addContactView = document.querySelector(".contact-form");
    addContactView.style.display = "none";

}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

