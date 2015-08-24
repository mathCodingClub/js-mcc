angular.module('mcc').directive('mccTemplateCreate',
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
                    code: attrs.mccTemplateCreate,
                    title: attrs.mccTemplateCreate
                  };
                  client.create(obj).then(function (data) {
                    toasterTranslate.success(data.dict);          
                    $route.reload();
                  });
                }
              }
            };
          }]
        );