import { inspect } from "util";
import { User, Todo } from "../models/index.js";
import { getDateLog } from "./utils.js";

class TodoController {
  static async saveTask(req, res) {
    const userid = req.session.userId;
    const title = req.body.text;
    // criar uma nova tarefa
    try {
      const task = Todo.build({
        title,
        completed: false,
        UserId: userid,
      });

      await task.save();

      return res.status(200).json({ id: task.dataValues.id });
    } catch (error) {
      console.log(getDateLog() + inspect(error));
      return res.status(500).json({ msg: error.message });
    }
  }

  static async editTask(req, res) {
    const task = req.body.taskId;
    const newTitle = req.body.text;
    // editar uma tarefa
    try {
      const editTask = await Todo.findOne({ where: { id: task } });
      editTask.set({
        title: newTitle,
      });
      await editTask.save();

      console.log(getDateLog() + `edit todo: ${task}`);

      return res.status(200).end();
    } catch (error) {
      console.log(getDateLog() + inspect(error));
      return res.status(500).json({ msg: error.message });
    }
  }

  static async deleteTask(req, res) {
    const task = req.body.taskId;
    // deletar uma tarefa
    try {
      await Todo.destroy({ where: { id: task } });
      console.log(getDateLog() + `delete todo: ${task}`);

      return res.status(200).end();
    } catch (error) {
      console.log(getDateLog() + inspect(error));
      return res.status(500).json({ msg: error.message });
    }
  }

  static async complateTask(req, res) {
    const task = req.body.taskId;
    const completed = req.body.completed;

    try {
      const complateTask = await Todo.findOne({ where: { id: task } });
      complateTask.set({
        completed: completed ? 1 : 0,
      });
      await complateTask.save();

      console.log(getDateLog() + `complate todo: ${task}`);

      return res.status(200).end();
    } catch (error) {
      console.log(getDateLog() + inspect(error));
      return res.status(500).json({ msg: error.message });
    }
  }
}

export { TodoController };
