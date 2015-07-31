/**
 * Created by Victor on 19/06/2015.
 */

angular.module('app')
    .constant('appSettings',{serverUrl:'http://localhost:8080'})
    .factory('authService',
    ['$http', '$localStorage','appSettings', function($http, $localStorage, appSettings) {

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        return {
            signin: function (data, success, error) {
                var req = {
                    method: 'POST',
                    url: appSettings.serverUrl + '/signin',
                    headers: {
                        'Access-Control-Allow-Origin':'*'
                    },
                    data: data
                };
                $http(req).success(function(res){
                    if(!res.error) {
                        $localStorage.user = res.data;
                        success(res.data);
                    }else {
                        error(res.error);
                    }
                }).error(error);
            },

            signup: function (data, success, error) {
                var req = {
                    method: 'POST',
                    url: appSettings.serverUrl + '/signup',
                    headers: {
                        'Access-Control-Allow-Origin':'*'
                    },
                    data: data
                };
                $http(req).success(function(res){
                    if(!res.error) {
                        $localStorage.user = res.data;
                        success(res.data);
                    }else {
                        error(res.error);
                    }
                }).error(error);
            },

            isAuthenticated: function () {
                return $localStorage.user===undefined;
            },

            getUserName: function () {
                return $localStorage.user.firstname + ' ' + $localStorage.user.surname;
            },

            logout: function (success) {
                delete $localStorage.user;
                success();
            }
        };

    }]);