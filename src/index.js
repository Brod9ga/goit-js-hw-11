import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { clearTotalSearch}from './clearTotalSearch';
import {clearPages} from './clearPages'
import { clearGallary } from './clearGallary';
import { clearBtnAddMore } from './clearBtnAddMore';


const form = document.querySelector('.search-form');
const input = document.querySelector('[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const btnAddMore = document.querySelector('.btnAddMore')
const divBtnAddMore = document.querySelector('.js_btn_add_More')

let pages = 1;
let wordToSeach = '';
let totalSearch = 0;
let totalHits = 1
// btnAddMore.style.display = 'none'

form.style.backgroundColor = 'blue';
form.style.padding = '20px';
form.style.textAlign = 'center';
form.style.position = 'sticky';
form.style.margin = '0';
form.style.top = '-1px';
gallery.style.display = 'flex';
gallery.style.flexWrap = 'wrap';
gallery.style.justifyContent = 'center';
gallery.style.gap = '20px';
btnAddMore.style.display = 'none';
btnAddMore.style.margin = '0 auto';
btnAddMore.style.marginTop = '20px';
btnAddMore.style.padding = '15px 30px';
btnAddMore.style.fontSize = '16px';
btnAddMore.style.backgroundColor = 'blue';
btnAddMore.style.border = 'none';
btnAddMore.style.color = 'white';
btnAddMore.style.width = "50px"
btnAddMore.style.heigth = "100px"

form.addEventListener('submit', e => {
  e.preventDefault();

  clearGallary()
  wordToSeach = input.value.trim();
  if(wordToSeach === ''){
    Notify.failure('Please, input value');
    return;
  }
 clearPages()
 clearGallary()
 clearTotalSearch()
  clearBtnAddMore();
  addCard(e);
  addBtnAddMore();
  if(totalHits<=totalSearch){clearBtnAddMore(),Notify.info("We're sorry, but you've reached the end of search results.");}
 
});



async function getFoto() {
  const searchFoto = await axios.get('https://pixabay.com/api/', {
    params: {
      key: '36610432-c2e311e7e488000960139023f',
      q: wordToSeach,
      orientation: 'horizontal',
      safesearch: true,
      per_page: '40',
      page: pages,
    },
  });
  return searchFoto;
}
async function addCard(e) {
  try {
    const response = await getFoto(input.value.trim);
    totalHits = await response.data.totalHits
   
    if (totalSearch >= totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      clearBtnAddMore()

      return;
    } if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } 

    
    const resps = response.data.hits
      .map(data => {
        // Обращаемся к полю data.hits для получения массива фотографий
        return `<div class="photo-card"><a href="${data.largeImageURL}"><img src="${data.webformatURL}" alt="${data.tags}" loading="lazy" /></a><div class="info">  <p class="info-item">    <b>Likes:</b> ${data.likes}</p>  <p class="info-item">        <b>Views:</b> ${data.views}</p> <p class="info-item">    <b>Comments:</b> ${data.comments}</p>  <p class="info-item">    <b>Downloads:</b> ${data.downloads}</p></div ></div>`;
      })
      .join('');
    gallery.insertAdjacentHTML('beforeend', resps);
    const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
  
    pages++;
    totalSearch += 40;
    
  } catch (error) {
    console.error(error);
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    ); // Выводим уведомление об ошибке загрузки фотографий
  } finally {
    input.value = '';
  }
}
function addBtnAddMore() {
  divBtnAddMore.innerHTML = '<button class="btnAddMore">Add More</button>';
  const btnAddMore = document.querySelector('.btnAddMore');
  btnAddMore.addEventListener('click', async () => addCard(event)); // Обработчик события для кнопки "Add More"
}
function clearPages(){
  pages=1
  }
  function clearTotalSearch(){
    totalSearch = 0
  }
function loadMoreImages() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    addCard();
  }
}

window.addEventListener('scroll', loadMoreImages);