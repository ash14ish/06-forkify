import "regenerator-runtime/runtime.js";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
// import { getJSON, sendJSON } from "./helper.js";
import { AJAX } from "./helper.js";

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

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

const loadRecipe = async function (id) {
  try {
    // console.log(res, data);
    let data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    // console.log(state.bookmarks);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
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
    let data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(
      rec =>
        (state.results = {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          image: rec.image_url,
          ...(rec.key && { key: rec.key }),
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

  const start = (page - 1) * 6; //start -> 0,10,20;
  const end = page * 6; // end -> 9(10),19(20),29(30);

  return state.search.results.slice(start, end);
}

function updateRecipe(newServings) {
  state.recipe.ingredients.forEach(ing => {
    const quantity = (ing.quantity / state.recipe.servings) * newServings;
    ing.quantity =
      !Number.isNaN(quantity) && !Number.isInteger(quantity)
        ? quantity.toFixed(1)
        : quantity;
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
  const index = state.bookmarks.findIndex(curr => curr.id === id);
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
  // localStorage.removeItem("bookmarks");
};
// clearBookmarks();

const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(el => el[0].startsWith("ingredient-") && el[1] !== "")
      .map(el => {
        // const ingArr = el[1].replaceAll(" ", "").split(",");
        const ingArr = el[1].split(",").map(curr => curr.trim());
        // console.log(ingArr);
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format!   Please use the correct format :)"
          );

        // console.log(ingArr);
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // console.log(ingredients);
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe); // to always bookmark this uploaded recipe
  } catch (err) {
    throw err;
  }
};

export {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultsPage,
  updateRecipe,
  addBookmark,
  deleteBookmark,
  uploadRecipe,
};
