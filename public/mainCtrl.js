/**
 * Created by Victor on 29/04/2015.
 */
(function(){
    var app = angular.module('app', ['ui.router','ui.bootstrap.datetimepicker','angular-underscore','ngStorage',
    'ngAnimate','toastr','angularSpinner']);
    app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/login");
        $stateProvider.state('login',{
            url:"/login",
            views:{
                "headerView":{templateUrl:"loggedOutHeader.html"},
                "mainView":{templateUrl:"login.html"}
            },
            controller:'loginCtrl'
        }).state("patient",{
            url:"/patient",
            views:{
                "headerView":{templateUrl:"patient.header.html"},
                "mainView":{templateUrl:"patient.body.html"}
            }
        }).state('register',{
            url:"/register",
            views:{
                "headerView":{templateUrl:"registerHeader.html"},
                "mainView":{templateUrl:"register.html"}
            },
            controller:'registerCtrl'
        }).state('register.type',{
            url:"/type",
            templateUrl:"register.type.html",
            controller:'registerCtrl',
            data:{
                previousState:NaN,
                nextState:"register.basic",
                order:0
            }
        }).state('register.basic',{
            url:"/basic",
            templateUrl:"register.basic.html",
            controller:'registerBasicCtrl',
            data:{
                previousState:"register.type",
                nextState:"register.address",
                order:1
            }
        }).state('register.address',{
            url:"/address",
            templateUrl:"register.address.html",
            controller:'registerAddressCtrl',
            data:{
                previousState:"register.basic",
                nextState:"register.medical",
                order:2
            }
        }).state('register.medical',{
            url:"/medical",
            templateUrl:"register.medical.html",
            controller:'registerMedicalCtrl',
            data:{
                previousState:"register.address",
                nextState:"register.save",
                order:3
            }
        }).state('register.save',{
            url:"/save",
            templateUrl:"register.save.html",
            controller:'registerCtrl',
            data:{
                previousState:"register.medical",
                nextState:NaN,
                order:4
            }
        })
    }]);

    app.config(function(toastrConfig) {
        angular.extend(toastrConfig, {
            allowHtml: false,
            autoDismiss: false,
            closeButton: false,
            closeHtml: '<button>&times;</button>',
            containerId: 'toast-container',
            extendedTimeOut: 1000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            maxOpened: 0,
            messageClass: 'toast-message',
            newestOnTop: true,
            onHidden: null,
            onShown: null,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            progressBar: false,
            tapToDismiss: true,
            target: 'body',
            templates: {
                toast: 'directives/toast/toast.html',
                progressbar: 'directives/progressbar/progressbar.html'
            },
            timeOut: 5000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        });
    });

    app.factory('authorisationInjector',['$localStorage',function($localStorage){
        return{
          request:function(config){
              if($localStorage.token){
                    config.headers['authorization'] = 'bearer'.concat(' ',$localStorage.token);
              }
              else{
                  config.headers['authorization'] = NaN;
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

    app.factory('spinnerInjector', ['usSpinnerService',function(usSpinnerService){
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

    app.config(['$httpProvider',function($httpProvider){
        $httpProvider.interceptors.push('spinnerInjector');
        $httpProvider.interceptors.push('authorisationInjector');
    }]);

    app.controller('mainCtrl', ['$scope','$state','toastr','authService',function($scope, $state, toastr, authService){
            $scope.extr_page="extr-page";
            $scope.bodyClass="desktop-detected pace-done";

            $scope.logOut = function(){
                authService.logout(function(){
                    toastr.info('Logged out!','Information');
                });
                $state.go('login');
            };
    }]);
})();
