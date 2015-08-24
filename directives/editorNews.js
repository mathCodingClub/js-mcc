angular.module('mcc').directive("mccEditorNews", ['$http', '$rootScope', 'mcc.toasterTranslate', 'dialogs',
  function ($http, $rootScope, toasterTranslate, dialogs) {
    return {
      restrict: "A",
      transclude: true,
      scope: {
        news: "=mccEditorNews",
        cbDelete: "=deleteCb",
        cbAdd: "=saveCb"
      },
      templateUrl: 'mcc.editorNews',
      link: function ($scope, element, attrs) {
        $scope.figure = null;
        var layerName = attrs.newsOverlay;
        $scope.editorACE = true;
        $scope.modify = !('new' in attrs);
        $scope.show = 'editor';
        $scope.figureParam =
                {
                  ingres: {resize: 400,
                    type: 'ingress'
                  },
                  contents: {
                    resize: 800,
                    type: 'contents'
                  }
                };
        // cancel figure
        $scope.figureCancel = function () {
          $scope.show = 'editor';
        };
        // delete news
        $scope.del = function (id) {
          var dlg = dialogs.confirm(undefined, undefined, {size: 'sm'});
          dlg.result.then(function () {
            $http({method: 'DELETE',
              url: 'rest/mcc/private/news/' + id}).
                    success(function (data, status, headers, config) {
                      toasterTranslate.success(data.dict);
                      $rootScope.toggle(layerName, 'off');
                      $scope.cbDelete();
                    }).
                    error(function (data, status, headers, config) {
                      toasterTranslate.error(data.dict);
                    });
          },
                  function () {
                    toasterTranslate.info('DELETE_CANCELLED');
                  }
          );
        };
        // after on drop file is received call this
        $scope.fileReceived = function (file, element, params) {
          if (file.type.indexOf('image') !== -1) {            
            $scope.$root.$broadcast('editFigure', {figure: file, params: params});
            $scope.show = 'figure';
            $scope.$apply();
          }
          else {
            console.log('Received other file than figure - action not implemented.');
          }
        };
        // Set to current time
        $scope.setCurrentTime = function () {
          $http({method: 'GET',
            url: 'rest/mcc/private/news/' + $scope.news.id + '/settocurrenttime'}).
                  success(function (data, status, headers, config) {
                    toasterTranslate.success(data.dict);
                  }).
                  error(function (data, status, headers, config) {
                    toasterTranslate.error(data.dict);
                  });
        };
        // Save news
        $scope.save = function (close) {
          close = arguments.length > 0 ? close : true;
          if (!$scope.modify) {
            if ($scope.news.published == undefined) {
              $scope.news.published = false;
            }
            $http({method: 'POST',
              data: {
                title: $scope.news.title,
                contents: $scope.news.contents,
                ingress: $scope.news.ingress,
                published: $scope.news.published
              },
              url: 'rest/mcc/private/news'}).
                    success(function (data, status, headers, config) {
                      toasterTranslate.success(data.dict);
                      $rootScope.toggle(layerName, 'off');
                      $scope.cbAdd();
                    }).
                    error(function (data, status, headers, config) {
                      toasterTranslate.error(data.dict);
                    });
          }
          else {
            $http({method: 'PUT',
              data: $scope.news,
              url: 'rest/mcc/private/news'}).
                    success(function (data, status, headers, config) {
                      toasterTranslate.success(data.dict);
                      if (close) {
                        $rootScope.toggle(layerName, 'off');
                      }
                    }).
                    error(function (data, status, headers, config) {
                      toasterTranslate.error(data.dict);
                    });
          }
        };
        // Save file callback
        $scope.fileSaveCallback = function (data, params) {
          var editor = ace.edit('aceEditor_' + params.type);
          var add;
          if (data.isImage && params.type == 'contents') {
            add = '<p>\n' +
                    '  <figure>\n' +
                    '    <img src="' + data.relPath + '">\n' +
                    '    <figcaption></figcaption>\n' +
                    '  </figure>\n' +
                    '</p>';
          }
          else if (data.isImage) {
            add = '<img src="' + data.relPath + '">\n';
          }
          else {
            add = '<a href="' + data.relPath + '" target="blank"></a>';
          }
          editor.insert(add);
          toasterTranslate.common('success', 'FILE_UPLOADED');
          $scope.show = 'editor';
          // $scope.$apply();          
        };
      }
    };
  }]);