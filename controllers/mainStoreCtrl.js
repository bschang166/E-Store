angular.module("storeApp")
  .constant("dataUrl", "https://api.parse.com/1/classes/Products")
  .constant("orderUrl", "https://api.parse.com/1/classes/Orders")
  .run(function ($http) {
    $http.defaults.headers.common["X-Parse-Application-Id"]
      = "9XfYgRk2UWsr6ncwwa5m6O4ugaozwUZnD08I1wE9";
    $http.defaults.headers.common["X-Parse-REST-API-Key"]
      = "8kn3fFn1cpbSHD5U4cZ2j7XsEdQWsRK08qlNW3tD";
  })
  .controller("mainStoreCtrl", function ($scope, $http, $location,
    dataUrl, orderUrl, cart) {

    $scope.data = {};

    $http.get(dataUrl)
      .success(function(data){
        $scope.data.products = data.results;
      })
      .error(function(response){
        $scope.data.error = response.error || response;
      })

    $scope.sendOrder = function (shippingDetails) {
      var order = angular.copy(shippingDetails);

      order.products = cart.getProducts();
      $http.post(orderUrl, order)
        .success(function (data) {
          $scope.data.orderId = data.objectId;
          cart.getProducts().length = 0;
        })
        .error(function (error) {
          $scope.data.orderError = error;
        })
        .finally(function () {
          $location.path("/complete");
        });

    };

   });

    /*$scope.data = {
      products: [
        { name: "Product #1", description: "Description 1", category: "Category #1", price: 100 },
        { name: "Product #2", description: "Description 2", category: "Category #2", price: 200 },
        { name: "Product #3", description: "Description 3", category: "Category #3", price: 300 },
        { name: "Product #1", description: "Description 1", category: "Category #1", price: 100 },
        { name: "Product #2", description: "Description 2", category: "Category #2", price: 200 },
        { name: "Product #3", description: "Description 3", category: "Category #3", price: 300 },
        { name: "Product #1", description: "Description 1", category: "Category #1", price: 100 },
        { name: "Product #2", description: "Description 2", category: "Category #2", price: 200 },
        { name: "Product #3", description: "Description 3", category: "Category #3", price: 300 },
        { name: "Product #1", description: "Description 1", category: "Category #1", price: 100 },
        { name: "Product #2", description: "Description 2", category: "Category #2", price: 200 },
        { name: "Product #3", description: "Description 3", category: "Category #3", price: 300 },
        { name: "Product #4", description: "Description 4", category: "Category #3", price: 400 }]
    };

    */
