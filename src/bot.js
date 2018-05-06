const builder = require('botbuilder');
//
const { chatbot } = require('../config');
const controller = require('./controller');


const connector = new builder.ChatConnector({
    appId: chatbot.MICROSOFT_APP_ID,
    appPassword: chatbot.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector, function (session) {
    // session.sendTyping();
    // setTimeout(function(){
    session.beginDialog('recipes');
    // },3000);
});
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded[0].id === message.address.bot.id) {
        const reply = new builder.Message().address(message.address).text('Добро пожаловать в наш кулинарный мир!');
        bot.send(reply);
    } else if (message.membersRemoved) {
        // See if bot was removed
        var botId = message.address.bot.id;
        for (var i = 0; i < message.membersRemoved.length; i++) {
            if (message.membersRemoved[i].id === botId) {
                // Say goodbye
                var reply = new builder.Message()
                    .address(message.address)
                    .text("Goodbye");
                bot.send(reply);
                break;
            }
        }
    }
    console.log('REMOVED');
});
bot.dialog('recipes', [function (session) {
    // session.send(`Your mood: ${mood}`);
    // session.beginDialog('/');
    builder.Prompts.text(session, 'Опишите доступные ингредиенты в формате: `яйца, соль`');
}, async function (session, res) {
    const dishAmount = session.sessionState.dishAmount;
    const diagnose = controller.getDiagnose(session.message.text, dishAmount);
    session.send(`Варианты блюд: ${diagnose}`);
}, function (session, res) {
    session.endDialog();
}]);
bot.dialog('options', [function (session) {
    builder.Prompts.number(session, 'Введите колличество блюд');
}, function (session, results) {
    if (results.response) {
        session.sessionState.dishAmount = results.response;
        session.beginDialog('/');
    }
}]).triggerAction({
    matches: /^options$/i
});
bot.dialog('exit', function (session) {
    session.endConversation('Прощавайте! Успешных Вам кулинарных экспериментов');
}).triggerAction({
    matches: /^exit$/i,
    confirmPrompt: 'Вы точно хоитете выйти?'
});



module.exports = { bot, connector };
