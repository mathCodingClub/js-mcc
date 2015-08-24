angular.module('mcc').service('mcc.code',
        ['mcc.$http', 'mcc.crud', function (http, crud) {
            var urlBasePrivate = 'rest/mcc/private/';
              var client = new crud(urlBasePrivate, urlBasePrivate, 'templates');
            return client;
          }]);