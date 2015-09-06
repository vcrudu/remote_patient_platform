/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('patientCallCtrl', ['$scope', '$log', '$state',
    'toastr', 'authService', '$localStorage', 'ProviderService', 'Messaging','$modal','$rootScope',
    function ($scope, $log, $state, toastr, authService, $localStorage, ProviderService, Messaging, $modal,$rootScope) {

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
            ProviderService.search()
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


        vm.searchProviders();

        vm.call = function (provider, isCalling) {
            $localStorage.callModal = $modal.open({
                templateUrl: 'patient/appointments/dialog.call.html',
                controller : function($scope,$modalInstance,$rootScope, provider,isCalling){

                    $scope.provider = provider;
                    $scope.isCalling = isCalling;

                    $rootScope.$on('cancelCall',function(){
                        $modalInstance.dismiss('cancel');
                    });

                    $scope.cancel = function () {
                        //Todo-here to change the provider to contact
                        if (provider && provider.email && window.socket && window.socket.connected) {
                            //Todo-here recipient and caller is inverted:We should somehow solve describe this better.
                            window.socket.emit('cancel', {recipient: provider.email, caller: $localStorage.user.email});
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
                    provider: function () {
                        return provider;
                    },
                    isCalling: function () {
                        return isCalling;
                    }
                }
            });
            if (provider && provider.email && window.socket && window.socket.connected) {

                window.socket.emit('call', {recipient: provider.email, caller: $localStorage.user.email});
            }
        };

    }
]);
