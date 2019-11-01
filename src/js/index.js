import Search from './models/Search';
import Recipe from './models/Recipe';
import {elements, renderLoader, removeLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

const state = {};

const controlSearch = async () => {
    const query = searchView.getInput();
    if(query)
    {
        state.search = new Search(query);

        renderLoader(elements.searchDiv);
        searchView.clearInput();
        searchView.clearResults();

        try
        {
            await state.search.getResult();
            removeLoader();
            searchView.renderResults(state.search.results);
        }
        catch(error)
        {
            console.log(error);
            searchView.clearResults();
        }
    }
}

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});

elements.searchPageBtn.addEventListener('click', event =>{
    const btn = event.target.closest('.btn-inline');
    if(btn)
    {
        const goTo = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goTo);
    }
});

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', ' ');

    if(id)
    {
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if(state.search)
        {
            // searchView.highlight(id);
        }
        state.recipe = new Recipe(id);
        try 
        {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
        
            state.recipe.calcTime();
            state.recipe.calcServings();

            removeLoader();
            recipeView.renderRecipe(state.recipe);
        }
        catch(error)
        {
            console.log(error);
        }
       
    }

};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', element => {
    if(element.target.matches('.btn-decrease, .btn-decrease *'))
    {
        if(state.recipe.servings>1)
        {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIng(state.recipe);
        }
    } else if(element.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIng(state.recipe);
    }

});