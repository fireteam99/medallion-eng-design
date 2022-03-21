"use strict";
const { v4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Forms", null, {}); // for demo purposes
    await queryInterface.bulkInsert("Forms", [
      {
        id: v4(),
        name: "NY State Licensing Application",
        url: "https://zdngrvjngapeunjtifhz.supabase.in/storage/v1/object/public/forms/NY-State-Licensing-Application.pdf",
      },
      {
        id: v4(),
        name: "CA State Licensing Application",
        url: "https://zdngrvjngapeunjtifhz.supabase.in/storage/v1/object/public/forms/CA-State-Licensing-Appliation.pdf",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Forms", null, {});
  },
};
