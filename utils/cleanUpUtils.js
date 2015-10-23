/**
 * Created by Victor on 20/10/2015.
 */

(function(){

    var usersRepository = require('../repositories').Users;
    var usersDetailsRepository = require('../repositories').UsersDetails;
    var videoService = require('../services').VideoService;
    var paymentService = require('../services').PaymentService;

    module.exports = {
        cleanUser: function (userId) {
            paymentService.deleteCustomer(req, userId, function () {
                videoService.deleteVideoUser(userId, function () {
                    usersDetailsRepository.delete(userId, function () {
                        usersRepository.delete(userId, function () {
                        });
                    });
                });
            });
        }
    };
})();