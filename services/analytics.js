angular.module('mcc').service('mcc.analytics', [
  function () {
    var send = function (evt, data) {
      ga('send', evt, data);
    };
    return {
      send: send
    };
  }
]);