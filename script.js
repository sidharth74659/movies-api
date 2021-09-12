
// https://www.themoviedb.org/settings/api

// checkout : 
// Links : https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage
// Demo for above link (observe source code) : https://mdn.github.io/learning-area/javascript/apis/client-side-storage/indexeddb/notes/
// Other links : https://medium.com/javascript-dots/cache-api-in-javascript-644380391681


import api_key from './config.js'

let nav__items = document.querySelectorAll('.nav__items .nav__item');
let pages = document.querySelectorAll('.pagination li');
let nav__btn = document.querySelector('.nav__btn');
let result = document.querySelector('.result');

nav__items.forEach(item =>
    item.addEventListener('click', function (e) {
        nav__items.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
    })
)


nav__btn.addEventListener('click', function (e) {
    document.querySelector('.nav').classList.toggle('close');
})

document.addEventListener('DOMContentLoaded', () => DisplayMovies());


pages.forEach(page =>
    page.addEventListener('click', function (e) {
        pages.forEach(page => page.classList.remove('active'));
        this.classList.add('active');
        DisplayMovies(parseInt(page.textContent))
    })
)



async function DisplayMovies(pageNumber = 1) {
    let res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${pageNumber}`,)
    let data = await res.json();
    console.log(data);
    result.innerHTML = '';
    result.innerHTML += data.results.map(movie => `<section class="movie">
                <div class="movie__poster">
                    <img src="https://image.tmdb.org/t/p/w185${movie.poster_path}" alt="${movie.title}" class="movie__poster__img">
                </div>
                <div class="movie__title" title="${movie.title}">${movie.title.length > 23 ? movie.title.substring(0, 23) + "..." : movie.title}</div>
                <div class="movie__date">(${movie.release_date ? movie.release_date.split('-')[0] : "Unknown"})</div>
              </section>`).join('');
}

