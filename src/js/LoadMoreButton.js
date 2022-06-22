export default class LoadMoreBtn {
  constructor({ selector, hidden = true }) {
    this.btn = this.getRef(selector);
    hidden && this.hide();
  }
  
  getRef(selector) { 
  return document.querySelector(selector)
  }
  
  show() {
   this.btn.classList.remove('is-hidden');
  }

  hide() {
   this.btn.classList.add('is-hidden');
  }

  enable() {
    this.btn.disabled = false;
    this.btn.textContent = "Load more";
  }

  disable() { 
    this.btn.disabled = true;
    this.btn.textContent = "Loading...";
  }
}

