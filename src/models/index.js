import { DataTypes } from "sequelize";
import sequelize from "../db/conn.js";

const Todo = sequelize.define("Todo", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const User = sequelize.define("Users", {
  username: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

// Todo.hasOne(User);
User.hasMany(Todo);

sequelize.sync();

export { Todo, User };
