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
  .card {
    border-radius: 10px;
    overflow: hidden;
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
darkmode()
