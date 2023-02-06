const ActionsUsersJson = require("../models/actionsUsersJsonBL");
const MAX_ACTIONS = 50;
let currentDate = new Date().toISOString().slice(0, 10);

const loginAuthCheck = async (userId) => {
  let isUserAllowed = true;

  //Check if the user have actions logged in the json file
  const actionJsonFile = await ActionsUsersJson.getActionsUsersFromJson();

  const haveActions = actionJsonFile.actions.filter(
    (action) => action.id === userId
  );

  if (haveActions.length === 0) {
    //If user don't have any actions records,
    //Insert a new action with MAX_ACTIONS to the json
    obj = {
      id: userId,
      maxActions: MAX_ACTIONS,
      date: currentDate,
      actionAllowed: MAX_ACTIONS,
    };
    ActionsUsersJson.updateActionsUsersFromJson(obj);
    isUserAllowed = true;
  }

  //If user do have actions logged, check if he have actions on current day.
  if (haveActions.length > 0) {
    const actionsOnToday = haveActions.filter(
      (action) => action.date.slice(0, 10) == currentDate
    );

    //if user have actions on today, find the minimum actionAllowed.
    if (actionsOnToday.length > 0) {
      const minActionAllowedToday = actionsOnToday.reduce((prev, curr) => {
        return prev.actionAllowed < curr.actionAllowed ? prev : curr;
      });

      //If the minimum actionAllowed === 0 return to login with a message
      if (minActionAllowedToday.actionAllowed === 0) {
        //Return to login page with unautorized msg
        isUserAllowed = false;
      }
      //If the minimum actionAllowed < maxActions && actionAllowed  > 0 -> add a new row with actionAllowed - 1
      if (
        minActionAllowedToday.actionAllowed > 0 &&
        minActionAllowedToday.actionAllowed <= minActionAllowedToday.maxActions
      ) {
        obj = {
          id: userId,
          maxActions: minActionAllowedToday.maxActions,
          date: currentDate,
          actionAllowed: minActionAllowedToday.actionAllowed - 1,
        };
        ActionsUsersJson.updateActionsUsersFromJson(obj);
        isUserAllowed = true;
      }
    }
    //If user don't have actions on today, create one.
    if (actionsOnToday.length === 0) {
      obj = {
        id: userId,
        maxActions: MAX_ACTIONS,
        date: currentDate,
        actionAllowed: MAX_ACTIONS,
      };
      ActionsUsersJson.updateActionsUsersFromJson(obj);
      isUserAllowed = true;
    }
  }

  return isUserAllowed;
};

const isUserHasCredit = async (userId) => {
  let isUserAllowed = false;
  let creditNum = 0;

  const actionJsonFile = await ActionsUsersJson.getActionsUsersFromJson();

  const todayUserMinActionAllowed = actionJsonFile.actions
    .filter(
      (action) =>
        action.id === userId && action.date.slice(0, 10) == currentDate
    )
    .reduce((prev, curr) => {
      return prev.actionAllowed < curr.actionAllowed ? prev : curr;
    });

  //If the minimum actionAllowed === 0 return to login with a message
  if (todayUserMinActionAllowed.actionAllowed === 0) {
    //Return to login page with unautorized msg
    isUserAllowed = false;
  }

  //If the minimum actionAllowed < maxActions && (actionAllowed>0) -> add a new row with actionAllowed - 1
  if (
    todayUserMinActionAllowed.actionAllowed > 0 &&
    todayUserMinActionAllowed.actionAllowed <=
      todayUserMinActionAllowed.maxActions
  ) {
    obj = {
      id: userId,
      maxActions: todayUserMinActionAllowed.maxActions,
      date: currentDate,
      actionAllowed: todayUserMinActionAllowed.actionAllowed - 1,
    };
    ActionsUsersJson.updateActionsUsersFromJson(obj);
    isUserAllowed = true;
    creditNum = todayUserMinActionAllowed.actionAllowed - 1;
  }

  return { isUserAllowed, creditNum };
};

const getUserCreditStatus = async (userId) => {
  let isUserAllowed = false;
  let creditNum = 0;

  const actionJsonFile = await ActionsUsersJson.getActionsUsersFromJson();

  const todayUserMinActionAllowed = actionJsonFile.actions
    .filter(
      (action) =>
        action.id === userId && action.date.slice(0, 10) == currentDate
    )
    .reduce((prev, curr) => {
      return prev.actionAllowed < curr.actionAllowed ? prev : curr;
    });

  //If the minimum actionAllowed === 0 return to login with a message
  if (todayUserMinActionAllowed.actionAllowed === 0) {
    //Return to login page with unautorized msg
    isUserAllowed = false;
  }

  //If the minimum actionAllowed < maxActions && (actionAllowed>0)
  if (
    todayUserMinActionAllowed.actionAllowed > 0 &&
    todayUserMinActionAllowed.actionAllowed <=
      todayUserMinActionAllowed.maxActions
  ) {
    creditNum = todayUserMinActionAllowed.actionAllowed;
    isUserAllowed = true;
  }

  return { isUserAllowed, creditNum };
};

module.exports = { loginAuthCheck, isUserHasCredit, getUserCreditStatus };
