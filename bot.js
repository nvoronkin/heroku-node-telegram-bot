var token = process.env.TOKEN;
var Bot = require('node-telegram-bot-api');

var R = require('ramda');
var data  = require('./data');

isFunction = function(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function splitIngredients(ingredients) {
  var res = "";
  var ings = ingredients.split('|');
  for (var i = 0; i < ings.length; i++) {
    res += "  - "+ings[i]+"\n";
  }
  return res;
}

function formatRecipe(recipe) {
  var res = "*"+recipe.title+"* на "+(recipe.type == 1 ? "обед": "ужин") +" \n";
  res += recipe.description ? recipe.description+"\n" : '';
  res += "*Продукты*:\n"+splitIngredients(recipe.ingredients)+"\n";
  res += "*Приготовление*:\n"+recipe.cooking+"\n";
  return res;
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

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function sendInfo(chatId, index, info, keybrd) {
  if(index < info.length) {
    bot.sendMessage(chatId, info[index].join('\n'),
      {parse_mode: 'Markdown', reply_markup: keybrd});
    sleep(1000).then(()=>{
      sendInfo(chatId, ++index, info, keybrd);
    })
  }
}

bot.onText(/^/, function (msg) {
  // console.log(msg.text, data.reply[msg.text])
  if(data.reply[msg.text]) {
    if (isFunction(data.reply[msg.text].i)) {
      var info = data.reply[msg.text].i(msg);
      bot.sendMessage(msg.chat.id, formatRecipe(info),
                {parse_mode: 'Markdown', reply_markup: data.reply[msg.text].k});
    } else {
      sendInfo(msg.chat.id, 0, data.reply[msg.text].i, data.reply[msg.text].k);
    }
  } else {
      bot.sendMessage(msg.chat.id, "Не понял, попробуй другую команду",
              {parse_mode: 'Markdown', reply_markup: data.keyboard});
  }

  // if (msg.text.toLowerCase() === '/start' || msg.text.toLowerCase() === 'вернуться в главное меню') {
  //   bot.sendMessage(msg.chat.id, 'У меня есть рецепты для питания по *системе минус 60*\n'+stat()+'\nНажми *Рецепт обеда* для случайного рецепта обеда\n*Рецепт ужина* для случайного рецепта ужина\n',
  //           {parse_mode: 'Markdown', reply_markup: keyboard});
  // }
  // if (msg.text.toLowerCase() === 'рецепт обеда') {
  //   var recipe = recipesLunch[Math.floor(Math.random() * recipesLunch.length)];
  //   bot.sendMessage(msg.chat.id, formatRecipe(recipe),
  //           {parse_mode: 'Markdown', reply_markup: keyboard});
  // }
  // if (msg.text.toLowerCase() === 'рецепт ужина') {
  //   var recipe = recipesSupper[Math.floor(Math.random() * recipesSupper.length)];
  //   bot.sendMessage(msg.chat.id, formatRecipe(recipe),
  //           {parse_mode: 'Markdown', reply_markup: keyboard}).then(function () {
  //     // reply sent!
  //   });
  // }
  //
  // if (msg.text.toLowerCase() === 'о системе') {
  //   var info = 'Диета (система) "Минус 60″ была разработана автором бестселлеров о похудении Екатериной Миримановой. Она испробовала её на себе, похудев при этом со 120 кг до 60-ти всего за полтора года, не прибегая к хирургическим методам. Основное преимущество и отличие системы "Минус 60" от большинства других – отказываться от любимой еды нет необходимости, а запрещенных продуктов нет.';
  //   bot.sendMessage(msg.chat.id, info,
  //           {parse_mode: 'Markdown', reply_markup: keyboardAbout}).then(function () {
  //     // reply sent!
  //   });
  // }
  // if (msg.text.toLowerCase() === 'распространенные ошибки') {
  //   var info = errors.join('\n');
  //   bot.sendMessage(msg.chat.id, info,
  //           {parse_mode: 'Markdown', reply_markup: keyboardAbout}).then(function () {
  //     // reply sent!
  //   });
  // }
  // if (msg.text.toLowerCase() === 'советы') {
  //   var info = princips.join('\n');
  //   bot.sendMessage(msg.chat.id, info,
  //           {parse_mode: 'Markdown', reply_markup: keyboardAbout}).then(function () {
  //     // reply sent!
  //   });
  // }
  // if (msg.text.toLowerCase() === 'что можно на завтрак') {
  //   var info = dinner.join('\n');
  //   bot.sendMessage(msg.chat.id, info,
  //           {parse_mode: 'Markdown', reply_markup: keyboardAbout}).then(function () {
  //     // reply sent!
  //   });
  // }
  //
  // if (msg.text.toLowerCase() === 'что можно на обед') {
  //   var i = 0;
  //   sendInfo(msg.chat.id, i, lunch, keyboardAbout);
  // }
  //
  // if (msg.text.toLowerCase() === 'что можно на ужин') {
  //   var i = 0;
  //   sendInfo(msg.chat.id, i, supper, keyboardSupper);
  // }
  //
  // if (supper_variants_index[msg.text]) {
  //   var i = 0;
  //   sendInfo(msg.chat.id, i, supper_variants_index[msg.text], keyboardSupper);
  // }


});

module.exports = bot;
