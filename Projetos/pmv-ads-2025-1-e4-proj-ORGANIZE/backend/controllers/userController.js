const { User: UserModel } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklist = require("../middlewares/blacklist");

const userController = {
  create: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const userExists = await UserModel.findOne({ email });
      if (userExists) {
        return res.status(400).json({ msg: "Email já cadastrado!" });
      }

      const passwordStrengthRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!passwordStrengthRegex.test(password)) {
        return res.status(400).json({
          msg: "A senha deve ter pelo menos 6 caracteres, 1 letra, 1 número e 1 caractere especial",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
      });

      const response = await newUser.save();

      res.status(201).json({ response, msg: "Usuário criado com sucesso!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Erro interno do servidor." });
    }
  },

  login: async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email }).select(
        "+password"
      );

      if (!user) {
        return res.status(400).json({ error: "Dados inválidos" });
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Dados inválidos" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ message: "Login realizado com sucesso", token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  },

  logout: (req, res) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ error: "Token não fornecido." });
    }

    blacklist.add(token);

    res.json({ message: "Logout realizado com sucesso." });
  },

  getAll: async (req, res) => {
    try {
      const users = await UserModel.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  get: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

      res.json(user);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Erro ao buscar usuário", error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

      const deletedUser = await UserModel.findByIdAndDelete(id);

      res
        .status(200)
        .json({ deletedUser, msg: "Usuário excluído com sucesso" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Erro ao excluir usuário", error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;

      const user = {
        name: req.body.name,
        email: req.body.email,
      };

      const updatedUser = await UserModel.findByIdAndUpdate(id, user, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

      res
        .status(200)
        .json({ updatedUser, msg: "Usuário atualizado com sucesso" });
    } catch (err) {
      res
        .status(500)
        .json({ msg: "Erro ao atualizar usuário", error: err.message });
    }
  },

  passwordUpdate: async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
      const user = await UserModel.findById(req.user.userId).select(
        "+password"
      );

      if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ msg: "Senha antiga incorreta" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();
      res.status(200).json({ msg: "Senha atualizada com sucesso" });
    } catch (err) {
      res
        .status(500)
        .json({ msg: "Erro ao atualizar a senha", error: err.message });
    }
  },

  getLoggedInUser: async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.userId).select(
        "-password"
      );

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json(user);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Erro ao buscar usuário", error: err.message });
    }
  },
};

module.exports = userController;
