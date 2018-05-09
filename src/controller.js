const NBC = require('./nbc');

const googleSheets = require('./google/googleSheets');
const googleSearch = require('./search-google');

async function searchforReceipt() {
    const res = await googleSearch.search('бастурма рецепт');
    return res;
}


async function getDiagnose(text, amount = 1) {
    const nbc = new NBC();

    const dishes = await googleSheets.init();
    dishes.slice(1).forEach(dish => {
        nbc.train(dish[0], dish[1]);
    });

    nbc.setAmountOfMatches(amount);
    let receipsNumbers = '';
    const diagnoses = nbc.getBestMatches(text);
    const dishesStr = '\n\n' + diagnoses.map((diagnose, index) => {
        receipsNumbers += (index + '|');
        return `${index + 1}: ${diagnose.name}: (рецепты)`;
    }).join('\n\n');
    receipsNumbers = receipsNumbers.slice(0, -1);
    return { dishesStr, receipsNumbers };
    // nbc.calculateTotalProb();
}

module.exports = {
    getDiagnose,
    searchforReceipt
};
