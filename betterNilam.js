var settings = {
  legitMode: true,
  legitModeDelayMin: 10000,
  legitModeDelayMax: 30000,

  // AutoNilam Settings
  autoNilamPreferredGenres: [
    "mystery",
    "fantasy",
    "sci-fi",
    "adventure",
    "cyberpunk",
  ],
  autoNilamLanguages: ["english"],
  autoNilamSeriesMode: true,
};

// AutoNilam Functions

// Send Nilam (universal)
async function sendNilam(
  category,
  language,
  title,
  is_synopsis,
  synopsis,
  author,
  publisher,
  year
) {
  // Get CSRF Key
  async function getKey() {
    try {
      const response = await fetch(
        "https://nilamjohor.edu.my/aktiviti-bacaan/create"
      );
      const data = await response.text();
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, "text/html");
      var key = htmlDoc.getElementsByName("_csrf-frontend")[0];
      return key.value;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = dd + "-" + mm + "-" + yyyy;
    return today;
  }

  return getKey().then((resolvedKey) => {
    statusElement(false, "Sending", title);
    var date = getDate();
    key = resolvedKey;

    return fetch("https://nilamjohor.edu.my/aktiviti-bacaan/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "_csrf-frontend=" +
        key +
        "&AktivitiBacaan[akb_mod_kategori_bahan]=" +
        category +
        "&AktivitiBacaan[akb_mod_kategori_bahasa]=" +
        language +
        "&AktivitiBacaan[akb_mod_judul]=" +
        title +
        "&AktivitiBacaan[akb_mod_tick_sinopsis]=&AktivitiBacaan[akb_mod_tick_sinopsis]=" +
        is_synopsis +
        "&AktivitiBacaan[akb_mod_sinopsis]=" +
        synopsis +
        "&AktivitiBacaan[akb_mod_pengarang]=" +
        author +
        "&AktivitiBacaan[akb_mod_penerbit]=" +
        publisher +
        "&AktivitiBacaan[akb_mod_tahun_terbit]=" +
        year +
        "&AktivitiBacaan[akb_mod_tarikh_baca]=" +
        date,
    }).then((response) => {
      if (response.status == 200) {
        return true;
      } else {
        return false;
      }
    });
  });
}

// Do Nilam (only for AutoNilam)
async function doNilam(json) {
  var pJson = JSON.parse(json);
  var prevBooks = await fetchPastReadBooks();

  var statsPastRead = 0;
  var statsNewRead = 0;
  var statsFailed = 0;
  var statsNewTotal = prevBooks.length;
  for (var i = 0; i < pJson.books.length; i++) {
    var title = pJson.books[i].title;
    var language = pJson.books[i].language;
    var fiction = pJson.books[i].fiction;
    var author = pJson.books[i].author;
    var publisher = pJson.books[i].publisher;
    var synopsis = pJson.books[i].synopsis;
    var year = pJson.books[i].year;
    // detect if repeating title
    if (prevBooks.includes(title)) {
      console.log(`Title ${title} already read, skipping`);
      statusElement(false, "Already read", title);
      statsPastRead += 1;
      continue;
    }

    // convert to id
    if (language.toLowerCase() == "bm") {
      var language = "10";
    } else if (language.toLowerCase() == "english") {
      var language = "20";
    } else {
      console.log(`Language ${language} parsing error, fallback to BM`);
      var language = "10";
    }

    if (fiction == true) {
      var category = "30";
    } else {
      var category = "40";
    }

    if (!(typeof year == "number")) {
      console.log(`Year ${year} not a number, attempting to convert`);
      var tYear = Number(year);
      if (isNaN(tYear)) {
        console.log(`Year ${year} convert error, fallback to 2020`);
        var year = "2020";
      } else {
        console.log(`Year ${year} convert success`);
        var year = tYear;
      }
    }

    function generateRandomTimeout() {
      var min = settings.legitModeDelayMin;
      var max = settings.legitModeDelayMax;
      var timeout = Math.floor(Math.random() * (max - min + 1)) + min;
      return timeout;
    }

    if (settings.legitMode == true) {
      var timeout = generateRandomTimeout();
      console.log(
        `Sending ${title}, ETA ${Math.round(timeout / 1000)} seconds`
      );
      statusElement(false, "Timeout", title, timeout);
      await new Promise((r) => setTimeout(r, timeout));
    }

    var send = await sendNilam(
      category,
      language,
      title,
      "1",
      synopsis,
      author,
      publisher,
      year
    );
    console.log(`Send status: ${send}`);
    if (send == true) {
      statusElement(false, "Success", title);
      statsNewRead += 1;
    }
    if (send == false) {
      statusElement(false, "Error", title);
      statsFailed += 1;
    }
  }

  var stats = {
    status: "done",
    pastRead: statsPastRead,
    newRead: statsNewRead,
    failed: statsFailed,
  };
  return stats;
}

async function processBooks(json) {
  var pJson = JSON.parse(json);

  for (var i = 0; i < pJson.books.length; i++) {
    var title = pJson.books[i].title;
    statusElement(true, "Queued", title);
  }
}

// Status Element
function statusElement(create, status, title, timeout) {
  if (create == true) {
    console.log(`Creating status element for ${title}`);
    var statusElement = document.createElement("div");
    statusElement.style =
      "display: flex; justify-content: space-between; align-items: stretch; padding: 1em; border-radius: 1em; background: #d9edf7;";
    statusElement.id = title;

    var statusTitle = document.createElement("span");
    statusTitle.innerHTML = title;

    var statusStatus = document.createElement("span");
    statusStatus.innerHTML = status;
    statusStatus.id = title + "-status";

    var statusProgress = document.createElement("div");
    statusProgress.className = "progress";
    statusProgress.id = title + "-progress";
    statusProgress.style.width = "40%";
    statusProgress.style.display = "none";

    var statusProgressBar = document.createElement("div");
    statusProgressBar.className =
      "progress-bar progress-bar-striped progress-bar-animated";
    statusProgressBar.id = title + "-progressBar";

    statusElement.appendChild(statusTitle);
    statusElement.appendChild(statusStatus);
    statusElement.appendChild(statusProgress);
    statusProgress.appendChild(statusProgressBar);

    document.getElementById("statusContainer").appendChild(statusElement);
  } else {
    console.log(`Updating status element for ${title}`);
    var statusElement = document.getElementById(title);
    var statusStatus = document.getElementById(title + "-status");
    var statusProgressBar = document.getElementById(title + "-progressBar");
    var statusProgress = document.getElementById(title + "-progress");

    statusStatus.textContent = status;

    if (status == "Queued" || status == "Sending") {
      statusElement.style.background = "#fcf8e3";
    } else if (status == "Already read") {
      statusProgress.remove();
      statusElement.style.background = "#f2dede";
    } else if (status == "Success") {
      statusProgress.remove();
      statusElement.style.background = "#dff0d8";
      statusStatus.style.display = "none";
    } else if (status == "Timeout") {
      statusElement.style.background = "#d9edf7";
      statusProgress.style.display = "flex";
    } else if (status == "Error") {
      statusProgress.remove();
      statusElement.style.background = "#f2dede";
    }

    if (timeout) {
      statusProgressBar.ariaValueMax = timeout / 1000;
      var interval = setInterval(function () {
        if (statusProgress.style.background == "#dff0d8") {
          clearInterval(interval);
        }

        statusProgressBar.ariaValueNow =
          Number(statusProgressBar.ariaValueNow) + 1;
        statusProgressBar.style.width = `${Math.round(
          (statusProgressBar.ariaValueNow / statusProgressBar.ariaValueMax) *
            100
        )}%`;
        statusStatus.textContent = `${status} (${Math.round(
          statusProgressBar.ariaValueNow
        )} / ${Math.round(statusProgressBar.ariaValueMax)})`;
      }, 1000);
    } else {
      clearInterval(interval);
    }
  }
}

// Past Read Books Fetching
function fetchPastReadBooks() {
  var bookList = [];
  return fetch(
    "https://nilamjohor.edu.my/aktiviti-bacaan/index?AktivitiBacaanSearch[pageSize]=10000"
  )
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, "text/html");
      const bookNames = htmlDoc.querySelectorAll('[data-col-seq="3"] b');
      bookNames.forEach((bookName) => {
        bookList.push(bookName.innerText);
      });
    })
    .then(() => {
      return bookList;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Prompt Generation
function generatePrompt(bookCount) {
  return fetchPastReadBooks().then((bookList) => {
    var prompt = `
    Generate a JSON list of random story books {"books":[...content]} with the following criteria: title, language, author, publisher, synopsis, and year of publication (use key year). Generate every book in a random book series if series mode is enabled.
Options:
Desired book count: ${bookCount}
Languages (match the values): ${settings.autoNilamLanguages}
Series mode: ${settings.autoNilamSeriesMode}
Preferred genres: ${settings.autoNilamPreferredGenres}
    `;
    return prompt;
  });
}

// End of AutoNilam Functions


function injectCSS() {
  var css = document.createElement("style");
  css.innerHTML = `:root {
    /* Colors */
    --overlay-color: #afafaf90;
    --secondary-color: #92929290;
    --topbar-color: #12121270;
    --sidebar-color: #12121270;
    --footer-color: #12121250;
    --card-color: #6a6a6a60;
    --card-header-color: #43434360;
    --page-title-color: #12121270;
    --preloader-background: #121212;

    --page-title-text-color: #fff;
    --topbar-text-color: #fff;
    --sidebar-text-color: #fff;
    --footer-text-color: #fff;
    --card-text-color: #fff;
    --card-header-text-color: #fff;
    --overlay-text-color: #fff;
    --secondary-text-color: #fff;
    --hover-color: #03a9f3;

    /* Misc */
    --overlay-blur: 50px;
    --border-radius: 10px;
    --body-background: url("https://i.ibb.co/K6CbnB2/rsz-wp11825066-simple-color-4k-wallpapers.jpg")
}

.topbar {
    background: var(--topbar-color) !important;
    backdrop-filter: blur(var(--overlay-blur));
}

.topbar * {
    color: var(--topbar-text-color);
}

.left-sidebar {
    background: var(--sidebar-color);
    backdrop-filter: blur(var(--overlay-blur));
}

.left-sidebar * {
    color: var(--sidebar-text-color) !important;
}

.left-sidebar *:hover:not(.nav-small-cap) {
    color: var(--hover-color) !important;
}

.page-titles {
    background: var(--page-title-color);
    backdrop-filter: blur(var(--overlay-blur));
}

.page-titles * {
    color: var(--page-title-text-color) !important;
}

.page-wrapper {
    background: transparent;
}

.footer {
    background: var(--footer-color);
    backdrop-filter: blur(var(--overlay-blur));
    border: none;
    color: var(--footer-text-color) !important;
}

.card {
    background: var(--card-color);
    backdrop-filter: blur(var(--overlay-blur));
    border-radius: var(--border-radius);
}

.card * {
    color: var(--card-text-color) !important;
}

.card-header {
    background-color: var(--card-header-color) !important;
    backdrop-filter: blur(var(--overlay-blur));
    border-radius: var(--border-radius) !important;
}

.card-header * {
    color: var(--card-header-text-color) !important;
}

.form-group {
    background: transparent;
}

.form-control {
    background-color: var(--overlay-color) !important;
}

.form-control:disabled, .form-control[readonly] {
    background-color: var(--secondary-color) !important;
    color: var(--secondary-text-color) !important;
}

.form-control:focus {
    background-color: var(--overlay-color) !important;
    color: var(--overlay-text-color) !important;
}

.select2-selection {
    background-color: var(--overlay-color) !important;
}

.select2-selection * {
    color: var(--overlay-text-color) !important;
}

.select2-dropdown, .dropdown-menu {
    background-color: var(--overlay-color) !important;
    backdrop-filter: blur(var(--overlay-blur));
}

.select2-results__option {
    background-color: transparent !important;
}

.select2-results__option[aria-selected=true] {
    background-color: var(--overlay-color) !important;
    color: var(--overlay-text-color) !important;
    backdrop-filter: brightness(1.2);
}

.select2-results__option--highlighted, .dropdown-item:hover, .dropdown-item:focus {
    background-color: var(--secondary-color) !important;
    color: var(--secondary-text-color) !important;
    backdrop-filter: brightness(1.2);
}

.kv-table-header {
    background: var(--overlay-color) !important;
    backdrop-filter: blur(var(--overlay-blur));
}

body {
    background: var(--body-background);
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    color: var(--card-text-color);
}

.mini-sidebar .sidebar-nav #sidebarnav > li:hover > a {
    background: var(--overlay-color) !important;
    backdrop-filter: blur(var(--overlay-blur));
    border-radius: var(--border-radius);
}

.mini-sidebar .sidebar-nav #sidebarnav > li > ul {
    background: var(--overlay-color) !important;
    backdrop-filter: blur(var(--overlay-blur));
}

.preloader {
    background: var(--preloader-background);
}

.feeds li:hover {
    background: var(--overlay-color) !important;
    backdrop-filter: blur(var(--overlay-blur));
    border-radius: var(--border-radius);
}

.site-error {
    color: var(--overlay-text-color) !important;
}

::placeholder {
  filter: brightness(0.7);
}

`;

  document.head.appendChild(css);


}

// GUI Injection for AutoNilam
function injectAutoNilamGUI() {
  // generate prompt section

  var container = document.getElementsByClassName("container-fluid")[0];
  document.getElementsByClassName("site-error")[0].remove();
  document.getElementsByClassName("page-titles")[0].innerHTML = `
  <div class="col-md-5 align-self-center">
  <h4 class="text-themecolor">AutoNilam</h4>
</div>
<div class="col-md-7 align-self-center text-right">
  <div class="d-flex justify-content-end align-items-center"></div>
</div>
  `;

  var autoNilamPromptGUI = document.createElement("div");
  autoNilamPromptGUI.className = "row";
  autoNilamPromptGUI.innerHTML = `
  <div class="col-12">
    <div class="card">
      <div class="card-header bg-info">
        <h4 class="mb-0 text-white">
          <i class="fas fa-message-bot m-r-5"></i> Generate Prompt
        </h4>
      </div>

      <div class="card-body">
        <h3 class="box-title m-t-10"><i class="fas fa-gear"></i> Options</h3>
        <div class="row m-t-20">
          <input
            type="number"
            class="form-control col-5"
            placeholder="Book count"
            id="bookCount"
          />
        </div>
        <div class="row m-t-20">
          <button type="submit" id="submit-btn" class="btn btn-success">
            <i class="fas fa-sparkles"></i> Generate
          </button>
        </div>
        <h3 class="box-title m-t-30">
          <i class="fas fa-align-left"></i> Prompt
        </h3>
        <div class="m-t-20 input-group">
          <textarea
            class="form-control input-group-prepend row"
            readonly=""
            style="overflow: auto; scrollbar-width: thin; height: 5em"
            id="promptOutput"
          ></textarea
          ><a
            class="btn btn-info"
            style="
              color: white;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            "
            id="copy-btn"
            ><i class="fas fa-copy"></i
          ></a>
        </div>
      </div>
    </div>
  </div>
`;

  container.appendChild(autoNilamPromptGUI);

  var submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", function () {
    document.getElementById("promptOutput").value = "Generating prompt...";
    var bookCount = document.getElementById("bookCount").value;
    generatePrompt(bookCount).then((prompt) => {
      document.getElementById("promptOutput").value = prompt;
    });
  });

  var copyBtn = document.getElementById("copy-btn");
  copyBtn.addEventListener("click", function () {
    var copyText = document.getElementById("promptOutput");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
  });

  // autoNilam section
  var autoNilamGUI = document.createElement("div");
  autoNilamGUI.className = "row";
  autoNilamGUI.innerHTML = `
  <div class="col-12">
  <div class="card">
    <div class="card-header bg-info">
      <h4 class="mb-0 text-white">
        <i class="fas fa-sparkles m-r-5"></i> AutoNilam
      </h4>
    </div>

    <div class="card-body" id="cardBody">
      <h3 class="box-title m-t-20"><i class="fas fa-input-text"></i> Input</h3>
      <div class="m-t-20 input-group">
        <textarea
          class="form-control input-group-prepend row"
          style="overflow: auto; scrollbar-width: thin; height: 10em"
          id="JSONInput"
          placeholder="Paste output from chatGPT here"
        ></textarea>
      </div>
      <div class="row m-t-20" style="align-items: center;">
        <button type="submit" id="autoNilam-btn" class="btn btn-success">
          <i class="fas fa-sparkles"></i> AutoNilam
        </button>
        <span class="m-l-10 col" id="autoNilam-status"></span>
      </div>
    </div>
  </div>
</div>

`;

  container.appendChild(autoNilamGUI);

  var autoNilamBtn = document.getElementById("autoNilam-btn");
  autoNilamBtn.addEventListener("click", function () {
    autoNilamBtn.innerHTML = `<i class="fas fa-xmark"></i> Cancel`;
    autoNilamBtn.addEventListener("click", function () {
      location.reload();
    });

    autoNilamPromptGUI.querySelector(".card-body").style.display = "none";
    // status section
    var statusGUI = document.createElement("h3");
    statusGUI.className = "box-title m-t-30";
    statusGUI.innerHTML = `<i class="fas fa-bars-progress"></i> Status`;
    statusGUI.id = "statusHeader";

    var statusGUIContent = document.createElement("div");
    statusGUIContent.id = "statusContainer";
    statusGUIContent.style = "display: flex; gap: 1em; flex-direction: column;";

    document.getElementById("cardBody").appendChild(statusGUI);
    document.getElementById("cardBody").appendChild(statusGUIContent);

    var json = document.getElementById("JSONInput").value;
    document.getElementById("JSONInput").value = "";
    document.getElementById("JSONInput").style.height = "1em";
    document.getElementById("JSONInput").readOnly = true;
    processBooks(json);
    doNilam(json).then((result) => {
      if (result.status == "done") {
        console.log("Done");
        statusGUI.remove();
        statusGUIContent.remove();
        autoNilamPromptGUI.querySelector(".card-body").style.display = "block";
        document.getElementById("JSONInput").style.height = "10em";
        document.getElementById("JSONInput").readOnly = false;
        autoNilamBtn.innerHTML = `<i class="fas fa-check"></i> Done!`;
        document.getElementById(
          "autoNilam-status"
        ).innerHTML = `${result.newRead} new books read, ${result.pastRead} books already read, ${result.failed} books failed.`;
        setTimeout(function () {
          autoNilamBtn.innerHTML = `<i class="fas fa-sparkles"></i> AutoNilam`;
        }, 2000);
      }
    });
  });
}

// NiceNilam Functions
function injectNiceNilamGUI() {
  var container = document.getElementsByClassName("container-fluid")[0];
  document.getElementsByClassName("site-error")[0].remove();
  document.getElementsByClassName("page-titles")[0].innerHTML = `
  <div class="col-md-5 align-self-center">
  <h4 class="text-themecolor">BetterNilam</h4>
</div>
<div class="col-md-7 align-self-center text-right">
  <div class="d-flex justify-content-end align-items-center"></div>
</div>
  `;
  var niceNilamGUI = document.createElement("div");
  niceNilamGUI.innerHTML = `
  <div class="card">
  <div class="card-header bg-info">
    <h4 class="mb-0 text-white">
      <i class="fas fa-palette m-r-5"></i> NiceNilam
    </h4>
  </div>

  <div class="card-body">
    <form
      id="aktiviti-form-vertical-"
      class="form-vertical kv-form-bs4"
      action="/aktiviti-bacaan/create"
      method="post"
      role="form"
    >
      <h3 class="box-title m-t-10">Themes</h3>
      <hr class="m-t-0 m-b-0" />

      <div class="row m-t-20">
        <div class="col-md-6">
          <div
            class="form-group highlight-addon field-aktivitibacaan-akb_mod_kategori_bahan required"
          >
            <label class="has-star" for="aktivitibacaan-akb_mod_kategori_bahan"
              >Themes</label
            >

            <div class="dropdown dropright">
              <button
                type="button"
                class="btn btn-primary dropdown-toggle"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                Select theme
              </button>
              <div class="dropdown-menu" style="">
                <span class="dropdown-header" href="#">Preset themes </span>
                <a class="dropdown-item" id="theme-default">None</a>
                <a class="dropdown-item" id="theme-dark">Dark Mode</a>
                <span class="dropdown-header">Custom themes </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 class="box-title m-t-30">Customize</h3>
      <small>Don't know how to use this? <a href="#">Click here</a> </small>
      <hr class="m-t-0 m-b-20" />

      <div class="row">
        <div class="col-md-6"></div>
      </div>

      <h3 class="m-t-10">Theme</h3>
      <div class="m-t-20 row">
        <div class="form-group col">
          <h4>Theme Name</h4>
          <input
            type="text"
            class="form-control"
            id="theme-name"
            placeholder="Value
    "
          />
        </div>
      </div>
      <h3 class="m-t-10">Main</h3>
      <div class="m-t-20 row">
        <div class="form-group col">
          <h4>Background</h4>
          <input type="text" class="form-control" id="bg" placeholder="Value" />
        </div>
        <div class="form-group col">
          <h4>Overlay blur</h4>
          <input
            type="text"
            class="form-control"
            id="overlay-blur"
            placeholder="Value (0px to disable)"
          />
        </div>
        <div class="form-group col">
          <h4>Border radius</h4>
          <input
            type="text"
            class="form-control"
            id="border-radius"
            placeholder="Value (0px to disable)"
          />
        </div>
      </div>
      <h3 class="m-t-10">Elements</h3>
      <div class="m-t-20 row">
        <div class="form-group col">
          <h4>Overlay</h4>
          <input
            type="text"
            class="form-control"
            id="bg-overlay"
            placeholder="Background color"
          /><input
            type="text"
            class="form-control"
            id="txt-overlay"
            placeholder="Text color"
          />
        </div>
        <div class="form-group col">
          <h4>Secondary</h4>
          <input
            type="text"
            class="form-control"
            id="bg-secondary"
            placeholder="Background color"
          /><input
            type="text"
            class="form-control"
            id="txt-secondary"
            placeholder="Text color"
          />
        </div>
        <div class="form-group col">
          <h4>Topbar</h4>
          <input
            type="text"
            class="form-control"
            id="bg-topbar"
            placeholder="Background color"
          /><input
            type="text"
            class="form-control"
            id="txt-topbar"
            placeholder="Text color"
          />
        </div>
        <div class="form-group col">
          <h4>Sidebar</h4>
          <input
            type="text"
            class="form-control"
            id="bg-sidebar"
            placeholder="Background color"
          /><input
            type="text"
            class="form-control"
            id="txt-sidebar"
            placeholder="Text color"
          />
        </div>
        <div class="form-group col">
          <h4>Footer</h4>
          <input
            type="text"
            class="form-control"
            id="bg-footer"
            placeholder="Background color"
          /><input
            type="text"
            class="form-control"
            id="txt-footer"
            placeholder="Text color"
          />
        </div>
        <div class="form-group col">
          <h4>Card</h4>
          <input
            type="text"
            class="form-control"
            id="bg-card"
            placeholder="Background color"
          /><input
            type="text"
            class="form-control"
            id="txt-card"
            placeholder="Text color"
          />
        </div>
        <div class="form-group col">
          <h4>Page title</h4>
          <input
            type="text"
            class="form-control"
            id="bg-page-title"
            placeholder="Background color"
          /><input
            type="text"
            class="form-control"
            id="txt-page-title"
            placeholder="Text color"
          />
        </div>
        <div class="form-group col">
          <h4>Card header</h4>
          <input
            type="text"
            class="form-control"
            id="bg-card-header"
            placeholder="Background color"
          /><input
            type="text"
            class="form-control"
            id="txt-card-header"
            placeholder="Text color"
          />
        </div>
        <div class="form-group col">
          <h4>Preloader</h4>
          <input
            type="text"
            class="form-control"
            id="bg-preloader"
            placeholder="Background color"
          />
        </div>
      </div>
      <div class="form-actions m-t-30">
        <button type="submit" id="apply-btn" class="btn btn-success">
          <i class="fas fa-check"></i> Apply
        </button>
        <button type="reset" class="btn btn-inverse">Reset</button>
      </div>
    </form>
  </div>
</div>

`;

  container.appendChild(niceNilamGUI);

}

// Site Detection
function detectSite() {
  var url = window.location.href;
  if (url == "https://nilamjohor.edu.my/auto-nilam") {
    return "auto-nilam";
  }
  if (url == "https://nilamjohor.edu.my/auto-nilam/settings") {
    return "auto-nilam-settings";
  }
  if (url == "https://nilamjohor.edu.my/nice-nilam") {
    return "nice-nilam";
  }
  if (url == "https://nilamjohor.edu.my/aktiviti-bacaan/create") {
    return "create";
  }
}

// GUI Injections
function injectSidebar() {
  var fontAwesome = document.createElement("link");
  fontAwesome.setAttribute("rel", "stylesheet");
  fontAwesome.setAttribute(
    "href",
    "https://site-assets.fontawesome.com/releases/v6.5.1/css/all.css"
  );

  var sidebar = document.getElementById("sidebarnav");

  var autoNilamSidebarClass = document.createElement("li");
  autoNilamSidebarClass.className = "nav-small-cap pt-2";
  autoNilamSidebarClass.innerHTML = "--- AutoNilam";

  var autoNilamSettingsSidebar = document.createElement("li");

  var autoNilamSettingsSidebarLink = document.createElement("a");
  autoNilamSettingsSidebarLink.setAttribute("href", "/auto-nilam/settings");
  autoNilamSettingsSidebarLink.className = "waves-effect waves-dark";

  var autoNilamSettingsSidebarIcon = document.createElement("i");
  autoNilamSettingsSidebarIcon.className = "fa-regular fa-cog";

  var autoNilamSettingsSidebarText = document.createElement("span");
  autoNilamSettingsSidebarText.innerHTML = " AutoNilam Settings ";
  autoNilamSettingsSidebarText.className = "hide-menu";

  var autoNilamSidebar = document.createElement("li");

  var autoNilamSidebarLink = document.createElement("a");
  autoNilamSidebarLink.setAttribute("href", "/auto-nilam");
  autoNilamSidebarLink.className = "waves-effect waves-dark";

  var autoNilamSidebarIcon = document.createElement("i");
  autoNilamSidebarIcon.className = "fa-regular fa-bolt";

  var autoNilamSidebarText = document.createElement("span");
  autoNilamSidebarText.innerHTML = " AutoNilam ";
  autoNilamSidebarText.className = "hide-menu";

  var betterNilamSidebarClass = document.createElement("li");
  betterNilamSidebarClass.className = "nav-small-cap pt-2";
  betterNilamSidebarClass.innerHTML = "--- NiceNilam";

  var betterNilamSidebar = document.createElement("li");

  var betterNilamSidebarLink = document.createElement("a");
  betterNilamSidebarLink.setAttribute("href", "/nice-nilam");

  var betterNilamSidebarIcon = document.createElement("i");
  betterNilamSidebarIcon.className = "fa-regular fa-sparkles";

  var betterNilamSidebarText = document.createElement("span");
  betterNilamSidebarText.innerHTML = " NiceNilam ";
  betterNilamSidebarText.className = "hide-menu";

  autoNilamSidebarLink.appendChild(autoNilamSidebarIcon);
  autoNilamSidebarLink.appendChild(autoNilamSidebarText);
  autoNilamSidebar.appendChild(autoNilamSidebarLink);
  sidebar.appendChild(autoNilamSidebarClass);
  sidebar.appendChild(autoNilamSidebar);

  autoNilamSettingsSidebarLink.appendChild(autoNilamSettingsSidebarIcon);
  autoNilamSettingsSidebarLink.appendChild(autoNilamSettingsSidebarText);
  autoNilamSettingsSidebar.appendChild(autoNilamSettingsSidebarLink);
  sidebar.appendChild(autoNilamSettingsSidebar);

  betterNilamSidebarLink.appendChild(betterNilamSidebarIcon);
  betterNilamSidebarLink.appendChild(betterNilamSidebarText);
  betterNilamSidebar.appendChild(betterNilamSidebarLink);
  sidebar.appendChild(betterNilamSidebarClass);
  sidebar.appendChild(betterNilamSidebar);

  document.head.appendChild(fontAwesome);
}

if (detectSite() == "auto-nilam") {
  injectAutoNilamGUI();
} else if (detectSite() == "nice-nilam") {
  injectNiceNilamGUI();
}

injectSidebar();
injectCSS();
