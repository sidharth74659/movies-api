// https://www.themoviedb.org/settings/api
// api_key : 
import api_key from './config.js'
document.addEventListener('DOMContentLoaded',() =>  loadPopularMovies());

let nav__items = document.querySelectorAll('.nav__items .nav__item');
let nav__btn = document.querySelector('.nav__btn');
let result = document.querySelector('.result');
let pages = document.querySelectorAll('.pagination li');

nav__items.forEach(item =>
    item.addEventListener('click', function (e) {
        nav__items.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
    })
)

pages.forEach(page =>
    page.addEventListener('click', function (e) {
        pages.forEach(page => page.classList.remove('active'));
        this.classList.add('active');
        console.log(parseInt(page.textContent));

        loadPopularMovies(parseInt(page.textContent))
    })
)

nav__btn.addEventListener('click', function (e) {
    document.querySelector('.nav').classList.toggle('close');
})
console.log(api_key);


// remember to apply overview
async function loadPopularMovies(pageNumber = 1) {
    console.log("called");
    
    let res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${pageNumber}`)
    let data = await res.json();
    result.innerHTML = '';
    result.innerHTML += data.results.map(movie =>
        `<section class="movie">
            <div class="movie__poster">
                <img src="https://image.tmdb.org/t/p/w185${movie.poster_path}" alt="${movie.title}" class="movie__poster__img">
            </div>
            <div class="movie__title" title="${movie.title}">${movie.title.length > 23 ? movie.title.substring(0, 23) + "..." : movie.title}</div>
            <div class="movie__date">(${movie.release_date.split('-')[0]})</div>
          </section>`
    ).join('');
}