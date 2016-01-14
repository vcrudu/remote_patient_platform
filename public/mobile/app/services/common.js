/**
 * Created by Victor on 1/10/2016.
 */

angular.module('mobileApp')
    .factory('commonService',['$localStorage', function($localStorage) {
        return {
            getToken:function(){
                return $localStorage.user.token;
            },
            getServerUrl:function(){
                return "http://localhost:8081"
            }
        };
    }]);
