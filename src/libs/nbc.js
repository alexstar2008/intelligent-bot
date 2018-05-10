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
    calculateProbabilityPerClass(className) {
        //
        // const classProbability = Math.log(this.documents[className].length / this.documentsLen);
        // 
        const phraseWords = this.phrase.split(DELIMETER);
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
    filterIfNoMatches(probabilities) {
        return probabilities.filter(probability => {
            const name = probability.name;
            const ingredients = this.words[name];
            return ingredients.some(ingredient => this.phrase.includes(ingredient));
        });
    }
    getBestMatches(phrase) {
        this.phrase = phrase.toLowerCase();
        const classNames = this.getClassNames();
        const probabilities = classNames.map(className => this.calculateProbabilityPerClass(className));
        const sortedProbabilities = this.sortProbabilities(probabilities);
        const filteredProbabilities = this.filterIfNoMatches(sortedProbabilities);
        //: TODO 
        return filteredProbabilities.slice(0, this.amountOfResult);
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
}

module.exports = NBC;
