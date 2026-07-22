'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const now = new Date();

    const hashedPassword =
      '$2b$10$Bi.v98laZAvsUcEcX86JqObExs9QkImlFRfC3uOkcCSNotQqEQ4Ki';

    const adminHashPassword =
      '$2b$10$2rU7W6oybEGFu0lyX97L6e8PHxaqNqoFnKwGyk1J61p82J1PdZSLG';


    const officeMap = [
      { office_id: 1, code: "OOG" },
      { office_id: 2, code: "OVG" },
      { office_id: 3, code: "OPA" },
      { office_id: 4, code: "ICTO" },
      { office_id: 5, code: "PHRMO" },
      { office_id: 6, code: "PACCO" },
      { office_id: 7, code: "PBO" },
      { office_id: 8, code: "PTO" },
      { office_id: 9, code: "PAO" },
      { office_id: 10, code: "PEO" },
      { office_id: 11, code: "PPDO" },
      { office_id: 12, code: "PGSO" },
      { office_id: 13, code: "PLO" },
      { office_id: 14, code: "PIO" },
      { office_id: 15, code: "PHO" },
      { office_id: 16, code: "PSWDO" },
      { office_id: 17, code: "PAGRO" },
      { office_id: 18, code: "PVO" },
      { office_id: 19, code: "PENRO" },
      { office_id: 20, code: "PDRRMO" },
      { office_id: 21, code: "PTOUR" },
      { office_id: 22, code: "PESO" },
      { office_id: 23, code: "PCDO" },
      { office_id: 24, code: "PPO" },
      { office_id: 25, code: "BAC" },
      { office_id: 26, code: "COA" },
      { office_id: 27, code: "IPCR" },
      { office_id: 28, code: "MOTOR" },
      { office_id: 29, code: "RECORDS" },
      { office_id: 30, code: "SUPPLY" },
    ];


    const employees = [];


    function addEmployee(data){
      employees.push({
        statusId: 1,
        isActive: 1,
        Gender: "M",
        CivilStatus: "Single",
        Province: "Cebu",
        CityTown: "Cebu City",
        MonthlyRate: 20000,
        createdAt: now,
        updatedAt: now,
        ...data
      });
    }



    // =========================
    // SUPER ADMIN (ICTO)
    // =========================

    addEmployee({
      EmployeeNo:"EMP001",
      role_id:1,
      office_id:4,

      LastName:"Cruz",
      FirstName:"Juan",

      SameDeptCode:"ICTO",

      Position:"ICT Administrator",
      Email:"juan.cruz@icto.com",

      CellNo:"09111111111",

      MonthlyRate:35000,

      Password:hashedPassword
    });



    // =========================
    // PGSO ASSET MANAGER
    // =========================

    addEmployee({
      EmployeeNo:"EMP002",
      role_id:2,
      office_id:12,

      LastName:"Reyes",
      FirstName:"Maria",

      SameDeptCode:"PGSO",

      Position:"Property Management Officer",
      Email:"maria.reyes@pgso.com",

      CellNo:"09222222222",

      MonthlyRate:30000,

      Password:adminHashPassword
    });



    // =========================
    // OFFICE ADMINS
    // =========================

    const adminOffices = [
      {
        office_id:5,
        name:"HR",
        position:"HR Officer"
      },
      {
        office_id:6,
        name:"Accounting",
        position:"Accountant"
      },
      {
        office_id:7,
        name:"Budget",
        position:"Budget Officer"
      },
      {
        office_id:10,
        name:"Engineering",
        position:"Engineer"
      },
      {
        office_id:22,
        name:"PESO",
        position:"Employment Officer"
      },
      {
        office_id:21,
        name:"Tourism",
        position:"Tourism Officer"
      }
    ];


    let counter = 3;


    adminOffices.forEach((office)=>{

      const officeCode =
        officeMap.find(
          o=>o.office_id===office.office_id
        ).code;


      addEmployee({

        EmployeeNo:`EMP00${counter++}`,

        role_id:2,

        office_id:office.office_id,

        LastName:`${office.name}Admin`,
        FirstName:"Maria",

        SameDeptCode:officeCode,

        Position:office.position,

        Email:
        `${officeCode.toLowerCase()}admin@test.com`,

        Password:adminHashPassword

      });

    });



    // =========================
    // NORMAL EMPLOYEES
    // =========================


    let empCounter = 100;


    const excluded = [
      4,  // ICTO
      12  // PGSO
    ];


    officeMap
    .filter(
      o=>!excluded.includes(o.office_id)
    )
    .forEach((office)=>{


      for(let i=1;i<=3;i++){

        addEmployee({

          EmployeeNo:`EMP${empCounter++}`,

          role_id:3,

          office_id:office.office_id,

          isActive:0,

          LastName:`Employee${i}`,

          FirstName:office.code,

          SameDeptCode:office.code,

          Position:"Staff",

          Email:
          `${office.code.toLowerCase()}${i}@test.com`,

          CellNo:
          `09${Math.floor(
            100000000+
            Math.random()*900000000
          )}`,

          Password:hashedPassword

        });

      }

    });



    await queryInterface.bulkInsert(
      "Employees",
      employees,
      {}
    );

  },


  async down(queryInterface){

    await queryInterface.bulkDelete(
      "Employees",
      null,
      {}
    );

  }
};