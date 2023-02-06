const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const employeesBL = require("../models/employeesBL");
const shiftsBL = require("../models/shiftsBL");
const deparmenstBL = require("../models/departmentBL");
const authBL = require("../models/authBL");

// Entry Point: 'http://localhost:8888/employees'
router.route("/").get((req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(401).json("No Token Provided");
  }

  const RSA_PRIVATE_KEY = req.socket.remoteAddress;

  jwt.verify(token, RSA_PRIVATE_KEY, async (err, data) => {
    if (err) {
      res.status(500).json("Failed to authenticate token");
    }
    try {
      // Get data from DB + Verified jwt token
      const allEmployees = await employeesBL.getEmployees();

      res.json({
        allEmployees,
        currentUserFullName: data.name,
        userId: data.userId,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// Entry Point: 'http://localhost:8888/employees/shiftsanddepartments'
router.route("/shiftsanddepartments").get((req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(401).json("No Token Provided");
  }

  const RSA_PRIVATE_KEY = req.socket.remoteAddress;

  jwt.verify(token, RSA_PRIVATE_KEY, async (err, data) => {
    if (err) {
      res.status(500).json("Failed to authenticate token");
    }
    try {
      //Get data from DB + Verified jwt token
      const usersValidation = await authBL.isUserHasCredit(data.userId);
      const allEmployees = await employeesBL.getEmployees();
      const allShifts = await shiftsBL.getShifts();
      const allDepartments = await deparmenstBL.getDeparments();

      res.json({
        allEmployees,
        allShifts,
        allDepartments,
        currentUserFullName: data.name,
        userId: data.userId,
        creditNum: usersValidation.creditNum,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// Entry Point: 'http://localhost:8888/employees'
router.route("/").post((req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(401).json("No Token Provided");
  }
  const RSA_PRIVATE_KEY = req.socket.remoteAddress;
  jwt.verify(token, RSA_PRIVATE_KEY, async (err, data) => {
    if (err) {
      res.status(500).json("Failed to authenticate token");
    }

    try {
      const obj = req.body;
      const result = await employeesBL.createEmployee(obj);
      res.json({ result, currentUserFullName: data.name, userId: data.userId });
    } catch (err) {
      console.log(err);
    }
  });
});

// Entry Point: 'http://localhost:8888/employees/id'
router.route("/:id").get((req, res) => {
  const token = req.headers["x-access-token"];
  const employeeId = req.headers["employee-id"];

  if (!token) {
    res.status(401).json("No Token Provided");
  }
  const RSA_PRIVATE_KEY = req.socket.remoteAddress;
  jwt.verify(token, RSA_PRIVATE_KEY, async (err, data) => {
    if (err) {
      res.status(500).json("Failed to authenticate token");
    }

    try {
      const usersValidation = await authBL.isUserHasCredit(data.userId);
      const employeeData = await employeesBL.getEmployeeById(employeeId);

      res.json({
        employeeData,
        currentUserFullName: data.name,
        userId: data.userId,
        creditNum: usersValidation.creditNum,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// Entry Point: 'http://localhost:8888/employees/shiftsanddepartments/id'
router.route("/shiftsanddepartments/:id").get((req, res) => {
  const token = req.headers["x-access-token"];
  const employeeId = req.headers["employee-id"];

  if (!token) {
    res.status(401).json("No Token Provided");
  }
  const RSA_PRIVATE_KEY = req.socket.remoteAddress;
  jwt.verify(token, RSA_PRIVATE_KEY, async (err, data) => {
    if (err) {
      res.status(500).json("Failed to authenticate token");
    }

    try {
      const usersValidation = await authBL.isUserHasCredit(data.userId);
      const employeeData = await employeesBL.getEmployeeById(employeeId);
      const allShifts = await shiftsBL.getShifts();
      const allDepartments = await deparmenstBL.getDeparments();

      res.json({
        employeeData,
        allShifts,
        allDepartments,
        currentUserFullName: data.name,
        userId: data.userId,
        creditNum: usersValidation.creditNum,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// http://localhost:8888/employees/id
router.route("/:id").put(async (req, res) => {
  const token = req.headers["x-access-token"];
  const employeeId = req.headers["employee-id"];
  const chosenDeparmentId = req.headers["chosen-deparment-id"];
  const obj = req.body;

  if (!token) {
    res.status(401).json("No Token Provided");
  }
  const RSA_PRIVATE_KEY = req.socket.remoteAddress;
  jwt.verify(token, RSA_PRIVATE_KEY, async (err, data) => {
    if (err) {
      res.status(500).json("Failed to authenticate token");
    }
    try {
      const usersValidation = await authBL.isUserHasCredit(data.userId);
      const result = await employeesBL.updateEmployee(employeeId, obj);
      //Needs to Update the field Manager in the chosen department
      //With employeeId
      const status = await deparmenstBL.updateSingleField(
        chosenDeparmentId,
        "Manager",
        employeeId
      );

      res.json({
        result,
        currentUserFullName: data.name,
        creditNum: usersValidation.creditNum,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// http://localhost:8888/employees/id
router.route("/:id").delete(async (req, res) => {
  const token = req.headers["x-access-token"];
  const employeeId = req.headers["employee-id"];
  if (!token) {
    res.status(401).json("No Token Provided");
  }
  const RSA_PRIVATE_KEY = req.socket.remoteAddress;
  jwt.verify(token, RSA_PRIVATE_KEY, async (err, data) => {
    if (err) {
      res.status(500).json("Failed to authenticate token");
    }

    try {
      const usersValidation = await authBL.isUserHasCredit(data.userId);
      const result = await employeesBL.deleteEmployee(employeeId);

      //Delete all employee shifts (run on shifts, in every shift if shift.Employees == employeeId)
      //Delete the employeeId from this shift.
      const allshifts = await shiftsBL.getShifts();

      allshifts.map(async (shift) => {
        let shiftsPerEmployee = [];
        shift.Employees.forEach((empId) => {
          if (empId !== employeeId) {
            shiftsPerEmployee.push(empId);
          }
        });
        
        //Update the current shift._id and give the new employee arr shiftsPerEmployee
        const resultUpdateShiftEmployees = await shiftsBL.updateShift(
          shift._id,
          {
            Date: shift.Date,
            Ending_Hour: shift.Ending_Hour,
            Starting_Hour: shift.Starting_Hour,
            Employees: shiftsPerEmployee,
            creditNum: usersValidation.creditNum,
          }
        );
      });

      res.json({ result, currentUserFullName: data.name });
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
