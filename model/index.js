/**
 * Created by Victor on 21/06/2015.
 */
var UserFactoryImplementation = require('./user');
var OrderFactoryImplementation = require('./order');
var EventImplementation = require('./event');
var PaymentImplementation = require('./payment');
var HealthProfessionalImplementation = require('./healthProfessional');

module.exports = {
    UserFactory:UserFactoryImplementation,
    OrderFactory:OrderFactoryImplementation,
    Event:EventImplementation,
    Payment:PaymentImplementation,
    HealthProfessional:HealthProfessionalImplementation
};