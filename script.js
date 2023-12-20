const API_KEY = 'api_key=f74ebae20cbc9952c093f044fa1a090c'
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?language=pt-BRsort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

const main = document.getElementById('main');

getMovies(API_URL);

function getMovies(url) {

    fetch(url).then(res => res.json()).then(data =>{
        console.log(data.results)
        showMovies(data.results);

    })
}

function showMovies(data){
    main.innerHTML = '';
    data.forEach(movie => {
        const{title, poster_path, vote_average, overview} = movie;
        const moviEl = document.createElement('div');
        moviEl.classList.add('filme');
        moviEl.innerHTML = `
        
        <img src="${IMG_URL+poster_path}" alt="${title}">

        <div class="filme_info">
            <h2> ${title} </h2>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>

        <div class="descricao">
            <h3>Descricao</h3>
            ${overview}
        </div>
        `

        main.appendChild(moviEl)
    })
}

function getColor(vote) {
    if(vote >= 7){
        return 'verde'
    } else if(vote >= 5){
        return 'laranja'
    } else {
        return 'vermelho'
    }
}