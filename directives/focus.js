angular.module('mcc').directive('mccFocus', [
  function () {
    return {
      restrict: 'A',
      scope: {},      
      link: function ($scope, element, attrs) {         
        $(element[0]).focus();
      }
    };
  }]);