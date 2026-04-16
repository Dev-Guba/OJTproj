'use strict';

const { default: e } = require("express");

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();

    const employees = await queryInterface.sequelize.query(
      `SELECT EmployeeId, SameDeptCode FROM Employees;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const getOffices = (id) => {
      const employee = employees.find(emp => emp.EmployeeId === id);
      return employee ? employee.SameDeptCode : null;
    }

    await queryInterface.bulkInsert('ICTORecords', [
      // Employee 1 (SuperAdmin)
      {
        employee_id: 1,
        article: 'Laptop',
        description: 'Dell Latitude 5420',
        propNumber: 'ICTO-001',
        dateAcquired: '2024-01-10',
        unit: 'pcs',
        unitValue: 55000,
        balQty: 1,
        balValue: 55000,
        areMeNo: 'ARE-001',
        office: getOffices(1),
        createdAt: now,
        updatedAt: now,
      },

      // Employee 2
      {
        employee_id: 2,
        article: 'Printer',
        description: 'Epson L3210',
        propNumber: 'ICTO-002',
        dateAcquired: '2023-12-05',
        unit: 'pcs',
        unitValue: 12000,
        balQty: 1,
        balValue: 12000,
        areMeNo: 'ARE-002',
        office: getOffices(2),
        createdAt: now,
        updatedAt: now,
      },

      // Employee 3
      {
        employee_id: 3,
        article: 'Desktop Computer',
        description: 'Core i5 Workstation',
        propNumber: 'ICTO-003',
        dateAcquired: '2024-02-20',
        unit: 'set',
        unitValue: 35000,
        balQty: 1,
        balValue: 35000,
        areMeNo: 'ARE-003',
        office: getOffices(3),
        createdAt: now,
        updatedAt: now,
      },

      // Employee 4
      {
        employee_id: 4,
        article: 'Projector',
        description: null,
        propNumber: 'ICTO-004',
        dateAcquired: '2023-11-15',
        unit: 'pcs',
        unitValue: 18000,
        balQty: 1,
        balValue: 18000,
        areMeNo: 'ARE-004',
        office: getOffices(4),
        createdAt: now,
        updatedAt: now,
      },

      // Employee 5
      {
        employee_id: 5,
        article: 'Office Chair',
        description: 'Ergonomic Chair',
        propNumber: 'ICTO-005',
        dateAcquired: '2024-03-01',
        unit: 'pcs',
        unitValue: 5000,
        balQty: 2,
        balValue: 10000,
        areMeNo: null,
        office: getOffices(5),
        createdAt: now,
        updatedAt: now,
      },

      // Employee 6
      {
        employee_id: 6,
        article: 'Air Conditioner',
        description: 'Split Type 1.5HP',
        propNumber: 'ICTO-006',
        dateAcquired: '2022-08-10',
        unit: 'unit',
        unitValue: 25000,
        balQty: 1,
        balValue: 25000,
        areMeNo: 'ARE-006',
        office: getOffices(6),
        createdAt: now,
        updatedAt: now,
      },

      // Employee 7
      {
        employee_id: 7,
        article: 'Camera',
        description: 'Canon DSLR',
        propNumber: 'ICTO-007',
        dateAcquired: '2023-06-18',
        unit: 'pcs',
        unitValue: 30000,
        balQty: 1,
        balValue: 30000,
        areMeNo: null,
        office: getOffices(7),
        createdAt: now,
        updatedAt: now,
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ICTORecords', null, {});
  }
};