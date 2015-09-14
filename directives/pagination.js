angular.module('mcc').directive("mccPagination", [
  function() {
    return {restrict: 'A',
      scope: {
        fun: '=mccPagination'
      },
      link: function($scope, element, attrs) {                
        if ('parent' in attrs) { // it might be that only parent is scrollable and one must bind to it
          var container = $(element[0]).closest(attrs.parent);          
        }
        else {
          container = element;
        }        
        var heightMargin = 'heightMargin' in attrs ? attrs.heightMargin : 0;
        container.bind('scroll', function() {
          var pos = window.innerHeight + container[0].scrollTop;
          var height = container[0].scrollHeight - heightMargin;         
          if (pos > height) {                           
            $scope.fun();            
            if ('forceScroll' in attrs){
             setTimeout(function(){$(container).scrollTop((height+pos)/2);},20);            
            }
          }
        });
      }
    };
  }]);

