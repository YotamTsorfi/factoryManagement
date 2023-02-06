const { UserModel } = require("./models");

const getUsers = () => {
  return new Promise((resolve, reject) => {
    UserModel.find((err, users) => {
      if (err) {
        reject(err);
      } else {
        resolve(users);
      }
    });
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    UserModel.findById(id, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};

const createUser = (obj) => {
  return new Promise((resolve, reject) => {
    let user = UserModel({
      Full_Name: obj.Full_Name,
      Num_Of_Actions: obj.Num_Of_Actions,
    });

    user.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(user._id);
      }
    });
  });
};

const updateUser = (id, obj) => {
  return new Promise((resolve, reject) => {
    UserModel.findByIdAndUpdate(
      id,
      {
        Full_Name: obj.Full_Name,
        Num_Of_Actions: obj.Num_Of_Actions,
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

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    UserModel.findByIdAndDelete(id, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Deleted successfully");
      }
    });
  });
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
