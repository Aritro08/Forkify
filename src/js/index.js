import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import {elements, renderLoader, removeLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesViews';


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

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');

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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        }
        catch(error)
        {
            console.log(error);
        }
       
    }

};

const controlList = () => {
    if(!state.list)
    {
        state.list = new List();
    }
    state.recipe.ingredients.forEach(element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient);
        listView.renderItem(item);
        // console.log(item);
    });
}

const controlLikes = () => {
    if(!state.likes)
    {
        state.likes = new Likes();
    }
    const currentID = state.recipe.id;

    if(!state.likes.isLiked(currentID))
    {
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
        likesView.toggleLikeBtn(true);
        likesView.renderLikes(newLike);
    } else {
        state.likes.deleteLike(currentID);
        likesView.toggleLikeBtn(false);
        likesView.removeLikes(currentID);
    }
    
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesView.renderLikes(like));
});

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

elements.shoppingList.addEventListener('click', element => {
    // console.log(state.list);
    const id = element.target.closest('.shopping__item').dataset.itemid;

    if(element.target.matches('.shopping__delete, .shopping__delete *'))
    {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if(element.target.matches(".shopping__count-value")){
            const val = parseFloat(element.target.value);
            state.list.updateList(id, val);
    }
});

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
    } else if(element.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if(element.target.matches('.recipe__love, .recipe__love *')) {
        controlLikes();
    }

});

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));