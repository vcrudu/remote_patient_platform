/**
 * Created by Victor on 2/10/2016.
 */

angular.module("mobileApp")
    .controller("PatientSignUpCtrl", ['$scope', 'accessService', function ($scope, accessService) {
            $scope.patient = {
                email: "",
                password: "",
                confirmPassword: "",
                type: "patient",
                name: "",
                surname: "",
                agent: "mobile"
            };

            $scope.signUp = function()
            {
                accessService.patientSignUp($scope.patient, function(result) {
                    //sign in user and store user login details

                    accessService.signInWithToken(result.token, function(res) {
                        if($scope.$parent)
                        {
                            $scope.$parent.goToState("patient-signup.landing");
                        }
                    }, function(error) {
                    })
                }, function(error) {
                });
            };
    }]);