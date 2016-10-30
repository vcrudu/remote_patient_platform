/**
 * Created by home on 04/01/2016.
 */
angular.module('app').controller('groupMemberApproveCtrl',['$scope', '$state', '$location','authService','toastr','$rootScope',
    function($scope, $state, $location, authService, toastr,$rootScope) {
        var params = $location.search();
        vm = this;
        $rootScope.$broadcast('signin');
        vm.groupName = params.groupName;
        vm.authorisation = params.authorisation;
        vm.showQuestion = true;
        vm.message = 'Being a member of ' + vm.groupName + ' group your health care provider will be able to monitor your vital signs and contact you in case actions are needed.';
        vm.question = 'Would you like to become member of '+ vm.groupName + ' group?';
        vm.authorise = function () {
            authService.authoriseGroupMembership(vm.authorisation,
                function (res) {
                    if (res.data.success) {
                        vm.message = "You are now member of the group " + vm.groupName + '!';
                        vm.showQuestion = false;
                    } else {
                        $state.go('error');
                    }
                }, function (error) {
                    $state.go('error');
                    toastr.error(error, 'Error');
                }
            );
        };
    }]);
