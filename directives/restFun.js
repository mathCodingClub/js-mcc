angular.module('mcc').directive("mccRestFun", ['$http',
  'mcc.toasterTranslate',
  function ($http, toasterTranslate) {
    return {restrict: 'A',
      scope: '@',
      link: function ($scope, element, attrs) {
        if (attrs.method == 'GET') {

        }
        else if (attrs.method == 'POST' || attrs.method == 'PUT') {          
          $scope[attrs.fun] = function (obj) {
            console.log(attrs);
            $http({
              method: attrs.method,
              data: obj,
              url: attrs.mccRestFun
            }).success(function (data, status, headers, config) {
              toasterTranslate.success(data.dict);
              if ('cb' in attrs){
                $scope[attrs.cb](status,data);
              }
            }).error(function (data, status, headers, config) {

            });

          }
        }
        else if (attrs.method == 'DELETE') {

        }
      }
    };
  }]);

