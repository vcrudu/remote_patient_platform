angular.module('app').directive('checkExistsGroupName',function($q,$http,$localStorage,$stateParams,appSettings) {

    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$asyncValidators.checkExistsGroupName = function (modelValue, viewValue) {

                var def = $q.defer();

                var req = {
                    method: 'GET',
                    url: appSettings.getServerUrl() + '/v1/api/checkExistsGroupName?groupName=' + modelValue + '&providerId=' + $localStorage.user.email,
                    headers: {
                        'x-access-token': $localStorage.user.token
                    }
                };


                $http(req).success(function (data, status, headers, config) {


                    if (data.success) {


                        
                        def.reject();
                    } else {

                       
                        
                        def.resolve();
                    }
                });

                return def.promise;

            };
        }
    };
});

