/* Bind ctrl-* and Enter keys to element (like input)
 * 
 * example:
 * mcc-bind-keys="enter|ctrl-s|ctrl-z"
 * bind-keys-enter="pressEnter"
 * bind-keys-ctrl-s="pressCtrlAndSSimultaneously"
 * bind-keys-ctrl-z="clickedAnotherMetaThing"
 * Given bind function is called with triggered event
 */

angular.module('mcc').directive('mccBindKeys', function () {
  return {restrict: 'A',
    link: function ($scope, element, attrs) {
      var bind = 'bindTo' in attrs ? attrs.bindTo : 'keydown';        
      $(element)[bind](function (evt) {
        console.log(evt);
        // ctrl-*
        var meta = attrs.mccBindKeys.match(/ctrl-[a-z]/);
        if (meta && evt.metaKey) {                    
          var ch = meta[0][5];                
          if (String.fromCharCode(evt.which).toLowerCase() === ch) {                        
            $scope[attrs['bindKeysCtrl' + ch.toUpperCase()]](evt);
            evt.preventDefault();
          }
        }
        // element
        if (evt.which === 13 && attrs.mccBindKeys.match(/enter/)){
            $scope[attrs.bindKeysEnter](evt);
            evt.preventDefault();
        }                
      });
    }
  };

});
