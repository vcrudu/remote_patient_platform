/**
 * Created by Victor on 21/06/2015.
 */
var usersRepository = require('./usersRepository');
var devicesRepository = require('./devicesRepository');
var usersDetailsRepository = require('./usersDetailsRepository');
var ordersRepository = require('./ordersRepository');

module.exports ={
    Users:usersRepository,
    UsersDetails:usersDetailsRepository,
    Devices:devicesRepository,
    Orders:ordersRepository
};
