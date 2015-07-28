angular.module('mcc').directive("mccPagination", function () {
  return {restrict: 'A',
    scope: '@',
    transclude: true,
    template: '<div><ng-transclude></ng-transclude></div>',
    link: function ($scope, element, attrs) {
      var raw = element[0];
      element.bind('scroll', function () {
        var pos = window.innerHeight + element[0].scrollTop;
        var height = element[0].children[0].offsetHeight - parseInt(attrs.heightMargin);
        if (pos > height) {
          $scope[attrs.mccPagination]();
        }
      });
    }
  };
});

