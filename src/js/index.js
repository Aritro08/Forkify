import Search from './models/Search';
import {elements, renderLoader, removeLoader} from './views/base';
import * as searchView from './views/searchView';

const state = {};

const controlSearch = async () => {
    const query = searchView.getInput();
    if(query)
    {
        state.search = new Search(query);

        renderLoader(elements.searchDiv);
        searchView.clearInput();
        searchView.clearResults();

        await state.search.getResult();

        removeLoader();
        searchView.renderResults(state.search.results);
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
