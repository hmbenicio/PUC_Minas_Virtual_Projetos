const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rotas públicas
router.post("/user", userController.create);
router.post("/user/login", userController.login);

// Rotas protegidas
router.post("/user/logout", authMiddleware, userController.logout);
router.patch(
  "/user/password-update",
  authMiddleware,
  userController.passwordUpdate
);
router.get("/user/me", authMiddleware, userController.getLoggedInUser);

// Rotas REST para usuários
router.get("/user", userController.getAll);
router.get("/user/:id", userController.get);
router.delete("/user/:id", userController.delete);
router.put("/user/:id", userController.update);

module.exports = router;
