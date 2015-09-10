/**
 * Created by Victor on 19/06/2015.
 */

angular.module('app')
    .factory('appSettings',['$location', function($location) {
        return {
            getServerUrl:function(){
                    return "//" + $location.host()+":"+$location.port();
            }
        };
    }]).factory('authService',['$http', '$localStorage','$window','$modal','$rootScope','appSettings','toastr','ngDialog','callService',
        function($http, $localStorage, $window,$modal, $rootScope, appSettings,toastr,ngDialog, callService) {

            function StartCallSound() {
                if (window.snd) {
                    window.snd.play();

                }
            }

            function StopCallSound() {
                if (window.snd) {
                    window.snd.pause();
                }
            }

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
                        url: appSettings.getServerUrl() + '/signin',
                        data: data
                    };
                    $http(req).success(function (res) {
                        if (!res.error) {
                            $localStorage.user = res.data;
                            if (window.socket) {
                                window.socket.connect();
                            } else {
                                window.socket = window.io.connect(appSettings.getServerUrl());
                                window.socket.on('connect', function () {
                                    window.socket.emit('authenticate', {token: $localStorage.user.token});
                                });

                                window.socket.on('call', function (data) {
                                    $localStorage.callData = data;

                                    callService.getContact(data.caller, function (contact) {
                                        $localStorage.recipientModal = $modal.open({
                                            templateUrl: 'patient/appointments/dialog.call.html',
                                            controller: function ($scope, $modalInstance, provider, isCalling) {

                                                StartCallSound();
                                                $scope.provider = provider;
                                                $scope.isCalling = isCalling;

                                                $scope.cancel = function () {
                                                    $modalInstance.dismiss({send: true});
                                                };

                                                $scope.answer = function () {
                                                    $modalInstance.close({send: true});
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

                                        $localStorage.recipientModal.result.then(function (arg) {
                                            if (arg.send && window.socket && window.socket.connected) {
                                                window.socket.emit('answer', $localStorage.callData);
                                            }
                                        }, function (arg) {
                                            if (arg.send && window.socket && window.socket.connected) {
                                                //Todo-here recipient and caller is inverted:We should somehow solve describe this better.
                                                window.socket.emit('cancel', $localStorage.callData);
                                            }
                                        });

                                    }, function (error) {
                                        toastr.error(error);
                                    });
                                });

                                window.socket.on('answer', function (data) {
                                    $localStorage.callData = data;
                                    var url = data.start_url;
                                    $localStorage.callerModal.close({send: false});
                                    StopCallSound();
                                    $window.open(url);
                                });

                                window.socket.on('cancel', function (data) {
                                    $localStorage.callData = data;
                                    StopCallSound();
                                    if ($localStorage.recipientModal && $localStorage.recipientModal.dismiss)
                                        $localStorage.recipientModal.dismiss({send: false});
                                    if ($localStorage.callerModal && $localStorage.callerModal.dismiss)
                                        $localStorage.callerModal.dismiss({send: false});
                                });

                                window.socket.on('meetingData', function (data) {
                                    StopCallSound();
                                    $localStorage.recipientModal.close({send: false});
                                    $window.open(data.joinUrl);
                                });
                            }
                            success(res.data);
                        } else {
                            error(res.error);
                        }
                    }).error(error);
                },

                signup: function (data, success, error) {
                    var req = {
                        method: 'POST',
                        url: appSettings.getServerUrl() + '/signup',

                        data: data
                    };
                    $http(req).success(function (res) {
                        if (!res.error) {
                            $localStorage.user = res.data;
                            success(res.data);
                        } else {
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