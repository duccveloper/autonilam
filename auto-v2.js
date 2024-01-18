var settings = {
  legitMode: true,
  legitModeDelayMin: 30000,
  legitModeDelayMax: 60000,

  // AutoNilam Settings
  autoNilamPreferredGenres: [
    "mystery",
    "fantasy",
    "sci-fi",
    "adventure",
    "cyberpunk",
  ],
  autoNilamPreferredLanguage: "english",
  autoNilamRandomizeLanguage: true,
  autoNilamStrictBookCount: true,
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
  // Get CSRF Key
  function getKey() {
    return fetch("https://nilamjohor.edu.my/aktiviti-bacaan/create")
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, "text/html");
        const key = htmlDoc.querySelector('input[name="_csrf-frontend"]');
        return key.value;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = dd + "-" + mm + "-" + yyyy;
    return today;
  }

  statusElement(false, "Sending", title);

  const xhr = new XMLHttpRequest();
  const date = getDate();
  getKey().then((resolvedKey) => {
    key = resolvedKey;

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
        statusElement(false, "Success", title);
      } else {
        console.log(`Error: ${title}`);
        statusElement(false, "Error", title);
      }
    };
    xhr.send(body);
  });
}

async function doNilam(json) {
  var pJson = JSON.parse(json);
  var bookList = await fetchPastReadBooks();
  prevBooks = bookList;


  for (var i = 0; i < pJson.books.length; i++) {
    var title = pJson.books[i].title;
    var language = pJson.books[i].language;
    var fiction = pJson.books[i].fiction;
    var author = pJson.books[i].author;
    var publisher = pJson.books[i].publisher;
    var synopsis = pJson.books[i].synopsis;
    var year = pJson.books[i].year;
    statusElement(true, "Sending", title);
    // detect if repeating title
    if (prevBooks.includes(title)) {
      console.log(`Title ${title} already read, skipping`);
      statusElement(false, "Already read", title);
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
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }

    await sendNilam(
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

  return "done";
}

// Status Element
function statusElement(create, status, title, timeout) {
  if (create == true) {
    console.log(`Creating status element for ${title}`);
    var statusElement = document.createElement("div");
    statusElement.style =
      "display: flex; justify-content: space-between; align-items: center; padding: 1em; border-radius: 1em; background: lightgray;";
    statusElement.id = title;

    var statusTitle = document.createElement("span");
    statusTitle.innerHTML = title;

    var statusStatus = document.createElement("span");
    statusStatus.innerHTML = "Timeout";
    statusStatus.id = title + "-status";

    var statusProgress = document.createElement("progress");
    statusProgress.value = 0;
    statusProgress.id = title + "-progress";
    if (timeout) {
      statusProgress.max = timeout;
    }

    statusElement.appendChild(statusTitle);
    statusElement.appendChild(statusStatus);
    statusElement.appendChild(statusProgress);

    document.getElementById("statusContainer").appendChild(statusElement);
  } else {
    console.log(`Updating status element for ${title}`);
    var statusElement = document.getElementById(title);
    var statusStatus = document.getElementById(title + "-status");
    statusStatus.textContent = status;

    if (timeout) {
      var statusProgress = document.getElementById(title + "-progress");
      statusProgress.max = timeout / 1000;

      var interval = setInterval(function () {
        statusProgress.value += 1;
        if (statusProgress.value >= statusProgress.max) {
          clearInterval(interval);
        }
      }, 1000);
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
    var prompt = `**Generate a JSON list of story books, prioritizing series over single books, with the following specifications:**

    **Mandatory Book Information:**
    
    * Title (original language. Do not include series title)
    * Language ("bm" or "english") - Must be the original language of the book, not a translation.
    * Fiction (true/false)
    * Author (must match language of book and synopsis)
    * Publisher (must match language of book and synopsis)
    * Synopsis (brief, 1-2 sentences, mentioning series if applicable, must match language of book and author)
    * Year of publication
    
    **Strict Exclusions:**
    
    * Absolutely exclude books listed in "list_of_previously_read_books": ${JSON.stringify(
      bookList
    )}
    
    **Options:**
    
    * Prioritize genres: ${JSON.stringify(settings.autoNilamPreferredGenres)}
    * Number of books: ${bookCount} (prefer series first; include at least one book per series)
    * Preferred language (if not randomizing): ${
      settings.autoNilamPreferredLanguage
    }
    * Randomize languages (overrides preferred language): ${
      settings.autoNilamRandomizeLanguage
    }
    * Strict book count: ${
      settings.autoNilamStrictBookCount
    } (true to adhere to book count exactly, false to allow exceeding count for complete series)
    
    **Additional Requirements:**
    
    * Only include real-world publications
    * Adhere to language randomization if applicable
    * Prioritize complete or ongoing series if possible
    * If strict book count is false, prioritize completing series over adhering to the exact book count
    * **Ensure the synopsis reflects the author's language and cultural background.**
    
    **Example JSON Output:**
    
    json
    {
      "books": [
        {
          "title": "The Time Weavers",
          "language": "english",
          "fiction": true,
          "author": "Elizabeth Richards",
          "publisher": "Starlight Press",
          "synopsis": "A young clockmaker embarks on a time-traveling adventure...",
          "year": 2022
        },
        // ... more book entries (mixing single and series books) with original languages only
      ]
    }
    
    
    `;
    return prompt;
  });
}

// GUI Injection
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
      <div class="row m-t-20">
        <button type="submit" id="autoNilam-btn" class="btn btn-success">
          <i class="fas fa-sparkles"></i> AutoNilam
        </button>
      </div>
    </div>
  </div>
</div>

`;

  container.appendChild(autoNilamGUI);

  // status section
  var statusGUI = document.createElement("h3");
  statusGUI.className = "box-title m-t-30";
  statusGUI.innerHTML = `<i class="fas fa-bars-progress"></i> Status`;

  var statusGUIContent = document.createElement("div");
  statusGUIContent.id = "statusContainer";
  statusGUIContent.style = "display: flex; gap: 1em; flex-direction: column;";

  var autoNilamBtn = document.getElementById("autoNilam-btn");
  autoNilamBtn.addEventListener("click", function () {
    autoNilamPromptGUI.querySelector(".card-body").style.display = "none";

    var json = document.getElementById("JSONInput").value;
    doNilam(json).then((result) => {
      if (result == "done") {
        autoNilamPromptGUI.querySelector(".card-body").style.display = "block";
      }
    });


  });
  
  document.getElementById("cardBody").appendChild(statusGUI);
  document.getElementById("cardBody").appendChild(statusGUIContent);
  
}

if (detectSite() == "auto-nilam") {
  injectAutoNilamGUI();
}

injectSidebar();
