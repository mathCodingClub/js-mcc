angular.module('mcc').directive('mccNews', ['$rootScope', 'mcc.newsData',
  function ($rootScope, newsData) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'mcc.news',
      link: function ($scope, element, attrs) {
        $scope.scrollCb = function () {
        };

        var init = function () {
          $scope.loadInProgress = false;
          $scope.isInitialized = false;
          $scope.news = {data: [], pagination: {}};
        };

        init();

        $scope.loadedHandle = function (data) {
          if ($scope.isInitialized) {            
            //return;
          }
          $scope.news.pagination = data.pagination;
          $scope.news.data = $scope.news.data.concat(data.news);
          $scope.loadInProgress = false;
          $scope.isInitialized = true;
          newsData.saveToLocalStorage($scope.news);          
        };

        $scope.load = function () {                              
          $scope.$apply(function () {
            $scope.loadInProgress = true;                        
            newsData.getTitles($scope.news.data.length).then($scope.loadedHandle);
          });
        };

        $scope.addedNew = function () {
          $scope.refresh();
          $rootScope.toggle('mcc.overlayEditorNews', 'off');
        };

        $scope.refresh = function () {
          $scope.newNews = {published: false, contents: "", ingress: "", title: ""};
          newsData.reset();
          init();
          $scope.load();
        };

        $scope.atTheEnd = function () {
          if ($scope.loadInProgress || $scope.news.pagination.isLast) {
            return;
          }
          $scope.load();
        };

        // init news
        newsData.init().then($scope.loadedHandle);
      }
    };
  }]);
