const { EmployeeModel } = require("./models");

const getEmployees = () => {
  return new Promise((resolve, reject) => {
    EmployeeModel.find((err, employees) => {
      if (err) {
        reject(err);
      } else {
        resolve(employees);
      }
    });
  });
};

const getEmployeeById = (id) => {
  return new Promise((resolve, reject) => {
    EmployeeModel.findById(id, (err, employee) => {
      if (err) {
        reject(err);
      } else {
        resolve(employee);
      }
    });
  });
};

const createEmployee = (obj) => {
  return new Promise((resolve, reject) => {
    let employee = EmployeeModel({
      First_Name: obj.First_Name,
      Last_Name: obj.Last_Name,
      Start_Work_Year: obj.Start_Work_Year,
      DepartmentID: obj.DepartmentID,
    });

    employee.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(employee._id);
      }
    });
  });
};

const updateEmployee = (id, obj) => {
  return new Promise((resolve, reject) => {
    EmployeeModel.findByIdAndUpdate(
      id,
      {
        First_Name: obj.First_Name,
        Last_Name: obj.Last_Name,
        Start_Work_Year: obj.Start_Work_Year,
        DepartmentID: obj.DepartmentID,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("Update successfully");
        }
      }
    );
  });
};

const updateSingleField = (id, field, value) => {
  return new Promise((resolve, reject) => {
    EmployeeModel.findByIdAndUpdate(id, { [field]: value }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Update successfully");
      }
    });
  });
};

const deleteEmployee = (id) => {
  return new Promise((resolve, reject) => {
    EmployeeModel.findByIdAndDelete(id, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Deleted successfully");
      }
    });
  });
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateSingleField,
};
