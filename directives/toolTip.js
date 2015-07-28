angular.module('mcc').directive("mccTooltip", function() {  
  return {restrict: 'A',    
    link: function(scope, element, attrs) {            
      var div = document.createElement('div');
      $(element[0]).css({position: 'relative'});
      $(div).hide();
      $(div).css({position: 'absolute','z-index':10000}).
              html(attrs.mccTooltip).
              addClass('mcc-tooltip').
              appendTo(element);      
      element.bind('mousemove', function(e) {
        var myWidth = $(div).width();
        var myHeight = $(div).width(); 
        var cursor = 8;
        $(div).css({
          top: e.offsetY-myHeight/2+cursor,
          left: e.offsetX+10
        });
      });
      element.bind('mouseenter', function() {
        $(div).fadeIn(100);
      });
      element.bind('mouseleave', function() {
        $(div).fadeOut(100);
      });
      /*
      element.bind('touchdown', function() {
        $('.mcc-tooltip').fadeOut(100,function(){
          $(div).fadeIn(100);
        });        
      });
      */
      /*
      $('body').bind('touchmove',function(){
        $('.mcc-tooltip').fadeOut(100);
      },true);
      */
    }
  };
});