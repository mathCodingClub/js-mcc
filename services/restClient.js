angular.module('mcc').service('mcc.restClient',
        ['mcc.toasterTranslate',          
          'dialogs',
          function(toasterTranslate, dialogs) {
            var restClient = function(conf) {
              this.addInit = function(initWithData) {
                conf.selected[conf.object] = initWithData;
                if ('cb' in conf && 'addInit' in conf.cb) {
                  conf.cb.addInit(initWithData);
                }
              };
              this.editInit = function(initWithData) {
                conf.selected[conf.object] = initWithData;
                if ('cb' in conf && 'editInit' in conf.cb) {
                  conf.cb.editInit(initWithData);
                }
              };
              this.remove = function(id) {
                var dlg = dialogs.confirm(undefined, undefined, {size: 'sm'});
                dlg.result.then(function() {
                  var cb = function(data) {
                    toasterTranslate.report(data.status,
                            data.data.dict);
                    if ('cb' in conf && 'remove' in conf.cb) {
                      conf.cb.remove(data);
                    }
                  };
                  conf.service.remove(id).then(cb);
                });
              };
              this.save = function() {
                if ('cb' in conf && 'savemw' in conf.cb) {
                  conf.cb.savemw();
                }
                var cb = function(data) {
                  // check here success etc
                  if (conf.object in data.data) {
                    conf.selected[conf.object] = data.data[conf.object];
                  }
                  toasterTranslate.report(data.status, data.data.dict);
                  if ('cb' in conf && 'save' in conf.cb) {
                    conf.cb.save(data.data);
                  }
                };
                if ('id' in conf.selected[conf.object]) {
                  conf.service.update(conf.selected[conf.object]).then(cb);
                }
                else {
                  conf.service.create(conf.selected[conf.object]).then(cb);
                }
              };
            };
            return {
              init: restClient
            };
          }
        ]);