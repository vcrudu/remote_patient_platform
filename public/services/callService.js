/**
 * Created by Victor on 31/08/2015.
 */

angular.module('app').factory('callService',['$http', '$localStorage','appSettings',
    function($http,$localStorage,appSettings){
        return {
            getProviders:function(success, error){
                var req = {
                    method: 'GET',
                    url: appSettings.serverUrl + '/v1/api/providers/',
                    headers: {
                        'Access-Control-Request-Origin': 'http://localhost:8081',
                        'x-access-token': $localStorage.user.token
                    }
                };

                $http(req).success(function(res){
                    success(res);
                }).error(error);
            },
            getContact:function(userId, success, error){
                var req = {
                    method: 'GET',
                    url: appSettings.serverUrl + '/v1/api/contacts/'+userId,
                    headers: {
                        'x-access-token': $localStorage.user.token
                    }
                };

                $http(req).success(function(data){
                    success(data.result);
                }).error(error);
            }
        } ;
    }
]);