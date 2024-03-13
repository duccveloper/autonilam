// THIS IS INDIVIDUAL SCRIPT
// This can work alone without source.js (just paste in console every page change lol)
// Author: ducc

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

// Book Processing (for status)
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

// GUI Injection
async function inject(type, arg) {
  var container = document.getElementsByClassName("container-fluid")[0];

  function replace404(text) {
    document.getElementsByClassName("site-error")[0].remove();
    document.getElementsByClassName("page-titles")[0].innerHTML = `
  <div class="col-md-5 align-self-center">
  <h4 class="text-themecolor">${text}</h4>
</div>
<div class="col-md-7 align-self-center text-right">
  <div class="d-flex justify-content-end align-items-center"></div>
</div>
  `;
  }

  // AutoNilam
  if (type == "AutoNilam") {
    replace404("AutoNilam");

    // generate prompt section
    var autoNilamPromptGUI = document.createElement("div");
    autoNilamPromptGUI.className = "row";
    autoNilamPromptGUI.innerHTML = await webFetch("AutoNilam-prompt");

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
    autoNilamGUI.innerHTML = await webFetch("AutoNilam-main");

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
      statusGUIContent.style =
        "display: flex; gap: 1em; flex-direction: column;";

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
          autoNilamPromptGUI.querySelector(".card-body").style.display =
            "block";
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

  // Sidebar
  if (type == "Sidebar") {
    var fontAwesome = document.createElement("link");
    fontAwesome.setAttribute("rel", "stylesheet");
    fontAwesome.setAttribute(
      "href",
      "https://site-assets.fontawesome.com/releases/v6.5.1/css/all.css"
    );

    var coloris = document.createElement("link");
    coloris.setAttribute("rel", "stylesheet");
    coloris.setAttribute(
      "href",
      "https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.css"
    );

    var colorisJS = document.createElement("script");
    colorisJS.setAttribute(
      "src",
      "https://cdn.jsdelivr.net/gh/du-cc/Coloris@main/src/coloris.js"
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


    autoNilamSidebarLink.appendChild(autoNilamSidebarIcon);
    autoNilamSidebarLink.appendChild(autoNilamSidebarText);
    autoNilamSidebar.appendChild(autoNilamSidebarLink);
    sidebar.appendChild(autoNilamSidebarClass);
    sidebar.appendChild(autoNilamSidebar);

    autoNilamSettingsSidebarLink.appendChild(autoNilamSettingsSidebarIcon);
    autoNilamSettingsSidebarLink.appendChild(autoNilamSettingsSidebarText);
    autoNilamSettingsSidebar.appendChild(autoNilamSettingsSidebarLink);
    sidebar.appendChild(autoNilamSettingsSidebar);

    document.head.appendChild(fontAwesome);
    document.head.appendChild(coloris);
    document.head.appendChild(colorisJS);
  }

  // CSS
  if (type == "CSS") {
    var setting = arg;
    if (arg == "default") {
      if (document.getElementById("NiceNilam-css")) {
        document.getElementById("NiceNilam-css").remove();
      }
      return true;
    }

    if (!document.getElementById("NiceNilam-css")) {
      var css = document.createElement("style");
      css.id = "NiceNilam-css";
    } else {
      var css = document.getElementById("NiceNilam-css");
    }

    Object.keys(arg).forEach((key) => {
      if (setting[key] == "") {
        var oldSetting = JSON.parse(data("get", "theme"));
        setting[key] = oldSetting[key];
      }
    });

    if (setting["txt-primary"] !== "unset") {
      Object.keys(setting).forEach((key) => {
        if (key.includes("txt-")) {
          setting[key] = setting["txt-primary"];
        }
      });
    }

    var cssText = await webFetch("css");
    Object.keys(setting).forEach(key => {
      const regex = new RegExp(`\\$\\{setting\\["${key}"\\]\\}`, 'g');
      cssText = cssText.replace(regex, setting[key]);
    });

    css.innerHTML = cssText;

    if (!document.getElementById("NiceNilam-css")) {
      document.head.appendChild(css);
    }

    return true;
  }
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

async function webFetch(type) {
  if (type == "AutoNilam-prompt") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/elements/autoNilam-prompt.html"
    )
      .then((response) => response.text())
      .then((data) => {
        return data;
      });
  }
  if (type == "AutoNilam-main") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/elements/autoNilam-main.html"
    )
      .then((response) => response.text())
      .then((data) => {
        return data;
      });
  }
  if (type == "NiceNilam") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/elements/niceNilam.html"
    )
      .then((response) => response.text())
      .then((data) => {
        return data;
      });
  }
  if (type == "css") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/elements/niceNilam.css"
    )
      .then((response) => response.text())
      .then((data) => {
        return data;
      });
  }
  if (type == "theme-dark") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/themes/default-dark.json"
    )
      .then((response) => response.text())
      .then((data) => {
        return data;
      });
  }
}
inject("Sidebar");
if (detectSite() == "auto-nilam") {
  inject("AutoNilam");
}
