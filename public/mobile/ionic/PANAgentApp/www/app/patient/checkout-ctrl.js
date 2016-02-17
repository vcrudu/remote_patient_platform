/**
 * Created by Victor on 2/15/2016.
 */

angular.module('panAgentApp').controller("PatientCheckoutCtrl", ['$scope', '$state', '$ionicPopup', 'commonService', 'shoppingCartService',
  function ($scope, $state, $ionicPopup, commonService, shoppingCartService) {
    if ($scope.$parent && $scope.$parent.changeCartIconVisibility)
    {
      $scope.$parent.changeCartIconVisibility(false);
    }

    if ($scope.$parent && $scope.$parent.changeCartSubtotalVisibility)
    {
      $scope.$parent.changeCartSubtotalVisibility(false);
    }

    $scope.subtotal = shoppingCartService.getTotal();

    $scope.ccInfo = {type:undefined}

    $scope.paymentInfo = {
      firstName: "",
      lastName: ""
    };

    $scope.countries = [];
    commonService.getCountries(function(result) {
      $scope.countries = result;
    })

    commonService.getContextUser(function(user) {
      $scope.paymentInfo.firstName = user.name;
      $scope.paymentInfo.lastName = user.surname;
    });

    $scope.countriesPopup = null;
    $scope.showCountriesPopup = function()
    {
      $scope.countriesPopup = $ionicPopup.show({
        template: '<ion-list>'+
                  '  <ion-item ng-repeat="country in countries" ng-click="closeCountriesPopup(country)"> '+
                  '    <span class="flag-icon flag-icon-{{country.code | lowercase}}"></span> {{country.name}}'+
                  '  </ion-item>                                 '+
                  '</ion-list>                                   ',

        scope: $scope,
        buttons: [
          { text: 'Cancel' },
        ]
      });
    }

    $scope.selectCountryLabel = "PICK COUNTRY"
    $scope.selectedCountry = null;
    $scope.closeCountriesPopup = function(country)
    {
      if ($scope.countriesPopup)
      {
        $scope.selectedCountry = country;
        $scope.countriesPopup.close();
        $scope.selectCountryLabel = "CHANGE COUNTRY"
      }
    }
  }]);
