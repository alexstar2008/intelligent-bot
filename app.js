const NBC = require('./nbc');

const nbc = new NBC();

nbc.train('простуда','кашель насморк');
nbc.train('грипп','кашель температура ломота');
nbc.train('аллергия','кашель насморк');
nbc.setAmountOfMatches(1);
const res = nbc.getBestMatches('кашель насморк');
console.log(res);
// nbc.calculateTotalProb();