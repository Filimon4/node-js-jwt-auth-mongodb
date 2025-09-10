const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

/**
 * Проверяет JWT токен из заголовка запроса
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция для перехода к следующему middleware
 * @returns {Object} Отправляет ответ с ошибкой если токен отсутствует или недействителен
 */
verifyToken = (req, res, next) => {
  // Получаем токен из заголовка запроса
  let token = req.headers["x-access-token"];

  // Если токен не предоставлен, возвращаем ошибку
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  // Проверяем токен с помощью секретного ключа
  jwt.verify(token,
            config.secret,
            (err, decoded) => {
              // Если есть ошибка при проверке, возвращаем ошибку авторизации
              if (err) {
                return res.status(401).send({
                  message: "Unauthorized!",
                });
              }
              // Сохраняем ID пользователя из декодированного токена и переходим к следующему middleware
              req.userId = decoded.id;
              next();
            });
};

/**
 * Проверяет, имеет ли пользователь роль администратора
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция для перехода к следующему middleware
 * @returns {Object} Отправляет ответ с ошибкой если пользователь не является администратором
 */
isAdmin = (req, res, next) => {
  // Находим пользователя по ID из запроса
  User.findById(req.userId).exec((err, user) => {
    // Если произошла ошибка при поиске пользователя, возвращаем ошибку сервера
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    // Находим роли пользователя
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        // Если произошла ошибка при поиске ролей, возвращаем ошибку сервера
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        // Проверяем, есть ли среди ролей роль администратора
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        // Если роль администратора не найдена, возвращаем ошибку доступа
        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

/**
 * Проверяет, имеет ли пользователь роль модератора
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция для перехода к следующему middleware
 * @returns {Object} Отправляет ответ с ошибкой если пользователь не является модератором
 */
isModerator = (req, res, next) => {
  // Находим пользователя по ID из запроса
  User.findById(req.userId).exec((err, user) => {
    // Если произошла ошибка при поиске пользователя, возвращаем ошибку сервера
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    // Находим роли пользователя
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        // Если произошла ошибка при поиске ролей, возвращаем ошибку сервера
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        // Проверяем, есть ли среди ролей роль модератора
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        // Если роль модератора не найдена, возвращаем ошибку доступа
        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

// Экспортируем middleware функции для использования в маршрутах
const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;
