angular.module('mcc').directive('mccCodePageCreate',
        ['$route',
          'mcc.code',
          'mcc.toasterTranslate',
          function ($route, client, toasterTranslate) {
            return {
              restrict: 'A',
              scope: false,
              link: function ($scope, element, attrs) {
                $scope.create = function () {
                  var obj = {
                    code: attrs.mccCodePageCreate,
                    title: attrs.mccCodePageCreate
                  };
                  client.create(obj).then(function (data) {
                    toasterTranslate.success(data.dict);                    
                  });
                }
              }
            };
          }]
        );