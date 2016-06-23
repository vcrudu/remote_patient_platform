/**
 * Created by home on 04/01/2016.
 */
angular.module('app').controller('confirmCtrl',['$scope', '$state', '$stateParams',
    function($scope, $state, $stateParams){
        $scope.userConfirm={email:""};

        if ($state && $state.params && $state.params.userName)
        {
            $scope.userConfirm.email = $stateParams.userName;
        }
        $scope.hideSendAgain=true;
        $scope.setShowForm = function(){
            $scope.hideSendAgain=false;
        };

        $scope.submitSendConfirm = function(){
            //submit activate email
        };
    }]);
