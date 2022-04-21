// module import
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";

// console.log(model);

// npm module import
import "core-js/stable";
import "regenerator-runtime/runtime.js";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controllerRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;

    // Rendering Spinner
    recipeView.renderSpinner();

    // 1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get Query

    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load Search Results

    await model.loadSearchResults(query);

    // 3) Render Results
    // console.log(model.getSearchResultsPage());
    resultsView.render(model.getSearchResultsPage());

    // 4) Render Initial Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) Render New Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render Initial Pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1) Update the recipe (in state)
  model.updateRecipe(newServings);

  // 2) Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controllerRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
