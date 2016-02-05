/**
 * Created by Victor on 2/3/2016.
 */

angular.module('mobileApp').factory('providerAppointmentsService',['$http', 'rx','commonService',
    function($http, rx, commonService) {
        return {
            getAppointments: function (startDate, endDate, success, error) {
                var tokenSource = rx.Observable.fromCallback(commonService.getToken)();
                var urlSource = rx.Observable.fromCallback(commonService.getServerUrl)();
                var source = rx.Observable.when(tokenSource.and(urlSource).thenDo(function (token, url) {
                    return {token:token, url:url};
                }));

                source.subscribe(
                    function (x) {
                        var req = {
                            method: 'GET',
                            url: x.url + "appointments?startDate=" + startDate + "&endDate=" + endDate,
                            headers: {
                                'x-access-token': x.token
                            }
                        };
                        $http(req).success(function (res) {
                            success(res.result);
                        }).error(error);
                    });
            }
        };
    }]);