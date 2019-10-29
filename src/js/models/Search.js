import axios from 'axios';

export default class Search {
    constructor(query)
    {
        this.query = query;
    }
    async getResult()
    {
        const key = 'f150e3e6b43083efca6af0a9436a2810';
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        try
        {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.results = res.data.recipes;
            //console.log(this.results);
        }
        catch(error)
        {
            console.log(error);
        }
    }
}