angular.module('mcc').directive("mccInstagram", ['$http', 'mcc.toasterTranslate',
  function ($http, toasterTranslate) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'rest/mcc/templates/directives/instagram',
      link: function ($scope, element, attrs) {
        $scope.isLoading = true;
        console.log(attrs.url);
        $http({method: 'GET',
          url: attrs.url}).
                success(function (data, status, headers, config) {
                  $scope.data = data.posts;
                  $scope.isLoading = false;
                }).
                error(function (data, status, headers, config) {
                  toasterTranslate.error(data.dict);
                  $scope.isLoading = false;
                });

      }
    }
  }]);