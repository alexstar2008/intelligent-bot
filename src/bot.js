const builder = require('botbuilder');
//
const { chatbot } = require('../config');
const controller = require('./controller');


const connector = new builder.ChatConnector({
    appId: chatbot.MICROSOFT_APP_ID,
    appPassword: chatbot.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector);
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded[0].id === message.address.bot.id) {
        const reply = new builder.Message().address(message.address).text('Добро пожаловать в нашу клинику!');
        bot.send(reply);
    }
});
bot.dialog('/', [function (session) {
    // session.send(`Your mood: ${mood}`);
    // session.beginDialog('/');
    builder.Prompts.text(session, 'Опишите симптомы в формате `кашель насморк`');
}, async function (session, res) {
    const diagnose = controller.getDiagnose(session.message.text);
    session.send(`Ваш вероятный дигноз: ${diagnose}`);
    // session.send({
    //     text: 'We have something interesting for you:',
    //     attachments: [{
    //         contentType: 'image/gif',
    //         contentUrl: 'Nne'
    //     }]
    // });
}]);

// bot.dialog('/', [
//     function (session) {
//         builder.Prompts.text(session, 'What makes you happy?');
//     }, async function (session, res) {
//         session.send({
//             text: 'We have something interesting for you:',
//             attachments: [{
//                 contentType: 'image/gif',
//                 contentUrl: 'Nne'
//             }]
//         });
//     }
// ]);


module.exports = { bot, connector };
