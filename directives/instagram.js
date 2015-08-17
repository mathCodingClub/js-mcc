angular.module('mcc').directive("mccInstagram", ['$sce', '$http', 'mcc.toasterTranslate',
  function($sce, $http, toasterTranslate) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'mcc.instagram',
      link: function($scope, element, attrs) {
        $scope.isLoading = true;
        $scope.allFetched = false;
        $scope.data = [];
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
            url: attrs.url + maxid}).
                  success(function(data, status, headers, config) {
                    if (data.posts.length == 0) {
                      $scope.allFetched = true;
                      $scope.loadingMore = false;
                      return;
                    }
                    // often twitter duplicates in homeline queries retweets
                    if ($scope.data.length > 0) {
                      if ($scope.data[$scope.data.length - 1].id == data.posts[0].id) {
                        data.tweets.splice(0, 1);
                      }
                      if ($scope.data[0].id == data.posts[0].id) {                        
                        $scope.allFetched = true;
                        $scope.loadingMore = false;
                        return;
                      }
                    }                    
                    $scope.data = $scope.data.concat(data.posts);
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