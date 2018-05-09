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
    }
});

bot.dialog('recipes', [function (session) {
    builder.Prompts.text(session, 'Опишите доступные ингредиенты в формате: `яйца, соль`');
}, async function (session) {
    const dishAmount = session.sessionState.dishAmount;
    const {dishesStr,receipsNumbers} = await controller.getDiagnose(session.message.text, dishAmount);
    session.send(`Варианты блюд: ${dishesStr}`);
    // builder.Prompts.choice(session, "Введите номер блюда для поиска", receipsNumbers);
}, function (session,results) {
    console.log(results.response);
    session.endDialog();
}]);

bot.dialog('options', [function (session) {
    builder.Prompts.number(session, 'Введите колличество блюд:');
}, function (session, results) {
    if (results.response) {
        session.sessionState.dishAmount = results.response;
        session.beginDialog('/');
    }
}]).triggerAction({
    matches: /^options$/i
});

bot.dialog('exit', function (session) {
    // builder.Prompts.confirm(session, 'Вы точно хотете выйти?');
    session.endConversation('Прощавайте! Успешных Вам кулинарных экспериментов');
}).triggerAction({
    matches: /^exit$/i
});



module.exports = { bot, connector };
