angular.module('mcc').directive('mccCodePageAdmin',
        ['$rootScope',
          'mcc.code',
          function ($rootScope, client) {
            return {
              restrict: 'E',
              templateUrl: 'mcc.codePageAdmin',              
              link: function ($scope, element, attrs) {                
                $scope.dataObject = {};
                $scope.showCodeEditor = function (code) {
                  client.get(code).then(function (data) {
                    $scope.dataObject = data.data.data;
                    $rootScope.toggle('mcc.overlayEditorData', 'on');
                  });
                };
              }
            };
          }]
        );