/**
 * Created by Victor on 21/06/2015.
 */
var UserFactoryImplementation = require('./user');
var OrderImplementation = require('./order');
var EventImplementation = require('./event');
var HealthProfessionalImplementation = require('./healthProfessional');

module.exports = {
    UserFactory:UserFactoryImplementation,
    Order:OrderImplementation,
    Event:EventImplementation,
    HealthProfessional:HealthProfessionalImplementation
};