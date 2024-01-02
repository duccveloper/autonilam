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
    if (xhr.readyState == 200) {
      console.log(JSON.parse(xhr.responseText));
      console.log(`Success: ${title}`);
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

    // send
    console.log(`Sending ${pJson[i]}`);
    sendNilam(
      category,
      language,
      title,
      1,
      synopsis,
      author,
      publisher,
      year
    );
  }
}
