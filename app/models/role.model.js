// Подключаем библиотеку Mongoose для работы с MongoDB
const mongoose = require("mongoose");

// Создаем модель Role для хранения ролей пользователей в системе
const Role = mongoose.model(
  "Role", // Название коллекции в MongoDB
  new mongoose.Schema({
    // Название роли (например, "user", "admin", "moderator")
    name: String
  })
);

// Экспортируем модель Role для использования в других частях приложения
module.exports = Role;
