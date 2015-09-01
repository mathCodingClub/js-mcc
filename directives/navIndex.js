angular.module('mcc').directive('mccNavIndex',
        ['$rootScope',
          '$window',
          'mcc.code',
          function ($rootScope, $window, client) {
            return {
              restrict: 'E',
              templateUrl: 'mcc.navIndex',
              link: function ($scope, element, attrs) {
                for (var i = 0; i < CONFIG.nav.length; i++) {
                  if (CONFIG.nav[i].path == attrs.path){
                    $scope.nav = CONFIG.nav[i];
                  }
                }                
                $scope.toShow = function(link){
                  if ('skip' in attrs){                    
                    if (link.link.match(attrs.skip) !== null){                      
                      return false;
                    }                                        
                  }
                  if (!('title' in link)){
                    return false;
                  }
                  return true;
                }
                $scope.getLink = function(link){
                  return attrs.path + '/' + link.link;
                }
              }
            };
          }]
        );