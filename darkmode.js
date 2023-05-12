// ==UserScript==
// @name         Auto Nilam
// @namespace    https://duccweb.tk
// @version      0.1
// @description  johor nilam sucks
// @author       duccveloper
// @match        https://nilamjohor.edu.my/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at document-end
// ==/UserScript==

(function() {
    'use strict';

var version = "0.0.1 [ALPHA]";

function sendNilam(category, language, title, is_synopsis, synopsis, author, publisher, year) {
    const xhr = new XMLHttpRequest();
    const key = getKey();
    const date = getDate();
    xhr.open("POST", "https://nilamjohor.edu.my/aktiviti-bacaan/create");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body =
        "_csrf-frontend=" + key + "&AktivitiBacaan[akb_mod_kategori_bahan]=" + category + "&AktivitiBacaan[akb_mod_kategori_bahasa]=" + language + "&AktivitiBacaan[akb_mod_judul]=" + title + "&AktivitiBacaan[akb_mod_tick_sinopsis]=&AktivitiBacaan[akb_mod_tick_sinopsis]=" + is_synopsis + "&AktivitiBacaan[akb_mod_sinopsis]=" + synopsis + "&AktivitiBacaan[akb_mod_pengarang]=" + author + "&AktivitiBacaan[akb_mod_penerbit]=" + publisher + "&AktivitiBacaan[akb_mod_tahun_terbit]=" + year + "&AktivitiBacaan[akb_mod_tarikh_baca]=" + date;
    xhr.onload = () => {
        if (xhr.readyState == 302) {
            console.log(JSON.parse(xhr.responseText));
        } else {
            console.log(`Error: ${xhr.status}`);
        }
    };
    xhr.send(body);
}

function getKey() {
    var key = document.getElementsByName("_csrf-frontend")[0].value;
    return key;
}

function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;
    return today;
}

function doNilam(json) {
    var is_valid = false;
    console.log(json)
    var obj = JSON.parse(json);
    var language = obj.books[0].language;
    var title = obj.books[0].title;
    var synopsis = obj.books[0].synopsis;
    var author = obj.books[0].author;
    var publisher = obj.books[0].publisher;
    var year = obj.books[0].year_of_publish;
    var is_fiction = obj.books[0].fiction;
    var language = language.toLowerCase();

    function checkYear() {
        if (!(typeof year == "number")) {
            notify("Invalid year value", "Error");
            return false;
        }
    }

    function checkLanguage(language) {
        if (language == "english") {
            var id_language = "20";
            return id_language;
        } else if (language == "bahasa melayu") {
            var id_language = "10";
            return id_language;
        } else {
            notify("Invalid language value", "Error");
            return false;
        }
    }

    function checkFiction(is_fiction) {
        if (is_fiction == true) {
            var id_category = "30";
            return id_category;
        } else if (is_fiction == false) {
            var id_category = "40";
            return id_category;
        } else {
            notify("Invalid category value", "Error");
            return false;
        }
    }

    var id_category = checkFiction(is_fiction);
    var id_language = checkLanguage(language);
    var year_valid = checkYear();
    if (id_category == false || id_language == false || year_valid == false) {
        is_valid = false;
    } else {
        var is_valid = true;
    }


    if (is_valid) {
        notify(id_category + " " + id_language + " " + title + " " + synopsis + " " + author + " " + publisher + " " + year, "Info")
        sendNilam(id_category, id_language, title, 1, synopsis, author, publisher, year);
    } else {
        notify("Failed valid check", "Error");
        return false;
    }
}

function notify(message, type) {
    console.log(type + ": " + message)
}

function nilam(json) {
    var text = json;
    doNilam(text);
}

function load() {
    var head = document.getElementsByTagName("head")[0];
    var fontawesome = head.appendChild(document.createElement("link"));
    fontawesome.setAttribute("rel", "stylesheet");
    fontawesome.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css");
    var ul = document.getElementById("sidebarnav");
    var menu_li = ul.appendChild(document.createElement("li"));
    var menu_a = menu_li.appendChild(document.createElement("a"));
    menu_a.setAttribute("class", "waves-effect waves-dark");
    menu_a.setAttribute("aria-expanded", "false");
    var menu_i = menu_a.appendChild(document.createElement("i"));
    menu_i.setAttribute("class", "fa-solid fa-sliders");
    var menu_span = menu_a.appendChild(document.createElement("span"));
    menu_span.setAttribute("class", "hide-menu");
    menu_span.innerHTML = " BetterNilam Options ";
    menu_a.setAttribute("href", "/");
}

function darkmode() {
    var fontawesome = document.createElement("link");
    fontawesome.rel = "stylesheet";
    fontawesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(fontawesome);
    var style = document.createElement("style");
    style.innerHTML = `
  .container-fluid {
    background-color: #121212;
  }
  .page-titles {
    background-color: #262626;
    color: #cccccc;
  }
  .page-titles .breadcrumb li a {
    color: #cccccc;
  }
  .card-body {
    background-color: #393939;
  }
  .bg-info {
    background-color: #2F2F2F;
    border: 2px solid #03a9f3;
    border-radius: 5px 5px 0px 0px !important;
  }
  .card-body {
    border-radius: 0px 0px 5px 5px !important;
  }
  .form-body {
    color: #cccccc;
  }
  label {
    color: #b9b9b9;
  }
  .select2-container--krajee-bs4 .select2-selection {
    background-color: transparent;
  }
  .select2-container--krajee-bs4 .select2-results__option[aria-selected] {
    background-color: #2f2f2f;
    color: #cccccc;
  }
  .select2-container--krajee-bs4 .select2-selection--single .select2-selection__arrow {
    border-left: none;
  }
  .form-control {
    background-color: transparent !important;
    color: #cccccc;
  }
  .select2-container--krajee-bs4 .select2-results__option--highlighted[aria-selected] {
    color: #01b7ff;
  }
  .select2-container--krajee-bs4 .select2-selection__clear {
    color: #cccccc;
    text-shadow: none;
    line-height: normal;
  }
  .select2-container--krajee-bs4 .select2-selection--single .select2-selection__rendered {
    color: #cccccc;
  }
  .form-control:focus {
    background-color: #2f2f2f;
    color: #cccccc;
  }
  .was-validated .custom-control-input:valid ~ .custom-control-label, .custom-control-input.is-valid ~ .custom-control-label {
    color: #cccccc;
  }
  textarea.form-control:disabled {
    background-color: #2f2f2f !important;
  }
  .form-control:focus {
    border-color: #01b7ff;
  }
  .datepicker {
    background-color: #2f2f2f;
  }
  .kv-date-picker {
    background-color: transparent !important;
    color: #cccccc;
  }
  .custom-control-label {
    color: #cccccc !important;
  }
  .datepicker-days {
    color: #cccccc;
  }
  .day:not(.active):hover, .prev:hover, .next:hover, .datepicker-switch:hover {
    background-color: #262626 !important;
  }
  .btn {
    color: #cccccc !important;
    border-width: 1px;
  }
  .left-sidebar {
    background-color: #2f2f2f;
  }
  [class^="ti-"], [class*=" ti-"] {
    color: #cccccc;
  }
  .footer {
    background-color: #393939;
    color: #cccccc;
  }
  .page-wrapper {
    background-color: #121212 !important;
    color: #cccccc;
  }
  hr {
    background-color: #cccccc;
    margin-bottom: 10px !important;
  }
  .modal-content {
    background-color: #2f2f2f;
  }
  
  .mini-sidebar .sidebar-nav #sidebarnav > li:hover > a {
    background: #262626 !important;
    border-radius: 5px;
  }
  .mini-sidebar .sidebar-nav #sidebarnav > li:hover > ul, .mini-sidebar .sidebar-nav #sidebarnav > li:hover > ul.collapse {
  background: #262626;
  }
  .card-group .card {
  border: none;
  }
  #w0 > #w1 {
  background-color: #262626;
  }
  #w0 > #w1 > a {
  color: #cccccc;
  }
  .dropdown-item:hover {
  background-color: #2f2f2f;
  color: #cccccc;
  }
  .raphael-group-159-background > rect {
  fill: #393939;
  }
  .raphael-group-5-background > rect {
  fill: #393939;
  }
  .raphael-group-86-background > rect {
  fill: #393939;
  }
  .feeds > li:hover {
  background-color: #262626;
  }
  .kv-grid-table > tbody {
  color: #cccccc !important;
  }
  .kv-table-header {
  background: transparent !important;
  }
  .btn-group > a {
  background-color: #2f2f2f !important;
  }
  .table-success {
  color: #cccccc !important;
  }
  .raphael-group-95-caption > text, .raphael-group-14-caption > text {
  fill: #cccccc;
  }
  .raphael-group-260-dataset-axis > text, .raphael-group-241-dataset-axis > text {
  fill: gray;
  }
  .raphael-group-144-labels > path, .raphael-group-66-labels > path {
  stroke: gray;
  }
  table {
  color: #cccccc !important;
  }
  .kv-grid-bs4 > div:last-child {
  background-color: transparent !important;
  }
  option {
  background-color: #262626 !important;
  color: #cccccc !important;
  }
  span.input-group-text {
  background-color: transparent !important;
  }
  .card-header {
  background-color: #2f2f2f !important;
  }
  .navbar-collapse {
  background-color: #1c1c1c !important;
  }
  .navbar-header {
  background-color: #121212 !important;
  }
  li.breadcrumb-item.active {
  color: #606060 !important;
  }
  .text-primary {
  color: #747474 !important;
  }
  .text-success {
  color: #888888 !important;
  }
  .skin-blue .sidebar-nav > ul > li.active > a {
  color: #a5a5a5 !important;
  border-left: 3px solid #a5a5a5 !important;
  }
  .skin-blue .sidebar-nav > ul > li.active > a > i {
  color: #a5a5a5 !important;
  }
  .skin-blue .sidebar-nav > ul > li:hover > a , .skin-blue .sidebar-nav > ul > li:hover > a > i {
  color: #77839d !important;
  }
  .table-success, .table-success > th, .table-success > td {
  background-color: #1d7c63 !important;
  }
  a {
  color: #9b9b9b !important;
  }
  .btn:not(.btn-underline) {
  background-color: #2f2f2f;
  }
  .label-info {
  background-color: transparent !important;
  border: 1px solid #03a9f3 !important;
  }
  .skin-blue .sidebar-nav ul li a.active i, .skin-blue .sidebar-nav ul li a:hover i {
  color: #77839d !important;
  }
  .skin-blue .sidebar-nav ul li a.active, .skin-blue .sidebar-nav ul li a:hover {
  color: #77839d !important;
  }
  .progress-bar.bg-primary {
  border: 1px solid #fb9678 !important;
  background-color: #393939 !important;
  }
  .progress-bar.bg-success {
  border: 1px solid #00c292 !important;
  background-color: #393939 !important;
  }
  .progress-bar.bg-cyan {
  border: 1px solid #01c0c8 !important;
  background-color: #393939 !important;
  }
  .progress-bar.bg-purple {
  border: 1px solid #ab8ce4 !important;
  background-color: #393939 !important;
  }
  .card {
  background-color: transparent !important;
  }
  .custom-control-label::before {
  background-color: #393939 !important;
  }
  .raphael-group-158-background > rect, .raphael-group-4-background > rect, raphael-group-85-background > rect {
  fill: #393939 !important;
  }
  .preloader {
  background-color: #121212 !important;
  }
  .card-group {
    border: 2px solid #03a9f3 !important;
    border-radius: 5px !important;
  }
  `;
    document.head.appendChild(style);
    if (window.location.href.indexOf("https://nilamjohor.edu.my/aktiviti-bacaan/index") > -1) {
        var btn = document.getElementsByClassName("m-l-0")[0];
        var icon = btn.getElementsByTagName("i")[0];
        icon.classList.remove("fas", "fa-search-minus");
        icon.classList.add("fa-solid", "fa-rotate-right");
        var btn2 = document.getElementsByClassName("btn-group")[0];
        var btn22 = btn2.children[0];
        var icon2 = btn22.getElementsByTagName("i")[0];
        icon2.classList.remove("fas", "fa-search-plus");
        icon2.classList.add("fa-solid", "fa-magnifying-glass");
    }
    var log = document.getElementsByClassName("nav-link")[2];
    var logout = log.getElementsByTagName("i")[0];
    logout.classList.remove("fa", "fa-power-off");
    logout.classList.add("fa-solid", "fa-arrow-right-from-bracket");
}

function autoLogin(username, password) {
    const xhr = new XMLHttpRequest();
    const key = getKey();
    xhr.open("POST", "https://nilamjohor.edu.my/site/login");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    const body =
        "_csrf-frontend=" + key + "&LoginForm[username]=" + username + "&LoginForm[password]=" + password + "&login-button=";
    xhr.onload = () => {
        if (xhr.status == 302 || xhr.status == 200) {
            window.location.href = "https://nilamjohor.edu.my/";
        } else {
            console.log(`Error: ${xhr.status}`);
        }
    };
    xhr.send(body);
}

if (window.location.href.indexOf("https://nilamjohor.edu.my/site/login") > -1) {
    autoLogin("m-9493219", "abcd@1234");
}


console.log("Loaded BetterNilam v" + version)

darkmode();
})();
