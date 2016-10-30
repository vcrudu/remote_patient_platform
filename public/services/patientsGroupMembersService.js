
angular.module('app').factory('patientsGroupMembersService',['$http', '$localStorage','appSettings','$stateParams',
    function($http, $localStorage, appSettings, $stateParams) {
        return {
            getPatientsGroupMembers: function (success, error) {
                var req = {
                    method: 'GET',
                    url: appSettings.getServerUrl() + '/v1/api/patientsgroupmember/'+$stateParams.groupName,
                    headers: {
                        'x-access-token': $localStorage.user.token
                    }
                };

                $http(req).success(function(res){
                    success(res);
                }).error(error);
            }
        }
    }]);