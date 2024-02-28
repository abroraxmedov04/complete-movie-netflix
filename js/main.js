// get elements
let fragment = document.createDocumentFragment();
let elTemplateCard = document.querySelector(".js-template").content;
let elCardWrapper = document.querySelector(".js-movie-list");
let elFormForFunctionality = document.querySelector(
  ".js-form-for-functionality"
);
let elInputSearch = document.querySelector(".js-input-search");
let elSelectCategory = document.querySelector(".js-select-option-input");
let elInputMinYear = document.querySelector(".js-min-year-input");
let elInputMaxYear = document.querySelector(".js-max-year-input");
let elSortSElect = document.querySelector(".js-select-option-input-sort");
let uniqCategories = [];
let moviesSliced = movies.slice(0, 25);
function uniqueFenres(arr) {
  for (const movie of arr) {
    let categories = movie.categories;
    for (const category of categories) {
      if (!uniqCategories.includes(category)) {
        uniqCategories.push(category);
      }
    }
  }
}
uniqueFenres(movies);

function sortByvalalues(elSortSElect, allFunctionality) {
  if (elSortSElect.value == "AtoZ") {
    allFunctionality.sort((a, b) => {
      return (
        a.title.toLowerCase().charCodeAt(0) -
        b.title.toLowerCase().charCodeAt(0)
      );
    });
  }
  if (elSortSElect.value == "ZtoA") {
    allFunctionality.sort((a, b) => {
      return (
        b.title.toLowerCase().charCodeAt(0) -
        a.title.toLowerCase().charCodeAt(0)
      );
    });
  }
  if (elSortSElect.value == "NewToOld") {
    allFunctionality.sort((a, b) => {
      return a.movie_year - b.movie_year;
    });
  }
  if (elSortSElect.value == "OldToNewd") {
    allFunctionality.sort((a, b) => {
      return b.movie_year - a.movie_year;
    });
  }
  if (elSortSElect.value == "TopYoLow") {
    allFunctionality.sort((a, b) => {
      return a.imdb_rating - b.imdb_rating;
    });
  }
  if (elSortSElect.value == "lowtoTop") {
    allFunctionality.sort((a, b) => {
      return b.imdb_rating - a.imdb_rating;
    });
  }
}

function renderCategory(category) {
  category.forEach((item) => {
    let option = document.createElement("option");
    option.textContent = item;
    option.value = item;
    option.classList.add("js-option-category", "font-bold");
    elSelectCategory.appendChild(option);
  });
}
renderCategory(uniqCategories);
function getHourAndMin(data) {
  let hour = Math.floor(data / 60);
  let min = Math.floor(data % 60);
  return `${hour} h ${min} min`;
}

function renderMovies(arr, node) {
  arr.forEach((item) => {
    let cloneNode = elTemplateCard.cloneNode(true);
    cloneNode.querySelector(".js-movie-image").src = item.image_url;
    cloneNode.querySelector(".js-movie-name").textContent =
      item.title.length > 30 ? `${item.title.substring(0, 30)}...` : item.title;
    cloneNode.querySelector(".js-movie-rating").textContent = item.imdb_rating;
    cloneNode.querySelector(".js-movie-year").textContent = item.movie_year;
    cloneNode.querySelector(".js-movie-watch-time").textContent = getHourAndMin(
      item.runtime
    );
    cloneNode.querySelector(".js-movie-genres").textContent =
      item.categories.join(", ");

    cloneNode.querySelector(".js-modal-btn").dataset.imdbId = item.imdb_id;
    fragment.appendChild(cloneNode);
  });
  node.appendChild(fragment);
}
renderMovies(moviesSliced, elCardWrapper);
elFormForFunctionality.addEventListener("submit", (evet) => {
  evet.preventDefault();
  let inputValue = elInputSearch.value.trim();
  let searchRegex = new RegExp(inputValue, "gi");
  let allFunctionality = movies.filter((item) => {
    return (
      item.title.match(searchRegex) &&
      (elSelectCategory.value == "all" ||
        item.categories.includes(elSelectCategory.value)) &&
      (elInputMinYear.value == "" || item.movie_year >= elInputMinYear.value) &&
      (elInputMaxYear.value == "" || item.movie_year <= elInputMaxYear.value)
    );
  });
  elCardWrapper.innerHTML = "";
  if (allFunctionality.length > 0) {
    sortByvalalues(elSortSElect, allFunctionality);
    renderMovies(allFunctionality, elCardWrapper);
    console.log("hi Im woriking 🤞");
  } else {
    renderInitialMovies(moviesSliced, elCardWrapper);
    console.log("No matching movies found");
  }
});

// modal
elCardWrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("js-modal-btn")) {
    let imdb = e.target.dataset.imdbId;
    let getMovie = movies.find((movie) => movie.imdb_id == imdb);
    renderModal(getMovie);
  }
});

const elModal = document.querySelector(".js-modal");
const elCloseModal = document.querySelector(".js-modal-close");
const elframe = document.querySelector(".js-frame-modal");
const elModalTitle = document.querySelector(".js-movie-title-modal");
const elMovierating = document.querySelector(".js-movie-rating-modal");
const elMovieYear = document.querySelector(".js-movie-year-modal");
const elMovieRuntime = document.querySelector(".js-movie-watch-time-modal");
const elModalSummary = document.querySelector(".js-summary-modal");
const elMovieModalLink = document.querySelector(".js-movie-link-modal");

function renderModal(movie) {
  elModal.classList.remove("hidden");
  elCloseModal.addEventListener("click", (evet) => {
    elModal.classList.add("hidden");
  });

  elframe.src = movie.movie_frame;
  elModalTitle.textContent = movie.fulltitle;
  elMovierating.textContent = movie.imdb_rating;
  elMovieYear.textContent = movie.movie_year;
  elMovieRuntime.textContent = getHourAndMin(movie.runtime);
  elModalSummary.textContent = movie.summary;
  elMovieModalLink.href = movie.imdb_link;
}
