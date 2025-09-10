// Импортируем middleware для работы с JWT токенами и проверки ролей
const authJwt = require("./authJwt");

// Импортируем middleware для проверки данных при регистрации
const verifySignUp = require("./verifySignUp");

// Экспортируем все middleware функции для использования в приложении
module.exports = {
  authJwt,
  verifySignUp
};
