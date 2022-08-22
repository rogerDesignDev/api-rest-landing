const api = axios.create({
  baseURL: 'https://api.thecatapi.com/v1'
});
api.defaults.headers.common['X-API-KEY'] = 'b17def75-2cc5-400a-9ce0-f101efce2335';

// const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2';
// const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
// const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
// const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const spamError = document.getElementById('error');

// cargar aleatorios
async function loadRandomCats(){
  const { data, status } = await api.get('/images/search?limit=4');

  // const res = await fetch(API_URL_RANDOM);
  // const data = await res.json();

  // console.log('Random');
  console.log(data);

  if (status !== 200) {
    spamError.innerHTML = "Hubo un error: " + status;
  } else {
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const img3 = document.getElementById('img3');
    const img4 = document.getElementById('img4');
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    const btn3 = document.getElementById('btn3');
    const btn4 = document.getElementById('btn4');

    img1.src = data[0].url;
    img2.src = data[1].url;
    img3.src = data[2].url;
    img4.src = data[3].url;

    const disablebtn1 = () => { btn1.disabled = true };
    const disablebtn2 = () => { btn2.disabled = true };
    const disablebtn3 = () => { btn3.disabled = true };
    const disablebtn4 = () => { btn4.disabled = true };

    btn1.onclick = () => saveFavouriteCats(data[0].id);
    btn1.addEventListener('click', disablebtn1);
    btn2.onclick = () => saveFavouriteCats(data[1].id);
    btn2.addEventListener('click', disablebtn2);
    btn3.onclick = () => saveFavouriteCats(data[2].id);
    btn3.addEventListener('click', disablebtn3);
    btn4.onclick = () => saveFavouriteCats(data[3].id);
    btn4.addEventListener('click', disablebtn4);
  }
};

// agregar a favorito
async function loadFavouritesCats() {
  const { data, status } = await api.get('/favourites');

  // const res = await fetch(API_URL_FAVORITES, {
  //   method: 'GET',
  //   headers: {
  //     'X-API-KEY': 'b17def75-2cc5-400a-9ce0-f101efce2335',
  //   },
  // });
  // const data = await res.json();

  // console.log('Favoritos');
  // console.log(data);

  if (status !== 200) {
    spamError.innerHTML = "Hubo un error: " + status + ' ' + data.message;
  } else {
    const section = document.getElementById('favoritesList')
    section.innerHTML = "";

    data.forEach(cat => {
      const article = document.createElement('article');
      const div = document.createElement('div');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      const btnSpan = document.createElement('span');
      const btnSpanText = document.createTextNode(`Sacar al michi de favoritos`);
      const btnText = document.createTextNode(`✖`);

      article.classList.add('cats--favorites-item');
      div.classList.add('cats--favorites-inner');
      img.src = cat.image.url;
      img.width = 323;
      img.height = 256;
      img.classList.add('cats--favorites-img');
      btn.appendChild(btnSpan);
      btnSpan.appendChild(btnSpanText);
      btn.appendChild(btnText);
      btn.onclick = () => deleteFavouriteCats(cat.id);
      btn.classList.add('cats--favorites-button');
      article.appendChild(div);
      div.appendChild(img);
      div.appendChild(btn);
      section.appendChild(article);
    });
  }
};

// guardar en favoritos
async function saveFavouriteCats(id) {
  const { data, status } = await api.post('/favourites', {
    image_id: id,
  });

  // const res = await fetch(API_URL_FAVORITES, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-API-KEY': 'b17def75-2cc5-400a-9ce0-f101efce2335',
  //   },
  //   body: JSON.stringify({
  //     image_id: id
  //   }),
  // });
  // const data = await res.json();

  console.log('Save');

  if (status !== 200) {
    spamError.innerHTML = "Hubo un error: " + status + ' ' + data.message;
  } else {
    // console.log('Gato guardado en favoritos');
    loadFavouritesCats();
  }
};

// borrar de favoritos
async function deleteFavouriteCats(id) {
  const { data, status } = await api.delete(`/favourites/${id}`);

  // const res = await fetch(API_URL_FAVORITES_DELETE(id), {
  //   method: 'DELETE',
  //   headers: {
  //     'X-API-KEY': 'b17def75-2cc5-400a-9ce0-f101efce2335',
  //   },
  // });
  // const data = await res.json();

  if (status !== 200) {
    spamError.innerHTML = "Hubo un error: " + status + ' ' + data.message;
  } else {
    // console.log('Gato borrado de favoritos');
    loadFavouritesCats();
  }
};

// visualizar imagen antes de subir
const inputImage = document.querySelector("#file");
const upload__imgsContainer = document.querySelector(".cats--uploading-img-container");

inputImage.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      upload__imgsContainer.style.display = "block";
      upload__imgsContainer.innerHTML =
        `<img src="${e.target.result}" class="cats--uploading-img" alt="Uploaded image" />`;
    };
  }
});

// subir nueva foto
async function uploadCatPhoto() {
  const form = document.getElementById('uploadingForm');
  const formData = new FormData(form);

  console.log(formData.get('file'));

  const { data, status } = await api.post('/images/upload', formData);

  // const res = await fetch(API_URL_UPLOAD, {
  //   method: 'POST',
  //   headers: {
  //     // 'Content-Type': 'multipart/form-data',
  //     'X-API-KEY': 'b17def75-2cc5-400a-9ce0-f101efce2335',
  //   },
  //   body: formData,
  // });
  // const data = await res.json();

  console.log(data);

  if (status !== 201) {
    spamError.innerHTML = "Hubo un error: " + status + ' ' + data.message;
  } else {
    console.log('Foto de gato subida');
    saveFavouriteCats(data.id);
    upload__imgsContainer.innerHTML = "";
  }

  console.log(data);
  console.log(status);
};


loadRandomCats();
loadFavouritesCats();
