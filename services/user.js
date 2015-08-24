angular.module('mcc').service('mcc.user',
        ['$localStorage', '$rootScope', '$http',
          'mcc.toasterTranslate',
          function ($localStorage, $rootScope, $http, toasterTranslate) {

            var obj = {};
            obj.autoLogin = function () {
              if ($rootScope.ishttps) {
                $http({method: 'GET',
                  url: 'rest/mcc/private/auth'}).
                        success(function (data, status, headers, config) {
                          $rootScope.isLoggedIn = true;
                          $rootScope.user = data.user;
                        }).
                        error(function (data, status, headers, config) {
                          $rootScope.isLoggedIn = false;
                          $rootScope.user = {};
                        });
              }
            }

            obj.login = function (username, password) {
              var data = {
                username: username,
                password: password
              };
              return $http({method: 'POST',
                data: data,
                url: 'rest/mcc/private/auth'});
            };

            obj.logout = function () {
              delete $localStorage.user;
              delete $localStorage.isLoggedIn;
              return $http({method: 'GET',
                url: 'rest/mcc/private/auth/logout'});
            };

            obj.setLoginData = function (isLoggedIn, data) {
              $rootScope.isLoggedIn = isLoggedIn;
              if (arguments.length == 2 && isLoggedIn) {
                $rootScope.user = data.user;
              } else {
                $rootScope.user = {};
              }
            };

            obj.setToScope = function ($scope) {
              if ($rootScope.isLoggedIn) {
                $scope.user = $rootScope.user;
                $scope.isLoggedIn = true;
              }
              else {
                $scope.isLoggedIn = false;
              }
            }

            return obj;
          }]);

