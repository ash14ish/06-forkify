import "regenerator-runtime/runtime.js";
import { API_URL, RES_PER_PAGE } from "./config.js";
import { getJSON } from "./helper.js";

const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
};

const loadRecipe = async function (id) {
  try {
    // console.log(res, data);
    let data = await getJSON(`${API_URL}${id}`);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      cookingTime: recipe.cooking_time,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      ingredients: recipe.ingredients,
      servings: recipe.servings,
    };
    // console.log(state.recipe.servings);
  } catch (err) {
    // alert(err);
    throw err;
  }
};

const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    let data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(
      (rec) =>
        (state.results = {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          image: rec.image_url,
        })
    );
    // console.log(state.results);
  } catch (err) {
    // alert(err);
    throw err;
  }
};

function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * 10; //start -> 0,10,20;
  const end = page * 10; // end -> 9(10),19(20),29(30);

  return state.search.results.slice(start, end);
}

function updateRecipe(newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity / state.recipe.servings) * newServings;
  });
  state.recipe.servings = newServings;
}

export {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultsPage,
  updateRecipe,
};
