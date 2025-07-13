/*
[x] Pegar a informação do input, quando o usuário clicar no botão, e exibir no console.
[x] Ir até a API e retornar as receitas
[x] Exibir as receitas na tela
[x] Saber quando o usuário clicar na receita
[x] Buscar informações da receita individual
[x] Colocar a receita individial na tela
*/

const input = document.querySelector('.search-input')    // Seleciona o input de busca
const form = document.querySelector('.search-form');          // Seleciona o formulário de busca
const recipeList = document.querySelector('.recipe-list');          //  Seleciona a lista de receitas
const recipeDetails = document.querySelector('.recipe-details');

form.addEventListener('submit', function (event) {
  event.preventDefault();       // Impede o comportamento padrão do formulário de recarregar a página
  const InputValue = event.target[0].value;        // Pega o valor do input

  searchRecipes(InputValue);
});

//www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast

async function searchRecipes(ingredient) {
  recipeList.innerHTML = '<p class="loading">Loading...</p>';
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`); // Pega as receitas da API com o ingrediente informado
    const data = await response.json();     // Converte a resposta em JSON
    if (!data.meals) { // Verifica se a resposta contém receitas
      recipeList.innerHTML = `<p class="error">No recipes found for "${ingredient}". Please try another ingredient.</p>`;
      return;
    }
    showRecipes(data.meals);
  } catch (err) { // Trata alguns erros 
    recipeList.innerHTML = `<p class="error">No recipes found for "${ingredient}". Please try another ingredient.</p>`;
  }
}

async function showRecipes(recipes) { // Exibe as receitas na tela
  recipeList.innerHTML = recipes.map(recipe => `
    <div class="recipe-card" data-id="${recipe.idMeal}">
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
      <h3>${recipe.strMeal}</h3>
    </div>  
  `).join('');

  // Adiciona o event listener para cada card
  document.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      getRecipeDetails(id);
    });
  });
}
async function getRecipeDetails(id) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`); // Pega as receitas da API por id

  const data = await response.json();
  const recipe = data.meals ? data.meals[0] : null; // Converte a resposta em JSON
  // Pega a primeira receita do array
  console.log(recipe);

  if (!recipe) {
    recipeDetails.innerHTML = `<p class="error">Recipe details not found.</p>`;
    return;
  }

  let ingredients = '';

  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) { // Verifica se o ingrediente existe
      ingredients += `<li>${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}</li>`; // Adiciona o ingrediente à lista
    } else {
      break;
    }
  }
  recipeDetails.innerHTML = `
    <h2>${recipe.strMeal}</h2>
    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-img">
    <h3>Categoria:</h3>
    <p>${recipe.strCategory}</p>
    <h3>Category:</h3>
    <p>${recipe.strArea}</p>
    <h3>Ingredients:</h3>
    <ul>${ingredients}</ul>
    <h3>Instructions:</h3>
    <p>${recipe.strInstructions}</p>
    <h3>Tags</h3>
    <p>${recipe.strTags}</p>
    <p>Video: <a href="${recipe.strYoutube}" target="blank">Watch on youtube</a></p>
  `; // Exibe os detalhes da receita na tela
}
