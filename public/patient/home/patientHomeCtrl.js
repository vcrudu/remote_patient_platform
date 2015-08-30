/**
 * Created by Victor on 28/07/2015.
 */
(function(){
    angular.module('app').controller('patientHomeCtrl',['$scope','$state','userService',function($scope,$state,userService){

        userService.getUserDetails(function(result){
            var user=result;
            alert(user.email + ' ' +user.firstname +' ' + user.surname);
        }, function(result){

        });

    }]);
})();
