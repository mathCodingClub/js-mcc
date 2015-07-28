angular.module('mcc').directive('mccNews', ['$rootScope', 'mcc.newsData', 
  function ($rootScope, newsData) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'rest/mcc/templates/directives/news',
      link: function ($scope, element, attrs) {
        $scope.scrollCb = function () {
        };

        var init = function () {
          $scope.loadInProgress = false;
          $scope.isInitialized = false;
          $scope.news = {data: [], pagination: {}};
        };

        init();

        var loadedHandle = function (data) {
          $scope.news.pagination = data.pagination;          
          $scope.news.data = $scope.news.data.concat(data.news);          
          $scope.loadInProgress = false;
          $scope.isInitialized = true;
          newsData.saveToLocalStorage($scope.news);
        };

        var load = function () {
          $scope.loadInProgress = true;
          newsData.getTitles($scope.news.data.length).then(loadedHandle);
        };

        $scope.addedNew = function(){
          $scope.refresh();
          $rootScope.toggle('mcc.overlayEditorNews', 'off');          
        };

        $scope.refresh = function () {
          $scope.newNews = {published: false, contents: "", ingress: "", title: ""};
          newsData.reset();
          init();
          load();
        };

        $scope.atTheEnd = function () {
          if ($scope.loadInProgress || $scope.news.pagination.isLast) {
            return;
          }
          load();
        };

        // init news
        newsData.init().then(loadedHandle);
      }
    };
  }]);
