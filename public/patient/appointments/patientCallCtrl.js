/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('patientCallCtrl',['$scope','$log','$state','toastr','authService','$localStorage', 'providers',
        function($scope, $log, $state, toastr, authService, $localStorage, providers){

                $scope.call = function(email){
                        if(window.socket && window.socket.connected){
                                window.socket.emit('call',{recipient:email, caller:$localStorage.user.email});
                        }
                };

                $scope.providers=providers;
        }
]);
