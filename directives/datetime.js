angular.module('mcc').directive("mccDatetime", [
  function () {
    return {
      restrict: "E",
      scope: {
        timestamp: '=timestamp'
      },
      templateUrl: 'mcc.datetime',
      link: function ($scope, element, attrs) {
        $scope.opts = {
          showWeeks: true,
          hourStep: 1,
          minuteStep: 10,
          showMeridian: false,
          startingDay: 1,
          dateFormat: "dd.MM.yyyy",
          readonlyTime: false
        };
        $scope.$watch('timestamp', function () {
          $scope.timeObject = new Date($scope.timestamp);
        });
        $scope.$watch('timeObject', function () {
          $scope.timestamp = Math.floor($scope.timeObject.getTime());
        });
      }
    };
  }]);