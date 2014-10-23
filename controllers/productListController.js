angular.module("storeApp")
  .constant("productListActiveClass", "btn-primary")
  .constant("productListPageCount", [5, 25, 50])
  .controller("productListCtrl", function ($scope, $filter,
    productListActiveClass, productListPageCount, cart) {

    var selectedCategory = null;

    $scope.selectedPage = 1;
    $scope.productListPageCount = productListPageCount;
    $scope.pageSize = productListPageCount[0];

    $scope.selectCategory = function ( newCategory ) {
      selectedCategory = newCategory;
      $scope.selectedPage = 1;
    };
    
    $scope.selectPage = function ( newPage ) {
      $scope.selectedPage = newPage;
    };

    $scope.categoryFilterFn = function ( product ) {
      return selectedCategory === null ||
        product.category === selectedCategory;
    };

    $scope.getCategoryClass = function ( category ) {
      return selectedCategory === category ? productListActiveClass : "";
    };

    $scope.getPageClass = function (page) {
      return $scope.selectedPage === page ? productListActiveClass : "";
    };

    $scope.setPageSize = function (newPageSize) {
      $scope.pageSize = newPageSize;
      $scope.selectedPage = 1;
    };

    $scope.getPageSizeClass = function (newPageSize) {
      return $scope.pageSize === newPageSize ? productListActiveClass : "";
    };

    $scope.addProductToCart = function (product) {
      cart.addProduct(product.objectId, product.name, product.price);
    };
  });