const google = require('google');

google.resultsPerPage = 1;
google.lang = 'ru';
google.tld = 'ru';
google.protocol = 'https';


async function search(text) {
    return new Promise((resolve, reject) => {
        google(text, function (err, res) {
            if (err) {
                reject(err);
            }
            resolve(res.links[0]);
        });
    });
}

module.exports = { search };

