var settings = {
  legitMode: true,
  legitModeDelayMin: 30000,
  legitModeDelayMax: 60000,
};

// AutoNilam Main Function
function sendNilam(
  category,
  language,
  title,
  is_synopsis,
  synopsis,
  author,
  publisher,
  year
) {
  const xhr = new XMLHttpRequest();
  const key = getKey();
  const date = getDate();
  xhr.open("POST", "https://nilamjohor.edu.my/aktiviti-bacaan/create");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  const body =
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
    date;
  xhr.onload = () => {
    if (xhr.status == 200) {
      console.log(`Success: ${title}`);
    } else {
      console.log(`Error: ${title}`);
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
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = dd + "-" + mm + "-" + yyyy;
  return today;
}

function doNilam(json) {
  console.log(json);
  var pJson = JSON.parse(json);

  for (var i = 0; i < pJson.books.length; i++) {
    var title = pJson.books[i].title;
    var language = pJson.books[i].language;
    var fiction = pJson.books[i].fiction;
    var author = pJson.books[i].author;
    var publisher = pJson.books[i].publisher;
    var synopsis = pJson.books[i].synopsis;
    var year = pJson.books[i].year;

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
      console.log(`Year ${year} not a number, attemting to convert`);
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
      console.log(`Sending ${title}, ETA ${timeout}ms`);
      setTimeout(function () {
        sendNilam(
          category,
          language,
          title,
          "0",
          synopsis,
          author,
          publisher,
          year
        );
      }, timeout);
    } else {
      sendNilam(
        category,
        language,
        title,
        "0",
        synopsis,
        author,
        publisher,
        year
      );
    }
  }
}

// Prompt Generation
function generatePrompt(bookCount) {
  var bookList = [];

  // Fetch past read books
  fetch(
    "https://nilamjohor.edu.my/aktiviti-bacaan/index?AktivitiBacaanSearch[pageSize]=1000"
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
      var prompt = `
    Generate a list of random STORY books with rules or options below:
  - ${bookCount} books in the list
  - Language: BM or English
  - Make more fiction books (story like books)
  - Less science category books
  - Without repeat the book name or story in the list of previously read books
  
  - Must contain:
  - title of the book (title key for JSON)(according to the book's language)
  - language of the book (language key for JSON) (bm/english for value)
  - is the book fiction (fiction key for JSON) (true/false for value)
  - author of the book (author key for JSON) (according to the book's language)
  - publisher of the book (publisher key for JSON)
  - sypnosis (synopsis key for JSON) (according to the book's language) 
  - year of publish (year key for JSON)
  
  - Additional notes:
  - book MUST be real (exist in this world), CAN'T BE imagined (made up)
  - generate the list in JSON form: 
  {"books":[...]}
  
  
   list of previously read books:
   ${JSON.stringify(bookList)}
    `;

      console.log(prompt);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
generatePrompt();

// GUI Injection
function injectGUI() {
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
  betterNilamSidebarClass.innerHTML = "--- BetterNilam";

  var betterNilamSidebar = document.createElement("li");

  var betterNilamSidebarLink = document.createElement("a");
  betterNilamSidebarLink.setAttribute("href", "/better-nilam");

  var betterNilamSidebarIcon = document.createElement("i");
  betterNilamSidebarIcon.className = "fa-regular fa-sparkles";

  var betterNilamSidebarText = document.createElement("span");
  betterNilamSidebarText.innerHTML = " BetterNilam ";
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

// Site Detection
function detectSite() {
  var url = window.location.href;
  if (url == "https://nilamjohor.edu.my/auto-nilam") {
    return "auto-nilam";
  }
  if (url == "https://nilamjohor.edu.my/auto-nilam/settings") {
    return "auto-nilam-settings";
  }
  if (url == "https://nilamjohor.edu.my/better-nilam") {
    return "better-nilam";
  } else {
    return "unknown";
  }
}

// GUI Injection for AutoNilam (WIP)
function injectAutoNilamGUI() {
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

  var autoNilamGUI = document.createElement("div");
  autoNilamGUI.className = "row";
  autoNilamGUI.innerHTML = `
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
          />
        </div>
        <div class="row m-t-20">
          <button type="submit" id="submit-btn" class="btn btn-success">
            <i class="fas fa-sparkles"></i> Generate
          </button>
        </div>
        <h3 class="box-title m-t-40">
          <i class="fas fa-align-left"></i> Prompt
        </h3>
        <div class="m-t-20 input-group">
          <textarea
            class="form-control input-group-prepend row"
            readonly=""
            style="overflow: auto; scrollbar-width: thin"
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
            ><i class="fas fa-copy"></i
          ></a>
        </div>
      </div>
    </div>
  </div>
`;

  container.appendChild(autoNilamGUI);

  var submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", function () {
    var bookCount = document.getElementsByClassName("form-control")[0].value;
    var prompt = generatePrompt(bookCount);
    document.getElementsByClassName("form-control")[1].value = prompt;
  });
}
injectAutoNilamGUI();
injectGUI();
