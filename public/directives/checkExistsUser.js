/**
 * Created by home on 18.07.2015.
 */


angular.module('app').directive('checkExistsUser',function($q){

    function checkUser(email){
        if (email =="test@test.com")
         {
            return false;
        }
        return true;
    }

    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$asyncValidators.checkExistsUser = function(modelValue, viewValue) {

                var def = $q.defer();
                var req = {
                    method: 'GET',
                    url: 'http://localhost:8080/checkExistsUser',
                    headers: {
                        'Access-Control-Allow-Origin':'*'
                    },
                    data: {email:modelValue}
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

