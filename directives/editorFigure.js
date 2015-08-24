angular.module('mcc').directive('mccEditorFigure',
        ['$http', 'mcc.toasterTranslate', function ($http, toasterTranslate) {
            return {
              restrict: 'E',
              //templateUrl: 'rest/mcc/templates/directives/editorFigure',
              templateUrl: 'mcc.editorFigure',
              scope: {
                onSave: '=figureSave',
                onCancel: '=figureCancel'                
              },
              link: function ($scope, element, attrs) {                                
                $scope.show = 'loading';
                // Init figure drawing when editFigure event is launched
                $scope.$on('editFigure', function (evt, data) {   
                  if ($scope.show != 'loading'){
                    return;
                  }
                  $scope.fe = new mcc.figureEditor({   
                    id: 'mcc-editor-figure-canvas',
                    // canvas: $($(element[0])).children('canvas')[0],
                    maxWidth: 750,
                    maxHeight: 500
                  });
                  $scope.figure = data.figure;                  
                  $scope.params = data.params;
                  $scope.fe.drawFullImage($scope.figure, function(){
                    $scope.show = 'loaded';
                    $scope.$apply();
                  });
                  $scope.params.name = $scope.figure.name;
                });
                $scope.cancel = function(){
                    $scope.show = 'loading';
                    $scope.onCancel();
                };
                $scope.mousePosition = function (x, y) {
                  $scope.mouse = {x: x, y: y};
                  $scope.$apply();
                };
                $scope.recordMouseClick = function () {
                  // add also possibility to change perspeection                  
                  $scope.setCropPoint();
                };
                $scope.saveToServer = function () {
                  $scope.show = 'uploading';
                  var fd = new FormData();
                  fd.append('file', $scope.figure);
                  fd.append('resize', $scope.params.resize);
                  fd.append('name', $scope.params.name);
                  fd.append('crop', JSON.stringify($scope.fe.getCropPoints()));
                  $http.post('rest/mcc/private/files', fd, {
                    withCredentials: true,
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identity
                  }).success(function (data, status, headers, config) {
                    toasterTranslate.common('success', 'FILE_UPLOADED');
                    $scope.show = 'uploaded';
                    $scope.onSave(data, $scope.params);
                    $scope.show = 'loading';
                  }).error(function (data, status, headers, config) {
                    $scope.show = 'uploadedError';
                    toasterTranslate.error(data.dict);
                  });
                };
                $scope.setCropPoint = function () {
                  $scope.fe.setCropPoint($scope.mouse.x, $scope.mouse.y);
                };
              }
            };
          }
        ]);