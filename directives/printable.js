angular.module('mcc').directive("mccPrintable", [
  function () {
    return {
      restrict: "A",
      link: function ($scope, element, attrs) {
        element.bind('click', function () {
          var w = window.open();
          // load all stylesheets to the document
          var sts = document.styleSheets;
          var result = [];
          for (var i = 0; i < sts.length; i++) {
            var st = sts.item(i);
            if (st.href != null) {
              if ('mccPrintableNoCss' in attrs) {
                if (st.href.match(attrs.mccPrintableNoCss) != null) {
                  continue;
                }
              }
              result.push(st.href);
            }
          }
          var stylesheet = '';
          for (var i = 0; i < result.length; i++) {
            stylesheet += '<link rel="stylesheet" href="' + result[i] + '" \>';
          }
          if (attrs.mccPrintable == "") {
            var text = $(element[0]).html();
          }
          else {
            text = $('#' + attrs.mccPrintable).html();
          }

          w.document.writeln('<html><head>' +
                  stylesheet + '\n\n' +
                  '<style>' +
                  'input {display: none !important; }' +
                  '.no-print {display: none !important; }' +
                  '.only-print {display: block !important; }' +
                  'a {text-decoration: none !important; color: black !important;}' +
                  '</style>' +
                  '</head><body>' +
                  text +
                  '</body></html>');

        });
      }
    };
  }]);