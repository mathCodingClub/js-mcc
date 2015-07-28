angular.module('mcc').directive("mccEditorData", ['$http',
  'mcc.toasterTranslate',
  'mcc.code',
  function ($http, toasterTranslate, code) {
    return {
      restrict: 'A',
      transclude: true,
      scope: {
        data: '=overlayData'
      },
      templateUrl: 'rest/mcc/templates/directives/editorData',
      link: function ($scope, element, attrs) {
        $scope.editorACE = true;
        $scope.fe = new mcc.figureEditor({
          id: 'figureEditorCanvas',
          maxWidth: 750,
          maxHeight: 500
        });
        $scope.show = 'editor';
        $scope.save = function () {
          code.update($scope.data).then(function (data) {
            toasterTranslate.report(data.status, data.data.dict);
          });
        };
        $scope.mousePosition = function (x, y) {
          $scope.mouse = {x: x, y: y};
          $scope.$apply();
        };
        $scope.cancelFigure = function () {
          $scope.show = 'editor';
        };
        $scope.setCropPoint = function () {
          $scope.fe.setCropPoint($scope.mouse.x, $scope.mouse.y);
        };
        $scope.saveFigure = function () {
          var editor = ace.edit('aceEditor_content');
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
            if (data.isImage) {
              add = '<p>\n' +
                      '  <figure>\n' +
                      '    <img src="' + data.relPath + '">\n' +
                      '    <figcaption></figcaption>\n' +
                      '  </figure>\n' +
                      '</p>';
            }
            else {
              add = '<a href="' + data.relPath + '" target="blank"></a>';
            }
            editor.insert(add);
            toasterTranslate.common('success', 'FILE_UPLOADED');
            $scope.show = 'editor';
          }).error(function (data, status, headers, config) {
            toasterTranslate.error(data.dict);
          });
        };
        $scope.fileReceived = function (file, element, param) {
          $scope.file = file;
          $scope.figure = {
            maxdim: 1000,
            name: file.name
          };
          if (file.type.indexOf("image") !== -1) {
            $scope.show = 'figure';
            $scope.fe.drawFullImage(file);
          }
          $scope.$apply();
        };
      }
    };
  }]);