(function (self, $, undefined) {
  // figure editor
  self.route = {
    add: function (path, data, $routeProvider) {
      var obj = {};
      if (('overlay' in data) ||
              ('noroute' in data) ||
              !('link' in data)) {
        return;
      }
      else if ('template' in data) {
        obj = {template: data.template};
      }
      else if ('code' in data) {
        obj = {template: '<div mcc-template="' + data.code + '"></div>'};
      }
      else if ('templateUrl' in data) {
        obj = {templateUrl: data.templateUrl};
      }
      else {
        console.log('Could not find template for route: ' + path + data.link);
      }
      // add possible controller
      if ('controller' in data) {
        obj.controller = data.controller;
      }
      $routeProvider.when(path + data.link, obj);
      if (data.contents) {
        for (var i = 0; i < data.contents.length; i++) {
          mcc.route.add(path + data.path + '/', data.contents[i], $routeProvider);
        }
      }
    }
  };
}(window.mcc = window.mcc || {}, jQuery));