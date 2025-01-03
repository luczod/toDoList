import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { TodoController } from "../controllers/todoController.js";
import { checkAuth } from "../helpers/auth.js";

const router = Router();

router.get("/", async (_, res) => {
  res.status(200).render("templates/login", {
    nonce: res.locals.nonce,
  });
});

router.post("/todo", AuthController.login);
router.post("/todo/save", checkAuth, TodoController.saveTask);
router.post("/todo/edit", checkAuth, TodoController.editTask);
router.post("/todo/delete", checkAuth, TodoController.deleteTask);
router.post("/todo/complate", checkAuth, TodoController.complateTask);

router.post("/register", AuthController.register);
router.get("/register", async (_, res) => {
  res.status(200).render("templates/register");
});

export default router;
