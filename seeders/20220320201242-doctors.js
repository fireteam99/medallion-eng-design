"use strict";
const { v4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Doctors", null, {}); // for demo purposes
    await queryInterface.bulkInsert("Doctors", [
      {
        id: v4(),
        firstName: "Jack",
        lastName: "Smith",
        gender: "male",
        birthday: new Date(1970, 0, 11),
      },
      {
        id: v4(),
        firstName: "Ally",
        lastName: "Love",
        gender: "female",
        birthday: new Date(1989, 10, 1),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Doctors", null, {});
  },
};
