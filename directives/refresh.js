angular.module('mcc').directive('mccRefresh', [
  '$window',
  function($window) {
    return {
      restrict: 'AE',
      scope: {},
      link: function($scope, element, attrs) {
        element.bind('tap click', function() {
          $window.location.reload();
        });
      }
    };
  }]);