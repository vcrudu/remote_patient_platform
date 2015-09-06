/**
 * Created by Victor on 19/06/2015.
 */

angular.module('app')
    .constant('appSettings',{
        qaserverUrl:'http://hcm-qa.elasticbeanstalk.com',
        serverUrl:'http://192.168.0.13:8081'
    })
    .factory('authService',
    ['$http', '$localStorage','$window','$modal','$rootScope','appSettings','toastr','ngDialog','callService',
         function($http, $localStorage, $window,$modal, $rootScope, appSettings,toastr,ngDialog, callService) {

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
                                $localStorage.callData = data;

                                callService.getContact(data.caller, function(contact){
                                    $localStorage.callModal = $modal.open({
                                        templateUrl: 'patient/appointments/dialog.call.html',
                                        controller : function($scope,$modalInstance,provider,isCalling) {

                                            $scope.provider = provider;
                                            $scope.isCalling = isCalling;

                                            $rootScope.$on('cancelCall',function(){
                                                $modalInstance.dismiss('cancel');
                                            });

                                            $scope.cancel = function () {
                                                //Todo-here to change the provider to contact
                                                if (provider && provider.email && window.socket && window.socket.connected) {
                                                    window.socket.emit('cancel', {recipient:$localStorage.user.email , caller: provider.email});
                                                }
                                                $modalInstance.dismiss('cancel');
                                            };

                                            $scope.answer = function () {
                                                if (provider && provider.email && window.socket && window.socket.connected) {
                                                    window.socket.emit('answer', {recipient: $localStorage.user.email , caller: provider.email});
                                                }
                                                $modalInstance.dismiss('cancel');
                                            };
                                        },
                                        resolve: {
                                            //Todo-here the provider should be changed to contact
                                            provider: function () {
                                                return contact;
                                            },
                                            isCalling: function () {
                                                return false;
                                            }
                                        }
                                    });
                                },function(error){
                                    toastr.error(error);
                                });
                            });

                            window.socket.on('answer', function(data) {
                                $localStorage.callData = data;
                                var url = data.start_url;
                                $localStorage.callModal.close('cancel');
                                $window.open(url);
                            });

                            window.socket.on('cancel', function(data) {
                                $localStorage.callData = data;
                                $localStorage.callModal.close('cancel');
                            });

                            window.socket.on('meetingData', function(join_url) {
                                $localStorage.callModal.close('cancel');
                                $window.open(join_url.joinUrl);
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