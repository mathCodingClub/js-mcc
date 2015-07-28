angular.module('mcc').directive('mccNewsSelected', [
  '$routeParams',
  '$location',
  '$http',
  '$rootScope',
  'mcc.newsData',
  'mcc.toasterTranslate',
  'dialogs',
  function ($routeParams, $location, $http, $rootScope,
          newsData, toasterTranslate, dialogs) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'rest/mcc/templates/directives/newsSelected',
      link: function ($scope, element, attrs) {        
        $scope.id = $routeParams.id;
        $scope.news = {title: '', contents: ''};
        $scope.comments = [];
        var resetComments = function () {
          $scope.comment = {name: '', email: '', contents: ''};
        };
        resetComments();
        $scope.isInitialized = false;
        newsData.getById($scope.id).then(
                function (data) {
                  $scope.news = data.news;
                  $scope.previous = data.news_previous;
                  $scope.next = data.news_next;
                  $scope.isInitialized = true;
                }
        );
        $scope.afterDelete = function () {
          $rootScope.toggle('mcc.overlayEditorNews', 'off');
          $location.path('news');
        };
        // load comments
        $scope.loadComments = function () {
          $http({method: 'GET',
            url: 'rest/news/comments/' + $scope.id}).
                  success(function (data, status, headers, config) {
                    $scope.comments = data.comments;
                  }).
                  error(function (data, status, headers, config) {
                    toasterTranslate.error(data.code);
                  });
        };
        // post reply to comment
        $scope.postReply = function (index) {
          $http({method: 'PUT',
            data: $scope.comments[index],
            url: 'rest/private/news/comment'}).
                  success(function (data, status, headers, config) {
                    toasterTranslate.success(data.dict);
                    resetComments();
                    $scope.loadComments();
                  }).
                  error(function (data, status, headers, config) {
                    toasterTranslate.error(data.dict);
                  });
        };
        $scope.deleteComment = function (commentId) {
          var dlg = dialogs.confirm(undefined, undefined, {size: 'sm'});
          dlg.result.then(function () {
            $http({method: 'DELETE',
              url: 'rest/private/news/comment/' + commentId}).
                    success(function (data, status, headers, config) {
                      toasterTranslate.success(data.dict);
                      $scope.loadComments();
                    }).
                    error(function (data, status, headers, config) {
                      toasterTranslate.error(data.dict);
                    });
          });
        };
        $scope.postComment = function () {
          $http({method: 'POST',
            data: $scope.comment,
            url: 'rest/news/comment/' + $scope.id}).
                  success(function (data, status, headers, config) {
                    toasterTranslate.success(data.dict);
                    resetComments();
                    $scope.loadComments();
                  }).
                  error(function (data, status, headers, config) {
                    toasterTranslate.error(data.dict);
                  });
        };
        $scope.loadComments();
      }
    };
  }]);
