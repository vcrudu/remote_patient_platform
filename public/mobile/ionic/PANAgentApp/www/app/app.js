/**
 * Created by Victor on 2/12/2016.
 */

var Bridge = {};

Bridge.getToken = function (callBack) {
  Bridge.resultCallback = callBack;
  var message = {method: "getToken"};
  prompt("bridge_key", JSON.stringify(message));
}

Bridge.getUrl = function (callBack) {
  Bridge.resultCallback = callBack;
  var message = {method: "getUrl"};
  prompt("bridge_key", JSON.stringify(message));
}

Bridge.callBack = function (result) {
  if (Bridge.resultCallback) {
    if (result.token && Bridge.resultCallback) {
      Bridge.resultCallback(result.token);
      // delete Bridge.resultCallback;
      return;
    }
    if (result.url && Bridge.resultCallback) {
      Bridge.resultCallback(result.url);
      //   delete Bridge.resultCallback;
      return;
    }
  }
}

angular.module("panAgentApp", ["ionic", 'ngMessages', 'ngStorage', 'rx'])

  .directive("compareTo", function () {
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function (scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function (modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function () {
          ngModel.$validate();
        });
      }
    };
  })

  .directive("creditCardType", function () {
    var directive =
    {
      require: "ngModel",
      link: function (scope, elm, attrs, ctrl) {
              ctrl.$parsers.unshift(function (value) {
                if (scope.ccInfo) {
                  scope.ccInfo.type =
                    (/^(?:5[1-5][0-9]{14})$/.test(value)) ? "mastercard"
                      : (/^(?:4[0-9]{12}(?:[0-9]{3})?)$/.test(value)) ? "visa"
                      : undefined;
                  ctrl.$setValidity("invalid", !!scope.ccInfo.type);

                  return value;
                }
                else {
                  return true;
                }
              })
            }
    }
    return directive;
  })

  .directive("cardExpiration", function () {
    var directive =
    {
      require: "ngModel",
      link: function(scope, elm, attrs, ctrl){
                scope.$watch("[ccInfo.month,ccInfo.year]", function(value){
                  ctrl.$setValidity("invalid",true);
                  if ( scope.ccInfo.year == scope.currentYear && scope.ccInfo.month <= scope.currentMonth) {
                    ctrl.$setValidity("invalid",false);
                  }

                  return value
                },true);
              }
    }
    return directive;
  })

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .factory('commonService', ['$http', '$localStorage', function ($http, $localStorage) {
    return {
      getToken: function (callback) {
        /*if ((/android/gi).test(navigator.userAgent)) {
         Bridge.getToken(callback);
         } else {*/
        setTimeout(function () {
          callback($localStorage.user.token);
        }, 0);
        /*}*/
      },
      getServerUrl: function (callback) {
        /*if ((/android/gi).test(navigator.userAgent)) {
         Bridge.getUrl(callback);
         } else {*/
        setTimeout(function () {
          callback("http://192.168.0.12:8081/v1/api/");
        }, 0);
        /*}*/
      },
      getPublicServerUrl: function (callback) {
        /*if ((/android/gi).test(navigator.userAgent)) {
         Bridge.getUrl(callback);
         } else {*/
        setTimeout(function () {
          callback("http://192.168.0.12:8081/");
        }, 0);
        /*}*/
      },
      setContextUser: function (user, callback) {
        setTimeout(function () {
          $localStorage.user = user;
          callback($localStorage.user);
        }, 0);
      },
      getContextUser: function (callback) {
        setTimeout(function () {
          callback($localStorage.user);
        }, 0);
      },
      setContextShoppingCart: function (cart, callback) {
        setTimeout(function () {
          $localStorage.cart = cart;
          callback($localStorage.cart);
        }, 0);
      },
      getContextShoppingCart: function (callback) {
        setTimeout(function () {
          callback($localStorage.cart);
        }, 0);
      },
      getCountries: function (callback) {
        setTimeout(function () {

          $http.get('app/resources/countries.json').then(function (res) {
            callback(res.data);
          }, function (err) {
          });

        }, 0);
      }
    };
  }])

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('home', {
        abstract: true,
        url: "/home",
        templateUrl: "app/home/landing.html"
      })

      .state('home.landing', {
        url: "/landing",
        views: {
          'content': {
            templateUrl: 'app/home/landing-content.html',
          }
        }
      })

      .state('home.become-patient', {
        url: "/become-patient",
        views: {
          'content': {
            templateUrl: 'app/home/become-patient.html',
          }
        }
      })

      .state('home.become-provider', {
        url: "/become-provider",
        views: {
          'content': {
            templateUrl: 'app/home/become-provider.html',
          }
        }
      })

      .state('patient', {
        abstract: true,
        url: "/patient",
        templateUrl: "app/patient/home.html",
      })

      .state('patient.landing', {
        url: "/landing",
        views: {
          'content': {
            templateUrl: 'app/patient/landing.html',
          }
        }
      })

      .state('patient.devices', {
        url: "/devices",
        views: {
          'content': {
            templateUrl: 'app/patient/devices.html',
          },

        }
      })

      .state('patient.device', {
        url: "/device/:model",
        views: {
          'content': {
            templateUrl: 'app/patient/device-details.html',
          },
        }
      })

      .state('patient.cart', {
        url: "/cart",
        views: {
          'content': {
            templateUrl: 'app/patient/shopping-cart.html',
          },
        }
      })

      .state('patient.checkout', {
        url: "/checkout",
        views: {
          'content': {
            templateUrl: 'app/patient/checkout.html',
          },
        }
      })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home/landing');
  });
