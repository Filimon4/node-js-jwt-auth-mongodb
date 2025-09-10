// Подключаем библиотеку Mongoose для работы с MongoDB
const mongoose = require('mongoose');
// Устанавливаем глобальный Promise для Mongoose
mongoose.Promise = global.Promise;

// Создаем объект для хранения всех моделей и конфигураций базы данных
const db = {};

// Добавляем экземпляр Mongoose в объект db для удобного доступа
db.mongoose = mongoose;

// Подключаем и регистрируем модель пользователя
db.user = require("./user.model");

// Подключаем и регистрируем модель роли
db.role = require("./role.model");

// Определяем массив доступных ролей в системе
db.ROLES = ["user", "admin", "moderator"];

// Экспортируем объект db со всеми моделями и конфигурациями
module.exports = db;