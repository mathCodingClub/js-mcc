angular.module('mcc').directive('mccMouseEnter', [
  function () {
    return {
      restrict: 'AE',
      scope: {bind: '=mccMouseEnter'},      
      link: function ($scope, element, attrs) {       
        element.bind("mouseenter", function (evt) {
          $scope.bind(evt);
        });        
      }
    };
  }]);