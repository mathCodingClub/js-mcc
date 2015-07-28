angular.module('mcc').directive("mccTabToSpace", function () {
  return {restrict: 'A',
    link: function ($scope, element, attrs) {
      $(element).keydown(function (evt) {
        if (evt.which == 9) {
          this.focus();
          var cursorLocation = this.selectionStart;
          var startString = '';
          var endString = '';
          var val = $(element).val();
          startString = val.substr(0, cursorLocation);
          endString = val.substr(cursorLocation, val.length);
          for (var k = 0; k < attrs.tabToSpace; k++) {
            startString += ' ';
          }
          $(element).val(startString + endString);
          $(element).selectRange(parseInt(cursorLocation) + parseInt(attrs.tabToSpace));          
          evt.preventDefault();
        }
      });
    }
  };

});
