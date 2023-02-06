const { DepartmentModel } = require("./models");

const getDeparments = () => {
  return new Promise((resolve, reject) => {
    DepartmentModel.find((err, departments) => {
      if (err) {
        reject(err);
      } else {
        resolve(departments);
      }
    });
  });
};

const getDeparmentById = (id) => {
  return new Promise((resolve, reject) => {
    DepartmentModel.findById(id, (err, department) => {
      if (err) {
        reject(err);
      } else {
        resolve(department);
      }
    });
  });
};

const createDeparment = (obj) => {
  return new Promise((resolve, reject) => {
    let deparment = DepartmentModel({
      Name: obj.Name,
      Manager: obj.Manager,
    });

    deparment.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(deparment._id);
      }
    });
  });
};

const updateDeparment = (id, obj) => {
  return new Promise((resolve, reject) => {
    DepartmentModel.findByIdAndUpdate(
      id,
      {
        Name: obj.Name,
        Manager: obj.Manager,
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
    DepartmentModel.findByIdAndUpdate(id, { [field]: value }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Update successfully");
      }
    });
  });
};

const deleteDeparment = (id) => {
  return new Promise((resolve, reject) => {
    DepartmentModel.findByIdAndDelete(id, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Deleted successfully");
      }
    });
  });
};

module.exports = {
  getDeparments,
  getDeparmentById,
  createDeparment,
  updateDeparment,
  deleteDeparment,
  updateSingleField,
};
