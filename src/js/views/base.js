export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    searchDiv: document.querySelector('.results'),
    searchPageBtn: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likedMenu: document.querySelector('.likes__field'),
    likedList: document.querySelector('.likes__list')
}

export const renderLoader = parent => {
    const loader = `
        <div class = "loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>`;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const removeLoader = () => {
    const loader = document.querySelector('.loader');
    if(loader)
    {
        loader.parentElement.removeChild(loader);
    }
}