angular.module('mcc').service('mcc.toasterTranslate',
        ['toaster', '$translate', function (toaster, $translate) {
            var common = function (style, key) {
              popup(style, key);
            };
            var error = function (CODE) {
              popup('error', CODE);
            };
            var info = function (CODE) {
              popup('info', CODE);
            };
            var report = function (htmlcode, CODE) {
              if (htmlcode === 200) {
                success(CODE);
              }
              else {
                error(CODE);
              }
            };
            var success = function (CODE) {
              popup('success', CODE);
            };

            var popup = function(style, key) {
              var styleKey = 'TOASTER.' + style.toUpperCase();
              $translate([styleKey, key]).then(function (lang) {
                toaster.pop(style, lang[styleKey] + '!', lang[key]);
              });
            }

            return {
              error: error,
              info: info,
              success: success,
              common: common,
              report: report
            };
          }]);