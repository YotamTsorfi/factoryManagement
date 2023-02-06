const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

// User Modal Schema
const UserSchema = new mongoose.Schema(
  {
    Full_Name: String,
    Num_Of_Actions: Number,
  },
  { versionKey: false }
);

// Department Modal Schema
const DepartmentSchema = new mongoose.Schema(
  {
    Name: String,
    Manager: String,
  },
  { versionKey: false }
);

// Employees Modal Schema
const EmployeesSchema = new mongoose.Schema(
  {
    First_Name: String,
    Last_Name: String,
    DepartmentID: String,
    Start_Work_Year: Number,
  },
  { versionKey: false }
);

// Shifts Modal Schema
const ShiftsSchema = new mongoose.Schema(
  {
    Date: Date,
    Starting_Hour: Number,
    Ending_Hour: Number,
    Employees: Array,
  },
  { versionKey: false }
);

// Creating model objects
const UserModel = mongoose.model("users", UserSchema);
const DepartmentModel = mongoose.model("departments", DepartmentSchema);
const EmployeeModel = mongoose.model("employees", EmployeesSchema);
const ShiftModel = mongoose.model("shifts", ShiftsSchema);

// Exporting our model objects
module.exports = {
  UserModel,
  DepartmentModel,
  EmployeeModel,
  ShiftModel,
};
