/**
 * Created by Victor on 2/5/2016.
 */

angular.module('mobileApp')
    .factory('providerPatientDetailsService',['$http','rx', 'commonService', '_', function($http, rx, commonService, _) {
        return {
            getUserDetails: function(success, error){
                var tokenSource = rx.Observable.fromCallback(commonService.getToken)();
                var urlSource = rx.Observable.fromCallback(commonService.getServerUrl)();
                var source = rx.Observable.when(tokenSource.and(urlSource).thenDo(function (token, url) {
                    return {token:token, url:url};
                }));

                source.subscribe(
                    function (x) {
                        var req = {
                            method:'GET',
                            url:x.url + 'patients/' + userId,
                            headers:{
                                'x-access-token': x.token
                            }
                        };
                        $http(req).success(function(data){
                                success(data.result);
                            }
                        ).error(error);
                    }
                );
            }
        };
    }]);