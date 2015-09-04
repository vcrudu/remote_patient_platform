angular.module('app')
    .factory('dataaccess',
    ['$http', '$localStorage', 'appSettings', '$q', function ($http, $localStorage, appSettings, $q) {

        var self = this;


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
    ['$localStorage', '$filter', '$rootScope', 'dataaccess', function ($localStorage, $filter, $rootScope, dataaccess) {

        var self = this,
            basket = new Basket(null);

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

            self.updateBasket(basket);

            $rootScope.$broadcast('basketChanged');
        };

        self.removeItem = function (item) {
            var existed = getDevice(item.Device);

            if (existed) {
                basket.Items.splice(basket.Items.indexOf(existed), 1);
            }

            self.updateBasket(basket);

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

        self.updateBasket = function (basket) {
            $localStorage.basket = basket;

        };

        self.confirmOrder = function () {

            var basket = self.getBasket();
            if (!basket) {
                return;
            }

            var order = {
                shippingAddress: basket.shippingAddress,
                payment: basket.payment,
                orderItems: []
            };

            angular.forEach(basket.Items, function (item) {
                order.orderItems.push(
                    {
                        model: item.Device.model,
                        quantity: item.Quantity
                    }
                );
            });

            return dataaccess.post('/v1/api/orders',order);
        };

        return self;
    }
    ])
    .factory('common',
    ['dataaccess', function common(dataaccess) {

        var self = this;

        self.getCountries = function () {
            return dataaccess.get('/resourses/json/countries.json');
        };

        self.getMonths = function () {
            return [
                {id: 1, name: "January"},
                {id: 2, name: "February"},
                {id: 3, name: "March"},
                {id: 4, name: "April"},
                {id: 5, name: "May"},
                {id: 6, name: "June"},
                {id: 7, name: "July"},
                {id: 8, name: "August"},
                {id: 9, name: "September"},
                {id: 10, name: "October"},
                {id: 11, name: "November"},
                {id: 12, name: "December"}]
        };

        return self;
    }]);
