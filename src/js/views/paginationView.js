import View from "./View.js";
import icons from "../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;

      const goto = +btn.dataset.goto;

      handler(goto);
    });
  }

  // markup generation
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);

    // Page 1 and other pages
    if (this._data.page === 1 && numPages > 1) {
      return this._generateMarkupNextPage(curPage);
    }

    // Last Page
    if (numPages === this._data.page && numPages > 1) {
      return this._generateMarkupPrevPage(curPage);
    }

    // Other Pages
    if (this._data.page < numPages) {
      return (
        this._generateMarkupPrevPage(curPage) +
        this._generateMarkupNextPage(curPage)
      );
    }

    // Page 1 and no other pages
    else {
      return ``;
    }
  }

  _generateMarkupPrevPage(page) {
    return `<button data-goto="${
      page - 1
    }" class="btn--inline pagination__btn--prev">
  <svg class="search__icon">
    <use href="${icons}#icon-arrow-left"></use>
  </svg>
  <span>Page ${page - 1}</span>
</button>
`;
  }

  _generateMarkupNextPage(page) {
    return `<button data-goto="${
      page + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
  }
}

export default new PaginationView();
