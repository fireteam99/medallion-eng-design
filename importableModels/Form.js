import sequelize from "./sequelize";
const { Sequelize } = require("sequelize");

const Form = require("models/Form")(sequelize, Sequelize.DataTypes);
export default Form;
