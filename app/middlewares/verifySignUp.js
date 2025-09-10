const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

/**
 * Проверяет, существует ли уже пользователь с таким именем или email
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция для перехода к следующему middleware
 * @returns {Object} Отправляет ответ с ошибкой если имя пользователя или email уже существуют
 */
checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Проверяем, существует ли уже пользователь с таким именем
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    // Если произошла ошибка при поиске, возвращаем ошибку сервера
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    // Если пользователь с таким именем уже существует, возвращаем ошибку
    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Проверяем, существует ли уже пользователь с таким email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      // Если произошла ошибка при поиске, возвращаем ошибку сервера
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      // Если пользователь с таким email уже существует, возвращаем ошибку
      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      // Если все проверки пройдены, переходим к следующему middleware
      next();
    });
  });
};

/**
 * Проверяет, существуют ли указанные роли в системе
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция для перехода к следующему middleware
 * @returns {Object} Отправляет ответ с ошибкой если указана несуществующая роль
 */
checkRolesExisted = (req, res, next) => {
  // Проверяем, есть ли в запросе указанные роли
  if (req.body.roles) {
    // Проходим по всем указанным ролям
    for (let i = 0; i < req.body.roles.length; i++) {
      // Если роль не существует в системе, возвращаем ошибку
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  // Если все роли существуют или роли не указаны, переходим к следующему middleware
  next();
};

// Экспортируем middleware функции для использования в маршрутах
const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;
