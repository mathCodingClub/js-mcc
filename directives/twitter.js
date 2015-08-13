angular.module('mcc').directive("mccTwitter", ['$http', 'mcc.toasterTranslate',
  function($http, toasterTranslate) {
    return {
      restrict: 'E',
      scope: false, // could be true perhaps too, need to check
      templateUrl: 'rest/mcc/templates/directives/twitter',
      link: function($scope, element, attrs) {
        $scope.isLoading = true;
        $scope.allFetched = false;
        $scope.data = [];
        $scope.load = function() {
          if ($scope.loadingMore || $scope.allFetched){
            return;
          }
          $scope.loadingMore = true;
          var maxid;
          if ($scope.data.length == 0){
            maxid = '';
          }
          else {
            maxid = '/' + $scope.data[$scope.data.length-1].id;
          }
          $http({method: 'GET',
            url: attrs.url + maxid}).
                  success(function(data, status, headers, config) {
                    if (data.tweets.length == 0){
                      $scope.allFetched = true;
                      return;
                    }
                    // often twitter duplicates in homeline queries retweets
                    if ($scope.data.length > 0){
                      if ($scope.data[$scope.data.length-1].id == data.tweets[0].id){
                        data.tweets.splice(0,1);
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