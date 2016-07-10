/**
 * Created by Victor on 18/10/2015.
 */

angular.module('app').factory('patientsGroupsService',['$http', '$localStorage','appSettings',
    function($http, $localStorage, appSettings) {
        return {
            getPatientsGroups: function (success, error) {
                var req = {
                    method: 'GET',
                   url: appSettings.getServerUrl() + '/v1/api/patientsgroup',
                    headers: {
                        'x-access-token': $localStorage.user.token
                    }
                };


                $http(req).success(function(res){
                    success(res);
                }).error(error);
             //   });
                /*      getPacientAppointment: function (dateTime, success, error) {
                 var req = {
                 method:'GET',
                 url:appSettings.getServerUrl()+'/v1/api/patientAppointments',
                 headers:{
                 'x-access-token': $localStorage.user.token
                 }
                 };

                 $http(req).success(function(res){
                 success(res);
                 }).error(error);
                 },
                 bookAppointment: function (slot, success, error) {

                 var req = {
                 method: 'PUT',
                 url: appSettings.getServerUrl() + '/v1/api/appointments',
                 headers: {
                 'x-access-token': $localStorage.user.token
                 },
                 data: slot
                 };

                 $http(req).success(function (res) {
                 if (res.success) {
                 success(res.result);
                 } else {
                 error(res.error);
                 }
                 }).error(error);
                 }*/

            }
        }
    }]);