/**
 * Created by home on 18.07.2015.
 */


angular.module('app').directive('checkExistsUser',function($q,$http){

    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$asyncValidators.checkExistsUser = function(modelValue, viewValue) {

                var def = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'checkExistsUser?email='+modelValue,
                    headers: {
                        'Access-Control-Allow-Origin':'*'
                    }
                };
                $http(req).
                    success(function(data, status, headers, config) {
                       if(data.success){
                           def.reject();
                       }else{
                           def.resolve();
                       }
                    });

                return def.promise;

            };
        }
    };
});

