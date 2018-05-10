const builder = require('botbuilder');
//
const { chatbot } = require('../config');
const controller = require('./controller');


const connector = new builder.ChatConnector({
    appId: chatbot.MICROSOFT_APP_ID,
    appPassword: chatbot.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector, function (session) {
    const name = session && session.message && session.message.user && session.message.user.name || 'user';
    session.send(name[0].toUpperCase() + name.slice(1) + ', Добро пожаловать в наш кулинарный мир!\n\n (`help` - помощь)');
    session.beginDialog('dishes');
});


bot.dialog('greeting', function (session) {
    const name = session.message.user.name;
    session.send(name[0].toUpperCase() + name.slice(1) + ', Добро пожаловать в наш кулинарный мир!\n\n (`help` - помощь)');
    session.beginDialog('dishes');
}).triggerAction({
    matches: /^\/start$/i
});


bot.dialog('dishes', [function (session) {
    builder.Prompts.text(session, 'Опишите доступные ингредиенты в формате: `мука, яйца`');
}, async function (session) {
    const dishAmount = session.sessionState.dishAmount;
    const searchRecipe = session.sessionState.searchRecipe;
    const dishesStr = await controller.getDishes(session.message.text, dishAmount, searchRecipe);
    session.send(`Варианты блюд: ${dishesStr}`);
}, function (session) {
    session.endDialog();
}]);

bot.dialog('options', [function (session) {
    builder.Prompts.number(session, 'Введите колличество блюд:');
}, function (session, results) {
    if (results.response) {
        session.sessionState.dishAmount = results.response;
        session.beginDialog('dishes');
    }
}]).triggerAction({
    matches: /^options$/i
});

bot.dialog('recipe', function (session) {
    if (session.sessionState.searchRecipe === undefined) {
        session.sessionState.searchRecipe = true;
    }
    session.sessionState.searchRecipe = !session.sessionState.searchRecipe;
    const msg = session.sessionState.searchRecipe ? 'Поиск рецептов включен' : 'Поиск рецептов отключен';
    session.send(msg);
    session.beginDialog('dishes');
}).triggerAction({
    matches: /^recipe$/i
});

bot.dialog('help', function (session) {
    const msg =
        '**Доступные комманды:**\n\n\n' +
        '`start` - старт бота\n\n' +
        '`options` - изменить кол-во блюд\n\n' +
        '`recipe` - вкл./выкл. поиск рецепта для блюд\n\n' +
        '`help` - вызов помощи\n\n' +
        '`exit` - выход\n\n';
    session.send(msg);
    session.beginDialog('dishes');
}).triggerAction({
    matches: /^help$/i
});

bot.dialog('exit', function (session) {
    const name = session && session.message && session.message.user && session.message.user.name || 'user';
    session.endConversation('Прощай, ' + name[0].toUpperCase() + name.slice(1) + '! Успешных Вам кулинарных экспериментов');
}).triggerAction({
    matches: /^exit$/i
});



module.exports = { bot, connector };
