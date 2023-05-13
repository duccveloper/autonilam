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

(function () {
    'use strict';

    var version = "0.0.1 [ALPHA]";
    var language_api_key = "64c3d7fffecc2e887a6f74649db2ad87"

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
        fontawesome.setAttribute("href", "https://site-assets.fontawesome.com/releases/v6.4.0/css/all.css");
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
    border-radius: 5px !important;
  }
  .input-group-text {
    color: #cccccc !important;
  }
  `;
        document.head.appendChild(style);
        if (window.location.href == "https://nilamjohor.edu.my/aktiviti-bacaan/index") {
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

    function betterUI() {
        var style = document.createElement("style");
        style.innerHTML = `
    .user-pro {
        display: none !important;
    }
    .site-index > .jumbotron {
        display: none !important;
    }
    `;
        document.head.appendChild(style);
        var log = document.getElementsByClassName("my-lg-0")[0];
        var log2 = log.getElementsByTagName("li")[0];
        var log3 = log2.getElementsByTagName("a")[0];
        var logout = log3.getElementsByTagName("i")[0];
        logout.classList.remove("fa", "fa-power-off");
        logout.classList.add("fa-solid", "fa-arrow-right-from-bracket");
        var user_profile = document.createElement("li");
        user_profile.classList.add("nav-item", "right-side-toggle");
        log.prepend(user_profile);
        var user_profilea = document.createElement("a");
        user_profilea.classList.add("nav-link", "waves-effect", "waves-light");
        user_profilea.setAttribute("href", "https://nilamjohor.edu.my/murid/view");
        user_profile.appendChild(user_profilea);
        var user_profilei = document.createElement("i");
        user_profilei.classList.add("fa-regular", "fa-user");
        user_profilea.appendChild(user_profilei);
        var user_profilespan = document.createElement("span");
        user_profilespan.style.color = "#cccccc"
        user_profilespan.style.marginLeft = "10px"
        var prof_name = document.getElementsByClassName('media-body')[0].getElementsByTagName('span')[0].innerHTML;
        user_profilespan.innerHTML = prof_name;
        user_profilea.appendChild(user_profilespan);
        user_profilea.style.fontWeight = "500";
        var leftbar = document.getElementsByClassName("mr-auto")[0];
        var tambah_buku = document.createElement("li");
        tambah_buku.classList.add("nav-item");
        leftbar.appendChild(tambah_buku);
        var tambah_bukua = document.createElement("a");
        tambah_bukua.classList.add("nav-link", "waves-effect", "waves-light");
        tambah_bukua.setAttribute("href", "https://nilamjohor.edu.my/aktiviti-bacaan/create");
        tambah_buku.appendChild(tambah_bukua);
        var tambah_bukui = document.createElement("i");
        tambah_bukui.classList.add("fa-regular", "fa-plus");
        tambah_bukua.appendChild(tambah_bukui);
        var tambah_bukuspan = document.createElement("span");
        tambah_bukuspan.style.color = "#cccccc"
        tambah_bukuspan.style.marginLeft = "10px"
        tambah_bukuspan.style.fontSize = "15px";
        tambah_bukuspan.innerHTML = "Tambah aktiviti bacaan"
        tambah_bukua.appendChild(tambah_bukuspan);

        async function homepage() {
            if (window.location.href == "https://nilamjohor.edu.my" || window.location.href == "https://nilamjohor.edu.my/" || window.location.href == "https://nilamjohor.edu.my/site") {
                var site_index = document.getElementsByClassName("site-index")[0];
                var cardgroup1 = document.createElement("div");
                cardgroup1.classList.add("card-group", "row");
                var cardwrapper1 = document.createElement("div");
                cardwrapper1.classList.add("card", "col-md-6");
                var cardbody1 = document.createElement("div");
                cardbody1.classList.add("card-body");
                var cardbodywrapper1 = document.createElement("div");
                cardbodywrapper1.classList.add("row");
                var cardheader1 = document.createElement("div");
                cardheader1.classList.add("card-header", "bg-info");
                var cardheaderwrapper1 = document.createElement("h4");
                cardheaderwrapper1.classList.add("m-b-0", "text-white");
                cardheaderwrapper1.innerHTML = "Aktiviti Bacaan";
                var cardicon1 = document.createElement("i");
                cardicon1.classList.add("fa-regular", "fa-chart-simple");
                cardicon1.style.marginRight = "10px";
                cardheaderwrapper1.innerText = "Overview";
                cardheaderwrapper1.prepend(cardicon1);
                cardheader1.appendChild(cardheaderwrapper1);
                cardwrapper1.appendChild(cardheader1);
                site_index.appendChild(cardgroup1);
                cardgroup1.appendChild(cardwrapper1);
                cardwrapper1.appendChild(cardbody1);
                cardbody1.appendChild(cardbodywrapper1);



            }
            async function fetchBooks() {
                var response = await fetch("https://nilamjohor.edu.my/aktiviti-bacaan/index");
                var data = await response.text();
                var books = doStuffWithParsedBooks(data);
                return books;

            }
            function doStuffWithParsedBooks(data) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(data, "text/html");
                var table = doc.getElementsByClassName("kv-grid-table")[0];
                var tbody = table.getElementsByTagName("tbody")[0];
                var books = [];
                for (var i = 0; i < 5; i++) {
                    var book = {};
                    var row = tbody.children[i];
                    var book_id = row.children[0].innerText;
                    var book_name = row.children[2].innerText;
                    var book_genre = row.children[3].innerText;
                    var book_language = row.children[4].innerText;
                    var book_date = row.children[5].innerText;
                    book.name = book_name;
                    book.id = book_id;
                    book.genre = book_genre;
                    book.language = book_language;
                    book.date = book_date;
                    books.push(book);
                    console.log(book);
                }
                console.log(books);
                return books;
            }
            const bookss = fetchBooks();
            var list_book = await bookss;
            var cardwrapper2 = document.createElement("div");
            cardwrapper2.classList.add("card");
            var cardbody2 = document.createElement("div");
            cardbody2.classList.add("card-body");
            var cardheader2 = document.createElement("div");
            cardheader2.classList.add("card-header", "bg-info");
            var cardheaderwrapper2 = document.createElement("h4");
            cardheaderwrapper2.classList.add("m-b-0", "text-white");
            cardheaderwrapper2.innerText = "Recent books";
            var cardicon2 = document.createElement("i");
            cardicon2.classList.add("fas", "fa-book");
            cardicon2.style.marginRight = "10px";
            var cardbodytable2 = document.createElement("table");
            cardbodytable2.classList.add("table");
            var cardbodytablehead2 = document.createElement("thead");
            var cardbodytableheadrow2 = document.createElement("tr");
            var cardbodytableheadrowth21 = document.createElement("th");
            var cardbodytableheadrowth22 = document.createElement("th");
            var cardbodytableheadrowth23 = document.createElement("th");
            var cardbodytableheadrowth24 = document.createElement("th");
            var cardbodytableheadrowth25 = document.createElement("th");
            cardbodytableheadrowth21.style.width = "5%";
            cardbodytableheadrowth22.style.width = "13%";
            cardbodytableheadrowth23.style.width = "15%";
            cardbodytableheadrowth24.style.width = "15%";
            cardbodytableheadrowth25.style.width = "15%";
            cardbodytableheadrowth21.innerText = "#";
            cardbodytableheadrowth22.innerText = "Name";
            cardbodytableheadrowth23.innerText = "Genre";
            cardbodytableheadrowth24.innerText = "Language";
            cardbodytableheadrowth25.innerText = "Date";
            var cardbodytablebody2 = document.createElement("tbody");
            for (var i = 0; i < list_book.length; i++) {
                var cardbodytablebodyrow2 = document.createElement("tr");
                var cardbodytablebodyrowth21 = document.createElement("td");
                var cardbodytablebodyrowth22 = document.createElement("td");
                var cardbodytablebodyrowth23 = document.createElement("td");
                var cardbodytablebodyrowth24 = document.createElement("td");
                var cardbodytablebodyrowth25 = document.createElement("td");
                cardbodytablebodyrowth21.innerText = list_book[i].id;
                cardbodytablebodyrowth22.innerText = list_book[i].name;
                cardbodytablebodyrowth23.innerText = list_book[i].genre;
                cardbodytablebodyrowth24.innerText = list_book[i].language;
                cardbodytablebodyrowth25.innerText = list_book[i].date;
                cardbodytablebodyrow2.appendChild(cardbodytablebodyrowth21);
                cardbodytablebodyrow2.appendChild(cardbodytablebodyrowth22);
                cardbodytablebodyrow2.appendChild(cardbodytablebodyrowth23);
                cardbodytablebodyrow2.appendChild(cardbodytablebodyrowth24);
                cardbodytablebodyrow2.appendChild(cardbodytablebodyrowth25);
                cardbodytablebody2.appendChild(cardbodytablebodyrow2);
            }

            cardbodytableheadrow2.appendChild(cardbodytableheadrowth21);
            cardbodytableheadrow2.appendChild(cardbodytableheadrowth22);
            cardbodytableheadrow2.appendChild(cardbodytableheadrowth23);
            cardbodytableheadrow2.appendChild(cardbodytableheadrowth24);
            cardbodytableheadrow2.appendChild(cardbodytableheadrowth25);
            cardbodytablehead2.appendChild(cardbodytableheadrow2);
            cardbodytable2.appendChild(cardbodytablehead2);
            cardbodytable2.appendChild(cardbodytablebody2);
            cardbody2.appendChild(cardbodytable2);
            cardwrapper2.appendChild(cardheader2);
            cardwrapper2.appendChild(cardbody2);
            cardgroup1.appendChild(cardwrapper2);
            cardheaderwrapper2.prepend(cardicon2);
            cardheader2.appendChild(cardheaderwrapper2);





        }
        homepage();

    }


    console.log("Loaded BetterNilam v" + version)
    load();
    darkmode();
    betterUI();
})();
