const searchfield = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const showSearch = document.getElementById("show-search");
const trending = document.getElementById("movie-list-trending");
const popular = document.getElementById("movie-list-popular");
const upcoming = document.getElementById("movie-list-upcoming");
const topRated = document.getElementById("movie-list-top-rated");

const apiKey = config.apiKey;

async function showSearchMovies(query) {

    try {
     const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${apiKey}`);
     const data = await res.json();
     console.log(data);
    
    const movies = data.results;
    if(!movies.length) return;

    showSearch.innerHTML = "";   //clear previous result

    formatCard(movies, showSearch);  // reuseable card format function
      
    } catch (error) {
      console.error("Failed to fetch movie", error);
      alert("Someting went wrong. Please try again later.")
    }
};

// call showSearchMovies() for search input
function searchMovie(){
   const queryInput = searchfield.value.trim();
    if(!queryInput) return;
    showSearchMovies(queryInput);
};

//search by pressing Enter in input
searchfield.addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
      searchMovie();
    }
});

searchBtn.addEventListener("click", searchMovie);

// render first page load
async function renderTrendingMovies(){
    
   try{                      
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&api_key=${apiKey}`);
    const data = await res.json();

    const movies = data.results;   //movies list results
    if(!movies.length) return;

    trending.innerHTML = "";    // clear previous

    formatCard(movies, trending);    // reuseable card format function

    } catch (error) {
      console.error("Failed to fetch movies", error);
    }
};
  

// render first page load
async function renderPopularMovies(){

   try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=${apiKey}`);
    const data = await res.json();

    const movies = data.results;
    if(!movies.length) return;

    popular.innerHTML= "";

    formatCard(movies, popular);   // reuseable card format function

   } catch (error) {
     console.error("Failed to fetch movies", error)
   }
};

async function renderUpcomingMovies(){

  const now = new Date();
  const until = new Date();
  until.setDate(now.getDate()+30);   // get next 30 days
 
   try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?&primary_release_date.gte=${now}&primary_release_date.lte=${until}&language=en-US&page=1&api_key=${apiKey}`);
    const data = await res.json();

    const movies = data.results;
    if(!movies.length) return;

    upcoming.innerHTML= "";

    formatCard(movies, upcoming);    // reuseable card format function

   } catch (error) {
     console.error("Failed to fetch movies", error)
   }
};

async function renderTopRatedMovies(){

   try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&api_key=${apiKey}`);
    const data = await res.json();
  
    const movies = data.results;
    if(!movies.length) return;

    topRated.innerHTML= "";

    formatCard(movies, topRated);     // reuseable card format function

   } catch (error) {
     console.error("Failed to fetch movies", error)
   }
};

//  reuseable card format to all categories
function formatCard(movies,container){
   
     movies.forEach(movie=>{
        const li = document.createElement("li");
        li.classList.add("card");
        li.innerHTML = `
         <div class="card-container">
           <div class="movie-card" style="background-image: url('https://image.tmdb.org/t/p/w500${movie.poster_path}')"></div>
           <h3>${movie.title}</h3> 
         </div>  
        `;

        li.addEventListener("click", ()=>showModal(movie));
        container.appendChild(li);   // append in each category
    });
};


// display movie trailer
async function getVideo(movie_id){
    
    try {                     
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos?language=en-US&api_key=${apiKey}`);
      const data = await res.json();
      console.log(data);
                              //find trailer or teaser that match video type on youtube
      const trailer  = data.results.find(video=> ["Trailer","Teaser"].includes(video.type) && video.site === "YouTube"); 
      if(trailer){
        const url = `https://youtu.be/${trailer.key}` ;  //check main link from youtube

        window.open(url,"_blank"); //argument to open link in another page
        
      }else{
        console.log("No trailer found on YouTube");
      }
    } catch (error) {
      console.error("Failed to fetch video", error);
    }
};

let currentMovie = null;
const modal = document.querySelector(".modal");

   // close modal that being clicked
    modal.addEventListener("click",(e) => {
   if(e.target === e.currentTarget){
      modal.classList.remove("show");
      currentMovie = null;
   }   
});

//click to show movie modal
async function showModal(movie){
    const modalContent = document.querySelector(".modal-box");

    if(currentMovie === movie.id){         // id from api  ,if same movie so hide modal
      modal.classList.remove("show");
      currentMovie = null;
      return;
    }
    
    modalContent.innerHTML = `
         <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
         <div class="movie-details">
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date} <span class="lang">(${movie.original_language})</span></p>
            <p class="overview">Overview</p>
            <p class="content">${movie.overview || "-"}</p>    
            <p class="score"><i class="fa-solid fa-star"></i> ${(movie.vote_average).toFixed(1)}</p>
            <button class="trailer-btn"><i class="fa-solid fa-play"></i>Trailer</button>         
         </div>
    `
      modal.classList.add("show");
      currentMovie = movie.id;

       // click trailer btn to watch by calling function getVideo();
      modalContent.querySelector(".trailer-btn").addEventListener("click",()=>getVideo(movie.id));

       //click content to close
      modalContent.addEventListener("click",()=>{
      modal.classList.remove("show");

    });
  };    

// initial call on page load
renderTrendingMovies(); 
renderPopularMovies();  
renderUpcomingMovies();
renderTopRatedMovies();
