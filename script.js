
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


let local_storage_data = [];

nav__items.forEach(item =>
    item.addEventListener('click', function (e) {
        nav__items.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
    })
)


nav__btn.addEventListener('click', function (e) {
    document.querySelector('.nav').classList.toggle('close');
})

document.addEventListener('DOMContentLoaded', () => loadPopularMoviesFromNetwork());


pages.forEach(page =>
    page.addEventListener('click', function (e) {
        pages.forEach(page => page.classList.remove('active'));
        this.classList.add('active');
        console.log(parseInt(page.textContent));

        loadPopularMoviesFromNetwork(parseInt(page.textContent))
    })
)


async function loadPopularMoviesFromNetwork(pageNumber = 1) {
    let res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${pageNumber}`)
    let data = await res.json();
    DisplayMovies(data.results);
    loadIntoLocalStorage(pageNumber, data);

    // DisplayMovies(JSON.parse(localStorage.getItem(`page${pageNumber}`)), false);
    // if (localStorage.getItem(`page${pageNumber}`) === null) {
    //     console.log("from network");
    // } else {
    //     console.log("from console");
    // }
}
function DisplayMovies(data, fromNetwork = true) {
    console.log(data);
    // let counter = 0;
    result.innerHTML = '';
    result.innerHTML += data.map(movie => {
        // console.log(fromNetwork ? 'https://image.tmdb.org/t/p/w185' + movie.poster_path : movie.poster_path);

        // console.log(counter++ + ' ' + movie.poster_path);

        return `<section class="movie">
                <div class="movie__poster">
                    <img src="${fromNetwork ? 'https://image.tmdb.org/t/p/w185' + movie.poster_path : movie.poster_path}" alt="${movie.title}" class="movie__poster__img">
                </div>
                <div class="movie__title" title="${movie.title}">${movie.title.length > 23 ? movie.title.substring(0, 23) + "..." : movie.title}</div>
                <div class="movie__date">(${movie.release_date ? movie.release_date.split('-')[0] : "Unknown"})</div>
              </section>`}
    ).join('');
}


async function loadIntoLocalStorage(pageNumber, { results: data }) {
    console.log(data);

    for (let movie of data) {
        // console.log(movie);

        let img_blob = await fetch(`https://image.tmdb.org/t/p/w185${movie.poster_path}`).then(res => res.blob());  //this contains the img_blob that is  size andd type of file (image/jpeg)

        //from 'dcode' youtube channel on 'how to save images to local storage'  
        let img_reader = new FileReader();
        img_reader.readAsDataURL(img_blob);
        img_reader.onload = () => (movie.poster_path = img_reader.result)
        console.log(img_reader);


    }
    console.log(data);
    DisplayMovies(data, false);
    localStorage.setItem(`page${pageNumber}`, JSON.stringify(data));

}
