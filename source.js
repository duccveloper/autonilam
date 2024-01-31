var defaultSettings = {
  EzNilam: {
    enabled: true,
    synopsis: false,
    defaultSynopsis: "This book is about ${title} written by ${author}.",
    defaultLanguage: "English",
    defaultFiction: true,
  },
  NiceNilam: {
    enabled: true,
  },
  AutoLogin: {
    enabled: true,
    username: "",
    password: "",
  },
  devMode: true,
};

// Main
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
      log("Error", "sendNilam", "getKey error:", error);
    }
  }

  function getDate() {
    log("Info", "sendNilam", "Getting date...");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = dd + "-" + mm + "-" + yyyy;
    return today;
  }

  log(
    "Info",
    "sendNilam",
    `Received data: Title: ${title}, Author: ${author}, Publisher: ${publisher}, Year: ${year}, Synopsis: ${synopsis}, is_synopsis: ${is_synopsis}, Category: ${category}, Language: ${language}`
  );
  log("Info", "sendNilam", "Getting CSRF Key...");

  return getKey().then((resolvedKey) => {
    log("Info", "sendNilam", "CSRF Key received.");
    var date = getDate();
    key = resolvedKey;
    log("Info", "sendNilam", "Sending data...");
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
        log("Success", "sendNilam", "Book sent.");
        return true;
      } else {
        log("Error", "sendNilam", "Book not sent.");
        return false;
      }
    });
  });
}

// AutoLogin
function autoLogin() {
  var username = settings("get", "AutoLogin", "username");
  var password = settings("get", "AutoLogin", "password");

  document.getElementById("loginform-username").value = username;
  document.getElementById("loginform-password").value = password;
  document.getElementById("loginform").submit();
  log("Success", "autoLogin", "Logged in.");
}

// Data Management
function data(action, key, value) {
  log(
    "Info",
    "data",
    `Received data: Action: ${action}, Key: ${key}, Value: ${value}`
  );
  if (action == "set") {
    document.cookie = `${key}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    log("Success", "data", `Set ${key} to ${value}`);
    return true;
  }
  if (action == "get") {
    var cookies = document.cookie.split(";");
    var cookie = cookies.find((cookie) => cookie.includes(key));
    if (cookie) {
      var value = cookie.split("=")[1];
      log("Success", "data", `Get ${key}: ${value}`);
      return value;
    } else {
      log("Info", "data", `Get ${key}: Not found`);
      return false;
    }
  }
  if (action == "delete") {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    log("Success", "data", `Deleted ${key}`);
    return true;
  }
}

// Setting Management
function settings(action, type, key, value) {
  log(
    "Info",
    "settings",
    `Received data: Action: ${action}, Type: ${type}, Key: ${key}, Value: ${value}`
  );
  if (action == "set") {
    var BetterNilam = JSON.parse(data("get", "BetterNilam"));
    BetterNilam[type][key] = value;
    data("set", "BetterNilam", JSON.stringify(BetterNilam));
    log("Success", "settings", `Set ${type} ${key} to ${value}`);
    return true;
  }
  if (action == "setRoot") {
    var BetterNilam = JSON.parse(data("get", "BetterNilam"));
    BetterNilam[type] = value;
    data("set", "BetterNilam", JSON.stringify(BetterNilam));
    log("Success", "settings", `Set ${type} to ${value}`);
    return true;
  }
  if (action == "get") {
    var BetterNilam = JSON.parse(data("get", "BetterNilam"));
    log("Success", "settings", `Get ${type} ${key}: ${BetterNilam[type][key]}`);
    return BetterNilam[type][key];
  }
  if (action == "getRoot") {
    var BetterNilam = JSON.parse(data("get", "BetterNilam"));
    log("Success", "settings", `Get ${type}: ${BetterNilam[type]}`);
    return BetterNilam[type];
  }
}

// Web Fetching
async function webFetch(type) {
  log("Info", "webFetch", `Received data: Type: ${type}`);
  if (type == "NiceNilam") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/elements/niceNilam.html"
    )
      .then((response) => response.text())
      .then((data) => {
        log("Success", "webFetch", "NiceNilam fetched.");
        return data;
      });
  }
  if (type == "css") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/elements/niceNilam.css"
    )
      .then((response) => response.text())
      .then((data) => {
        log("Success", "webFetch", "CSS fetched.");
        return data;
      });
  }
  if (type == "theme-dark") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/themes/default-dark.json"
    )
      .then((response) => response.text())
      .then((data) => {
        log("Success", "webFetch", "Dark theme fetched.");
        return data;
      });
  }
  if (type == "theme-default") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/themes/default.json"
    )
      .then((response) => response.text())
      .then((data) => {
        log("Success", "webFetch", "Default theme fetched.");
        return data;
      });
  }
  if (type == "ezNilam") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/elements/ezNilam.html"
    )
      .then((response) => response.text())
      .then((data) => {
        log("Success", "webFetch", "EzNilam fetched.");
        return data;
      });
  }
  if (type == "settings") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/elements/settings.html"
    )
      .then((response) => response.text())
      .then((data) => {
        log("Success", "webFetch", "Settings fetched.");
        return data;
      });
  }
  if (type == "version") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/version.json"
    )
      .then((response) => response.text())
      .then((data) => {
        log("Success", "webFetch", "Version fetched.");
        return data;
      });
  }
  if (type == "betterNilam") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/elements/betterNilam.html"
    )
      .then((response) => response.text())
      .then((data) => {
        log("Success", "webFetch", "BetterNilam fetched.");
        return data;
      });
  }
  if (type == "NiceNilam-guide") {
    return fetch(
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/elements/niceNilam-guide.html"
    )
      .then((response) => response.text())
      .then((data) => {
        log("Success", "webFetch", "NiceNilam guide fetched.");
        return data;
      });
  }

  log("Error", "webFetch", "Type not found.");
  return false;
}

// GUI Injection
async function inject(type, arg) {
  log(
    "Info",
    "inject",
    `Received data: Type: ${type}, Arg: ${JSON.stringify(arg)}`
  );

  var container = document.getElementsByClassName("container-fluid")[0];

  function replace404(text) {
    log("Info", "inject", `Replacing 404 with ${text}`);
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

  // NiceNilam
  if (type == "niceNilam") {
    log("Info", "inject", "Injecting NiceNilam...");
    checkColoris();

    var style = document.createElement("style");
    style.innerHTML = `
  .clr-field button {
    height: 22px !important;
    width: 22px !important;
    border-radius: 50% !important;
    margin-right: 6px !important;
    margin-top: 2px !important;
    color: inherit !important;
  }
    `;
    document.head.appendChild(style);

    replace404("NiceNilam");

    var niceNilamGUI = document.createElement("div");

    log("Info", "inject", "Fetching NiceNilam GUI...");
    niceNilamGUI.innerHTML = await webFetch("NiceNilam");

    container.appendChild(niceNilamGUI);

    var customThemeBtn = document.getElementById("pTheme-custom");
    if (data("get", "customTheme") !== false) {
      log("Info", "NiceNilam", "Custom theme found.");
      customThemeBtn.disabled = false;

      customThemeBtn.addEventListener("click", function () {
        log(
          "Info",
          "NiceNilam",
          `Custom theme applying... ${data("get", "customTheme")}`
        );
        var customSetting = JSON.parse(data("get", "customTheme"));
        loadInput(customSetting);
        theme("apply", customSetting);

        var status = document.getElementById("theme-status");
        status.innerHTML = "Custom theme applied.";
        log("Success", "NiceNilam", "Custom theme applied.");
      });
    }

    var actionBtns = document.querySelectorAll(".btn-action");

    log("Info", "NiceNilam", "Adding event listener to action buttons...");
    actionBtns.forEach((btn) => {
      btn.addEventListener("click", function (event) {
        var target = event.target.id;
        event.preventDefault();
        var inputs = document.getElementsByTagName("input");
        var newSetting = {};
        for (var i = 0; i < inputs.length; i++) {
          newSetting[inputs[i].id] = inputs[i].value;
        }
        if (target == "preview-btn") {
          log("Info", "NiceNilam", "Previewing...");
          theme("preview", newSetting);
        } else if (target == "apply-btn") {
          log("Info", "NiceNilam", "Applying...");
          newSetting["preset"] = false;
          theme("apply", newSetting);
        }
      });
    });

    var defaultBtn = document.getElementById("pTheme-default");

    defaultBtn.addEventListener("click", function () {
      log("Info", "NiceNilam", "Default theme applying...");
      inject("CSS", "default");
      data("delete", "theme");

      var inputs = document.getElementsByTagName("input");
      for (var i = 0; i < inputs.length; i++) {
        log("Info", "NiceNilam", "Setting inputs...");
        inputs[i].value = "";
        document
          .querySelector(`#${inputs[i].id}`)
          .dispatchEvent(new Event("input", { bubbles: true }));
      }

      var status = document.getElementById("theme-status");
      status.innerHTML = "NiceNilam disabled, default theme applied.";
      log(
        "Success",
        "NiceNilam",
        "NiceNilam disabled (not hidden in sidebar), default theme applied."
      );
    });

    var defaultDarkBtn = document.getElementById("pTheme-dark");

    defaultDarkBtn.addEventListener("click", function () {
      log("Info", "NiceNilam", "Dark theme applying...");
      webFetch("theme-dark").then((darkSetting) => {
        darkSetting = JSON.parse(darkSetting);
        loadInput(darkSetting);
        theme("apply", darkSetting);
        var status = document.getElementById("theme-status");
        status.innerHTML = "Dark theme applied.";
        log("Success", "NiceNilam", "Dark theme applied.");
      });
    });

    function loadInput(setting) {
      log("Info", "NiceNilam", `Loading inputs with ${setting}`);
      var inputs = document.getElementsByTagName("input");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = setting[inputs[i].id];
        document
          .querySelector(`#${inputs[i].id}`)
          .dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
    var exportBtn = document.getElementById("theme-export");
    var status = document.getElementById("themeMgmt-status");

    exportBtn.addEventListener("click", function () {
      log("Info", "NiceNilam", "Exporting...");
      var exportSetting = JSON.parse(data("get", "customTheme"));
      if (exportSetting == false) {
        log("Error", "NiceNilam", "No custom theme found.");
        status.innerHTML = "No custom theme found.";
        return false;
      }
      var json = JSON.stringify(exportSetting);
      var blob = new Blob([json], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "NiceNilam-theme.json";
      a.click();
      status.innerHTML = "Theme exported.";
      log("Success", "NiceNilam", "Theme exported.");
    });

    var importBtn = document.getElementById("theme-import");
    importBtn.addEventListener("click", function () {
      log("Info", "NiceNilam", "Importing...");
      var input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.click();
      input.addEventListener("change", function () {
        var file = input.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
          var importSetting = JSON.parse(e.target.result);
          theme("preview", importSetting);
          loadInput(importSetting);
          status.innerHTML = "Theme imported, click apply to save.";
          log("Success", "NiceNilam", "Theme imported.");
        };
        reader.readAsText(file);
      });
    });
    log("Success", "inject", "NiceNilam injected.");
    return true;
  }

  // Sidebar
  if (type == "sidebar") {
    log("Info", "inject", "Injecting sidebar...");
    // Addons
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

    document.head.appendChild(fontAwesome);
    document.head.appendChild(coloris);
    document.head.appendChild(colorisJS);

    var sidebar = document.getElementById("sidebarnav");

    var betterNilamSidebarClass = document.createElement("li");
    betterNilamSidebarClass.className = "nav-small-cap pt-2";
    betterNilamSidebarClass.innerHTML = "--- BetterNilam";

    var niceNilamSidebar = document.createElement("li");

    var niceNilamSidebarLink = document.createElement("a");
    niceNilamSidebarLink.setAttribute("href", "/nice-nilam");

    var niceNilamSidebarIcon = document.createElement("i");
    niceNilamSidebarIcon.className = "fa-regular fa-sparkles";

    var niceNilamSidebarText = document.createElement("span");
    niceNilamSidebarText.innerHTML = " NiceNilam ";
    niceNilamSidebarText.className = "hide-menu";

    var ezNilamSidebar = document.createElement("li");

    var ezNilamSidebarLink = document.createElement("a");
    ezNilamSidebarLink.setAttribute("href", "/ez-nilam");

    var ezNilamSidebarIcon = document.createElement("i");
    ezNilamSidebarIcon.className = "fa-regular fa-book";

    var ezNilamSidebarText = document.createElement("span");
    ezNilamSidebarText.innerHTML = " EzNilam ";
    ezNilamSidebarText.className = "hide-menu";

    var settingSidebar = document.createElement("li");

    var settingSidebarLink = document.createElement("a");
    settingSidebarLink.setAttribute("href", "/better-nilam/setting");

    var settingSidebarIcon = document.createElement("i");
    settingSidebarIcon.className = "fa-regular fa-cog";

    var settingSidebarText = document.createElement("span");
    settingSidebarText.innerHTML = " Settings ";
    settingSidebarText.className = "hide-menu";

    var betterNilamSidebar = document.createElement("li");

    var betterNilamSidebarLink = document.createElement("a");
    betterNilamSidebarLink.setAttribute("href", "/better-nilam");

    var betterNilamSidebarIcon = document.createElement("img");
    betterNilamSidebarIcon.src =
      "https://raw.githubusercontent.com/du-cc/BetterNilam/main/icons/icon.svg";
    betterNilamSidebarIcon.style.width = "25px";
    betterNilamSidebarIcon.style.height = "20px";
    betterNilamSidebarIcon.style.marginRight = "10px";
    betterNilamSidebarIcon.style.marginLeft = "-7px";

    var betterNilamSidebarText = document.createElement("span");
    betterNilamSidebarText.innerHTML = " About BetterNilam ";
    betterNilamSidebarText.className = "hide-menu";

    if (settings("get", "NiceNilam", "enabled") == true) {
      log(
        "Info",
        "inject",
        "NiceNilam enabled. Injecting NiceNilam sidebar..."
      );
      niceNilamSidebarLink.appendChild(niceNilamSidebarIcon);
      niceNilamSidebarLink.appendChild(niceNilamSidebarText);
      niceNilamSidebar.appendChild(niceNilamSidebarLink);
      sidebar.appendChild(betterNilamSidebarClass);
      sidebar.appendChild(niceNilamSidebar);
    } else {
      sidebar.appendChild(betterNilamSidebarClass);
    }

    if (settings("get", "EzNilam", "enabled") == true) {
      log("Info", "inject", "EzNilam enabled. Injecting EzNilam sidebar...");
      ezNilamSidebarLink.appendChild(ezNilamSidebarIcon);
      ezNilamSidebarLink.appendChild(ezNilamSidebarText);
      ezNilamSidebar.appendChild(ezNilamSidebarLink);
      sidebar.appendChild(ezNilamSidebar);
    }

    settingSidebarLink.appendChild(settingSidebarIcon);
    settingSidebarLink.appendChild(settingSidebarText);
    settingSidebar.appendChild(settingSidebarLink);
    sidebar.appendChild(settingSidebar);

    betterNilamSidebarLink.appendChild(betterNilamSidebarIcon);
    betterNilamSidebarLink.appendChild(betterNilamSidebarText);
    betterNilamSidebar.appendChild(betterNilamSidebarLink);
    sidebar.appendChild(betterNilamSidebar);

    log("Success", "inject", "Sidebar injected.");

    return true;
  }

  // CSS
  if (type == "CSS") {
    log("Info", "inject", "Injecting CSS...");
    var setting = arg;
    if (arg == "default") {
      log("Info", "CSS", "Default theme applied.");
      if (document.getElementById("NiceNilam-css")) {
        document.getElementById("NiceNilam-css").remove();
      }
      return true;
    }

    if (!document.getElementById("NiceNilam-css")) {
      log("Info", "CSS", "NiceNilam CSS not found. Creating...");
      var css = document.createElement("style");
      css.id = "NiceNilam-css";
    } else {
      log("Info", "CSS", "NiceNilam CSS found. Updating...");
      var css = document.getElementById("NiceNilam-css");
    }

    log("Info", "inject", "Fetching CSS...");
    var cssText = await webFetch("css");

    log("Info", "inject", "Replacing variables...");
    Object.keys(setting).forEach((key) => {
      const regex = new RegExp(`\\$\\{setting\\["${key}"\\]\\}`, "g");
      cssText = cssText.replace(regex, setting[key]);
    });

    css.innerHTML = cssText;

    if (!document.getElementById("NiceNilam-css")) {
      document.head.appendChild(css);
    }

    log("Success", "inject", "CSS injected.");
    return true;
  }

  // ezNilam
  if (type == "ezNilam") {
    log("Info", "inject", "Injecting EzNilam...");
    replace404("EzNilam");

    var ezNilamGUI = document.createElement("div");

    log("Info", "inject", "Fetching EzNilam...");
    ezNilamGUI.innerHTML = await webFetch("ezNilam");

    container.appendChild(ezNilamGUI);

    if (settings("get", "EzNilam", "synopsis") == false) {
      log("Info", "EzNilam", "Synopsis disabled, container hidden.");
      document.getElementById("sypnosisContainer").style.display = "none";
    }

    var sendBtn = document.getElementById("send");

    sendBtn.addEventListener("click", function () {
      log("Info", "EzNilam", "Sending...");
      if (document.getElementById("title").value == "") {
        log("Error", "EzNilam", "Title is empty.");
        document.getElementById("status").innerHTML = "Title is empty!";
        clearInputs();
        setTimeout(function () {
          document.getElementById("status").innerHTML = "";
        }, 3000);
        return false;
      }
      log("Info", "EzNilam", "Fetching past read books...");
      fetchPastReadBooks().then((pastReadBooks) => {
        var title = document.getElementById("title").value;
        if (pastReadBooks.includes(title)) {
          log("Error", "EzNilam", "Book already read.");
          document.getElementById("status").innerHTML = "Book already read!";
          clearInputs();
          setTimeout(function () {
            document.getElementById("status").innerHTML = "";
          }, 3000);
          return false;
        }
        var author = document.getElementById("author").value;
        var publisher = document.getElementById("publisher").value;
        var yearOfPublish = document.getElementById("yearOfPublish").value;

        log("Info", "EzNilam", "Checking synopsis...");
        if (settings("get", "EzNilam", "synopsis") == true) {
          var sypnosis = document.getElementById("sypnosis").value;
          var is_synopsis = "1";
        } else {
          var is_synopsis = "0";
        }

        log("Info", "EzNilam", "Checking category...");
        if (settings("get", "EzNilam", "defaultFiction") == true) {
          var category = "30";
        } else {
          var category = "40";
        }

        log("Info", "EzNilam", "Checking language...");
        if (settings("get", "EzNilam", "defaultLanguage") == "BM") {
          var language = "10";
        } else if (settings("get", "EzNilam", "defaultLanguage") == "English") {
          var language = "20";
        } else {
          var language = "30";
        }

        log(
          "Info",
          "EzNilam",
          `Sending data: Title: ${title}, Author: ${author}, Publisher: ${publisher}, Year: ${yearOfPublish}, Synopsis: ${sypnosis}, is_synopsis: ${is_synopsis}, Category: ${category}, Language: ${language}`
        );
        sendNilam(
          category,
          language,
          title,
          is_synopsis,
          sypnosis,
          author,
          publisher,
          yearOfPublish
        ).then((response) => {
          if (response == true) {
            log("Success", "EzNilam", "Book sent.");
            document.getElementById("status").innerHTML = "Book sent!";
            clearInputs();
            setTimeout(function () {
              document.getElementById("status").innerHTML = "";
            }, 3000);
          } else {
            log("Error", "EzNilam", "Book not sent.");
            document.getElementById("status").innerHTML = "Error!";
            clearInputs();
            setTimeout(function () {
              document.getElementById("status").innerHTML = "";
            }, 3000);
          }
        });
      });
    });

    var generateSypnosisBtn = document.getElementById("generateSypnosis");
    generateSypnosisBtn.addEventListener("click", generateSypnosis);

    var resetBtn = document.getElementById("reset");
    resetBtn.addEventListener("click", clearInputs);

    function generateSypnosis() {
      log("Info", "EzNilam", "Generating synopsis...");
      if (settings("get", "EzNilam", "synopsis") == true) {
        var sypnosisElement = document.getElementById("sypnosis");
        var synopsis = settings("get", "EzNilam", "defaultSynopsis");
        var args = {
          title: document.getElementById("title").value,
          author: document.getElementById("author").value,
          publisher: document.getElementById("publisher").value,
          yearOfPublish: document.getElementById("yearOfPublish").value,
          language: settings("get", "EzNilam", "defaultLanguage"),
        };
        synopsis = synopsis.replace(
          /\${(.*?)}/g,
          (match, p1) => args[p1.trim()] || match
        );
        sypnosisElement.value = synopsis;
        log("Success", "EzNilam", `Synopsis generated: ${synopsis}`);
      }
    }

    async function fetchPastReadBooks() {
      log("Info", "EzNilam", "Fetching past read books...");
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
          log("Success", "EzNilam", "Past read books fetched.");
          return bookList;
        })
        .catch((error) => {
          log("Error", "EzNilam", "Error fetching past read books:", error);
        });
    }

    function clearInputs() {
      log("Info", "EzNilam", "Clearing inputs...");
      var inputs = document.getElementsByTagName("input");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
      }
      var textarea = document.getElementsByTagName("textarea")[0];
      textarea.value = "";
      var title = document.getElementById("title");
      title.focus();
      log("Success", "EzNilam", "Inputs cleared.");
    }

    document.addEventListener("keydown", function (event) {
      if (event.key == "Enter") {
        log("Info", "EzNilam", "Enter pressed, sending...");
        sendBtn.click();
      }
    });

    return true;
  }

  // Setting
  if (type == "setting") {
    log("Info", "inject", "Injecting settings...");
    replace404("Settings");

    var settingGUI = document.createElement("div");

    log("Info", "inject", "Fetching settings...");
    settingGUI.innerHTML = await webFetch("settings");

    container.appendChild(settingGUI);

    // EzNilam
    var ezNilamTempLang = settings("get", "EzNilam", "defaultLanguage");
    var ezNilamTempFic = settings("get", "EzNilam", "defaultFiction");

    var EzNilamEnable = document.getElementById("EzNilam-enable");
    EzNilamEnable.checked = settings("get", "EzNilam", "enabled");

    var EzNilamLangEng = document.getElementById("EzNilam-langEng");
    var EzNilamLangBM = document.getElementById("EzNilam-langBM");
    var EzNilamLangOther = document.getElementById("EzNilam-langOther");

    log(
      "Info",
      "EzNilam",
      `Default language: ${settings("get", "EzNilam", "defaultLanguage")}`
    );
    if (settings("get", "EzNilam", "defaultLanguage") == "English") {
      EzNilamLangEng.style.backgroundColor = "#00a9ff";
      EzNilamLangBM.style.backgroundColor = "#6c757d";
      EzNilamLangOther.style.backgroundColor = "#6c757d";
    } else if (settings("get", "EzNilam", "defaultLanguage") == "BM") {
      EzNilamLangEng.style.backgroundColor = "#6c757d";
      EzNilamLangBM.style.backgroundColor = "#00a9ff";
      EzNilamLangOther.style.backgroundColor = "#6c757d";
    } else {
      EzNilamLangEng.style.backgroundColor = "#6c757d";
      EzNilamLangBM.style.backgroundColor = "#6c757d";
      EzNilamLangOther.style.backgroundColor = "#00a9ff";
    }

    var EzNilamFic = document.getElementById("EzNilam-Fic");
    var EzNilamNonFic = document.getElementById("EzNilam-nonFic");

    log(
      "Info",
      "EzNilam",
      `Default fiction: ${settings("get", "EzNilam", "defaultFiction")}`
    );
    if (settings("get", "EzNilam", "defaultFiction") == true) {
      EzNilamFic.style.backgroundColor = "#00a9ff";
      EzNilamNonFic.style.backgroundColor = "#6c757d";
    } else {
      EzNilamFic.style.backgroundColor = "#6c757d";
      EzNilamNonFic.style.backgroundColor = "#00a9ff";
    }

    var EzNilamSypnosis = document.getElementById("EzNilam-sypnosis");
    EzNilamSypnosis.checked = settings("get", "EzNilam", "synopsis");

    var EzNilamSypnosisTxt = document.getElementById("EzNilam-sypnosis-txt");

    if (settings("get", "EzNilam", "defaultSynopsis") !== false) {
      log(
        "Info",
        "EzNilam",
        `Default synopsis: ${settings("get", "EzNilam", "defaultSynopsis")}`
      );
      EzNilamSypnosisTxt.value = settings("get", "EzNilam", "defaultSynopsis");
    } else {
      log("Info", "EzNilam", "No default synopsis found.");
      EzNilamSypnosisTxt.readOnly = true;
    }

    var NiceNilamLangs = document.querySelectorAll(".ezNilam-lang");
    var NiceNilamFics = document.querySelectorAll(".ezNilam-fic");

    log("Info", "EzNilam", "Adding event listeners to language buttons...");
    NiceNilamLangs.forEach((lang) => {
      lang.addEventListener("click", function (event) {
        if (event.target.id == "EzNilam-langEng") {
          log("Info", "EzNilam", "English selected.");
          ezNilamTempLang = "English";
        } else if (event.target.id == "EzNilam-langBM") {
          log("Info", "EzNilam", "BM selected.");
          ezNilamTempLang = "BM";
        } else {
          log("Info", "EzNilam", "Other selected.");
          ezNilamTempLang = "Other";
        }
        NiceNilamLangs.forEach((lang) => {
          lang.style.backgroundColor = "#6c757d";
        });
        lang.style.backgroundColor = "#00a9ff";
      });
    });

    log("Info", "EzNilam", "Adding event listeners to fiction buttons...");
    NiceNilamFics.forEach((fic) => {
      fic.addEventListener("click", function (event) {
        if (event.target.id == "EzNilam-Fic") {
          log("Info", "EzNilam", "Fiction selected.");
          ezNilamTempFic = true;
        } else {
          log("Info", "EzNilam", "Non-fiction selected.");
          ezNilamTempFic = false;
        }
        NiceNilamFics.forEach((fic) => {
          fic.style.backgroundColor = "#6c757d";
        });
        fic.style.backgroundColor = "#00a9ff";
      });
    });

    var EzNilamApply = document.getElementById("EzNilam-apply");
    log("Info", "EzNilam", "Adding event listener to apply button...");
    EzNilamApply.addEventListener("click", function () {
      log("Info", "EzNilam", "Applying...");
      settings("set", "EzNilam", "enabled", EzNilamEnable.checked);
      settings("set", "EzNilam", "defaultLanguage", ezNilamTempLang);
      settings("set", "EzNilam", "defaultFiction", ezNilamTempFic);
      settings("set", "EzNilam", "synopsis", EzNilamSypnosis.checked);
      settings("set", "EzNilam", "defaultSynopsis", EzNilamSypnosisTxt.value);
      EzNilamApply.innerHTML = "Settings applied.";
      log("Success", "EzNilam", "Settings applied.");
      window.location.reload();
    });

    // NiceNilam
    var NiceNilamHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser = 0;
    var NiceNilamEnable = document.getElementById("NiceNilam-enable");
    NiceNilamEnable.checked = settings("get", "NiceNilam", "enabled");

    var NiceNilamApply = document.getElementById("NiceNilam-apply");
    log("Info", "NiceNilam", "Adding event listener to apply button...");
    NiceNilamApply.addEventListener("click", function () {
      log("Info", "NiceNilam", "Applying...");
      settings("set", "NiceNilam", "enabled", NiceNilamEnable.checked);
      NiceNilamApply.innerHTML = "Settings applied.";
      log("Success", "NiceNilam", "Settings applied.");
      window.location.reload();
    });

    var NiceNilamDel = document.getElementById("NiceNilam-del");

    log("Info", "NiceNilam", "Adding event listener to delete button...");
    NiceNilamDel.addEventListener("click", function () {
      log("Info", "NiceNilam", "Delete button clicked.");
      if (NiceNilamHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser == 0) {
        log("Info", "NiceNilam", "First click.");
        NiceNilamDel.innerHTML = "Are you sure?";
        NiceNilamHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser++;
        setTimeout(function () {
          log("Info", "NiceNilam", "Timeout. Resetting button.");
          NiceNilamDel.innerHTML = "Delete ALL NiceNilam data";
          NiceNilamHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser = 0;
        }, 3000);
      } else if (
        NiceNilamHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser == 1
      ) {
        log("Info", "NiceNilam", "Second click.");
        data("delete", "customTheme");
        data("delete", "theme");
        NiceNilamDel.innerHTML = "NiceNilam data deleted.";
        log("Success", "NiceNilam", "NiceNilam data deleted.");
        setTimeout(function () {
          NiceNilamDel.innerHTML = "Delete ALL NiceNilam data";
          NiceNilamHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser = 0;
        }, 3000);
      }
    });

    // AutoLogin
    var AutoLoginHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser = 0;
    var AutoLoginEnable = document.getElementById("AutoLogin-enable");
    AutoLoginEnable.checked = settings("get", "AutoLogin", "enabled");

    var AutoLoginUsr = document.getElementById("AutoLogin-usr");
    AutoLoginUsr.value = settings("get", "AutoLogin", "username");

    var AutoLoginPwd = document.getElementById("AutoLogin-pwd");
    AutoLoginPwd.value = settings("get", "AutoLogin", "password");

    var AutoLoginApply = document.getElementById("AutoLogin-apply");
    log("Info", "AutoLogin", "Adding event listener to apply button...");
    AutoLoginApply.addEventListener("click", function () {
      log("Info", "AutoLogin", "Applying...");
      settings("set", "AutoLogin", "enabled", AutoLoginEnable.checked);
      settings("set", "AutoLogin", "username", AutoLoginUsr.value);
      settings("set", "AutoLogin", "password", AutoLoginPwd.value);
      AutoLoginApply.innerHTML = "Settings applied.";
      log("Success", "AutoLogin", "Settings applied.");
      window.location.reload();
    });

    var AutoLoginDel = document.getElementById("AutoLogin-del");

    log("Info", "AutoLogin", "Adding event listener to delete button...");
    AutoLoginDel.addEventListener("click", function () {
      log("Info", "AutoLogin", "Delete button clicked.");
      if (AutoLoginHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser == 0) {
        log("Info", "AutoLogin", "First click.");
        AutoLoginDel.innerHTML = "Are you sure?";
        AutoLoginHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser++;
        setTimeout(function () {
          log("Info", "AutoLogin", "Timeout. Resetting button.");
          AutoLoginDel.innerHTML = "Delete ALL AutoLogin data";
          AutoLoginHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser = 0;
        }, 3000);
      } else if (
        AutoLoginHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser == 1
      ) {
        data("delete", "AutoLogin");
        log("Success", "AutoLogin", "AutoLogin data deleted.");
        AutoLoginDel.innerHTML = "AutoLogin data deleted.";
        setTimeout(function () {
          AutoLoginDel.innerHTML = "Delete ALL AutoLogin data";
          AutoLoginHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser = 0;
        }, 3000);
      }
    });

    // BetterNilam
    var BetterNilamHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser = 0;
    var BetterNilamDel = document.getElementById("BetterNilam-del");

    log("Info", "BetterNilam", "Adding event listener to delete button...");
    BetterNilamDel.addEventListener("click", function () {
      if (BetterNilamHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser == 0) {
        log("Info", "BetterNilam", "First click.");
        BetterNilamDel.innerHTML = "Are you sure?";
        BetterNilamHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser++;
        setTimeout(function () {
          log("Info", "BetterNilam", "Timeout. Resetting button.");
          BetterNilamDel.innerHTML = "Delete ALL BetterNilam data";
          BetterNilamHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser = 0;
        }, 3000);
      } else if (
        BetterNilamHowMuchTimeDoesTheDeleteButtonHasClickedByTheUser == 1
      ) {
        data("delete", "BetterNilam");
        data("delete", "customTheme");
        data("delete", "theme");
        log("Success", "BetterNilam", "BetterNilam data deleted.");
        setInterval(function () {
          BetterNilamDel.innerHTML =
            "BetterNilam data deleted, IF YOU WISH TO UNINSTALL BETTERNILAM, CLOSE THIS TAB AND UNINSTALL THE SCRIPT, DO NOT RELOAD.";
        }, 100);
      }
    });
  }

  // BetterNilam
  if (type == "betterNilam") {
    log("Info", "inject", "Injecting BetterNilam...");
    replace404("BetterNilam");

    var betterNilamGUI = document.createElement("div");

    log("Info", "inject", "Fetching BetterNilam...");
    betterNilamGUI.innerHTML = await webFetch("betterNilam");
    container.appendChild(betterNilamGUI);

    var feedbackBtn = document.getElementById("feedback");
    feedbackBtn.addEventListener("click", function () {
      log("Info", "BetterNilam", "Redirecting to feedback form...");
      window.open("https://forms.gle/Cyy6fcLEjbaAv3Pt8");
    });

    var bugBtn = document.getElementById("bug");
    bugBtn.addEventListener("click", function () {
      log("Info", "BetterNilam", "Redirecting to bug report form...");
      window.open("https://forms.gle/XNkNYpwMGhe1JgRP8");
    });

    var devBtn = document.getElementById("dev");
    if (settings("getRoot", "devMode") == true) {
      devBtn.innerHTML = `<i class="fa-regular fa-code"></i> Disable dev mode`;
    } else {
      devBtn.innerHTML = `<i class="fa-regular fa-code"></i> Enable dev mode`;
    }
    devBtn.addEventListener("click", function () {
      log("Info", "devMode", "Toggling dev mode...");
      if (settings("getRoot", "devMode", "devMode") == true) {
        settings("setRoot", "devMode", "devMode", false);
        devBtn.innerHTML = `<i class="fa-regular fa-code"></i> Enable dev mode`;
        log("Success", "devMode", "Dev mode disabled.");
      } else {
        settings("setRoot", "devMode", "devMode", true);
        devBtn.innerHTML = `<i class="fa-regular fa-code"></i> Disable dev mode`;
        log("Success", "devMode", "Dev mode enabled.");
      }
    });

    var version = document.getElementById("version");
    var modules = document.getElementById("modules");
    var changelog = document.getElementById("changelog");
    var releaseDate = document.getElementById("release-date");

    log("Info", "BetterNilam", "Fetching version data...");
    webFetch("version").then((data) => {
      var Pdata = JSON.parse(data);
      version.innerHTML = `Version: ${Pdata["version"]}`;
      modules.innerHTML = `${Pdata["modules"]}`;
      changelog.innerHTML = `${Pdata["changelog"]}`;
      releaseDate.innerHTML = `Release date: ${Pdata["releaseDate"]}`;
    });

    log("Success", "inject", "BetterNilam injected.");
    return true;
  }

  if (type == "NiceNilam-guide") {
    log("Info", "inject", "Injecting NiceNilam guide...");
    replace404("NiceNilam Guide");

    var niceNilamGuideGUI = document.createElement("div");

    log("Info", "inject", "Fetching NiceNilam guide...");
    niceNilamGuideGUI.innerHTML = await webFetch("NiceNilam-guide");
    container.appendChild(niceNilamGuideGUI);

    log("Success", "inject", "NiceNilam guide injected.");
    return true;
  }

  return false;
}

// Theme Management (NiceNilam)
function theme(type, setting) {
  log(
    "Info",
    "theme",
    `Received data: Type: ${type}, Setting: ${JSON.stringify(setting)}`
  );
  if (type == "apply") {
    if (setting["preset"] == true) {
      data("set", "theme", JSON.stringify(setting));
      inject("CSS", setting);
      log("Success", "theme", "Preset theme applied.");
      return true;
    } else {
      data("set", "customTheme", JSON.stringify(setting));
      data("set", "theme", JSON.stringify(setting));
      inject("CSS", setting);
      log("Success", "theme", "Custom theme applied.");
      return true;
    }
  }
  if (type == "preview") {
    inject("CSS", setting);
    log("Success", "theme", "Theme previewed.");
    return true;
  }
}

// Site Detection
function detectSite() {
  log("Info", "detectSite", "Detecting site...");
  var url = window.location.href;
  if (url == "https://nilamjohor.edu.my/auto-nilam") {
    log("Success", "detectSite", "Site detected: AutoNilam.");
    return "autoNilam";
  }
  if (url == "https://nilamjohor.edu.my/nice-nilam") {
    log("Success", "detectSite", "Site detected: NiceNilam.");
    return "niceNilam";
  }
  if (url == "https://nilamjohor.edu.my/aktiviti-bacaan/create") {
    log("Success", "detectSite", "Site detected: Create.");
    return "create";
  }
  if (url == "https://nilamjohor.edu.my/ez-nilam") {
    log("Success", "detectSite", "Site detected: EzNilam.");
    return "ezNilam";
  }
  if (url == "https://nilamjohor.edu.my/better-nilam") {
    log("Success", "detectSite", "Site detected: BetterNilam.");
    return "betterNilam";
  }
  if (url == "https://nilamjohor.edu.my/better-nilam/setting") {
    log("Success", "detectSite", "Site detected: Setting.");
    return "setting";
  }
  if (url == "https://nilamjohor.edu.my/site/login") {
    log("Success", "detectSite", "Site detected: Login.");
    return "login";
  }
  if (url == "https://nilamjohor.edu.my/nice-nilam/guide") {
    log("Success", "detectSite", "Site detected: NiceNilam guide.");
    return "NiceNilam-guide";
  }
  return false;
}

// Dev Log
function log(status, type, message) {
  function get() {
    var cookies = document.cookie.split(";");
    var cookie = cookies.find((cookie) => cookie.includes("BetterNilam"));
    if (cookie) {
      var value = cookie.split("=")[1];
      var BetterNilam = JSON.parse(value);
      return BetterNilam["devMode"];
    } else {
      return false;
    }
  }

  if (get()) {
    if (status == "Error") {
      console.error(
        `%c[BN]%c[${type}] %c${status.toUpperCase()}: %c${message}`,
        "color: #FFA500",
        "color: #FFA500",
        "color: #EE4B2B",
        "color: #EE4B2B"
      );
    } else if (status == "Success") {
      console.log(
        `%c[BN]%c[${type}] %c${status.toUpperCase()}: %c${message}`,
        "color: #FFA500",
        "color: #FFA500",
        "color: #40e0d0",
        "color: #40e0d0"
      );
    } else if (status == "Info") {
      console.log(
        `%c[BN]%c[${type}] %c${status.toUpperCase()}: %c${message}`,
        "color: #FFA500",
        "color: #FFA500",
        "color: #0096FF",
        "color: #0096FF"
      );
    } else {
      console.log(
        `%c[BN]%c[${type}] %c${status.toUpperCase()}: %c${message}`,
        "color: #FFA500",
        "color: #FFA500",
        "color: white",
        "color: white"
      );
    }
  }
}

// Coloris
function checkColoris() {
  log("Info", "checkColoris", "Checking Coloris...");
  if (typeof Coloris !== "undefined") {
    log("Info", "checkColoris", "Coloris found. Initializing...");
    Coloris({
      theme: "polaroid",
      themeMode: "dark",
      closeButton: true,
      clearButton: true,
    });
  } else {
    log("Info", "checkColoris", "Coloris not found. Trying again...");
    setTimeout(checkColoris, 100);
  }
}

if (data("get", "BetterNilam") == false) {
  log("Info", "init", "No BetterNilam data found. Creating...");
  data("set", "BetterNilam", JSON.stringify(defaultSettings));
}

if (settings("get", "AutoLogin", "enabled") == true) {
  if (detectSite() == "login") {
    autoLogin();
  }
}

log("Info", "init", "Injecting...");

inject("sidebar");
inject(detectSite());

if (data("get", "theme") == false) {
  inject("CSS", "default");
} else {
  inject("CSS", JSON.parse(data("get", "theme")));
}
