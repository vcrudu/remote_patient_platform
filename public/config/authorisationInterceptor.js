/**
 * Created by Victor on 14/07/2015.
 */

(function(){
    angular.module('app').factory('authorisationInterceptor',['$localStorage',function($localStorage){
        return{
            request:function(config){
                if($localStorage.user){
                    config.headers.authorization = 'bearer'.concat(' ',$localStorage.user.token);
                }
                else{
                    config.headers.authorization = undefined;
                }
                return config;
            },
            requestError:function(config){
                return config;
            },
            responseError:function(config){
                return config;
            }
        };
    }]);
})();