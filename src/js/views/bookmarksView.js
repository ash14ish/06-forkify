import View from "./View.js";
import previewView from "./previewView.js";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = " No bookmarks yet. Find a nice recipe and bookmark it :)";
  _message = "";
  _bookmarkOverlay = document.querySelector(".overlay-bookmark");

  constructor() {
    super();
    this._addHandlerShowBookmarkTab();
    this._addHandlerHideBookmarkTab();
  }

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _toggleBookmarkTab() {
    this._parentElement.closest(".bookmarks").classList.toggle("hidden");
    this._bookmarkOverlay.classList.toggle("hidden");
  }

  _addHandlerShowBookmarkTab() {
    document
      .querySelector(".nav__btn--bookmarks")
      .addEventListener("click", this._toggleBookmarkTab.bind(this));
  }

  _addHandlerHideBookmarkTab() {
    this._parentElement
      .closest(".bookmarks")
      .addEventListener("click", this._toggleBookmarkTab.bind(this));

    this._bookmarkOverlay.addEventListener(
      "click",
      this._toggleBookmarkTab.bind(this)
    );
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join("");
  }
}

export default new BookmarksView();
