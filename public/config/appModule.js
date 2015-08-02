/**
 * Created by Victor on 14/07/2015.
 */
(function(){
     angular.module('app', ['ui.router','ui.bootstrap.datetimepicker','angular-underscore','ngStorage',
    'ngAnimate','toastr','angularSpinner','LocalStorageModule','ngRoute']);

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

    angular.module('app').config(['$httpProvider',function($httpProvider){
        $httpProvider.interceptors.push('spinnerInterceptor');
        $httpProvider.interceptors.push('authorisationInterceptor');
    }]);



})();