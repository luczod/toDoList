import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

try {
  sequelize.authenticate();
  console.log("Conectado ao banco!");
} catch (error) {
  console.error("Não foi possível conectar:", error);
}

export default sequelize;
