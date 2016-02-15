/**
 * Created by Victor on 2/15/2016.
 */

function Basket(items) {

  this.Items = items || [];
  this.shippingAddress = {};
  this.payment = {};
  /**
   * @return {number}
   */
  Basket.prototype.getAmount = function () {
    var result = 0;

    if (this.Items) {
      angular.forEach(this.Items, function (basketItem) {
        result += basketItem.Amount();
      })
    }
    return result;
  };

  Basket.prototype.getTotalItems = function () {
    var result = 0;

    if (this.Items) {
      angular.forEach(this.Items, function (basketItem) {
        result += basketItem.Quantity;
      })
    }
    return result;
  };
}

function BasketItem(device, quantity) {

  this.Device = device;
  this.Quantity = quantity || 0;
  this.Price = device.price;

  /**
   * @return {number}
   */
  BasketItem.prototype.Amount = function () {
    return this.Quantity * this.Price;
  };
}
