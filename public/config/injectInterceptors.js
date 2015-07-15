/**
 * Created by Victor on 14/07/2015.
 */
(function(){
    angular.module('app').config(['$httpProvider',function($httpProvider){
        $httpProvider.interceptors.push('spinnerInterceptor');
        $httpProvider.interceptors.push('authorisationInterceptor');
    }]);
});
