angular.module('mcc').service('mcc.crud',
        ['$window',
          'mcc.$http',
          'mcc.toasterTranslate',
          'dialogs',
          function ($window, http, toasterTranslate, dialogs) {
            return function (urlBasePrivate, urlBasePublic, objectKey, parentKey) {
              var hasParent = (arguments.length === 4);
              var addFun;
              // create              
              if (hasParent) {
                addFun = function (obj) {
                  return http.postViaDefer(urlBasePrivate + parentKey + '/' + obj[parentKey + '_id'] + '/' + objectKey, obj);
                };
              }
              else {
                addFun = function (obj) {
                  return http.postViaDefer(urlBasePrivate + objectKey, obj);
                };
              }
              this.create = addFun;
              // retrieve
              this.get = function (id) {
                return http.getViaDefer(urlBasePrivate + objectKey + '/' + id);
              };
              this.getPub = function (id) {
                return http.getViaDefer(urlBasePublic + objectKey + '/' + id);
              };
              var getAllFun, getAllPubFun;
              if (hasParent) {
                getAllFun = function (parentId) {
                  return http.getViaDefer(urlBasePrivate + parentKey + '/' + parentId + '/' + objectKey + '_all');
                };
                getAllPubFun = function (parentId) {
                  return http.getViaDefer(urlBasePublic + parentKey + '/' + parentId + '/' + objectKey + '_all');
                };
              }
              else {
                getAllFun = function () {
                  return http.getViaDefer(urlBasePrivate + objectKey + '/all');
                };
                getAllPubFun = function () {
                  return http.getViaDefer(urlBasePrivate + objectKey + '/all');
                };
              }
              this.getAll = getAllFun;
              this.getAllPub = getAllPubFun;
              // update
              this.update = function (obj) {
                return http.putViaDefer(urlBasePrivate + objectKey + '/' + obj.id, obj);
              };
              // delete
              this.delete = function (id) {
                return http.deleteViaDefer(urlBasePrivate + objectKey + '/' + id)
              };
              this.confirmAndRemove = function (id, cb) {
                var hasCb = arguments.length == 2
                var dlg = dialogs.confirm(undefined, undefined, {size: 'sm'});
                dlg.result.then(function () {
                  http.deleteViaDefer(urlBasePrivate + objectKey + '/' + id).then(
                          function (reply) {
                            if ('data' in reply && 'dict' in reply.data) {
                              toasterTranslate.success(reply.dict);
                            }
                            if (hasCb) {
                              if (cb == 'refresh') {
                                $window.location.reload();
                              }
                              else {
                                cb(reply);
                              }
                            }
                          });
                });
              };
            };
          }
        ]);