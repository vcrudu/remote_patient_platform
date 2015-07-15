/**
 * Created by Victor on 14/07/2015.
 */

(function(){

    angular.module('app').factory('spinnerInterceptor', ['usSpinnerService',function(usSpinnerService){
        return {
            request:function(config){
                usSpinnerService.spin('spinner-main');
                return config;
            },
            response:function(config){
                usSpinnerService.stop('spinner-main');
                return config;
            },
            requestError:function(config){
                usSpinnerService.stop('spinner-main');
                return config;
            },
            responseError:function(config){
                usSpinnerService.stop('spinner-main');
                return config;
            }
        };
    }]);

})();
