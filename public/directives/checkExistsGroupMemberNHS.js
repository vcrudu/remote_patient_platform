/**
 * Created by developer1 on 8/2/2016.
 */

angular.module('app').directive('checkExistsGroupMemberNhs',function($q,$http,$localStorage,$stateParams,appSettings) {

    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$asyncValidators.checkExistsGroupMemberNhs = function (modelValue, viewValue) {

                var def = $q.defer();

                var req = {
                    method: 'GET',
                    url: appSettings.getServerUrl() + '/v1/api/checkExistsGroupMemberNhs?nhsNumber=' + modelValue + '&groupName=' + $stateParams.groupName
                    + '&providerId=' + $localStorage.user.email,
                    headers: {
                        'x-access-token': $localStorage.user.token
                    }
                };

                $http(req).success(function (data, status, headers, config) {


                    if (data.success) {


                        $localStorage.patientId = data.data[0].email;


                        // $localStorage.patientId = data.patientId;

                        def.reject();
                    } else {


                        $localStorage.patientId = data.data[0].email;


                        def.resolve();
                    }
                });

                return def.promise;

            };
        }
    };
});

