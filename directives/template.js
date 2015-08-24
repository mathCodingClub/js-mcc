angular.module('mcc').directive('mccTemplate',
        ['$rootScope',
          '$window',
          'mcc.code',
          function ($rootScope, $window, client) {
            return {
              restrict: 'A',
              replace: false,
              templateUrl: function (element, attrs) {
                return 'rest/mcc/templates/' + attrs.mccTemplate;
              },
              link: function ($scope, element, attrs) {
                $scope.dataObject = {};
                var code = attrs.mccTemplate;
                $scope.refresh = function () {
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