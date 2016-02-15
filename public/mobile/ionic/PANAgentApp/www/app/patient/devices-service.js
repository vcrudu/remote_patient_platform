/**
 * Created by Victor on 2/15/2016.
 */

angular.module('panAgentApp').factory('devicesService', ['$http', 'rx', '$filter','commonService', function ($http, rx, $filter, commonService) {
  var patientDevices = [];
  return {
    getDevices: function (success, error) {
      var tokenSource = rx.Observable.fromCallback(commonService.getToken)();
      var urlSource = rx.Observable.fromCallback(commonService.getServerUrl)();
      var source = rx.Observable.when(tokenSource.and(urlSource).thenDo(function (token, url) {
        return {token:token, url:url};
      }));

      source.subscribe(
        function (x) {
          var req = {
            method: 'GET',
            url: x.url + "devices" + "?token=" + x.token,
            headers: {
              'x-access-token': x.token
            }
          };
          $http(req).success(function (res) {
            patientDevices = res;
            success(res);
          }).error(error);
        });
    },
    getDevice: function(model) {
      if (patientDevices && patientDevices.items) {
        return $filter('filter')(patientDevices.items, function (d) {
          return d.model === model;
        })[0];
      }
      return null;
    }
  };
}]);
