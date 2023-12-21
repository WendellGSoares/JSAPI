const API_KEY = 'api_key=f74ebae20cbc9952c093f044fa1a090c'
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?language=pt-BRsort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]

const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('pesquisa');
const tagsEl = document.getElementById('tags');


var selectedGenre = []
setGenre();

function setGenre() {
    tagsEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            } else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagsEl.append(t);
    })
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag =>{
        tag.classList.remove('highlight')
    })
    if(selectedGenre.length != 0){
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id)
            highlightedTag.classList.add('highlight')

        })
    }
}

getMovies(API_URL);

function getMovies(url) {

    fetch(url).then(res => res.json()).then(data =>{
        console.log(data.results)
        if(data.results.length !==0){
            showMovies(data.results);
        } else {
            main.innerHTML= `<h1 class="resultado">Nenhum filme encontrado</h1>`
        }

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

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = pesquisa.value;
    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }

})