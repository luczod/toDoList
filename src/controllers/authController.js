import bcrypt from "bcrypt";
import { Todo, User } from "../models/index.js";
import { getDateLog } from "./utils.js";

class AuthController {
  static async register(req, res) {
    const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    const msgError = {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
      error: false,
    };

    // validações do formulário
    if (!name) {
      msgError.name = "O nome é obrigatório!";
      msgError.error = true;
    }

    if (!email) {
      msgError.email = "O e-mail é obrigatório!";
      msgError.error = true;
    }

    if (!password) {
      msgError.password = "A senha é obrigatória!";
      msgError.error = true;
    }

    if (!confirmpassword) {
      msgError.confirmpassword = "A senha e a confirmação precisam ser iguais!";
      msgError.error = true;
    }

    if (msgError.error) {
      return res.status(422).render("templates/register", {
        msgError,
      });
    }

    // verificar se o usuário já existe
    const userExists = await User.findOne({ where: { email: email } });

    if (userExists) {
      msgError.email = "Email já cadastrado!";
      msgError.error = true;
      return res.status(422).render("templates/register", {
        msgError,
        emailText: email,
      });
    }

    // criptografar a senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // criar um novo usuário
    const user = User.build({
      username: name,
      email: email,
      password: passwordHash,
    });

    try {
      await user.save();
      res.status(200).render("templates/login", {
        nonce: res.locals.nonce,
      });
    } catch (error) {
      console.log(getDateLog() + error.message);
      res.status(500).render("templates/register", {
        msg: error.message,
      });
    }
  }

  static async login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const msgError = {
      name: "",
      email: "",
      password: "",
      error: false,
    };

    // validações do formulário
    if (!email) {
      msgError.email = "O e-mail é obrigatório!";
      msgError.error = true;
    }

    if (!password) {
      msgError.password = "A senha é obrigatória!";
      msgError.error = true;
    }

    if (msgError.error) {
      return res.status(422).render("templates/login", {
        nonce: res.locals.nonce,
        msgError,
      });
    }

    // verificar se o usuário existe
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      msgError.email = "E-mail ou senha inválidos!";
      msgError.password = "E-mail ou senha inválidos!";
      msgError.error = true;

      console.log(getDateLog() + "Não há usuário cadastrado com este e-mail!");

      return res.status(422).render("templates/login", {
        nonce: res.locals.nonce,
        msgError,
        emailText: email,
      });
    }

    // verificar a senha
    const checkPassword = await bcrypt.compare(
      password,
      user.dataValues.password
    );

    if (!checkPassword) {
      msgError.email = "E-mail ou senha inválidos!";
      msgError.password = "E-mail ou senha inválidos!";
      msgError.error = true;

      console.log(getDateLog() + "Senha inválida");

      return res.status(422).render("templates/login", {
        nonce: res.locals.nonce,
        msgError,
        emailText: email,
      });
    }

    // salvar os dados na sessão
    req.session.userId = user.dataValues.id;
    req.session.save();

    try {
      const tasksData = await Todo.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "UserId"] },
        where: { UserId: user.dataValues.id },
      });

      const userTasks = tasksData.map((result) => result.dataValues);

      console.log(getDateLog() + "userId: " + req.session.userId);

      return res.status(200).render("templates/todo", {
        nonce: res.locals.nonce,
        name: user.dataValues.username,
        userTasks,
        userContent: JSON.stringify(tasksData),
      });
    } catch (error) {
      console.log(getDateLog() + inspect(error));
      return res.status(500).render("templates/login", {
        nonce: res.locals.nonce,
        errorMsg: error.message,
      });
    }
  }
}

export { AuthController };
