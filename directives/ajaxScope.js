// (c) Antti Stenvall, antti@stenvall.fi
// MIT Licensed
// 
// AngularJs diretive: mcc-ajax-scope
// 
// Binds data to json that is fetched from the server
// Attributes
//  mcc-ajax-scope: rest side url where to fetch data (mandatory)
//  mcc-loading-var: scope variable name, true while loading false when loaded 
//  mcc-ajax-scope-var: scope variable for data (default ajax)

angular.module('mcc').directive("mccAjaxScope", ['$http', function($http) {
    return {restrict: 'A',
      scope: '@',
      link: function($scope, element, attrs) {
        if (attrs.mccLoadingVar != undefined &&
                $scope[attrs.mccLoadingVar] == undefined) {
          $scope[attrs.mccLoadingVar] = true;
        }
        if ('mccAjaxLog' in attrs){
          console.log('Fetching data from ' + attrs.mccAjaxScope);
        }
        $http({method: 'GET', url: attrs.mccAjaxScope}).
                success(function(data, status, headers, config) {
                  if (attrs.mccLoadingVar != undefined) {                    
                    $scope[attrs.mccLoadingVar] = !$scope[attrs.mccLoadingVar];
                    console.log($scope);
                  }
                  if (attrs.mccAjaxScopeVar == undefined) {
                    attrs.mccAjaxScopeVar = 'mcc_ajax';
                  }
                  $scope[attrs.mccAjaxScopeVar] = data;
                  if ('mccAjaxLog' in attrs) {
                    console.log(data);
                    console.log($scope);
                  }
                }).
                error(function(data, status, headers, config) {
                  console.log('Error in ajax-scope. There\'s nothing I can do. (url: ' + attrs.mccAjaxScope + ')');
                });
      }
    };
  }]);

