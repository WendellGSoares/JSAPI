const API_KEY = 'api_key='
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?language=pt-BRsort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

const genres = [
    {
      "id": 28,
      "name": "Ação"
    },
    {
      "id": 12,
      "name": "Aventura"
    },
    {
      "id": 16,
      "name": "Animação"
    },
    {
      "id": 35,
      "name": "Comédia"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentátirio"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Familia"
    },
    {
      "id": 14,
      "name": "Fantasia"
    },
    {
      "id": 36,
      "name": "Hitória"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Musical"
    },
    {
      "id": 9648,
      "name": "Mistério"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Ficção Científica"
    },
    {
      "id": 10770,
      "name": "Programas de TV"
    },
    {
      "id": 53,
      "name": "Suspense"
    },
    {
      "id": 10752,
      "name": "Guerra"
    },
    {
      "id": 37,
      "name": "Faroeste "
    }
  ]

const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('pesquisa');
const tagsEl = document.getElementById('tags');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;


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
    lastUrl = url;
        fetch(url).then(res => res.json()).then(data =>{
            console.log(data.results)
            if(data.results.length !==0){
                showMovies(data.results);
                currentPage = data.page;
                nextPage = currentPage + 1;
                prevPage = currentPage - 1;
                totalPages = data.total_pages;
                current.innerText = currentPage;

                if(currentPage <= 1){
                    prev.classList.add('disabled');
                    next.classList.remove('disabled')
                }else if(currentPage>= totalPages){
                    prev.classList.remove('disabled');
                    next.classList.add('disabled')
                }else{
                    prev.classList.remove('disabled');
                    next.classList.remove('disabled')
                }

            } else {
                main.innerHTML= `<h1 class="resultado">Nenhum filme encontrado</h1>`
            }

        })
}

function showMovies(data){
    main.innerHTML = '';
    data.forEach(movie => {
        const{title, poster_path, vote_average, overview, vote_count, release_date} = movie;
        const moviEl = document.createElement('div');
        moviEl.classList.add('filme');
        moviEl.innerHTML = `
        
        <img src="${poster_path? IMG_URL+poster_path: "https://www.friking.es/cdn/shop/files/2661.jpg?v=1695323571&width=823"}" alt="${title}">

        <div class="filme_info">
            <h2> ${title}votos</h2>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>
            
        <div class="filme_info2">
            <p> ${release_date} </p>
        </div>

        <div class="descricao">
            <h3>Descricao - ${vote_count} Votos</h3> 
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

prev.addEventListener('click', () => {
    if(prevPage > 0){
      pageCall(prevPage);
    }
  })

next.addEventListener('click', () => {
    if(nextPage <= totalPages){
      pageCall(nextPage);
    }
  })
  
  function pageCall(page){
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length -1].split('=');
    if(key[0] != 'page'){
      let url = lastUrl + '&page='+page
      getMovies(url);
    }else{
      key[1] = page.toString();
      let a = key.join('=');
      queryParams[queryParams.length -1] = a;
      let b = queryParams.join('&');
      let url = urlSplit[0] +'?'+ b
      getMovies(url);
    }
}
