angular.module('mcc').directive('mccImgClick',
        [function () {
            return {
              restrict: 'A',
              scope: {},
              link: function ($scope, element, attrs) {                
                var clickFun = function(){
                  var url = attrs.src;
                  if ('target' in attrs){
                      window.open(url,attrs.target);
                    } 
                    else {
                      window.open(url);
                    }
                };                                                
                element.bind('tap click', clickFun);                                               
                $(element).addClass('hand');
              }
            };
          }]
        );