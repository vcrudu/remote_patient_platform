/**
 * Created by home on 25/12/2015.
 */
angular.module('app').directive('checkExistsNhs',function($q,$http){

    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$asyncValidators.checkExistsNhs = function(modelValue, viewValue) {

                var def = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'http://localhost:8081/checkExistsNhs?nhsNumber='+modelValue,
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

