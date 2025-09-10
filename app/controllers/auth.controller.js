const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Регистрация нового пользователя
exports.signup = (req, res) => {
  // Создание нового пользователя с хэшированным паролем
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8) // Хэширование пароля с солью
  });

  // Сохранение пользователя в базе данных
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    // Если в запросе указаны роли пользователя
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles } // Поиск ролей по именам
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          // Присвоение пользователю найденных ролей
          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      // Если роли не указаны, присваиваем роль по умолчанию "user"
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

// Аутентификация пользователя (вход в систему)
exports.signin = (req, res) => {
  // Поиск пользователя по имени пользователя
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v") // Заполнение информации о ролях пользователя
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      // Если пользователь не найден
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      // Проверка валидности пароля
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      // Если пароль неверный
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      // Генерация JWT токена для аутентифицированного пользователя
      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // Токен действует 24 часа
                              });

      // Формирование списка ролей пользователя в формате ROLE_ИМЯРОЛИ
      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      
      // Отправка ответа с данными пользователя и токеном доступа
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};
