/**
 * Created by Victor on 21/06/2015.
 */
var UserFactoryImplementation = require('./user');
var OrderFactoryImplementation = require('./order');
var EventFactoryImplementation = require('./event');
var PaymentImplementation = require('./payment');
var ProviderFactoryImplementation = require('./providerFactory');

module.exports = {
    UserFactory:UserFactoryImplementation,
    OrderFactory:OrderFactoryImplementation,
    EventFactory:EventFactoryImplementation,
    Payment:PaymentImplementation,
    ProviderFactory:ProviderFactoryImplementation
};