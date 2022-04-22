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
  bookmarks: [],
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

    // console.log(state.bookmarks);

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

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
    state.search.page = 1;
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

const persist = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

const addBookmark = function (recipe) {
  //1) Add Bookmark
  state.bookmarks.push(recipe);

  // 2) Bookmark fill add
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // 3) save the bookmark in local storage
  persist();
};

const deleteBookmark = function (id) {
  //1) Delete Bookmark
  const index = state.bookmarks.findIndex((curr) => curr.id === id);
  state.bookmarks.splice(index, 1);

  // 2) Bookmark fill add
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // 3) save the bookmark in local storage
  persist();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
// clearBookmarks();

export {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultsPage,
  updateRecipe,
  addBookmark,
  deleteBookmark,
};
