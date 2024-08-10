const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const catFaves = document.getElementById("cat-column");
const faveBtn = document.getElementById("getFavouritesBtn");
const progressBar = document.getElementById("progress-bar");

const getFavouritesBtn = document.getElementById("getFavouritesBtn");

let carousel = document.getElementById("cat-column");

let API_KEY =
  "live_pSmjFQzPtXrYMiFp0YUHtvsMopyYu9WtRlGN5YMsY0kBnrvMaQJegT69HodpyRd2";

async function initialLoad() {
  try {
    const defaultOptions = {
      baseURL: "https://api.thecatapi.com/v1/breeds",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const addProgressBar = {
      onUploadProgress: function updateProgress(progressEvent) {
        let proPercent =
          Math.floor(progressEvent.loaded / progressEvent.total) * 100;

        progressBar.setAttribute("value", proPercent);

        console.log(proPercent);
      },
    };

    await axios.get(defaultOptions.baseURL, addProgressBar).then((response) => {
      let catData = response.data;

      axios.interceptors.request.use(
        function (config) {
          console.time(config.url);
          progressBar.style.width = "0%";
          document.body.style.cursor = "progress";

          return config;
        },
        function (error) {
          return Promise.reject(error);
        }
      );

      axios.interceptors.response.use(
        (response) => {
          console.timeEnd(response.config.url);
          console.log(response);
          document.querySelector("body").style.cursor = "default";
          progressBar.style.width = "100%";
          return response;
        },
        (error) => {
          console.timeEnd(error.response.config.url);
          return Promise.reject(error);
        }
      );

      catData.forEach((cat) => {
        let option = document.createElement("option");
        option.setAttribute("value", cat.id);
        option.textContent = cat.name;
        breedSelect.append(option);
      });

      breedSelect.addEventListener("change", (e) => {
        e.preventDefault();

        async function fetchCat() {
          let catBreed = breedSelect.value;
          console.log(catBreed);

          await axios
            .get(
              `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${catBreed}&api_key=${API_KEY}`
            )
            .then((response) => {
              let catData = response.data;
              return catData;
            })
            .then((catBreed) => {
              catBreed.map((element) => {
                console.log(element);

                document
                  .getElementById("this-cat")
                  .setAttribute("src", element.url);

                infoDump.innerHTML = `<h3>${element.breeds[0].name}</h3> <p>${element.breeds[0].description}</p><p>${element.breeds[0].temperament}</p>`;

                faveBtn.addEventListener("click", () => {
                  let catPics = document.createElement("img");
                  catPics.setAttribute("src", element.url);
                  catPics.classList.add("this-cat");
                  catPics.style.width = "50%";
                  catPics.style.padding = "20px";

                  catFaves.append(catPics);
                });
              });
            });
        }
        fetchCat();
      });
    });
  } catch (error) {
    console.error(error);
  }
}

initialLoad();
