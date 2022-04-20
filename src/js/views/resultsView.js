import View from "./View.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage =
    "No recipe is found for your query. Please try with a different keyword";

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join("");
  }

  _generateMarkupPreview(curr) {
    return `<li class="preview">
  <a class="preview__link" href="#${curr.id}">
    <figure class="preview__fig">
      <img src="${curr.image}" alt="${curr.title}" />
    </figure>
    <div class="preview__data">
      <h4 class="preview__title">${curr.title} ...</h4>
      <p class="preview__publisher">${curr.publisher}</p>
    </div>
  </a>
</li>`;
  }
}

export default new ResultsView();
