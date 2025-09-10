// Подключаем библиотеку Mongoose для работы с MongoDB
const mongoose = require("mongoose");

// Создаем модель User для хранения информации о пользователях
const User = mongoose.model(
  "User", // Название коллекции в MongoDB
  new mongoose.Schema({
    // Имя пользователя (логин)
    username: String,
    
    // Электронная почта пользователя
    email: String,
    
    // Хэшированный пароль пользователя
    password: String,
    
    // Массив ролей пользователя (ссылки на документы в коллекции Role)
    roles: [
      {
        // Тип поля - ObjectId (идентификатор документа в MongoDB)
        type: mongoose.Schema.Types.ObjectId,
        
        // Ссылка на коллекцию Role
        ref: "Role"
      }
    ]
  })
);

// Экспортируем модель User для использования в других частях приложения
module.exports = User;
