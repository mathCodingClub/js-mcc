angular.module('mcc').directive('mccLink',
        ['$location',function ($location) {
            return {
              restrict: 'AE',
              scope: {},
              link: function ($scope, element, attrs) {                
                var clickfun = function(){               
                  console.log('keijo');
                  if ('url' in attrs){
                    var url = attrs.url;
                    if ('target' in attrs){
                      window.open(url,attrs.target);
                    } 
                    else {
                      window.open(url);
                    }
                  }
                  if ('route' in attrs){
                    $location.path(attrs.route);
                  }                  
                };                                
                element.bind('tap click', clickfun);                               
                $(element).addClass('hand');
                if (!('noClass' in attrs)){
                  $(element).addClass('mcc-link');
                }
              }
            };
          }]
        );