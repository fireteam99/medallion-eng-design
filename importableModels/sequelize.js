const { Sequelize } = require("sequelize");
// 'postgres://username:password@localhost:5432/medallion'
const sequelize = new Sequelize({
  dialect: "postgres",
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
});

export default sequelize;
