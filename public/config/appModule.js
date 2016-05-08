/**
 * Created by Victor on 14/07/2015.
 */
(function(){
     angular.module('app', ['ui.router','ui.bootstrap.datetimepicker','angular-underscore','underscore','ngStorage',
    'ngAnimate','toastr','angularSpinner','LocalStorageModule','ngRoute','ngDialog','ui.bootstrap','rcWizard','rcForm', 'ui.calendar']);

    angular.module('app').factory('authorisationInterceptor',['$localStorage','$location',function($localStorage, $location){
        return{
            request:function(config){
                if($localStorage.user){
                    config.headers['x-access-token'] = $localStorage.user.token;
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

    angular.module('app').filter('rawHtml', ['$sce', function($sce){
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    }]);

    angular.module('app').directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    // Incase value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }]);

})();