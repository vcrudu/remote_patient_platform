/**
 * Created by Victor on 1/10/2016.
 */

angular.module('mobileApp')
    .factory('common',[function($location) {
        return {
            getServerUrl:function(){
                return "//" + $location.host()+":"+$location.port();
            }
        };
    }]
