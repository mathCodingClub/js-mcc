// See manual https://docs.angularjs.org/api/ng/filter/date for format
angular.module('mcc').directive('mccNow', ['$filter',
  function ($filter) {
    return {
      restrict: 'AE',
      scope: {},
      template: function(element,attrs){
        return '{{now}}';
      },      
      link: function($scope,element,attrs){
        var timezone = 'tz' in attrs ? attrs.tz : "UTC";
        var date = new Date();
        $scope.now = $filter('date')(date, attrs.format, timezone);
      }
    };
  }]);