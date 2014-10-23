angular.module("cart", [])
  .factory("cart", function () {

    var cartData = [];

    return {

      addProduct: function (id, name, price) {
        var addedToExistingItem = false;
        for (var i = 0, n = cartData.length; i < n; i++) {
          if (cartData[i].objectId === id) {
            cartData[i].count++;
            addedToExistingItem = true;
            break;
          }
        }
        if (!addedToExistingItem) {
          cartData.push({
            objectId: id,
            name: name,
            price: price,
            count: 1
          });
        }
      },

      removeProduct: function (id) {
        for (var i = 0, n = cartData.length; i < n; i++) {
          if (cartData[i].objectId === id) {
            cartData.splice(i, 1);
            break;
          }
        }
      },

      getProducts: function () {
        return cartData;
      }

    };
  })
  .directive("cartSummary", function (cart) {
    return {
      restrict: "E",
      templateUrl: "components/cart/cartSummary.html",
      controller: function ($scope) {

        var cartData = cart.getProducts();

        $scope.total = function () {
          var total = 0;
          for (var i = 0, n = cartData.length; i < n; i++) {
            total += (cartData[i].price * cartData[i].count);
          }
          return total;
        };

        $scope.itemCount = function () {
          var count = 0;
          for (var i = 0, n = cartData.length; i < n; i++) {
            count += cartData[i].count;
          }
          return count;
        }
      }
    };
  });