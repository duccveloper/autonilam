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



// Data Management
function data(action, key, value) {
  if (action == "set") {
    document.cookie = `${key}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    return true;
  }
  if (action == "get") {
    var cookies = document.cookie.split(";");
    var cookie = cookies.find((cookie) => cookie.includes(key));
    if (cookie) {
      var value = cookie.split("=")[1];
      return value;
    } else {
      return false;
    }
  }
  if (action == "delete") {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    return true;
  }
}

// Web Fetching
async function webFetch(type) {
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

  // NiceNilam
  if (type == "NiceNilam") {
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

    niceNilamGUI.innerHTML = await webFetch("NiceNilam");

    container.appendChild(niceNilamGUI);

    var customThemeBtn = document.getElementById("pTheme-custom");
    if (data("get", "customTheme") !== false) {
      customThemeBtn.disabled = false;

      customThemeBtn.addEventListener("click", function () {
        var setting = JSON.parse(data("get", "customTheme"));
        loadInput(setting);
        theme("apply", setting);

        var status = document.getElementById("theme-status");
        status.innerHTML = "Custom theme applied.";
      });
    }

    var actionBtns = document.querySelectorAll(".btn-action");

    actionBtns.forEach((btn) => {
      btn.addEventListener("click", function (event) {
        var target = event.target.id;
        event.preventDefault();
        var inputs = document.getElementsByTagName("input");
        var setting = {};
        for (var i = 0; i < inputs.length; i++) {
          setting[inputs[i].id] = inputs[i].value;
        }
        if (target == "preview-btn") {
          theme("preview", setting);
        } else if (target == "apply-btn") {
          setting["preset"] = false;
          theme("apply", setting);
        }
      });
    });

    var defaultBtn = document.getElementById("pTheme-default");

    defaultBtn.addEventListener("click", function () {
      inject("CSS", "default");
      data("delete", "theme");

      var inputs = document.getElementsByTagName("input");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
        document
          .querySelector(`#${inputs[i].id}`)
          .dispatchEvent(new Event("input", { bubbles: true }));
      }

      var status = document.getElementById("theme-status");
      status.innerHTML = "NiceNilam disabled, default theme applied.";
    });

    var defaultDarkBtn = document.getElementById("pTheme-dark");

    defaultDarkBtn.addEventListener("click", function () {
      webFetch("theme-dark").then((setting) => {
        setting = JSON.parse(setting);
        loadInput(setting);
        theme("apply", setting);

        var status = document.getElementById("theme-status");
        status.innerHTML = "Dark theme applied.";
      });
    });

    function loadInput(setting) {
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
      var setting = JSON.parse(data("get", "customTheme"));
      if (setting == false) {
        status.innerHTML = "No custom theme found.";
        return false;
      }
      var json = JSON.stringify(setting);
      var blob = new Blob([json], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "NiceNilam-theme.json";
      a.click();
      status.innerHTML = "Theme exported.";
    });

    var importBtn = document.getElementById("theme-import");
    importBtn.addEventListener("click", function () {
      var input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.click();
      input.addEventListener("change", function () {
        var file = input.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
          var setting = JSON.parse(e.target.result);
          theme("preview", setting);
          loadInput(setting);
          status.innerHTML = "Theme imported, click apply to save.";
        };
        reader.readAsText(file);
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

    betterNilamSidebarLink.appendChild(betterNilamSidebarIcon);
    betterNilamSidebarLink.appendChild(betterNilamSidebarText);
    betterNilamSidebar.appendChild(betterNilamSidebarLink);
    sidebar.appendChild(betterNilamSidebarClass);
    sidebar.appendChild(betterNilamSidebar);

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

function theme(type, setting) {
  if (type == "apply") {
    if (setting["preset"] == true) {
      data("set", "theme", JSON.stringify(setting));
      inject("CSS", setting);
      return true;
    } else {
      data("set", "customTheme", JSON.stringify(setting));
      data("set", "theme", JSON.stringify(setting));
      inject("CSS", setting);
      return true;
    }
  }
  if (type == "preview") {
    inject("CSS", setting);
    return true;
  }
}

function previewTheme(setting) {
  inject("CSS", setting);
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

// Coloris
function checkColoris() {
  if (typeof Coloris !== "undefined") {
    Coloris({
      theme: "polaroid",
      themeMode: "dark",
      closeButton: true,
      clearButton: true,
    });
  } else {
    setTimeout(checkColoris, 100);
  }
}

checkColoris();
inject("Sidebar");
if (detectSite() == "nice-nilam") {
  inject("NiceNilam");
}

if (data("get", "theme") == false) {
  inject("CSS", "default");
} else {
  inject("CSS", JSON.parse(data("get", "theme")));
}
