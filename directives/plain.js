(function () {
  var obj = {
    E: ['fullSpinner','smallSpinner'],
    A: [],
    EA: []
  };

  for (var restrict in obj) {
    for (var i = 0; i < obj[restrict].length; i++) {
      var directive = obj[restrict][i];
      angular.module('mcc').directive("mcc" + capitalizeFirstLetter(directive),
              function () {
                return {
                  restrict: restrict,
                  templateUrl: 'rest/mcc/templates/directives/' + directive
                };
              });
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}());