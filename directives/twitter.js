angular.module('mcc').directive("mccTwitter", ['$http', 'mcc.toasterTranslate',
  function($http, toasterTranslate) {
    return {
      restrict: 'E',
      scope: {
        url: '=url',
        loadingMore: '=disableUrlChange'
      }, // could be true perhaps too, need to check
      templateUrl: 'mcc.twitter',
      link: function($scope, element, attrs) {
        $scope.isLoading = true;
        $scope.allFetched = false;
        $scope.data = [];

        $scope.$watch('url', function() {          
          if ($scope.url.length > 5) {
            $scope.data = [];
            $scope.allFetched = false;
            $scope.load();            
          }
        });

        $scope.load = function() {          
          if ($scope.loadingMore || $scope.allFetched) {            
            return;
          }
          $scope.loadingMore = true;
          var maxid;
          if ($scope.data.length == 0) {
            maxid = '';
          }
          else {
            maxid = '/' + $scope.data[$scope.data.length - 1].id;
          }
          $http({method: 'GET',
            url: $scope.url + maxid}).
                  success(function(data, status, headers, config) {
                    if (data.tweets.length == 0) {
                      $scope.loadingMore = false;
                      $scope.allFetched = true;
                      return;
                    }
                    if (data.tweets.length == 1 &&
                            $scope.data.length > 0 &&
                            ($scope.data[$scope.data.length - 1].id == data.tweets[0].id)) {
                      $scope.loadingMore = false;
                      $scope.allFetched = true;
                      return;
                    }
                    // often twitter duplicates in homeline queries retweets
                    if ($scope.data.length > 0) {
                      if ($scope.data[$scope.data.length - 1].id == data.tweets[0].id) {
                        data.tweets.splice(0, 1);
                      }
                    }
                    $scope.data = $scope.data.concat(data.tweets);
                    $scope.isLoading = false;
                    $scope.loadingMore = false;
                  }).
                  error(function(data, status, headers, config) {
                    toasterTranslate.error(data.dict);
                    $scope.isLoading = false;
                    $scope.loadingMore = false;
                  });
        };

        $scope.load();
      }
    };
  }]);