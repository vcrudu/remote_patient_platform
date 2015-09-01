angular.module('app')
    .factory('dataaccess',
    ['$http', '$localStorage', 'appSettings', '$q', function ($http, $localStorage, appSettings, $q) {

        var self = this;


        //var httpConfig = function () {
        //    return {
        //        headers: {
        //            //'Content-Type': 'application/json; charset=utf-8',
        //            'Accept': 'application/json',
        //            'x-access-token': $localStorage.user.token
        //        }
        //    };
        //};

        self.get = function (endpoint) {
            return $http.get(appSettings.serverUrl + endpoint);

        };

        self.post = function (endpoint, data) {

            return $http.post(appSettings.serverUrl + endpoint,
                JSON.stringify(data));
        };


        return self;

    }])
    .factory('BasketService',
    ['$localStorage', '$filter', '$rootScope', function ($localStorage, $filter, $rootScope) {

        var self = this,
            basket =  new Basket(null);

        //if($localStorage.basket){
        //    basket.Items =  $localStorage.basket.Items;
        //}


        var getDevice = function (device) {
            return $filter('filter')(basket.Items, function (i) {
                return i.Device.model == device.model
            })[0];

        };

        self.addToBasket = function (device, quantity) {

            var existed = getDevice(device);

            if (existed) {
                existed.Quantity += quantity;
            }
            else {
                basket.Items.push(new BasketItem(device, quantity))
            }

            $localStorage.basket = basket;

            $rootScope.$broadcast('basketChanged');
        };

        self.removeItem = function (item) {
            var existed = getDevice(item.Device);

            if (existed) {
                basket.Items.splice(basket.Items.indexOf(existed), 1);
            }

            $localStorage.basket = basket;

            $rootScope.$broadcast('basketChanged');
        };

        self.clearBasket = function (device) {
            basket = new Basket(null);
            delete $localStorage.basket;
            $rootScope.$broadcast('basketChanged');
        };

        self.getBasket = function () {
            return basket;
        };

        self.getTotal = function () {
            var result = 0;
            var basket = self.getBasket();
            if (basket) {
                result = basket.getAmount();
            }
            return result;
        };


        return self;
    }
    ])
;