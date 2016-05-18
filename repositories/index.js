/**
 * Created by Victor on 21/06/2015.
 */
var usersRepository = require('./usersRepository');
var devicesRepository = require('./devicesRepository');
var notificationsRepository = require('./notificationsRepository');
var usersDetailsRepository = require('./usersDetailsRepository');
var ordersRepository = require('./ordersRepository');
var eventsRepository = require('./eventsRepository');
var providersRepository = require('./providersRepository');
var slotsRepository = require('./slotsRepository');
var snsEndpointsRepository = require('./snsEndpointsRepository');

module.exports ={
    Users:usersRepository,
    UsersDetails:usersDetailsRepository,
    Devices:devicesRepository,
    Orders:ordersRepository,
    Events:eventsRepository,
    Providers:providersRepository,
    Slots:slotsRepository,
    Notifications:notificationsRepository,
    SnsEndpoints:snsEndpointsRepository
};
