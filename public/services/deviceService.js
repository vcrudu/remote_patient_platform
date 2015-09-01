angular.module('app')
    .factory('deviceService',
    ['dataaccess', '$q','$filter', function (dataaccess, $q,$filter) {

        var self = this,
            cached = [];

        var apiEndpoint = '/v1/api/devices';


        self.get = function (model) {
            return $filter('filter')(cached,function(d){
                return d.model === model;
            })[0];
        };

        self.search = function () {


            var d = $q.defer();


            dataaccess.get(apiEndpoint)
                .success(function (res) {

                    if (res.items) {
                        cached = res.items;
                    }

                    d.resolve(res);

                }).error(function (err) {
                    d.reject(err);
                });

            return d.promise;
        };

        return self;

    }]);