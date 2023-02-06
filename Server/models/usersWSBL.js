const wsUsersDAL = require("../dal/wsUsersDAL");

const validateUsernameAndEmail = async (username, email) => {
  return new Promise(async (resolve, reject) => {
    const resp = await wsUsersDAL.getUsers();
    const users = resp.data;
    try {
      const result = users.filter(
        (user) => user.username === username && user.email === email
      );
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

const getUsersFromWS = async () => {
  return new Promise(async (resolve, reject) => {
    const resp = await wsUsersDAL.getUsers();
    const users = resp.data;
    try {
      resolve(users);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { validateUsernameAndEmail, getUsersFromWS };
