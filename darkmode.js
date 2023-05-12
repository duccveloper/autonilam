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
    color: #fff;
  }
  .page-titles .breadcrumb li a {
    color: #fff;
  }
  .card-body {
    background-color: #393939;
  }
  .bg-info {
    background-color: #2F2F2F;
  }
  .form-body {
    color: #fff;
  }
  label {
    color: #b9b9b9;
  }
  .select2-container--krajee-bs4 .select2-selection {
    background-color: transparent;
  }
  .select2-container--krajee-bs4 .select2-results__option[aria-selected] {
    background-color: #2f2f2f;
    color: #fff;
  }
  .select2-container--krajee-bs4 .select2-selection--single .select2-selection__arrow {
    border-left: none;
  }
  .form-control {
    background-color: transparent !important;
    color: #fff;
  }
  .select2-container--krajee-bs4 .select2-results__option--highlighted[aria-selected] {
    color: #01b7ff;
  }
  .select2-container--krajee-bs4 .select2-selection__clear {
    color: #fff;
    text-shadow: none;
    line-height: normal;
  }
  .select2-container--krajee-bs4 .select2-selection--single .select2-selection__rendered {
    color: #fff;
  }
  .card {
    border-radius: 10px;
    overflow: hidden;
  }
  .form-control:focus {
    background-color: #2f2f2f;
    color: #fff;
  }
  .was-validated .custom-control-input:valid ~ .custom-control-label, .custom-control-input.is-valid ~ .custom-control-label {
    color: #fff;
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
    color: #fff;
  }
  .custom-control-label {
    color: #fff !important;
  }
  .datepicker-days {
    color: #fff;
  }
  .day:not(.active):hover, .prev:hover, .next:hover, .datepicker-switch:hover {
    background-color: #262626 !important;
  }
  .btn {
    color: #fff !important;
  }
  .left-sidebar {
    background-color: #2f2f2f;
  }
  [class^="ti-"], [class*=" ti-"] {
    color: #fff;
  }
  .footer {
    background-color: #393939;
    color: #fff;
  }
  .page-wrapper {
    background-color: #121212 !important;
    color: #fff;
  }
  hr {
    background-color: #fff;
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
  color: #fff;
}
.dropdown-item:hover {
  background-color: #2f2f2f;
  color: #fff;
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
  color: #fff !important;
}
.kv-table-header {
  background: transparent !important;
}
.btn-group > a {
  background-color: #2f2f2f !important;
}
.table-success {
  color: #000 !important;
}
.raphael-group-95-caption > text, .raphael-group-14-caption > text {
  fill: #fff;
}
.raphael-group-260-dataset-axis > text, .raphael-group-241-dataset-axis > text {
  fill: gray;
}
.raphael-group-144-labels > path, .raphael-group-66-labels > path {
  stroke: gray;
}
table {
  color: #fff !important;
}
.kv-grid-bs4 > div:last-child {
  background-color: transparent !important;
}
option {
  background-color: #262626 !important;
}
span.input-group-text {
  background-color: transparent !important;
}
  `;
  document.head.appendChild(style);
  if (window.location.href.indexOf("https://nilamjohor.edu.my/aktiviti-bacaan/index") > -1) {
    var btn = document.getElementsByClassName("m-l-0")[0];
    var icon = btn.getElementsByTagName("i")[0];
    icon.classList.remove("fas", "fa-search-minus");
    icon.classList.add("fa-solid", "fa-rotate-right");
    var btn = document.getElementsByClassName("btn-group")[0];
    var btn2 = btn.children[0];
    var icon = btn2.getElementsByTagName("i")[0];
    icon.classList.remove("fas", "fa-search-plus");
    icon.classList.add("fa-solid", "fa-magnifying-glass");
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
