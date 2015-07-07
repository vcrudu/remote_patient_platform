/**
 * Created by Victor on 21/06/2015.
 */
var usersRepository = require('./usersRepository');
var usersDetailsRepository = require('./usersDetailsRepository');

module.exports ={
    Users:usersRepository,
    UsersDetails:usersDetailsRepository
};
