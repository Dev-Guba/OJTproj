'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const now = new Date();

    await queryInterface.bulkInsert('Articles', [

      {
        article: "Laptop",
        description: "Dell Latitude 5420",
        propNumber: "ICTO-001",
        dateAcquired: "2024-01-10",
        unit: "pcs",
        unitValue: 55000,
        balQty: 1,
        balValue: 55000,
        createdAt: now,
        updatedAt: now,
      },

      {
        article: "Printer",
        description: "Epson L3210",
        propNumber: "ICTO-002",
        dateAcquired: "2023-12-05",
        unit: "pcs",
        unitValue: 12000,
        balQty: 1,
        balValue: 12000,
        createdAt: now,
        updatedAt: now,
      },

      {
        article: "Desktop Computer",
        description: "Core i5 Workstation",
        propNumber: "ICTO-003",
        dateAcquired: "2024-02-20",
        unit: "set",
        unitValue: 35000,
        balQty: 1,
        balValue: 35000,
        createdAt: now,
        updatedAt: now,
      },

      {
        article: "Projector",
        description: "Epson Projector",
        propNumber: "ICTO-004",
        dateAcquired: "2023-11-15",
        unit: "pcs",
        unitValue: 18000,
        balQty: 1,
        balValue: 18000,
        createdAt: now,
        updatedAt: now,
      },

      {
        article: "Office Chair",
        description: "Ergonomic Chair",
        propNumber: "ICTO-005",
        dateAcquired: "2024-03-01",
        unit: "pcs",
        unitValue: 5000,
        balQty: 2,
        balValue: 10000,
        createdAt: now,
        updatedAt: now,
      },

      {
        article: "Air Conditioner",
        description: "Split Type 1.5HP",
        propNumber: "ICTO-006",
        dateAcquired: "2022-08-10",
        unit: "unit",
        unitValue: 25000,
        balQty: 1,
        balValue: 25000,
        createdAt: now,
        updatedAt: now,
      },

      {
        article: "Camera",
        description: "Canon DSLR",
        propNumber: "ICTO-007",
        dateAcquired: "2023-06-18",
        unit: "pcs",
        unitValue: 30000,
        balQty: 1,
        balValue: 30000,
        createdAt: now,
        updatedAt: now,
      }

    ]);

  },


  async down(queryInterface) {
    await queryInterface.bulkDelete('Articles', null, {});
  }
};