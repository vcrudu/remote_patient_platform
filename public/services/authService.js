/**
 * Created by Victor on 19/06/2015.
 */

angular.module('app')
    .constant('appSettings',{
        qaserverUrl:'http://hcm-qa.elasticbeanstalk.com',
        serverUrl:'http://hcm-qa.elasticbeanstalk.com'
    })
    .factory('authService',
    ['$http', '$localStorage','$window','appSettings','toastr','ngDialog', function($http, $localStorage, $window, appSettings,toastr,ngDialog) {

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
                    data: data
                };
                $http(req).success(function(res){
                    if(!res.error) {
                        $localStorage.user = res.data;
                        if(window.socket){
                            window.socket.connect();
                        }else {
                            window.socket = window.io.connect(appSettings.serverUrl);
                            window.socket.on('connect', function() {
                                window.socket.emit('authenticate', {token: $localStorage.user.token});
                            });

                            window.socket.on('call', function(data) {
                                toastr.warning('Ringing......', 'Warn');
                                $localStorage.callData = data;
                                ngDialog.open({
                                    template:'provider/call.ringing.html',
                                    controller:'callRingingCtrl'
                                });
                            });

                            window.socket.on('answer', function(data) {
                                $localStorage.callData = data;
                                var url = data.start_url;
                                $window.open(url);
                            });

                            window.socket.on('meetingData', function(data) {
                                $localStorage.callData = data;
                                var url = data.join_url;
                                $window.open(url);
                            });
                        }
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
                return $localStorage.user !== undefined;
            },

            getUserName: function () {
                return $localStorage.user.firstname + ' ' + $localStorage.user.surname;
            },

            logout: function (success) {
                window.socket.disconnect();
                //delete window.socket;
                delete $localStorage.user;
                success();
            }
        };

    }]);