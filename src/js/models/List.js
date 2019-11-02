import uniqid from 'uniqid';

export default class List{
    constructor()
    {
        this.item = [];
    }

    addItem(count, unit, ingredient)
    {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.item.push(item);

        return item;
    }

    deleteItem(id)
    {
        const index = this.item.findIndex(element => element.id === id);
        this.item.splice(index, 1);
    }

    updateList(id, newCount)
    {
        this.item.find(element => element.id === id).count = newCount;
    }
}