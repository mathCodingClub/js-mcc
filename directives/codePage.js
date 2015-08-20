angular.module('mcc').directive('mccCodePage',
        ['$rootScope',
          '$window',
          'mcc.code',
          function ($rootScope, $window, client) {                  
            return {
              restrict: 'A',
              replace: false,
              templateUrl: function (element, attrs) {                
                return 'rest/mcc/templates/codepages/' + attrs.mccCodePage;
              },
              link: function ($scope, element, attrs) {
                $scope.dataObject = {};
                var code = attrs.mccCodePage;
                $scope.refresh = function(){
                  $window.location.reload();          
                };
                
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