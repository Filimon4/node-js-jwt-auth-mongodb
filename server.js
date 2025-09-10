// Подключение необходимых модулей
const express = require("express"); // Фреймворк для создания веб-приложений
const cors = require("cors"); // Модуль для разрешения CORS-запросов
const dbConfig = require("./app/config/db.config"); // Конфигурация базы данных

// Создание экземпляра приложения Express
const app = express();

// Настройка параметров CORS (разрешенные источники)
var corsOptions = {
  origin: "http://localhost:8081" // Разрешаем запросы только с этого адреса
};

// Подключение middleware для обработки CORS
app.use(cors(corsOptions));

// Подключение middleware для парсинга JSON в теле запроса
app.use(express.json());

// Подключение middleware для парсинга URL-encoded данных в теле запроса
app.use(express.urlencoded({ extended: true }));

// Подключение моделей базы данных
const db = require("./app/models");
const Role = db.role; // Модель ролей пользователей

// Подключение к базе данных MongoDB
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true, // Использование нового парсера URL
    useUnifiedTopology: true // Использование нового движка управления подключениями
  })
  .then(() => {
    console.log("Successfully connect to MongoDB."); // Успешное подключение
    initial(); // Инициализация ролей в базе данных
  })
  .catch(err => {
    console.error("Connection error", err); // Ошибка подключения
    process.exit(); // Завершение процесса при ошибке подключения
  });

// Подключение маршрутов приложения
require("./app/routes/auth.routes")(app); // Маршруты аутентификации
require("./app/routes/user.routes")(app); // Маршруты пользователей

// Определение порта сервера (из переменных окружения или 8080 по умолчанию)
const PORT = process.env.PORT || 8080;
// Запуск сервера на указанном порту
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`); // Сообщение о запуске сервера
});

// Функция инициализации ролей в базе данных
function initial() {
  // Проверка количества документов в коллекции ролей
  Role.estimatedDocumentCount((err, count) => {
    // Если нет ошибок и коллекция пуста
    if (!err && count === 0) {
      // Создание роли пользователя
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err); // Вывод ошибки при сохранении
        }

        console.log("added 'user' to roles collection"); // Сообщение об успешном добавлении
      });

      // Создание роли модератора
      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err); // Вывод ошибки при сохранении
        }

        console.log("added 'moderator' to roles collection"); // Сообщение об успешном добавлении
      });

      // Создание роли администратора
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err); // Вывод ошибки при сохранении
        }

        console.log("added 'admin' to roles collection"); // Сообщение об успешном добавлении
      });
    }
  });
}
