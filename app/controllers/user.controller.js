// Контроллер для получения публичного контента (доступен всем пользователям)
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

// Контроллер для получения контента пользователя (доступен только аутентифицированным пользователям)
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

// Контроллер для получения админского контента (доступен только администраторам)
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

// Контроллер для получения контента модератора (доступен только модераторам)
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
