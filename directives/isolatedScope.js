angular.module('mcc').directive('mccIsolatedScope',
        [ function () {                  
            return {
              restrict: 'AE',
              scope: {},
              link: function ($scope, element, attrs) {         
                console.log($scope);
              }
            };
          }]
        );