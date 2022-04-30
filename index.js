const api = axios.create({
  baseURL: "https://api.thecatapi.com/v1/",
});
api.defaults.headers.common["X-API-KEY"] =
  "22c23d95-7a47-45b5-a0b8-a84754e3d008";
const button = document.getElementById("generateCat");
const containerFavorites = document.getElementById("favorites");
const URL_API_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=6";
const URL_API_FAVOURITES = "https://api.thecatapi.com/v1/favourites?limit=10";
const URL_API_UPLOAD = "https://api.thecatapi.com/v1/images/upload";
const URL_API_FAVOURITES_DELETE = (id) => {
  return `https://api.thecatapi.com/v1/favourites/${id}`;
};

async function catReload() {
  const res = await fetch(URL_API_RANDOM);
  const resJSON = await res.json();
  if (resJSON[0].hasOwnProperty("categories")) {
    img1.alt = resJSON[0].categories[0].name;
    img2.alt = resJSON[0].categories[0].name;
    img3.alt = resJSON[0].categories[0].name;
  }
  if (res.status !== 200) {
    console.error(`error ${res.status} ${resJSON.message}`);
  } else {
    const src1 = resJSON[0].url;
    const src2 = resJSON[1].url;
    const src3 = resJSON[2].url;
    const src4 = resJSON[3].url;
    const src5 = resJSON[4].url;
    const src6 = resJSON[5].url;
    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");
    const img3 = document.getElementById("img3");
    const img4 = document.getElementById("img4");
    const img5 = document.getElementById("img5");
    const img6 = document.getElementById("img6");
    const btn1 = document.getElementById("saveMichi");
    const btn2 = document.getElementById("saveMichi2");
    const btn3 = document.getElementById("saveMichi3");
    const btn4 = document.getElementById("saveMichi4");
    const btn5 = document.getElementById("saveMichi5");
    const btn6 = document.getElementById("saveMichi6");

    img1.style.backgroundImage = `url(${src1})`;
    img2.style.backgroundImage = `url(${src2})`;
    img3.style.backgroundImage = `url(${src3})`;
    img4.style.backgroundImage = `url(${src4})`;
    img5.style.backgroundImage = `url(${src5})`;
    img6.style.backgroundImage = `url(${src6})`;

    btn1.onclick = () => saveFavouritesMichi(resJSON[0].id);
    btn2.onclick = () => saveFavouritesMichi(resJSON[1].id);
    btn3.onclick = () => saveFavouritesMichi(resJSON[2].id);
    btn4.onclick = () => saveFavouritesMichi(resJSON[3].id);
    btn5.onclick = () => saveFavouritesMichi(resJSON[4].id);
    btn6.onclick = () => saveFavouritesMichi(resJSON[5].id);
  }
}

async function catFavorite() {
  const res = await fetch(URL_API_FAVOURITES, {
    method: "GET",
    headers: {
      "x-api-key": "22c23d95-7a47-45b5-a0b8-a84754e3d008",
    },
  });
  const resJSON = await res.json();
  const title = document.createElement("h2");

  if (res.status !== 200) {
    console.error(`error ${res.status} ${resJSON.message}`);
  } else {
    containerFavorites.replaceChildren("");
    containerFavorites.appendChild(title);
    resJSON.forEach((michi) => {
      const article = document.createElement("article");
      const img = document.createElement("div");
      const btn = document.createElement("button");
      btn.innerText = "Eliminar de favoritos";
      title.innerText = "Michis Favoritos";

      img.classList.add("imgFav");
      img.style.backgroundImage = `url(${michi.image.url})`;
      article.classList.add("cardMichi");
      btn.onclick = () => deleteFavorite(michi.id);
      article.appendChild(img);
      article.appendChild(btn);
      containerFavorites.appendChild(article);
    });
  }
}

async function saveFavouritesMichi(id) {
  const { data, status } = await api.post("/favourites", {
    image_id: id,
  });
  if (status !== 200) {
    console.error(`error ${status} ${data.message}`);
  } else {
    console.log("se guardado correctamente");
    catFavorite();
  }
}

async function deleteFavorite(id) {
  const res = await fetch(URL_API_FAVOURITES_DELETE(id), {
    method: "DELETE",
    headers: {
      "x-api-key": "22c23d95-7a47-45b5-a0b8-a84754e3d008",
    },
  });
  if (res.status !== 200) {
    console.error("error");
  } else {
    console.log("se elminio correctamente");
    catFavorite();
  }
}

async function uploadMichiPhoto() {
  const form = document.getElementById("uploadingForm");
  const formData = new FormData(form);
  console.log(formData.get("file"));
  const res = await fetch(URL_API_UPLOAD, {
    method: "POST",
    headers: {
      "x-api-key": "22c23d95-7a47-45b5-a0b8-a84754e3d008",
    },
    body: formData,
  });
  const resJSON = await res.json();
  if (res.status !== 201) {
    // console.error("error");
    alert("!No ha seleccionado un archivo para publicar");
  } else {
    console.log("Foto subida correctamente");
    console.log(resJSON);
    saveFavouritesMichi(resJSON.id);
    catFavorite();
  }
}

//previsualizar img
const select = document.querySelector("#selectFile");
const imgFile = document.querySelector("#previsualizacion");

select.addEventListener("change", () => {
  const files = selectFile.files;
  if (files.lenght == 0) {
    imgFile.src = "";
    console.log("no hay imagen");
    return;
  }

  const firstimg = files[0];
  console.log(firstimg);
  const imgSrc = URL.createObjectURL(firstimg);
  imgFile.src = imgSrc;
});

catReload();
catFavorite();
button.addEventListener("click", catReload);
