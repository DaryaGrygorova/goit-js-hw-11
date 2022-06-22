import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import ImagesApiService from './js/ImagesApiService';
import LoadMoreBtn from './js/LoadMoreButton';
import { buildGalleryMarkup } from './js/buildGalleryMarkup';

const refs = {
  formEL: document.querySelector('#search-form'),
  galleryEL: document.querySelector('.gallery'),
  submitBtn: document.querySelector('[type="submit"]'),
};

let gallery = refs.galleryEL;
const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more' });

refs.formEL.addEventListener('submit', onFormSubmit);
loadMoreBtn.btn.addEventListener('click', onLoadMoreBtnClick);

async function onFormSubmit(event) {
  event.preventDefault();

  clearGalleryContainer();
  imagesApiService.query = event.currentTarget.elements.searchQuery.value.trim();
  imagesApiService.resetPage();

  if (imagesApiService.query === '') {
    Notify.failure('Please, enter a search term!');
    return;
  }
  await fetchImages();
  gallery = new SimpleLightbox('.gallery a', { showCounter: false, captionsData: 'alt', captionDelay: 300 });
}

async function onLoadMoreBtnClick() {
  await fetchImages();
  gallery.refresh();
  softScroll();
}

function fetchImages() {
  console.log(imagesApiService);
  loadMoreBtn.show();
  loadMoreBtn.disable();
  refs.submitBtn.disabled = true;

  return imagesApiService
    .fetchImages()
    .then(data => {
      buildGallery(data.hits);

      if (data.totalHits - (imagesApiService.page - 1) * 40 > 0) {
        loadMoreBtn.enable();
      } else {
        loadMoreBtn.hide();
        if (imagesApiService.page - 1 !== 1) {
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      }
      return data;
    })
    .catch(err => {
      loadMoreBtn.hide();
      Notify.failure(err);
    })
    .finally(() => {
      refs.submitBtn.disabled = false;
    });
}

function buildGallery(images) {
  const galleryMarkup = buildGalleryMarkup(images);
  refs.galleryEL.insertAdjacentHTML('beforeend', galleryMarkup);
}

function clearGalleryContainer() {
  refs.galleryEL.innerHTML = '';
}

function softScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
