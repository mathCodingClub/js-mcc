angular.module('mcc').directive("mccTwitter", ['$http', 'mcc.toasterTranslate',
  function ($http, toasterTranslate) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'rest/mcc/templates/directives/twitter',
      link: function ($scope, element, attrs) {
        $scope.isLoading = true;
        $http({method: 'GET',
          url: attrs.url}).
                success(function (data, status, headers, config) {
                  $scope.data = data.tweets;
                  $scope.isLoading = false;
                }).
                error(function (data, status, headers, config) {
                  toasterTranslate.error(data.dict);
                  $scope.isLoading = false;
                });

      }
    }
  }]);