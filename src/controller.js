const NBC = require('./nbc');



function getDiagnose(text) {
    const nbc = new NBC();

    nbc.train('простуда', 'кашель насморк');
    nbc.train('простуда', 'температура');
    nbc.train('грипп', 'кашель температура ломота');
    nbc.train('аллергия', 'кашель чесотка');
    nbc.setAmountOfMatches(1);
    console.log(text);

    const diagnoses = nbc.getBestMatches(text);
    const diagnoseStr = diagnoses.map((diagnose, index) => {
        return `${index + 1}: ${diagnose.name}`;
    }).join('\n');
    console.log(diagnoseStr);
    return diagnoseStr;
    // nbc.calculateTotalProb();
}

module.exports = {
    getDiagnose
};
