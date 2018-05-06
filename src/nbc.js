const DELIMETER = ', ';

class NBC {
    constructor() {
        this.documents = {};
        this.documentsLen = 0;

        this.amountOfResult = 1;
        this.words = {};
        this.wordsUnique = new Set();

        this.probs = {};
    }
    train(className, document) {
        if (!this.documents[className]) {
            this.documents[className] = [];
        }
        this.documents[className].push(document);
        this.documentsLen++;

        if (!this.words[className]) {
            this.words[className] = [];
        }
        const words = document.toLowerCase().split(DELIMETER);
        this.words[className].push(...words);
        words.forEach(word => {
            this.wordsUnique.add(word);
        });
    }
    calculateProbabilityPerClass(className, phrase) {
        //
        // const classProbability = Math.log(this.documents[className].length / this.documentsLen);
        // 
        const phraseWords = phrase.toLowerCase().split(DELIMETER);
        const wordProbability = phraseWords.reduce((sum, next) => {
            const wordsRepeatedAmount = this.words[className].filter(word => word === next).length;
            const wordsUniqueLen = this.wordsUnique.size;
            const wordsOfClassAmount = this.words[className].length;
            const prob = Math.log((wordsRepeatedAmount + 1) / (wordsUniqueLen + wordsOfClassAmount));
            return prob + sum;
        }, 0);
        // const total = classProbability + wordProbability;
        const total = wordProbability;
        return { name: className, prob: total };
    }
    setAmountOfMatches(amountOfResult) {
        this.amountOfResult = amountOfResult;
    }
    getBestMatches(phrase) {
        console.log(Array.from(this.wordsUnique).sort());
        const classNames = this.getClassNames();
        const probabilities = classNames.map(className => this.calculateProbabilityPerClass(className, phrase));
        const sortedProbabilities = this.sortProbabilities(probabilities);

        return sortedProbabilities.slice(0, this.amountOfResult);
    }
    sortProbabilities(probabilities) {
        probabilities.sort((a, b) => {
            return b.prob - a.prob;
        });
        return probabilities;
    }
    getClassNames() {
        return Object.keys(this.documents);
    }
    // calculateTotalProb() {
    //     const prob1 = 1 / (1 + Math.exp(this.probs['простуда'] - this.probs['грипп']) + Math.exp(this.probs['аллергия'] - this.probs['грипп']));
    //     const prob2 = 1 / (1 + Math.exp(this.probs['грипп'] - this.probs['простуда']) + Math.exp(this.probs['аллергия'] - this.probs['простуда']));
    //     const prob3 = 1 / (1 + Math.exp(this.probs['простуда'] - this.probs['аллергия']) + Math.exp(this.probs['грипп'] - this.probs['аллергия']))
    //     // console.log(prob1);
    //     // console.log(prob2);
    //     // console.log(prob3);
    // }
}

module.exports = NBC;