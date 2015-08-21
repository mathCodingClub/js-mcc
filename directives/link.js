angular.module('mcc').directive('mccLink',
        ['$location','$rootScope',function ($location,$rootScope) {
            return {
              restrict: 'AE',
              scope: {},
              link: function ($scope, element, attrs) {                
                var extUrl = function(url){
                  if ('target' in attrs){
                      window.open(url,attrs.target);
                    } 
                    else {
                      window.open(url);
                    }
                };
                var clickfun = function(){                                                   
                  if ('url' in attrs){
                    extUrl(attrs.url);                    
                    return;
                  }
                  if ('route' in attrs){
                    $location.path(attrs.route);
                    return;
                  }                          
                  if (attrs.mccLink.match('@://@') != ''){
                    extUrl(attrs.mccLink);
                  }
                  else {
                    $location.path(attrs.mccLink);                    
                  }                  
                };
                var applyFun = function(){
                  $rootScope.$apply(clickfun);
                };
                // add click
                element.bind('tap click', applyFun);                               
                $(element).addClass('hand');
                if (!('noClass' in attrs)){
                  $(element).addClass('mcc-link');
                }
              }
            };
          }]
        );