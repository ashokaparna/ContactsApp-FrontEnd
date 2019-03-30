
import {fromEvent} from "rxjs";

"use strict";

fromEvent(window,'load').subscribe(function () {
    fetchContacts();
    document.querySelector(".contact-form").style.display='none';
})


let addContactButton = document.querySelector(".add-contact");
fromEvent(addContactButton, 'click').subscribe(function () {
    toggleAddContactView();
});

let submitContactButton = document.querySelector(".submit-button");
fromEvent(submitContactButton, 'click').subscribe(function () {
    createContact();
});

function createContact(){
    let firstname = document.querySelector(".firstname");
    let lastname = document.querySelector(".lastname");
    let phoneNumber = document.querySelector(".phone-number");
    let email = document.querySelector(".email");
    let phonenoRegex = /^\d{10}$/;
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let warning_span = document.querySelector(".warning-span");
    warning_span.innerHTML="";
    firstname.style.removeProperty('border');
    lastname.style.removeProperty('border');
    phoneNumber.style.removeProperty('border');
    email.style.removeProperty('border');

    if(firstname.value === "" || firstname.value === null){
        firstname.style.borderColor = 'red';
        warning_span.innerHTML='<small><font color="red">First name cannot be empty</small><hr>';
        return false;
    }else if(lastname.value === "" || lastname.value === null){
        lastname.style.borderColor = 'red';
        warning_span.innerHTML='<small><font color="red">Last name cannot be empty</small><hr>';
        return false;
    }else if(phoneNumber.value === "" || phoneNumber.value === null){
        phoneNumber.style.borderColor = 'red';
        warning_span.innerHTML='<small><font color="red">Phone number cannot be empty</small><hr>';
        return false;
    }else if (!(phoneNumber.value.match(phonenoRegex))){
        phoneNumber.style.borderColor = 'red';
        warning_span.innerHTML='<small><font color="red">Phone number should be 10 digits long</small><hr>';
        return false;
    }else if (!isValid(email.value, emailRegex)) {
        email.style.borderColor = 'red';
        warning_span.innerHTML='<small><font color="red">Wrong email id format</small><hr>';
        return false;
    }else{
    fetch('http://localhost:3000/contacts', {
        mode: "cors",
        headers: { "Content-Type": "application/json"},
        method: 'POST',
        body: JSON.stringify({
            firstname: firstname.value,
            lastname: lastname.value,
            phonenumber: phoneNumber.value,
            email: email.value
        })
    })
            .then(response => handleErrors(response))
            .then(response => console.log("response status", response.status))
            .then(data => console.log("data", JSON.stringify(data)))
            .then(value => clearContacts())
            .then(value => fetchContacts())
            .catch(error => console.error('Error:', error));
}}

function isValid(email, emailRegex) {
    return email==="" || email===null || email.match(emailRegex);
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
    window.scrollTo(0, 0);
}

function showDetails(response_json) {
    console.log(response_json);
    let contactDetailsDiv = document.querySelector(".contact-details");
    let firstName = response_json.firstname;
    let secondName = response_json.lastname;
    let phoneno = response_json.phonenumber;
    let email = response_json.email;
    contactDetailsDiv.style.backgroundColor = "cornflowerblue";
    contactDetailsDiv.innerHTML = getInnerHTML(firstName, secondName, phoneno, email);

}

function getInnerHTML(firstName, secondName, phoneno, email) {
    return '<span class="single-contact-detail">Name:&nbsp;'+firstName + " " + secondName+'<br />Phone Number:&nbsp;'+ phoneno + '<br />Email:&nbsp;'+ email+'</span>';
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
        let cellText = document.createTextNode(json_array[i].firstname + " " + json_array[i].lastname);
        //cell1.appendChild(cellText);
        fromEvent(cell1, 'click').subscribe(function () {
            fetchContactById(json_array[i]._id);

        });
        cell1.appendChild(cellText);
        row.appendChild(cell1);
        tblBody.appendChild(row);
    }
    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    div.appendChild(tbl);
    // sets the border attribute of tbl to 2;
    tbl.setAttribute("border", "1");
}

function toggleAddContactView() {
    let addContactView = document.querySelector(".contact-form");
    if (addContactView.style.display === 'block') {
        addContactView.style.display = 'none';
    } else {
        addContactView.style.display = 'block';
    }
    document.querySelector(".contact-details").style.backgroundColor = "white";
    let single_contact_detail = document.querySelector(".single-contact-detail");
    if (single_contact_detail !==  null && single_contact_detail !== undefined) {
        single_contact_detail.innerHTML = '';
    }
}

function hideAddContactView() {
    document.querySelector(".firstname").value = "";
    document.querySelector(".lastname").value = "";
    document.querySelector(".phone-number").value = "";
    document.querySelector(".email").value = "";
    let addContactView = document.querySelector(".contact-form");
    addContactView.style.display = "none";
}

function handleErrors(response) {
    if (!response.ok) {
        document.querySelector(".warning-span").innerHTML='<font color="red" size="7">Oh no! Server threw an error:&nbsp;'+response.statusText+'<hr>';
        throw Error(response.statusText);
    }
    hideAddContactView();
    return response;
}

