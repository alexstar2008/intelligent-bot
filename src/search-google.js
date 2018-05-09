const google = require('google');

google.resultsPerPage = 25;
google.lang = 'ru';
google.tld = 'ru';
google.protocol = 'https';
var nextCounter = 0;


async function search(text) {
    return new Promise((resolve, reject) => {
        google(text, function (err, res) {
            if (err) {
                reject(err);
            }

            // for (var i = 0; i < 5; ++i) {
            //     var link = res.links[i];
            // console.log(link.title + ' - ' + link.href)
            // console.log(link.description + "\n");
            // }
            resolve(res.links.slice(0, 3));

            // if (nextCounter < 4) {
            //     nextCounter += 1;
            //     if (res.next) res.next();
            // }
        });
    });
}

module.exports = { search };

