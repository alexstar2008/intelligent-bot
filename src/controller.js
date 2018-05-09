const NBC = require('./libs/nbc');

const googleSheets = require('./libs/google/googleSheets');
const googleSearch = require('./libs/search-google');

async function searchforReceipt(dish) {
    const res = await googleSearch.search('рецепт ' + dish);
    return res;
}

async function getDishes(text, amount = 1, searchRecipe = true) {
    const nbc = new NBC();
    const dishesForTraining = await googleSheets.init();
    dishesForTraining.slice(1).forEach(dish => {
        nbc.train(dish[0], dish[1]);
    });

    nbc.setAmountOfMatches(amount);
    const dishes = nbc.getBestMatches(text);

    let dishesStr = 'Пусто(';
    if (dishes.length !== 0) {
        const dishesStrArr = [];
        for (let key = 0; key < dishes.length; key++) {
            const dish = dishes[key];
            if (searchRecipe) {
                const url = await searchforReceipt(dish.name);
                const recipeLink = `[Рецепт](${url.link})` || '';
                dishesStrArr.push(`${key + 1}: ${dish.name}: ${recipeLink}`);
            } else {
                dishesStrArr.push(`${key + 1}: ${dish.name}`);
            }
        }
        dishesStr = '\n\n' + dishesStrArr.join('\n\n');
    }
    return dishesStr;
}

module.exports = {
    getDishes,
    searchforReceipt
};
