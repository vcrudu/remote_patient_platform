angular.module('app').factory('appointedPatientsService',
    ['$localStorage', '$filter', '$rootScope', 'dataaccess', function ($localStorage, $filter, $rootScope, dataaccess) {

        var self = this;

        self.search = function () {

            return dataaccess.get('/v1/api/appointments');
        };
        return self;
    }
    ]);