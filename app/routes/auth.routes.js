const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  // Промежуточное ПО для установки заголовков CORS для всех маршрутов
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Маршрут для регистрации пользователя
  // Использует промежуточное ПО для проверки дубликатов имени пользователя/почты и существующих ролей
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  // Маршрут для входа пользователя
  app.post("/api/auth/signin", controller.signin);
};
