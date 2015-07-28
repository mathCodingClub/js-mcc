angular.module('mcc').directive("mccBindKeys", function () {
  return {restrict: 'A',
    link: function ($scope, element, attrs) {
      $(element).keydown(function (evt) {        
        if (evt.metaKey && evt.keyCode === 83) {
          $scope[attrs.bindKeysCtrlS](false);
          evt.preventDefault();
        }               
      });
    }
  };

});
