/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('patientCallCtrl', ['$scope', '$log', '$state',
    'toastr', 'authService', '$localStorage', 'ProviderService', 'Messaging','$modal',
    function ($scope, $log, $state, toastr, authService, $localStorage, ProviderService, Messaging, $modal) {

        var vm = this;

        var applyProviders = function(list){

            if(list){

                angular.forEach(list,function(l){

                    if(!l.image) {
                        l.image = "resourses/img/avatars/doctorhe.jpg"
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

        vm.call = function (provider) {
            var modalInstance = $modal.open({
                templateUrl: 'patient/appointments/dialog.call.html',
                controller : function($scope,$modalInstance,provider){

                    $scope.provider = provider;

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    provider: function () {
                        return provider;
                    }
                }
            });
            if (provider && provider.email && window.socket && window.socket.connected) {

                window.socket.emit('call', {recipient: provider.email, caller: $localStorage.user.email});
            }
        };

    }
]);
