const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");
let carousel = document.getElementById("car-img");

let API_KEY =
  "live_pSmjFQzPtXrYMiFp0YUHtvsMopyYu9WtRlGN5YMsY0kBnrvMaQJegT69HodpyRd2";

async function initialLoad() {
  catUrl = `https://api.thecatapi.com/v1/breeds`;

  await axios.get(catUrl).then((response) => {
    let catData = response.data;

    catData.forEach((cat) => {
      let option = document.createElement("option");

      option.setAttribute("value", cat.id);
      option.textContent = cat.name;
      breedSelect.append(option);
    });

    breedSelect.addEventListener("change", (e) => {
      e.preventDefault();
      let item = document.createElement("div");
      async function fetchCat() {
        let catBreed = breedSelect.value;
        console.log(catBreed);

        await fetch(
          `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${catBreed}&api_key=${API_KEY}`
        )
          .then((response) => {
            return response.json();
          })
          .then((catBreed) => {
            catBreed.map((element) => {
              console.log(element);

              let catImage = element.url;
              document.getElementById("this-cat").setAttribute("src", catImage);
              console.log(catImage);
              carousel.append(catImage);

              item.innerHTML = `<h3>${element.breeds[0].name}</h3> <p>${element.breeds[0].description}</p><p>${element.breeds[0].temperament}</p>`;
            });
            infoDump.appendChild(item);
          });
      }
      fetchCat();
    });
  });
}

// initialLoad();
