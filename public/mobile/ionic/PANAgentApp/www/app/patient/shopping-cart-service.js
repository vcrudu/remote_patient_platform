/**
 * Created by Victor on 2/15/2016.
 */

angular.module('panAgentApp').factory('shoppingCartService', ['$localStorage', '$filter', 'commonService', function ($localStorage, $filter, commonService) {
  var self = this,
    basket = new Basket(null);

  var getDevice = function (device) {
    return $filter('filter')(basket.Items, function (i) {
      return i.Device.model == device.model;
    })[0];

  };

  self.addToCart = function (device, quantity) {
    var existed = getDevice(device);

    if (existed) {
      existed.Quantity += quantity;
    }
    else {
      basket.Items.push(new BasketItem(device, quantity));
    }

    self.updateBasket(basket);
  };

  self.removeItem = function (item) {
    var existed = getDevice(item.Device);

    if (existed) {
      basket.Items.splice(basket.Items.indexOf(existed), 1);
    }

    self.updateBasket(basket);
  };

  self.clearBasket = function () {
    basket = new Basket(null);
    commonService.setContextShoppingCart(basket, function(basket) { });
  };

  self.getCart = function () {
    return basket;
  };

  self.getTotal = function () {
    var result = 0;
    var basket = self.getCart();
    if (basket) {
      result = basket.getAmount();
    }
    return result;
  };

  self.updateBasket = function (basket) {
    commonService.setContextShoppingCart(basket, function(basket) { });
  };

  self.confirmOrder = function () {

    var basket = self.getCart();
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
  };

  return self;
}]);
