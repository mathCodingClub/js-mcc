angular.module('mcc').directive('mccTemplateAdmin',
        ['$rootScope',
          'mcc.code',
          function ($rootScope, client) {
            return {
              restrict: 'E',
              templateUrl: 'mcc.templateAdmin',              
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