var token = process.env.TOKEN;
var Bot = require('node-telegram-bot-api');
var R = require('ramda');
var data = require('./data');

var filterLunch = R.filter(r=>r.type==1);
var filterSupper = R.filter(r=>r.type==2);
var recipesLunch = filterLunch(data);
var recipesSupper = filterSupper(data);

function splitIngredients(ingredients) {
  var res = "";
  var ings = ingredients.split('|');
  for (var i = 0; i < ings.length; i++) {
    res += "  - "+ings[i]+"\n";
  }
  return res;
}

function formatRecipe(recipe) {
  var res = "*"+recipe.title+"*\n";
  res += recipe.description ? recipe.description+"\n" : '';
  res += "*Продукты*:\n"+splitIngredients(recipe.ingredients)+"\n";
  res += "*Приготовление*:\n"+recipe.cooking+"\n";
  return res;
}

function newKeyboardButton(text, request_contact, request_location) {
  var button = {
    'text': text
  }

  if (request_contact) {
    button.request_contact = request_contact
  }

  if (request_location) {
    button.request_location = request_location
  }

  return button
}


var bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

var keyBoard = {
  'keyboard': [
    [ newKeyboardButton('/обед') ],
    [ newKeyboardButton('/ужин') ],
  ]
}

bot.onText(/^/, function (msg) {
  if (msg.text.toLowerCase() === '/start') {
    var name = msg.from.first_name;

    bot.sendMessage(msg.chat.id, 'Привет, '+name+'!\nУ меня есть рецепты для питания по *системе минус 60*\nНажми */обед* для случайного рецепта обеда\n*/ужин* для случайного рецепта ужина',
            {parse_mode: 'Markdown', reply_markup: keyBoard}).then(function () {
      // reply sent!
    });
  }
  if (msg.text.toLowerCase() === '/обед') {
    var recipe = recipesLunch[Math.floor(Math.random() * recipesLunch.length)];
    bot.sendMessage(msg.chat.id, formatRecipe(recipe),
            {parse_mode: 'Markdown', reply_markup: keyBoard}).then(function () {
      // reply sent!
    });
  }
  if (msg.text.toLowerCase() === '/ужин') {
    var recipe = recipesSupper[Math.floor(Math.random() * recipesSupper.length)];
    bot.sendMessage(msg.chat.id, formatRecipe(recipe),
            {parse_mode: 'Markdown', reply_markup: keyBoard}).then(function () {
      // reply sent!
    });
  }
});

module.exports = bot;
