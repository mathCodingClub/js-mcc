angular.module('mcc').directive("mccNewsEditor", ['$http', '$rootScope', 'mcc.toasterTranslate', 'dialogs',
  function ($http, $rootScope, toasterTranslate, dialogs) {
    return {
      restrict: "A",
      transclude: true,
      scope: {
        news: "=mccNewsEditor",
        cbDelete: "=mccNewsDeleteCb",
        cbAdd: "=mccNewsSaveCb"
      },
      templateUrl: 'rest/mcc/templates/directives/editorNews',
      link: function ($scope, element, attrs) {
        var layerName = attrs.newsOverlay;
        $scope.editorACE = true;
        $scope.modify = !('mccNewsNew' in attrs);
        $scope.fileParams = {};
        $scope.fe = new mcc.figureEditor({
          id: 'figureEditorCanvasNews',
          maxWidth: 750,
          maxHeight: 500
        });
        $scope.show = 'editor';
        // cancel figure
        $scope.cancelFigure = function () {
          $scope.show = 'editor';
        };
        // delete news
        $scope.del = function (id) {
          var dlg = dialogs.confirm(undefined, undefined, {size: 'sm'});
          dlg.result.then(function () {
            $http({method: 'DELETE',
              url: 'rest/private/news/' + id}).
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
        // file submission
        $scope.fileReceived = function (file, element, params) {
          $scope.fileParams = params;
          $scope.file = file;
          $scope.figure = {
            name: file.name,
            maxdim: $scope.fileParams.resize,
            type: $scope.fileParams.type
          };
          if (file.type.indexOf("image") !== -1) {
            $scope.show = 'figure';
            $scope.fe.drawFullImage(file);
            $scope.$apply();
          }
        };
        // follow mouse position
        $scope.mousePosition = function (x, y) {
          $scope.mouse = {x: x, y: y};
          $scope.$apply();
        };
        // Set to current time
        $scope.setCurrentTime = function () {
          $http({method: 'GET',            
            url: 'rest/private/news/' + $scope.news.id + '/settocurrenttime'}).
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
              url: 'rest/private/news'}).
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
              url: 'rest/private/news'}).
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
        // Save figure
        $scope.saveFigure = function () {
          var editor = ace.edit('aceEditor_' + $scope.figure.type);
          var fd = new FormData();
          fd.append('file', $scope.file);
          fd.append('resize', $scope.figure.maxdim);
          fd.append('name', $scope.figure.name);
          fd.append('crop', JSON.stringify($scope.fe.getCropPoints()));
          $http.post('rest/private/files', fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
          }).success(function (data, status, headers, config) {
            var add;
            if (data.isImage && $scope.figure.type == 'contents') {
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
            $scope.$apply();
            toasterTranslate.common('success', 'FILE_UPLOADED');
            $scope.show = 'editor';
          }).error(function (data, status, headers, config) {
            toasterTranslate.error(data.dict);
          });
        };
        // Set crop point
        $scope.setCropPoint = function () {
          $scope.fe.setCropPoint($scope.mouse.x, $scope.mouse.y);
        };
        $scope.swapEditorType = function() {
          $scope.editorACE = !$scope.editorACE;
        }
      }
    };
  }]);