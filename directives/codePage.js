angular.module('mcc').directive('mccCodePage',
        ['$rootScope',
          'mcc.code',
          function ($rootScope, client) {                  
            return {
              restrict: 'A',
              templateUrl: function (element, attrs) {                
                return 'rest/mcc/templates/codepages/' + attrs.mccCodePage;
              },
              link: function ($scope, element, attrs) {
                $scope.dataObject = {};
                var code = attrs.mccCodePage;
                $scope.showCodeEditor = function () {                  
                  client.get(code).then(function (data) {
                    $scope.dataObject = data.data.data;
                    $rootScope.toggle('mcc.overlayEditorData', 'on');
                  });
                };
              }
            };
          }]
        );