import axios from 'axios';

export default class Recipe{
    constructor(id)
    {
        this.id = id;
    }

    async getRecipe()
    {
        try 
        {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } 
        catch(error) 
        {
            console.log(error);
        }
    }

    calcTime()
    {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;
    }

    calcServings()
    {
        this.servings = 4;
    }

    parseIngredients()
    {
        const longUnits = ['tablespoon', 'tablespoons', 'teaspoon', 'teaspoons', 'ounces', 'ounce', 'cups', 'pounds'];
        const shortUnits = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'cup', 'pound'];
        const units = [...shortUnits, 'kg', 'g'];

        const newIngredients = this.ingredients.map(element => {

            let ingredient = element.toLowerCase();
            longUnits.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, shortUnits[i]);
            });

            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(element2 => units.includes(element2));

            let objIng;
            if(unitIndex > -1)
            {
                const arrCount = arrIng.slice(0, unitIndex);
                let count;

                if(arrCount.length === 1)
                {
                    count = eval(arrIng[0].replace('-','+'));
                } else {
                    count = eval(arrCount.join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                };

            } else if(parseInt(arrIng[0])) {
                
                objIng = {
                    count: parseInt(arrIng[0]),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                };

            } else if(unitIndex === -1) {
                
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }

            return objIng;

        });
        this.ingredients = newIngredients;

    }

    updateServings (type)
    {
        const newServings = type === 'dec' ? this.servings - 1: this.servings + 1;

        this.ingredients.forEach(ing => {
            ing.count *= (newServings/this.servings);
        });

        this.servings = newServings;
    }
}