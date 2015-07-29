angular.module('mcc').directive("mccSideBarLeftLinks", [
  '$rootScope',
  '$location',
  function($rootScope, $location) {
    return {
      restrict: 'A',
      scope: {links: '=mccSideBarLeftLinks'},
      templateUrl: 'rest/mcc/templates/directives/sideBarLeftLinks',
      link: function($scope, element, attrs) {
        $scope.click = function(link, parent) {
          if ('link' in link) {
            if (arguments.length == 2 && 'path' in parent) {
              $location.path(parent.path + '/' + link.link);
            }
            else {
              $location.path(link.link);
            }
          }
          if (!$scope.hasChildLinks(link)) {
            $rootScope.toggle('mainSidebar', 'off');
          }
          if ('overlay' in link) {
            $rootScope.toggle(link.overlay, 'on');
          }
        };
        $scope.hasChildLinks = function(link) {
          if ('contents' in link) {
            for (var i = 0; i < link.contents.length; i++) {
              if ('title' in link.contents[i]) {
                return true;
              }
              if ('contents' in link.contents[i]) {
                if (hasChildLinks(link.contents[i])) {
                  return true;
                }
              }
            }
          }
          return false;
        };
        $scope.show = function(link, parent) {
          if (!('title' in link)) {
            return false;
          }
          if (arguments.length == 2 && parent != null) {
            if ($rootScope.activeArea == parent.path) {
              return true;
            }
            return false;
          }
          if (!('title' in link)) {
            return false;
          }
          if ('ishttps' in link && link.ishttps) {
            if ('isLoggedIn' in link) {
              return $rootScope.ishttps && ($rootScope.isLoggedIn === link.isLoggedIn);
            }
            return $rootScope.ishttps;
          }
          if ('isLoggedIn' in link && link.isLoggedIn) {
            return $rootScope.isLoggedIn == link.isLoggedIn;
          }
          return true;
        }

      }
    };
  }]);