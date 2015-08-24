angular.module('mcc').directive("mccEditorData", [
  '$rootScope',
  '$window',
  'mcc.toasterTranslate',
  'mcc.code',
  function ($rootScope,$window,toasterTranslate, code) {
    return {
      restrict: 'A',
      transclude: true,
      scope: {
        data: '=overlayData'
      },      
      templateUrl: 'mcc.editorData',
      link: function ($scope, element, attrs) {
        $scope.editorACE = true;        
        $scope.show = 'editor';
        $scope.figureCancel = function () {
          $scope.show = 'editor';
        };
        $scope.fileSaveCallback = function (data, params) {
          var editor = ace.edit('aceEditor_content');
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
          $scope.show = 'editor';                    
        };
        // after on drop file is received call this
        $scope.fileReceived = function (file) {
          if (file.type.indexOf("image") !== -1) {
            var params = {
              resize: 800
            };            
            $scope.$root.$broadcast('editFigure', {figure: file, params: params});            
            $scope.show = 'figure';
            $scope.$apply();
          }
          else {
            console.log('Received other file than figure - action not implemented.');
          }
        };
        $scope.save = function () {
          delete $scope.data.created;
          delete $scope.data.updated;
          code.update($scope.data).then(function (data) {            
            toasterTranslate.report(data.status, data.data.dict);
          });
        };
        $scope.cancel = function(){          
          $rootScope.toggle('mcc.overlayEditorData', 'off');
          // $window.location.reload();          
        };
      }
    };
  }]);