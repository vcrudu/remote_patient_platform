/**
 * Created by Victor on 30/08/2015.
 */
angular.module('app')
    .factory('userService',
    ['$http', '$localStorage','appSettings', function($http, $localStorage, appSettings) {
        return {
            getUserDetails: function (success, error) {
                var req = {
                    method: 'GET',
                    url: appSettings.serverUrl + '/v1/api/users/'+$localStorage.user.email,
                    headers: {
                        'Access-Control-Request-Origin': 'http://localhost:8081',
                        'x-access-token': $localStorage.user.token,
                        'Access-Control-Request-Method': 'POST',
                        'Access-Control-Request-Headers': 'x-access-token'
                    }
                };
                $http(req).success(function(res){
                    if(!res.error) {
                        success(res.result);
                    }else {
                        error(res.error);
                    }
                }).error(error);
            }
        }
    }]);