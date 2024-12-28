const API_KEY = "249f222afb1002186f4d88b2b5418b55";
const API_SEARCH = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=`;
const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";
let page = 1;
const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_video=true&page=`;

const mainContent = document.getElementById("movie-content");
const form = document.getElementById("search-form");
const search = document.getElementById("search");
const pageLinks = document.querySelectorAll(".page-link");

// Initially get the most popular movies list's first page
getMovies(API_URL + page);

// Previous and next page
pageLinks.forEach((pageLink) => {
  pageLink.addEventListener("click", () => {
    if (pageLink.id === "next") {
      page++;
      getMovies(API_URL + page);
    }
    if (pageLink.id === "previous" && page > 1) {
      page--;
      getMovies(API_URL + page);
    }
  });
});

// Search for a movie
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = search.value;
  if (query) {
    getMovies(API_SEARCH + query);
  }
});

async function getMovies(url) {
  const resp = await fetch(url);
  const respData = await resp.json();
  showMovies(respData.results);
}

function showMovies(movies) {
  mainContent.innerHTML = ""; // Clear previous movies
  movies.forEach((movie) => {
    const movieTitle = movie.title;
    const moviePoster = movie.poster_path;
    const movieVote = movie.vote_average;

    const movieElm = document.createElement("div");
    movieElm.classList.add(
      "col-xs-12",
      "col-sm-6",
      "col-md-4",
      "col-lg-3",
      "p-0"
    );
    movieElm.innerHTML = `
            <div class="movie-card">
                <img
                    class="img-fluid movie-img"
                    src="${IMAGE_PATH}${moviePoster}"
                    onError="this.onerror=null;this.src='https://i.ebayimg.com/images/g/1EMAAMXQdGJR2-n3/s-l1600.jpg';"
                    alt="Sorry, something went wrong"
                />
                <div class="movie-description p-3 d-flex justify-content-between align-items-center">
                    <h3 class="movie-title">${movieTitle}</h3>
                    <h3 class="movie-vote">${movieVote}</h3>
                </div>
                <div class="comments">
                    <h4>Comments:</h4>
                    <ul class="comment-list"></ul>
                    <input type="text" class="comment-input" placeholder="Add a comment...">
                    <button class="comment-btn">Comment</button>
                </div>
                <button class="watchlist-btn">Add to Watchlist</button>
            </div>
        `;

    // Add event listeners for comments and watchlist
    const commentInput = movieElm.querySelector(".comment-input");
    const commentList = movieElm.querySelector(".comment-list");
    const commentBtn = movieElm.querySelector(".comment-btn");
    const watchlistBtn = movieElm.querySelector(".watchlist-btn");

    // Handle adding comments
    commentBtn.addEventListener("click", () => {
      const commentText = commentInput.value.trim();
      if (commentText) {
        const listItem = document.createElement("li");
        listItem.textContent = commentText;
        commentList.appendChild(listItem);
        commentInput.value = ""; // Clear the input
      } else {
        alert("Please enter a comment.");
      }
    });

    // Handle adding to watchlist
    watchlistBtn.addEventListener("click", () => {
      const watchlistItems = document.querySelector(".watchlist-items");
      const existingItem = Array.from(watchlistItems.children).find(
        (item) => item.textContent === movieTitle
      );

      if (!existingItem) {
        const listItem = document.createElement("li");
        listItem.textContent = movieTitle;
        watchlistItems.appendChild(listItem);
        alert(`${movieTitle} has been added to your watchlist.`);
      } else {
        alert(`${movieTitle} is already in your watchlist.`);
      }
    });

    mainContent.appendChild(movieElm);
  });
}
