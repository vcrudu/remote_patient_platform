/**
 * Created by Victor on 14/07/2015.
 */

angular.module('app').controller('asideNavCtrl',['$scope', '$localStorage', function($scope, $localStorage){
    $scope.status='closed';
    $scope.stateClass = 'fa fa-plus-square-o';
    $scope.childrenStateClass = {};
    $scope.isProvider =  $localStorage.user.type==='provider';

    $scope.isPatient = $localStorage.user.type==='patient';

    $scope.switchState = function() {
        if ($scope.status == 'open') {
            $scope.stateClass = 'fa fa-plus-square-o';
            $scope.status = 'closed';
            $scope.childrenStateClass = {};
        }else{
            $scope.stateClass = 'fa fa-minus-square-o';
            $scope.status = 'open';
            $scope.childrenStateClass = {display:"block"};
        }
    };
}]);