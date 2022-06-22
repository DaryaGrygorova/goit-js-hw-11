import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const URL_ORIGIN = 'https://pixabay.com/api/';

    const searchParam = new URLSearchParams({
      key: '28168095-f0304d55a0b5c15c6597d0047',
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: 40,
    });

    return axios
      .get(`${URL_ORIGIN}?${searchParam}`)
      .then(response => {
        if (response.status !== 200) {
          return Promise.reject(`Error: ${response.message}`);
        }
        if (!response.data.totalHits) {
          return Promise.reject(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
        if (this.page === 1) {
          Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
        }
        this.incrementPage();
        return response.data;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
