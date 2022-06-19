import View from "./View.js";
import previewView from "./previewView.js";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = " No bookmarks yet. Find a nice recipe and bookmark it :)";
  _message = "";

  constructor() {
    super();
    this._toggleBookMarkTab();
  }

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _toggleBookMarkTab() {
    document
      .querySelector(".nav__btn--bookmarks")
      .addEventListener("click", () => {
        this._parentElement.closest(".bookmarks").classList.toggle("hidden");
      });

    this._parentElement.closest(".bookmarks").addEventListener("click", e => {
      e.currentTarget.classList.add("hidden");
    });
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join("");
  }
}

export default new BookmarksView();
