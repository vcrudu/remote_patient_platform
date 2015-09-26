/**
 * Created by Victor on 19/09/2015.
 */

angular.module('app').directive('minimumOneRequired',function(){
    return {
        require:'form',
        link: function(scope, elm, attrs, ctrl){
            elm.bind('submit', function (event) {
                // if form is not valid cancel it.
                ctrl.$invalid = !scope.vm.isAvailabilityValid();
            });
        }
    };
});
