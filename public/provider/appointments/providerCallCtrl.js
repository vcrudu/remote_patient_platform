/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('providerCallCtrl', ['$scope', '$log', '$state',
    'toastr', 'authService', '$localStorage', 'appointedPatientsService', 'Messaging','$modal','$rootScope',
    function ($scope, $log, $state, toastr, authService, $localStorage, appointedPatientsService, Messaging, $modal,$window) {

        var vm = this;

        var applyProviders = function(list){

            if(list){

                angular.forEach(list,function(l){

                    if(!l.avatar) {
                        l.avatar = "resourses/img/avatars/doctorhe.jpg"
                    }
                });

                vm.providers = list;

            }

        };

        vm.searchProviders = function () {
            appointedPatientsService.search()
                .then(function (response) {
                    if (!response.data.success) {
                        Messaging.errHandle(response.data);
                    } else {
                        applyProviders(response.data.result);
                    }
                }, function (e) {
                    Messaging.errHandle(e);
                })
        };

        function StartCallSound(){
            if(window.snd) {
                window.snd.play();

            }
        }

        function StopCallSound(){
            if(window.snd) {
                window.snd.pause();
            }
        }

        vm.searchProviders();

        vm.call = function (provider, isCalling) {
            $localStorage.callData = {recipient: provider.email, caller: $localStorage.user.email};

            $localStorage.callerModal = $modal.open({
                backdrop: 'static',
                templateUrl: 'patient/appointments/dialog.call.html',
                controller : function($scope,$modalInstance,$rootScope, provider,isCalling){

                    StartCallSound();
                    $scope.provider = provider;
                    $scope.isCalling = isCalling;

                    $scope.cancel = function () {
                        $modalInstance.dismiss({send:true});
                    };

                    $scope.answer = function () {
                    };
                },
                resolve: {
                    provider: function () {
                        return provider;
                    },
                    isCalling: function () {
                        return isCalling;
                    }
                }
            });

            $localStorage.callerModal.result.then(function () {
            }, function (arg) {
                if (arg.send && window.socket && window.socket.connected) {
                    $localStorage.callData.recipient = provider.patientId;
                    window.socket.emit('cancelByCaller', $localStorage.callData);
                    StopCallSound();
                }
            });

            if (provider && provider.patientId && window.socket && window.socket.connected) {
                window.socket.emit('call', {recipient: provider.patientId, caller: $localStorage.user.email});
            }
        };

    }
]);