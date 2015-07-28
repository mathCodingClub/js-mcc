angular.module('mcc').service('mcc.code',
        ['mcc.$http', 'mcc.crud', function (http, crud) {
            var urlBasePrivate = 'rest/private/';
            var client = new crud(urlBasePrivate, urlBasePrivate, 'data');
            return client;
          }]);