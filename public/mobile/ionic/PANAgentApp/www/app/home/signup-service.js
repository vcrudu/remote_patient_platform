/**
 * Created by Victor on 2/15/2016.
 */

angular.module('panAgentApp').factory('signupService', ['$http', 'rx', '$localStorage', 'commonService', function ($http, rx, $localStorage, commonService) {
  return {
    patientSignUp: function (patient, success, error) {
      var urlSource = rx.Observable.fromCallback(commonService.getPublicServerUrl)();
      var source = rx.Observable.when(urlSource.thenDo(function (url) {
        return {url: url};
      }));

      source.subscribe(
        function (x) {
          var req = {
            method: 'POST',
            url: x.url + "signup",
            data: patient
          };
          $http(req).success(function (res) {
            if (!res.success) {
              error(res.error);
            }
            else {
              success(res.data);
            }

          }).error(error);
        });
    },
    signInWithToken: function (token, success, error) {
      var urlSource = rx.Observable.fromCallback(commonService.getServerUrl)();
      var source = rx.Observable.when(urlSource.thenDo(function (url) {
        return {url: url};
      }));

      source.subscribe(
        function (x) {
          var req = {
            method: 'POST',
            url: x.url + 'token_signin' + '?token=' + token,
            headers: {
              'x-access-token': token
            }
          };

          $http(req).success(function (res) {
            if (!res.error) {
              //TODO-here: use bridge for android
              $localStorage.user = res.data;
              success($localStorage.user);
            } else {
              error(res.error);
            }
          }).error(error);
        });
    }
  };
}]);

