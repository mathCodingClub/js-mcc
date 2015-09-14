angular.module('mcc').service('mcc.$http',
        ['$http', '$q', function ($http, $q) {

            // add here header data that can be set in settings
            var promise = function (url, method, data) {
              var def = $q.defer();
              if (arguments.length < 2) {
                method = 'get';
              }
              var obj = {
                method: method,
                url: url
              };
              if (arguments.length > 2 && data !== null) {
                obj.data = data;
              }
              $http(obj).
                      success(function (data, status, headers, config) {
                        var reply = {
                          data: data,
                          status: status,
                          headers: headers,
                          config: config
                        };
                        console.log(reply);
                        def.resolve(reply);
                      }).
                      error(function (data, status, headers, config) {
                        console.log('Could not get data');
                        var reply = {
                          data: data,
                          status: status,
                          headers: headers,
                          config: config
                        };
                        def.resolve(reply);
                      });
              return def.promise;
            };


            var getViaDefer = function (url) {
              return promise(url);
            };

            var deleteViaDefer = function (url) {
              return promise(url, 'delete');
            };

            var postViaDefer = function (url, data) {
              return promise(url, 'post', data);
            };

            var putViaDefer = function (url, data) {
              return promise(url, 'put', data);
            };

            return {
              customViaDefer: promise,
              getViaDefer: getViaDefer,
              deleteViaDefer: deleteViaDefer,
              postViaDefer: postViaDefer,
              putViaDefer: putViaDefer
            };
          }
        ]);