angular.module('mcc').directive("mccOnChange", [function () {
    return {restrict: 'A',
      scope: {fun: '=mccOnChange'},
      link: function ($scope, element, attrs) {
        $(element).bind('change', function () {
          var data = $(element).data();
          if (data != undefined) {
            $scope.fun(data, $(element).val());
          }
          else {
            $scope.fun($(element).val());
          }
        });
      }
    };
  }]);

