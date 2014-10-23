angular.module("storeAdmin")
  .constant("authUrl", "https://api.parse.com/1/login")
  .constant("ordersUrl", "https://api.parse.com/1/classes/Orders")
  .constant("ActiveOrderFilterClass", "btn-primary")
  .run(function ($http) {
    $http.defaults.headers.common["X-Parse-Application-Id"]
      = "9XfYgRk2UWsr6ncwwa5m6O4ugaozwUZnD08I1wE9";
    $http.defaults.headers.common["X-Parse-REST-API-Key"]
      = "8kn3fFn1cpbSHD5U4cZ2j7XsEdQWsRK08qlNW3tD";
  })
  .controller("authCtrl", function ($scope, $http, $location, authUrl) {

    $scope.authenticate = function (user, pass) {
      $http.get(authUrl, {
        params: {
          username: user,
          password: pass
        }
      }).success(function (data) {
        $scope.$broadcast("sessionToken", data.sessionToken);
        $http.defaults.headers.common["X-Parse-Session-Token"]
          = data.sessionToken;
        $location.path("/main");
      }).error(function (response) {
        $scope.authenticationError = response.error || response;
      });
    }})
  .controller("mainCtrl", function ($scope) {

    $scope.screens = ["Products", "Orders"];
    $scope.current = $scope.screens[0];

    $scope.setScreen = function (index) {
      $scope.current = $scope.screens[index];
    };

    $scope.getScreen = function () {
      return $scope.current === "Products"
        ? "/views/adminProducts.html" : "/views/adminOrders.html";
    };
  })
  .controller("ordersCtrl", function ($scope, $http, $location, $route, ordersUrl, ActiveOrderFilterClass) {
  
    $scope.selectedOrder;

    $scope.stateMap = {};
    $scope.stateMap.order_main = {
      currentOrderFilter : "OrderId",
      reverseOrderFilter: false,
      col : ["OrderId","Name", "City", "Value"]
    };
    $scope.stateMap.order_details = {
      currentOrderFilter: "Name",
      reverseOrderFilter: false,
      col : ["Name", "Count", "Price"]
    };

    $http.get(ordersUrl)
      .success(function (data) {
        $scope.orders = data.results;
        angular.forEach($scope.orders, function (order) {
          order.value = $scope.calcTotal(order);
        });
      })
      .error(function (response) {
        $scope.error = response.error || response;
        $location.path("/login");
      });

    $scope.selectOrder = function (order) {
      $scope.selectedOrder = order;
    };

    $scope.getActiveOrder = function (order) {
      return $scope.selectedOrder === order
        ? ActiveOrderFilterClass : "";
    };

    $scope.calcTotal = function (order) {
      var total = 0;
      for (var i = 0, n = order.products.length; i < n; i++) {
        total +=
          (order.products[i].price * order.products[i].count);
      }
      return total;
    };

    $scope.getOrderState = function (order_view, propName) {
      return stateMap.order_view[propName];
    };

    $scope.setOrderState = function (order_view, order_setmap) {
      angular.extend(stateMap.order_view, order_setmap);
    };

    $scope.setCurrentOrderFilter = function (order_view ,orderFilter) {
      $scope.stateMap[order_view].currentOrderFilter = orderFilter;
      $scope.stateMap[order_view].reverseOrderFilter = !($scope.stateMap[order_view].reverseOrderFilter);
    }

    $scope.getActiveClass = function (order_view, prop, value) {
      if ($scope.stateMap.hasOwnProperty(order_view)) {
        if ($scope.stateMap[order_view].hasOwnProperty(prop))
        return value === $scope.stateMap[order_view].prop
          ? ActiveOrderFilterClass : "";
      }
    }

    $scope.getActiveOrderFilterClass = function (order_view, propName) {
      if ($scope.stateMap.hasOwnProperty(order_view)) {
        return propName === $scope.stateMap[order_view].currentOrderFilter
          ? ActiveOrderFilterClass : "";
      }
    }

    $scope.confirmRemoveOrder = function (order) {
      var intent = confirm("Delete order " + order.objectId + " ?");
      if (intent) {
        removeOrder(order);
      }
    };

    removeOrder = function (order) {
      $http.delete(ordersUrl + "/" + order.objectId)
          .success(function () {
            alert("Order" + order.objectId + " has been removed");
          })
      $route.reload();
    }
  })
