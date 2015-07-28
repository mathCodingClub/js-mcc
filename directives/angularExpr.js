angular.module('mcc').directive("mccAngularExpr", ['$compile', function ($compile) {
    return {restrict: 'A',
      scope: {
        value: '=mccAngularExpr'
      },
      link: function ($scope, element, attrs) {
        $scope.$watch('value', function () {
          if ($scope.value.length < 1) {
            return;
          }
          var wrap = attrs.angularExprWrap;
          var str = '<' + wrap + '>' + $scope.value + '</' + wrap + '>';
          var elem = $compile(str)($scope);
          $(element).empty();
          element.append(elem);
        });
      }
    };
  }]);