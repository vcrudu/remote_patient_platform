/**
 * Created by Victor on 04/09/2015.
 */
angular.module('app').controller('callRingingCtrl',['currentCallDetails',function($scope, currentCallDetails) {
    $scope.currentCallDetails = currentCallDetails;
    $scope.answer = function(){
        if(window.socket && window.socket.connected) {
            window.socket.emit('answer', $scope.currentCallDetails.data);
        }
    };
}]);