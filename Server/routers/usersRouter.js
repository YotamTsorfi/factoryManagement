const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const dbUsersBL = require("../models/dbUsersBL");
const WsUsersBL = require("../models/usersWSBL");
const jsonUsersBL = require("../models/actionsUsersJsonBL");
const authBL = require("../models/authBL");

// Entry Point: 'http://localhost:8888/users'
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
      const allUsersDB = await dbUsersBL.getUsers();
      const allUsersWS = await WsUsersBL.getUsersFromWS();
      const allActionsUsersJson = await jsonUsersBL.getActionsUsersFromJson();
      res.json({
        allUsersDB,
        allUsersWS,
        allActionsUsersJson,
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
