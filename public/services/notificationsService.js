/**
 * Created by Victor on 30/08/2015.
 */
angular.module('app')
    .factory('notificationsService',
    ['$http', '$localStorage','appSettings', function($http, $localStorage, appSettings) {
        return {
            getNotifications: function (success, error) {
                var req = {
                    method: 'GET',
                    url: appSettings.getServerUrl() + '/v1/api/notifications?pageSize=10',
                    headers: {
                        'x-access-token': $localStorage.user.token
                    }
                };
                $http(req).success(function(res){
                    if(!res.error) {
                        success(res);
                    }else {
                        error(res.error);
                    }
                }).error(error);
            }
        };
    }]);