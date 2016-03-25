/**
 * Created by Victor on 2/11/2016.
 */

angular.module("mobileApp")
    .controller("PatientLandingCtrl", ['$scope', function ($scope) {
        $scope.buyDevice = function() {
            if($scope.$parent)
            {
                $scope.$parent.goToState("patient-devices");
            }
        };

        setTimeout(function() {
            var windowHeight = jQuery(window).height();
            jQuery("#landingCarousel").height(windowHeight);
            jQuery(".slideWrapper").height(windowHeight);
        }, 10);

        jQuery(window).resize(function() {
            var windowHeight = jQuery(window).height();
            jQuery("#landingCarousel").height(windowHeight);
            jQuery(".slideWrapper").height(windowHeight);
        });
    }]);