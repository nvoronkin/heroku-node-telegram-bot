var R = require('ramda');
var recipes = require('./recipes');
var errors = require('./errors');
var princips = require('./princips');
var dinner = require('./dinner');
var lunch = require('./lunch');
var supper = require('./supper');
var supper_variants = require('./supper_variants');

var filterLunch = R.filter(r=>r.type==1);
var filterSupper = R.filter(r=>r.type==2);
var recipesLunch = filterLunch(recipes);
var recipesSupper = filterSupper(recipes);

function stat() {
  var res = "*Рецепты для обеда*: "+recipesLunch.length+" шт.\n";
  res += "*Рецепты для ужина*: "+recipesSupper.length+" шт.\n";
  res += "*Всего*: "+recipes.length+" шт.\n";
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


var keyboard = {
  'keyboard': [
    [ newKeyboardButton('Рецепт обеда') ],
    [ newKeyboardButton('Рецепт ужина') ],
    [ newKeyboardButton('О системе') ],
  ],
  'resize_keyboard': true,
}

var keyboardAbout = {
  'keyboard': [
    [ newKeyboardButton('Советы') ],
    [ newKeyboardButton('Что можно на завтрак') ],
    [ newKeyboardButton('Что можно на обед') ],
    [ newKeyboardButton('Что можно на ужин') ],
    [ newKeyboardButton('Распространенные ошибки') ],
    [ newKeyboardButton('Вернуться в главное меню') ],
  ],
  'resize_keyboard': true,
}

var keyboardSupper = {
  'keyboard': [
    [ newKeyboardButton('Вариант № 1 Фрукты и молочка') ],
    [ newKeyboardButton('Вариант № 2 Фрукты и овощи') ],
    [ newKeyboardButton('Вариант № 3 Фрукты и крупы') ],
    [ newKeyboardButton('Вариант № 4 Овощи и молочка') ],
    [ newKeyboardButton('Вариант № 5 Овощи и крупы') ],
    [ newKeyboardButton('Вариант № 6 Мясные и рыбные продукты') ],
    [ newKeyboardButton('Вариант № 7 Молочка, сыр и криспы') ],
    [ newKeyboardButton('Вернуться в главное меню') ],
  ],
  'resize_keyboard': true,
}



var mainInfo = [[
   'У меня есть рецепты для питания по *системе минус 60*',
   'Нажми *Рецепт обеда* для случайного рецепта обеда',
   '*Рецепт ужина* для случайного рецепта ужина',
]]

var reply = {
  // Варианты ужина
  'Вариант № 1 Фрукты и молочка': { i: supper_variants[0], k: keyboardSupper},
  'Вариант № 2 Фрукты и овощи': { i: supper_variants[1], k: keyboardSupper},
  'Вариант № 3 Фрукты и крупы': { i: supper_variants[2], k: keyboardSupper},
  'Вариант № 4 Овощи и молочка': { i: supper_variants[3], k: keyboardSupper},
  'Вариант № 5 Овощи и крупы': { i: supper_variants[4], k: keyboardSupper},
  'Вариант № 6 Мясные и рыбные продукты': { i: supper_variants[5], k: keyboardSupper},
  'Вариант № 7 Молочка, сыр и криспы': { i: supper_variants[6], k: keyboardSupper},
  // Случайный рецепт
  'Рецепт обеда': { i: function () {
      return recipesLunch[Math.floor(Math.random() * recipesLunch.length)]
  }, k: keyboard},
  'Рецепт ужина': { i: function() {
    return recipesSupper[Math.floor(Math.random() * recipesSupper.length)];
  }, k: keyboard},
  // Общая информация
  'О системе': { i: [[
    'Диета (система) "Минус 60" была разработана автором бестселлеров о похудении Екатериной Миримановой. Она испробовала её на себе, похудев при этом со 120 кг до 60-ти всего за полтора года, не прибегая к хирургическим методам. Основное преимущество и отличие системы "Минус 60" от большинства других – отказываться от любимой еды нет необходимости, а запрещенных продуктов нет.'
  ]], k: keyboardAbout},
  'Советы': { i: princips, k: keyboardAbout},
  'Что можно на завтрак': { i: dinner, k: keyboardAbout},
  'Что можно на обед': { i: lunch, k: keyboardAbout},
  'Что можно на ужин': { i: supper, k: keyboardSupper},
  'Распространенные ошибки': { i: errors, k: keyboardAbout},
  'Вернуться в главное меню': { i: mainInfo, k: keyboard},
  '/start': { i: mainInfo, k: keyboard},
}

module.exports = {reply, keyboard};
