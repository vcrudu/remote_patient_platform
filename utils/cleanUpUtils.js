/**
 * Created by Victor on 20/10/2015.
 */

(function() {

    var usersRepository = require('../repositories').Users;
    var usersDetailsRepository = require('../repositories').UsersDetails;
    var videoService = require('../services').VideoService;
    var paymentService = require('../services').PaymentService;
    var notificationsRepository = require('../repositories/notificationsRepository');

    module.exports = {
        cleanUser: function (userId) {
            //paymentService.deleteCustomer(req, userId, function (err) {
            //notificationsRepository.cleanNotifications(userId, function (err) {
                videoService.deleteVideoUser(userId, function (err) {
                    usersDetailsRepository.delete(userId, function (err) {
                        usersRepository.delete(userId, function (err) {
                        });
                    });
                });
            //});
            //});
        }
    };
})();