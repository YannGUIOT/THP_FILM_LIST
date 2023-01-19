//******** Fetch API OMDbapi ********//

const doSearch= (search) =>{
  const newSearch = search.split(' ').join('_')
  fetch(`https://www.omdbapi.com/?s=${newSearch}&apikey=${api_key}`)
  .then((response) => response.json())
  .then((response) => {
    if (response.Response == "True"){
      views(response)
    }else{
      const allResult = document.getElementsByClassName('all-result')[0];
      allResult.innerHTML = 
      ` <h3> NO RESULT FOUND </h3>`
    }})
  .catch((error) => console.error(error))
}

//******** view of result ********//

const resultFilm = () =>{
  const search = document.getElementById('search');
  doSearch(search.value);
  return false;
  }

/// Create the films view ///
const views = (allFilms) => {
  const sectionResult = document.getElementsByClassName('all-result')[0];
  sectionResult.innerHTML ='';
  for(let i=0; i<allFilms.Search.length; i++){
    let image = allFilms.Search[i].Poster;
    if (allFilms.Search[i].Poster == 'N/A'){ image = 'img/poster-placeholder.png';}
    sectionResult.innerHTML += `
    <div class='film'>
      <div class='film-img'>
        <div class='more' onclick="loadModal('${allFilms.Search[i].imdbID}')">
          <p>More</p>
        </div>
        <div>
          <img src=${image} alt="">
        </div>
      </div>
      <div class='film-text'>
        <h2>${allFilms.Search[i].Title}</h2>
        <h4>Date : ${allFilms.Search[i].Year}</h4>
        <button onclick="loadModal('${allFilms.Search[i].imdbID}')" >Read More</button>
      </div>
    </div>`;
  }
  observer();
}

//******* Intersection observer *******//

const observer = () => {
  let observer = new IntersectionObserver(function (observables) {
    observables.forEach(function (observable) {
      if (observable.intersectionRatio > 0.5) {
        observable.target.classList.remove('not-visible')
      }
      if (observable.intersectionRatio < 0.5) {
        observable.target.classList.add('not-visible')
      }
    })
  }, {
    threshold: [0.5]
  });

  let items = document.getElementsByClassName('film');
  Array.from(items).forEach( (item) =>{
    item.classList.add('not-visible');
    observer.observe(item);
  })
}

//********* Modal interaction ********//

const loadModal = (id) =>{
  fetch(`https://www.omdbapi.com/?i=${id}&apikey=${api_key}`)
  .then((response) => response.json())
  .then((response) => createModal(response))
  .catch((error) => console.error(error))
}

/// Create Modal ///
const createModal = (film) => {
  const section = document.getElementsByClassName('modal-section')[0]
  let image = film.Poster;
  if (film.Poster =='N/A'){
    image = 'images/poster-placeholder.png';
  };
  section.innerHTML = `
    <div class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <span onclick='closeModal()' class='close'>&times;</span>
          <h2>${film.Title}</h2>
        </div>
        <div class="modal-body">
          <div class='modal-img'>
            <img src='${image}'>
          </div>
          <div class='modal-text'>
            <p>Date : ${film.Released}</p>
            <p>Actors : ${film.Actors}</p>
            <p>Awards : ${film.Awards}</p>
            <h3>${film.Plot}</h3>
            </div>
        </div>
      </div>
    </div>
    `
    const modal = document.getElementsByClassName('modal')[0];
    modal.style.display='block';
}    

/// Delete modal ///
const closeModal = () => {
  const section = document.getElementsByClassName('modal-section')[0];
  const modal = document.getElementsByClassName('modal')[0];
  modal.style.display='none';
  section.innerHTML='';
}