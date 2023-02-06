const axios = require('axios');

const getUsers = ()=> {
    return axios.get("https://jsonplaceholder.typicode.com/users");
}

const getUserById = (id) => {
    return axios.get("https://jsonplaceholder.typicode.com/users/" + id);
}


module.exports = {getUsers, getUserById}