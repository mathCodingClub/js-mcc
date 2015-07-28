angular.module('mcc').directive("mccLoginOverlay", [
  'mcc.user',
  '$rootScope',
  'mcc.toasterTranslate',
  function (user, $rootScope, toasterTranslate) {
    return {
      restrict: "E",
      scope: true,
      templateUrl: 'rest/mcc/templates/directives/loginOverlay',
      link: function ($scope, element, attrs) {
        var reset = function () {
          $scope.loginForm = {
            username: '',
            password: ''
          };
        };
        reset();
        
        $scope.clickLogin = function () {
          $scope.loginInProgress = true;
          user.login($scope.loginform.username, $scope.loginform.password).
                  success(function (data, status, headers, config) {
                    $rootScope.toggle('mcc.loginOverlay', 'off');
                    user.setLoginData(true, data);
                    toasterTranslate.success(data.dict);
                    reset();
                  }).
                  error(function (data, status, headers, config) {
                    $scope.loginFailed = true;
                    $scope.loginInProgress = false;
                    toasterTranslate.error(data.dict);
                  });
        };
        
        $scope.clickLogout = function () {
          user.logout().success(function (data, status, headers, config) {
            user.setLoginData(false);
            $rootScope.toggle('mcc.loginOverlay', 'off');
            toasterTranslate.success(data.dict);
          }).error(function (data, status, headers, config) {
            toasterTranslate.error(data.dict);
          });
        };
      }
    };
  }]);