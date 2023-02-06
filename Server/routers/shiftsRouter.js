const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const shiftsBL = require("../models/shiftsBL");
const employeesBL = require("../models/employeesBL");
const authBL = require("../models/authBL");

// Entry Point: 'http://localhost:8888/shifts/'
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
      const allShifts = await shiftsBL.getShifts();
      res.json({
        allShifts,
        currentUserFullName: data.name,
        userId: data.userId,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// Entry Point: "http://localhost:8888/shifts/employees"
router.route("/employees").get((req, res) => {
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
      const usersValidation = await authBL.isUserHasCredit(data.userId);
      const allShifts = await shiftsBL.getShifts();
      const allEmployees = await employeesBL.getEmployees();

      res.json({
        allShifts,
        allEmployees,
        currentUserFullName: data.name,
        userId: data.userId,
        creditNum: usersValidation.creditNum,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// Entry Point: 'http://localhost:8888/shifts/id'
router.route("/:id").get((req, res) => {
  const token = req.headers["x-access-token"];
  const shiftId = req.params.id;

  if (!token) {
    res.status(401).json("No Token Provided");
  }
  const RSA_PRIVATE_KEY = req.socket.remoteAddress;
  jwt.verify(token, RSA_PRIVATE_KEY, async (err, data) => {
    if (err) {
      res.status(500).json("Failed to authenticate token");
    }

    try {
      const shiftData = await shiftsBL.getShiftById(shiftId);
      res.json({
        shiftData,
        currentUserFullName: data.name,
        userId: data.userId,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// Entry Point: 'http://localhost:8888/shifts/id'
router.route("/:id").post((req, res) => {
  const token = req.headers["x-access-token"];
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
      //Get the shift by the id
      //Extract Employees array And Add to it the new employee and send it as a field (new Employees array)
      const shiftToUpdate = await shiftsBL.getShiftById(obj.shift_id);
      let newEmployeesShiftArr = shiftToUpdate.Employees;
      newEmployeesShiftArr.push(obj.employee_id);

      const updatedDocument = await shiftsBL.updateSingleField(
        obj.shift_id,
        obj.shift_field,
        newEmployeesShiftArr
      );

      res.json({
        updatedDocument,
        currentUserFullName: data.name,
        userId: data.userId,
        creditNum: usersValidation.creditNum,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// Entry Point: 'http://localhost:8888/shifts/update/id'
router.route("/update/:id").post((req, res) => {
  const token = req.headers["x-access-token"];
  const objData = req.body;

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
      const updatedDocument = await shiftsBL.updateShift(
        objData._id,
        objData.obj
      );

      res.json({
        updatedDocument,
        currentUserFullName: data.name,
        userId: data.userId,
        creditNum: usersValidation.creditNum,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// Entry Point: 'http://localhost:8888/shifts'
router.route("/").post((req, res) => {
  const token = req.headers["x-access-token"];
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
      const result = await shiftsBL.createShift(obj);
      res.json({
        result,
        currentUserFullName: data.name,
        userId: data.userId,
        creditNum: usersValidation.creditNum,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
