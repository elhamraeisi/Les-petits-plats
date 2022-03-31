import { recipes } from "../assets/data/data.js";

var selectedFilters = new Set();

/**
 * Initialisation du site 
 */
function init() {
  var searchInput = document.getElementById("search-global-input");
  searchInput.oninput = function (e) {
    if (selectedFilters.size > 0) {
      selectedFilters = new Set();
      displaySelectedFilters();
    }
    const userInput = e.target.value;
    const searchResult = filterGlobal(userInput);
    displayAllRecipes(searchResult)
  }

  var dropdownUstensiles = document.getElementById("dropdown-ustensiles");
  var searchUstensiles = document.getElementById("search-ustensiles");

  var dropdownAppareils = document.getElementById("dropdown-appareils");
  var searchAppareils = document.getElementById("search-appareils");

  var dropdownIngredients = document.getElementById("dropdown-ingredients");
  var searchIngredients = document.getElementById("search-ingredients");

  dropdownUstensiles.onclick = function () {
    searchUstensiles.style.display = "block"
    dropdownUstensiles.style.display = "none"
    searchAppareils.style.display = "none"
    dropdownAppareils.style.display = "block"
    searchIngredients.style.display = "none"
    dropdownIngredients.style.display = "block"
  }

  dropdownAppareils.onclick = function () {
    searchAppareils.style.display = "block"
    dropdownAppareils.style.display = "none"
    searchUstensiles.style.display = "none"
    dropdownUstensiles.style.display = "block"
    searchIngredients.style.display = "none"
    dropdownIngredients.style.display = "block"
  }

  dropdownIngredients.onclick = function () {
    searchIngredients.style.display = "block"
    dropdownIngredients.style.display = "none"
    searchAppareils.style.display = "none"
    dropdownAppareils.style.display = "block"
    searchUstensiles.style.display = "none"
    dropdownUstensiles.style.display = "block"
  }

  window.onclick = function () {
    searchUstensiles.style.display = "none"
    dropdownUstensiles.style.display = "block"
    searchAppareils.style.display = "none"
    dropdownAppareils.style.display = "block"
    searchIngredients.style.display = "none"
    dropdownIngredients.style.display = "block"
  }

  initFilter()
  displayAllRecipes(recipes)
}


/**
 * Affichage l'element HTML de chaque recette
 * @param {object} recipe les informations d'une recette
 */
function displayOneRecipe(recipe) {
  var searchResultSection = document.getElementById("search-result");

  const article = document.createElement('article');
  article.className = "card pb-3 mb-5 bg-light border-0 recipe-card";

  const cardImage = document.createElement('div');
  cardImage.className = "card-img-top card-img-placeholder";

  const cardDescription = document.createElement('div');
  cardDescription.className = "d-flex justify-content-between mt-3 px-3";

  const cardTitle = document.createElement('h4');
  cardTitle.className = "card-title w-50 card-content-title text-truncate";
  cardTitle.innerHTML = recipe.name;

  const sectionOfTitle = document.createElement('div');
  sectionOfTitle.className = "d-flex font-weight-bold";

  const icon = document.createElement('span');
  icon.className = "fa fa-history fa-2x";

  const time = document.createElement('h3');
  time.className = "ml-2"
  time.innerHTML = recipe.time + 'min';

  const cardDetails = document.createElement('div');
  cardDetails.className = "card-body d-flex justify-content-between card-content";

  const ingredientsList = document.createElement('div');
  ingredientsList.className = "ingredient-container";

  recipe.ingredients.forEach(ingredientData => {
    const ingredientContainer = document.createElement('p');
    ingredientContainer.className = "mb-0"
    const ingredientName = document.createElement('span');
    ingredientName.className = "font-weight-bold ingredient"
    ingredientName.innerHTML = ingredientData.ingredient;
    ingredientContainer.appendChild(ingredientName)
    if (ingredientData.quantity != undefined) {
      ingredientContainer.innerHTML += ' : ' + ingredientData.quantity + ' '
    }

    if (ingredientData.unit != undefined) {
      ingredientContainer.innerHTML += ingredientData.unit
    }
    ingredientsList.appendChild(ingredientContainer)

  })
  cardDetails.appendChild(ingredientsList);

  cardDescription.appendChild(cardTitle)
  sectionOfTitle.appendChild(icon)
  sectionOfTitle.appendChild(time)


  cardDescription.appendChild(sectionOfTitle)

  const description = document.createElement('p');
  description.innerHTML = recipe.description;
  description.className = "w-50 description  ml-2";

  cardDetails.appendChild(description)

  article.appendChild(cardImage)
  article.appendChild(cardDescription)
  article.appendChild(cardDetails)


  searchResultSection.appendChild(article)
}


/**
 * Afficher la liste de recette 
 * @param {Array} listOfRecipes une liste de recettes à afficher
 */
function displayAllRecipes(listOfRecipes) {
  var searchResultSection = document.getElementById("search-result");
  if (listOfRecipes.length !== 0) {
    searchResultSection.className = "d-flex flex-wrap"
    searchResultSection.innerHTML = ''
    listOfRecipes.forEach(recipe => {
      displayOneRecipe(recipe);
    });
  } else {
    searchResultSection.innerHTML = "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc."
    searchResultSection.className = "no-result"
  }
}


/**
 * Recherche dans liste déroulante
 * @param {string} searchQuery la saisie de l'utilisateur
 * @param {Array} listOfData La liste des filtres
 * @returns 
 */
function filterDroplistItems(searchQuery, listOfData) {
  return [...listOfData].filter((i) =>
    i.toLowerCase().includes(searchQuery.toLowerCase())
  )
}

/**
 * Recherche dans la barre de recherche principale
 * @param {string} searchQuery 
 * @returns la liste des recettes correspondantes à la saisie de l'utilisateur
 */
function filterGlobal(searchQuery) {
  var userInput = searchQuery.toLowerCase();

  if (userInput.length > 2) {
    return recipes.filter((recipe) => {
      if (recipe.name.toLowerCase().includes(userInput)) {
        return true
      }

      if (recipe.description.toLowerCase().includes(userInput)) {
        return true
      }

      if (findIngredients(recipe.ingredients, userInput) !== undefined) {
        return true
      }

      return false
    })
  } else {
    return recipes;
  }
}


/**
 * Recherche de la saisie de l'utilisateur dans les ingredients d'une recette 
 * @param {Array} ingredients 
 * @param {string} searchQuery 
 * @returns 
 */
function findIngredients(ingredients, searchQuery) {
  return ingredients.find((ingredientData) => {
    return ingredientData.ingredient.toLowerCase().includes(searchQuery.toLowerCase())
  });
}




/**
 * La recherches par tag(ingredient,ustensiles et appareils)
 * @returns la liste des recettes correspondantes aux choix l'utilisateur
 */
function filterBySelectedTags() {

  return recipes.filter((recipe) => {

    var listOfingredients = recipe.ingredients.map(ingredientData => ingredientData.ingredient.toLowerCase())
    var listOfUstensils = recipe.ustensils.map(ustensilData => ustensilData.toLowerCase())

    //verification de presence de chaque filtre dans la liste des ingredients
    if ([...selectedFilters].every(filter => listOfingredients.includes(filter) || listOfUstensils.includes(filter) || recipe.appliance.toLowerCase().includes(filter))) {
      return true;
    }

  })
}

/**
 * Affiche la liste de tags
 * @param {*} listOfTags liste d'ingredients,ustensils ou appareils
 * @param {*} sectionId l'identifiant de l'element HTML contenant la liste des tags
 */
function displayFilterList(listOfTags, sectionId) {
  var listOfTagsDOM = document.getElementById(sectionId);
  listOfTagsDOM.innerHTML = '';
  listOfTags.forEach(i => {
    const item = document.createElement('a');
    item.className = "dropdown-item text-white h5 filter-item text-space";
    item.innerHTML = i;
    item.onclick = function () {
      selectedFilters.add(i);
      displaySelectedFilters();
      let filterdRecipes = filterBySelectedTags();
      displayAllRecipes(filterdRecipes);
    }
    listOfTagsDOM.appendChild(item);
  });
}

/**
 * Affichages des tags selectionnés
 */
function displaySelectedFilters() {
  var tagList = document.getElementById("selected-tags");
  tagList.innerHTML = ''

  selectedFilters.forEach((filterName) => {
    var tag = document.createElement("button");
    tag.className = "btn btn-primary selected-tag-btn text-white py-3 mx-3 my-3"
    tag.innerHTML = filterName
    var closeIcon = document.createElement("i");
    closeIcon.className = "fa fa-times ml-2"

    closeIcon.onclick = function () {
      selectedFilters.delete(filterName);
      displaySelectedFilters();
      let filterdRecipes = filterBySelectedTags();
      displayAllRecipes(filterdRecipes);
    }

    tag.appendChild(closeIcon);
    tagList.appendChild(tag)
  })
}

/**
 * Initialisation de la recherche de tag dans chaque liste deroulante
 * @param {*} listOfTags la liste de tags(ingredients,ustensils,appareils)
 * @param {*} searchInputId l'identifiant du champs de recherche correspondant
 * @param {*} sectionInputId l'identifiant de la section des resultats de recherche
 */
function initFilterSearch(listOfTags, searchInputId, sectionInputId) {
  var searchDropdownInput = document.getElementById(searchInputId);
  searchDropdownInput.oninput = function (e) {
    const userInput = e.target.value;
    const searchResult = filterDroplistItems(userInput, listOfTags);
    displayFilterList(searchResult, sectionInputId);
  };
}

/**
 * Initialisation de la liste de tags (ingredients,ustensils,appareils)
 */
function initFilter() {
  var listOfIngredients = new Set();
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(i => {
      listOfIngredients.add(i.ingredient.toLowerCase());
    })
  })

  var listOfAppliances = new Set();
  recipes.forEach(recipe => {
    listOfAppliances.add(recipe.appliance.toLowerCase());
  })

  var listOfUstensils = new Set();
  recipes.forEach(recipe => {
    recipe.ustensils.forEach(u => {
      listOfUstensils.add(u.toLowerCase());
    })
  })


  initFilterSearch(listOfIngredients, "search-ingredients-input", "listOfIngredients");
  initFilterSearch(listOfAppliances, "search-Appliances-input", "listOfAppliances");
  initFilterSearch(listOfUstensils, "search-Ustensils-input", "listOfUstensils");


  //Rendering filter items 
  displayFilterList(listOfIngredients, "listOfIngredients");
  displayFilterList(listOfAppliances, "listOfAppliances");
  displayFilterList(listOfUstensils, "listOfUstensils");
}


window.onload = function () {
  init()
}

