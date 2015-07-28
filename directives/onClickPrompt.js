angular.module('mcc').directive("mccOnClickPrompt", ['$http', 'mcc.toasterTranslate',
  function ($http, toasterTranslate) {
    return {restrict: 'A',
      scope: {
        value: '=mccOnClickPrompt',
        data: '=mccOnClickData'
      },
      link: function ($scope, element, attrs) {
        var isSet = false;
        element.bind('click', function () {
          if (!isSet) {
            $scope.$watch('data', function () {
              $http({method: attrs.mccOnClickMethod, url: attrs.mccOnClickUrl, data: $scope.data}).
                      success(function (data, status, headers, config) {
                        toasterTranslate.success(data.dict);
                        $scope.data = data[attrs.mccOnClickObject];
                      }).
                      error(function (data, status, headers, config) {
                        toasterTranslate.error(data.dict);
                      });
            }, true);
            isSet = true;
          }
          var val = prompt(attrs.mccOnClickText, $scope.value);
          if (val == '' || val == null || val == undefined) {
            return;
          }
          $scope.value = val;
          $scope.$apply();
        });

      }
    };
  }]);
