const jsonActionsUsersDAL = require("../dal/jsonActionUsersDAL");

const getActionsUsersFromJson = async () => {
  return new Promise(async (resolve, reject) => {
    const resp = await jsonActionsUsersDAL.readFile();
    try {
      resolve(resp);
    } catch (err) {
      reject(err);
    }
  });
};

const updateActionsUsersFromJson = async (obj) => {
  return new Promise(async (resolve, reject) => {
    const resp = await jsonActionsUsersDAL.writeToFile(obj);
    try {
      resolve(resp);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { getActionsUsersFromJson, updateActionsUsersFromJson };
