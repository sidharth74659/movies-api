// this has nothing to do with the project, its just an attempt to implement IndexDB instead of localStorage


window.onload = function () {
    let db;
    // let offline_img = [];

    //create an instance of IndexedDB with name imagesOne and version 1
    let img_store = window.indexedDB.open('imagesOne', 1);

    //if the database doesn't exist, this creates it and then calls img_store.onsuccess
    img_store.onupgradeneeded = function (e) {
        //this contains the img_store reference
        let db = e.target.result;   //a.k.a img_store.result

        //create an object store called imagesOne and set the autoIncrement property to true
        let objectStore = db.createObjectStore('imagesOne', { keyPath: 'name' });

        objectStore.createIndex('img', 'jpeg', { unique: false });
        console.log('Database setup complete');
    };

    img_store.onerror = function () {
        console.log('Database failed to open');
    };

    // onsuccess handler signifies that the database opened successfully
    img_store.onsuccess = function () {
        console.log('Database opened succesfully');

        // Store the opened database object in the db variable
        db = img_store.result;

        loadPopularMoviesFromNetwork();

    };

    let img_blob_url;
    async function storeMoviesInDB(movie) {
        //store the image to indexeddb


        let img_name = movie.poster_path;
        let img_blob = await fetch(`https://image.tmdb.org/t/p/w185${movie.poster_path}`).then(res => res.blob());  //this contains the img_blob that is  size andd type of file (image/jpeg)
        // offline_img.push(img_blob);
        let img_file = new File([img_blob], movie.title);
        let img_file_url = URL.createObjectURL(img_file);   //creates a  blob type that can be accessed offline, example : "blob:http://127.0.0.1:5500/f77e3e9e-7d3e-4854-ab48-8bbe45d36812"
console.log("asfasf");

        let record = {
            img_file,
            img_name,
            release_date: movie.release_date,
            overview: movie.overview,
            name: movie.title
        };

        let request = db.transaction(['imagesOne'], 'readwrite').objectStore('imagesOne');
        request.add(record);

        return (img_blob_url = img_file_url);
    }



    pages.forEach(page =>
        page.addEventListener('click', function (e) {
            pages.forEach(page => page.classList.remove('active'));
            this.classList.add('active');
            console.log(parseInt(page.textContent));

            loadPopularMoviesFromNetwork(parseInt(page.textContent))
        })
    )

    // remember to apply overview
    async function loadPopularMoviesFromDB(pageNumber = 1) {
        console.log('fetching videos from network');
        // Fetch the MP4 and WebM versions of the video using the fetch() function,
        // then expose their response bodies as blobs
        let mp4Blob = fetch('videos/' + video.name + '.mp4').then(response =>
            response.blob()
        );
        let webmBlob = fetch('videos/' + video.name + '.webm').then(response =>
            response.blob()
        );

        // Only run the next code when both promises have fulfilled
        Promise.all([mp4Blob, webmBlob]).then(function (values) {
            // display the video fetched from the network with displayVideo()
            displayVideo(values[0], values[1], video.name);
            // store it in the IDB using storeVideo()
            storeMoviesInDB(values[0], values[1], video.name);
        });
    }
    async function loadPopularMoviesFromNetwork(pageNumber = 1) {
        let res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${pageNumber}`)
        let data = await res.json();
        // let blob = await res.blob()
        // console.log(blob)


        result.innerHTML = '';
        result.innerHTML += data.results.map(movie => {
            let img_url = storeMoviesInDB(movie);

            return `<section class="movie">
                <div class="movie__poster">
                    <img src="https://image.tmdb.org/t/p/w185${movie.poster_path}" alt="${movie.title} class="movie__poster__img">
                </div>
                <p class="overview">${movie.overview}</p>
                <div class="movie__title" title="${movie.title}">${movie.title.length > 23 ? movie.title.substring(0, 23) + "..." : movie.title}</div>
                <div class="movie__date">(${movie.release_date ? movie.release_date.split('-')[0] : "Unknown"})</div>
              </section>`}
        ).join('');
    }


}