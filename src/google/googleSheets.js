const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'credentials.json';

const config = require('../../config');


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

    if (!config.google.token) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(config.google.token);

    const data = await callback(oAuth2Client);
    return data;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return callback(err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}


//
async function getDishes(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.get({
            spreadsheetId: '1fw1342SCOcM7vukrRrNoEGYM3y2IIWtclnke68_iUow',
            range: 'Dishes!A:B',
        }, (err, { data }) => {
            if (err) {
                reject(err);
            }
            const raws = data.values;
            console.log(raws);
            resolve(raws);
        });
    });
}

function init() {
    return authorize(config.google, getDishes);
}

module.exports = { init };
