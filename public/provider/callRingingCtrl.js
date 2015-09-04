/**
 * Created by Victor on 04/09/2015.
 */
angular.module('app').controller('callRingingCtrl',['$scope','$localStorage',function($scope, $localStorage) {
    $scope.main = {};
    $scope.main.callData   = $localStorage.callData;
    $scope.main.answer = function(){
        if(window.socket && window.socket.connected) {
            window.socket.emit('answer', $localStorage.callData);
        }
    };
}]);