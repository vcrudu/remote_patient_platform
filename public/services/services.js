angular.module('app')
    .factory('dataaccess',
    ['$http', '$localStorage', 'appSettings', '$q', function ($http, $localStorage, appSettings, $q) {

        var self = this;


        self.get = function (endpoint) {
            return $http.get(appSettings.getServerUrl() + endpoint);

        };

        self.post = function (endpoint, data) {

            return $http.post(appSettings.getServerUrl() + endpoint,
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
                return i.Device.model == device.model;
            })[0];

        };

        self.addToBasket = function (device, quantity) {

            var existed = getDevice(device);

            if (existed) {
                existed.Quantity += quantity;
            }
            else {
                basket.Items.push(new BasketItem(device, quantity));
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

        self.clearBasket = function () {
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

            return dataaccess.post('/v1/api/orders', order);
        };

        return self;
    }
    ])
    .factory('ProviderService',
    ['$localStorage', '$filter', '$rootScope', 'dataaccess', function ($localStorage, $filter, $rootScope, dataaccess) {

        var self = this;

        self.search = function () {

            return dataaccess.get('/v1/api/providers/');
        };

        self.save = function (provider) {
            return dataaccess.post('/signup', provider);
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
                {id: 12, name: "December"}];
        };

        self.getPersonTitles = function () {
            return [
                "Mr.",
                "Mrs.",
                "Ms.",
                "Dr."
            ];
        };

        self.getProviderTypes = function () {
            return [
                "Caregiver",
                "Nurse",
                "Medicine",
                "General practice",
                "Anaesthetics",
                "Ophthalmology",
                "Paediatrics",
                "Pathology",
                "Psychiatry",
                "Surgery"
            ];
        };

        self.getWeekDays = function () {
            return [
                {value: 1, text: "Sunday"},
                {value: 2, text: "Monday"},
                {value: 3, text: "Tuesday"},
                {value: 4, text: "Wednesday"},
                {value: 5, text: "Thursday"},
                {value: 6, text: "Friday"},
                {value: 7, text: "Saturday"}
            ];
        };

        self.getGenders = function () {
            return [
                {value: "Male", text: "Male"},
                {value: "Female", text: "Female"},
                {value: "NoAnswer", text: "Prefer not to answer"}
            ];
        };


        self.getErrorMessage = function (response) {
            var result = '';

            if (response.message) {
                result = response.message;
            }
            return result;
        };


        return self;
    }])
    .factory('Messaging', ['common',
        function (common) {

            var self = this;


            var isNullOrEmpty = function (val) {
                return !val || val.trim().length === 0;
            };

            self.info = function (size, title, message) {


                if (isNullOrEmpty(message)) {
                    return;
                }

                if (size === undefined) {
                    size = 'small';
                }


                switch (size) {
                    case 'big':
                        $.bigBox({
                            title: title,
                            content: message,
                            color: "#5384AF",
                            icon: "fa fa-info fadeRight animated",
                            timeout: 5000
                        });
                        break;
                    case 'small':
                        $.smallBox({
                            title: title,
                            content: message,
                            color: "#5384AF",
                            iconSmall: "fa fa-info fadeRight animated",
                            timeout: 5000
                        });
                        break;
                }

            };
            self.success = function (size, title, message) {

                if (isNullOrEmpty(message)) {
                    return;
                }

                if (size === undefined) {
                    size = 'small';
                }


                switch (size) {
                    case 'big':
                        $.bigBox({
                            title: title,
                            content: message,
                            color: "#739E73",
                            icon: "fa fa-check shake animated",
                            timeout: 5000
                        });
                        break;
                    case 'small':
                        $.smallBox({
                            title: title,
                            content: message,
                            color: "#739E73",
                            iconSmall: "fa fa-check shake animated",
                            timeout: 4000
                        });
                        break;
                }

            };

            self.warning = function (size, title, message) {


                if (isNullOrEmpty(message)) {
                    return;
                }

                if (size === undefined) {
                    size = 'small';
                }

                switch (size) {
                    case 'big':
                        $.bigBox({
                            title: title,
                            content: message,
                            color: "#C79121",
                            icon: "fa fa-warning swing animated",
                            timeout: 5000
                        });
                        break;
                    case 'small':
                        $.smallBox({
                            title: title,
                            content: message,
                            color: "#C79121",
                            iconSmall: "fa fa-warning swing animated",
                            timeout: 5000
                        });
                        break;
                }
            };

            self.error = function (size, title, message) {

                if (isNullOrEmpty(message)) {
                    return;
                }

                if (size === undefined) {
                    size = 'small';
                }

                switch (size) {
                    case 'big':
                        $.bigBox({
                            title: title,
                            content: message,
                            color: "#C46A69",
                            icon: "fa fa-warning swing animated",
                            timeout: 5000
                        });
                        break;
                    case 'small':
                        $.smallBox({
                            title: title,
                            content: message,
                            color: "#C46A69",
                            iconSmall: "fa fa-warning swing animated",
                            timeout: 5000
                        });
                        break;
                }
            };


            self.errHandle = function (e) {
                self.error('small', 'Error', common.getErrorMessage(e));
            };
            return self;

        }])

;
