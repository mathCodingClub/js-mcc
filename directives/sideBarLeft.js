angular.module('mcc').directive("mccSideBarLeft", [
  function () {
    return {
      restrict: 'A',      
      scope: true,
      //templateUrl: 'rest/mcc/templates/directives/sideBarLeft',
      templateUrl: 'mcc.sideBarLeft',
      link: function ($scope, element, attrs) {
        $scope.sb = CONFIG;                
      }
    };
  }]);