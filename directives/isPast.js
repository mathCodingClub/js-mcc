angular.module('mcc').directive("mccIsPast", ['$http', function ($http) {
    return {restrict: 'A',
      scope: false,
      link: function ($scope, element, attrs) {
        var funName = attrs.mccIsPast == '' ? 'isPast' : attrs.mccIsPast;
        $scope[funName] = function (day, month, year) {
          var now = new Date();
          var event = new Date(year, month - 1, day);
          if (now.getTime() > (event.getTime() + 3600 * 24 * 1000)) {
            return 'past';
          }
          else if (now.getTime() > event.getTime()) {
            return 'today';
          }
          else if ((now.getTime() + 3600 * 24 * 1000) > event.getTime()) {
            return 'tomorrow';
          }
          else if ((now.getTime() + 6 * 3600 * 24 * 1000) > event.getTime()) {
            return 'next';
          }
          return '';
        };
      }
    };
  }]);

