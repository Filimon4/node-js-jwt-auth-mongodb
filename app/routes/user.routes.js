const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  // Промежуточное ПО для установки заголовков CORS для всех маршрутов
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Публичный маршрут, доступный всем пользователям
  app.get("/api/test/all", controller.allAccess);

  // Защищенный маршрут, требующий аутентификации
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  // Защищенный маршрут, требующий роль модератора
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  // Защищенный маршрут, требующий роль администратора
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
