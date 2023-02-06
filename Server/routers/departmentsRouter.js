const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const deparmenstBL = require("../models/departmentBL");
const employeesBL = require("../models/employeesBL");
const authBL = require("../models/authBL");

// Entry Point: 'http://localhost:8888/departments/'
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
      const usersValidation = await authBL.isUserHasCredit(data.userId);
      const allDepartments = await deparmenstBL.getDeparments();

      res.json({
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

// Entry Point: "http://localhost:8888/departments/employees"
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
      //Check user's credit
      const usersValidation = await authBL.isUserHasCredit(data.userId);
      const allDepartments = await deparmenstBL.getDeparments();
      const allEmployees = await employeesBL.getEmployees();

      res.json({
        allDepartments,
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

// Entry Point: 'http://localhost:8888/departments/id'
router.route("/:id").get((req, res) => {
  const token = req.headers["x-access-token"];
  const departmentId = req.headers["department-id"];

  if (!token) {
    res.status(401).json("No Token Provided");
  }
  const RSA_PRIVATE_KEY = req.socket.remoteAddress;
  jwt.verify(token, RSA_PRIVATE_KEY, async (err, data) => {
    if (err) {
      res.status(500).json("Failed to authenticate token");
    }
    try {
      const departmentData = await deparmenstBL.getDeparmentById(departmentId);
      const employeesData = await employeesBL.getEmployees();
      const usersValidation = await authBL.isUserHasCredit(data.userId);

      res.json({
        departmentData,
        employeesData,
        currentUserFullName: data.name,
        userId: data.userId,
        creditNum: usersValidation.creditNum,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// Entry Point: 'http://localhost:8888/departments/
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
      const newDepartmentId = await deparmenstBL.createDeparment(obj);

      res.json({
        newDepartmentId,
        currentUserFullName: data.name,
        userId: data.userId,
        creditNum: usersValidation.creditNum,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

// http://localhost:8888/departments/id
router.route("/:id").put(async (req, res) => {
  const token = req.headers["x-access-token"];
  const bodyObj = req.body;

  if (!token) {
    res.status(401).json("No Token Provided");
  }
  const RSA_PRIVATE_KEY = req.socket.remoteAddress;
  jwt.verify(token, RSA_PRIVATE_KEY, async (err, data) => {
    if (err) {
      res.status(500).json("Failed to authenticate token");
    }
    try {
      const result = await deparmenstBL.updateDeparment(
        bodyObj._id,
        bodyObj.obj
      );
      res.json({ result, currentUserFullName: data.name, userId: data.userId });
    } catch (err) {
      console.log(err);
    }
  });
});

// http://localhost:8888/departments/id
router.route("/:id").delete(async (req, res) => {
  const token = req.headers["x-access-token"];
  const departmentId = req.headers["department-id"];
  const departmentManagerId = req.headers["department-manager-id"];

  if (!token) {
    res.status(401).json("No Token Provided");
  }
  const RSA_PRIVATE_KEY = req.socket.remoteAddress;
  jwt.verify(token, RSA_PRIVATE_KEY, async (err, data) => {
    if (err) {
      res.status(500).json("Failed to authenticate token");
    }
    try {
      //1 Go to departmentManagerId employee and put "" in his DepartmentID Field (with newupdateFunc)
      const updatedDocument = await employeesBL.updateSingleField(
        departmentManagerId,
        "DepartmentID",
        ""
      );
      //2 delete the department
      const result = await deparmenstBL.deleteDeparment(departmentId);
      res.json({ result, currentUserFullName: data.name, userId: data.userId });
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
