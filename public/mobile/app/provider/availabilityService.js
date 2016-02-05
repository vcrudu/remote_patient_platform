/**
 * Created by Victor on 2/5/2016.
 */

angular.module('mobileApp').factory('providerAvailabilityService',['$http', 'rx','commonService',
    function($http, rx, commonService) {
        return {
            getAvailabilityByPeriod: function (startDate, endDate, success, error) {
                var tokenSource = rx.Observable.fromCallback(commonService.getToken)();
                var urlSource = rx.Observable.fromCallback(commonService.getServerUrl)();
                var source = rx.Observable.when(tokenSource.and(urlSource).thenDo(function (token, url) {
                    return {token:token, url:url};
                }));

                source.subscribe(
                    function (x) {
                        var req = {
                            method: 'GET',
                            url: x.url + "provider_availability_period?startDate=" + startDate + "&endDate=" + endDate,
                            headers: {
                                'x-access-token': x.token
                            }
                        };

                        $http(req).success(function (res) {
                            success(res.result);
                        }).error(error);
                    });
            },
            getAvailability: function (dateTime, success, error) {
                var tokenSource = rx.Observable.fromCallback(commonService.getToken)();
                var urlSource = rx.Observable.fromCallback(commonService.getServerUrl)();
                var source = rx.Observable.when(tokenSource.and(urlSource).thenDo(function (token, url) {
                    return {token:token, url:url};
                }));

                source.subscribe(
                    function (x) {
                        var req = {
                            method: 'GET',
                            url: x.url + 'provider_availability',
                            headers: {
                                'x-access-token': x.token
                            }
                        };

                        $http(req).success(function (res) {
                            success(res.result);
                        }).error(error);
                    });
            }, addAvailability: function (availability, success, error) {
                var tokenSource = rx.Observable.fromCallback(commonService.getToken)();
                var urlSource = rx.Observable.fromCallback(commonService.getServerUrl)();
                var source = rx.Observable.when(tokenSource.and(urlSource).thenDo(function (token, url) {
                    return {token:token, url:url};
                }));

                source.subscribe(function(x) {
                    var req = {
                        method: 'POST',
                        url: x.url + 'availability',
                        headers: {
                            'x-access-token': x.token
                        },
                        data: availability
                    };

                    $http(req).success(function (res) {
                        success(res.result);
                    }).error(error);
                });

            }, editAvailability: function (availability, success, error) {
                var tokenSource = rx.Observable.fromCallback(commonService.getToken)();
                var urlSource = rx.Observable.fromCallback(commonService.getServerUrl)();
                var source = rx.Observable.when(tokenSource.and(urlSource).thenDo(function (token, url) {
                    return {token:token, url:url};
                }));

                source.subscribe(function(x) {
                    var req = {
                        method: 'PUT',
                        url: x.url + 'availability',
                        headers: {
                            'x-access-token': x.token
                        },
                        data: availability
                    };

                    $http(req).success(function (res) {
                        success(res.result);
                    }).error(error);
                });
            }
        };
    }]);