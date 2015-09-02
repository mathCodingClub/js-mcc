angular.module('mcc').directive('mccTemplate',
        ['$rootScope',
          '$window',
          '$timeout',
          'mcc.code',
          function ($rootScope, $window, $timeout, client) {
            return {
              restrict: 'A',
              replace: false,
              templateUrl: function (element, attrs) {
                return 'rest/mcc/templates/' + attrs.mccTemplate;
              },
              link: function ($scope, element, attrs) {

                if (MathJax != undefined){
                 $timeout(function () {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                  }, 0);
                }

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