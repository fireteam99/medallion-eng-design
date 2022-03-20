import sequelize from "./sequelize";
const { Sequelize } = require("sequelize");

const Doctor = require("models/Doctor")(sequelize, Sequelize.DataTypes);
export default Doctor;
