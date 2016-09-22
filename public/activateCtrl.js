angular.module('app').controller('activateCtrl',['$scope', '$localStorage','$state', '$rootScope', function($scope, $localStorage, $state, $rootScope){
    this.signIn = function () {
        $rootScope.$broadcast('signin');
        $state.go($localStorage.user.type + ".home");
    }
}]);
