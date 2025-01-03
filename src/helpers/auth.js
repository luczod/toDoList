import { getDateLog } from "../controllers/utils.js";

function checkAuth(req, res, next) {
  // verificar a sessão do usuário
  if (!req.session.userId) {
    console.log(getDateLog() + "sessao encerrada");
    return res.redirect("/");
  }
  next();
}

export { checkAuth };
