
// init mcc module
angular.module('mcc', []);
// (c) Antti Stenvall, antti@stenvall.fi
// MIT Licensed
// 
// AngularJs diretive: mcc-ajax-scope
// 
// Binds data to json that is fetched from the server
// Attributes
//  mcc-ajax-scope: rest side url where to fetch data (mandatory)
//  mcc-loading-var: scope variable name, true while loading false when loaded 
//  mcc-ajax-scope-var: scope variable for data (default ajax)

angular.module('mcc').directive("mccAjaxScope", ['$http', function($http) {
    return {restrict: 'A',
      scope: '@',
      link: function($scope, element, attrs) {
        if (attrs.mccLoadingVar != undefined &&
                $scope[attrs.mccLoadingVar] == undefined) {
          $scope[attrs.mccLoadingVar] = true;
        }
        $http({method: 'GET', url: attrs.mccAjaxScope}).
                success(function(data, status, headers, config) {
                  if (attrs.mccLoadingVar != undefined) {                    
                    $scope[attrs.mccLoadingVar] = !$scope[attrs.mccLoadingVar];
                    console.log($scope);
                  }
                  if (attrs.mccAjaxScopeVar == undefined) {
                    attrs.mccAjaxScopeVar = 'mcc_ajax';
                  }
                  $scope[attrs.mccAjaxScopeVar] = data;
                  if ('mccAjaxLog' in attrs) {
                    console.log(data);
                  }
                }).
                error(function(data, status, headers, config) {
                  console.log('Error in ajax-scope. There\'s nothing I can do.');
                });
      }
    };
  }]);


angular.module('mcc').directive("mccAngularExpr", ['$compile', function ($compile) {
    return {restrict: 'A',
      transclude: true,
      scope: {        
        value: '=mccAngularExpr'
      },
      link: function ($scope, element, attrs) {
        $scope.$watch('value', function () {
          if ($scope.value == undefined || $scope.value.length < 1) {
            return;
          }
          var wrap = attrs.angularExprWrap;
          if (wrap == undefined){
            wrap = 'span';
          }
          var str = '<' + wrap + '>' + $scope.value + '</' + wrap + '>';
          var elem = $compile(str)($scope);
          $(element).empty();
          element.append(elem);
        });
      }
    };
  }]);
angular.module('mcc').directive("mccBindKeys", function () {
  return {restrict: 'A',
    link: function ($scope, element, attrs) {
      $(element).keydown(function (evt) {        
        if (evt.metaKey && evt.keyCode === 83) {
          $scope[attrs.bindKeysCtrlS](false);
          evt.preventDefault();
        }               
      });
    }
  };

});

angular.module('mcc').directive("mccCanvasFollowMouse", ['$http', function($http) {
    return {restrict: 'A',
      scope: {fun: '=mccCanvasFollowMouse'},
      link: function($scope, element, attrs) {
        function getMousePos(canvas, evt) {
          var rect = canvas.getBoundingClientRect();
          return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
          };
        }
        element[0].addEventListener('mousemove', function(evt) {
          var mousePos = getMousePos(element[0], evt);          
          $scope.fun(mousePos.x, mousePos.y);
        }, false);
      }
    };
  }]);


angular.module('mcc').directive('mccCodePage',
        ['$rootScope',
          'mcc.code',
          function ($rootScope, client) {                  
            return {
              restrict: 'A',
              templateUrl: function (element, attrs) {                
                return 'rest/mcc/templates/codepages/' + attrs.mccCodePage;
              },
              link: function ($scope, element, attrs) {
                $scope.dataObject = {};
                var code = attrs.mccCodePage;
                $scope.showCodeEditor = function () {                  
                  client.get(code).then(function (data) {
                    $scope.dataObject = data.data.data;
                    $rootScope.toggle('mcc.overlayEditorData', 'on');
                  });
                };
              }
            };
          }]
        );
angular.module('mcc').directive("mccDatetime", [
  function () {
    return {
      restrict: "E",
      scope: {
        timestamp: '=timestamp'
      },
      templateUrl: 'rest/mcc/templates/directives/datetime',
      link: function ($scope, element, attrs) {
        $scope.opts = {
          showWeeks: true,
          hourStep: 1,
          minuteStep: 10,
          showMeridian: false,
          startingDay: 1,
          dateFormat: "dd.MM.yyyy",
          readonlyTime: false
        };
        $scope.$watch('timestamp', function () {
          $scope.timeObject = new Date($scope.timestamp);
        });
        $scope.$watch('timeObject', function () {
          $scope.timestamp = Math.floor($scope.timeObject.getTime());
        });
      }
    };
  }]);
angular.module('mcc').directive("mccEditorData", ['$http',
  'mcc.toasterTranslate',
  'mcc.code',
  function ($http, toasterTranslate, code) {
    return {
      restrict: 'A',
      transclude: true,
      scope: {
        data: '=overlayData'
      },
      templateUrl: 'rest/mcc/templates/directives/editorData',
      link: function ($scope, element, attrs) {
        $scope.editorACE = true;
        $scope.fe = new mcc.figureEditor({
          id: 'figureEditorCanvas',
          maxWidth: 750,
          maxHeight: 500
        });
        $scope.show = 'editor';
        $scope.save = function () {
          code.update($scope.data).then(function (data) {
            toasterTranslate.report(data.status, data.data.dict);
          });
        };
        $scope.mousePosition = function (x, y) {
          $scope.mouse = {x: x, y: y};
          $scope.$apply();
        };
        $scope.cancelFigure = function () {
          $scope.show = 'editor';
        };
        $scope.setCropPoint = function () {
          $scope.fe.setCropPoint($scope.mouse.x, $scope.mouse.y);
        };
        $scope.saveFigure = function () {
          var editor = ace.edit('aceEditor_content');
          var fd = new FormData();
          fd.append('file', $scope.file);
          fd.append('resize', $scope.figure.maxdim);
          fd.append('name', $scope.figure.name);
          fd.append('crop', JSON.stringify($scope.fe.getCropPoints()));
          $http.post('rest/private/files', fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
          }).success(function (data, status, headers, config) {
            var add;
            if (data.isImage) {
              add = '<p>\n' +
                      '  <figure>\n' +
                      '    <img src="' + data.relPath + '">\n' +
                      '    <figcaption></figcaption>\n' +
                      '  </figure>\n' +
                      '</p>';
            }
            else {
              add = '<a href="' + data.relPath + '" target="blank"></a>';
            }
            editor.insert(add);
            toasterTranslate.common('success', 'FILE_UPLOADED');
            $scope.show = 'editor';
          }).error(function (data, status, headers, config) {
            toasterTranslate.error(data.dict);
          });
        };
        $scope.fileReceived = function (file, element, param) {
          $scope.file = file;
          $scope.figure = {
            maxdim: 1000,
            name: file.name
          };
          if (file.type.indexOf("image") !== -1) {
            $scope.show = 'figure';
            $scope.fe.drawFullImage(file);
          }
          $scope.$apply();
        };
      }
    };
  }]);
angular.module('mcc').directive("mccFileDropZone", function () {
  return {restrict: 'A',
    scope: {
      onDrop: '=fileDropZoneOnDrop',
      onDragover: '=fileDropZoneOnDragover',
      onDragleave: '=fileDropZoneOnDragleave',
      param: '=fileDropZoneParam'
    },
    link: function ($scope, element, attrs) {
      if ($scope.param == undefined) {
        $scope.param = {};
      }
      element[0].addEventListener('dragover', function (evt) {
        evt.preventDefault();
        if ($scope.onDragover != undefined) {
          $scope.onDragover(element[0], $scope.param);
        }
      }, false);

      element[0].addEventListener('dragleave', function (evt) {
        evt.preventDefault();
        if ($scope.onDragleave != undefined) {
          $scope.onDragleave(element[0], $scope.param);
        }
      }, false);

      element[0].addEventListener('drop', function (evt) {
        evt.preventDefault();
        if ('fileDropZoneMultiple' in attrs) {
          $scope.onDrop(evt.dataTransfer.files, element[0], $scope.param);
        }
        else {
          $scope.onDrop(evt.dataTransfer.files[0], element[0], $scope.param);
        }
      }, false);
    }
  };
});

angular.module('mcc').directive("mccIsPast", ['$http', function ($http) {
    return {restrict: 'A',
      scope: false,
      link: function ($scope, element, attrs) {
        var funName = attrs.mccIsPast == '' ? 'isPast' : attrs.mccIsPast;
        $scope[funName] = function (day, month, year) {
          var now = new Date();
          var event = new Date(year, month - 1, day);
          if (now.getTime() > (event.getTime() + 3600 * 24 * 1000)) {
            return 'past';
          }
          else if (now.getTime() > event.getTime()) {
            return 'today';
          }
          else if ((now.getTime() + 3600 * 24 * 1000) > event.getTime()) {
            return 'tomorrow';
          }
          else if ((now.getTime() + 6 * 3600 * 24 * 1000) > event.getTime()) {
            return 'next';
          }
          return '';
        };
      }
    };
  }]);


angular.module('mcc').directive("mccLoginOverlay", [
  'mcc.user',
  '$rootScope',
  'mcc.toasterTranslate',
  function (user, $rootScope, toasterTranslate) {
    return {
      restrict: "E",
      scope: true,
      templateUrl: 'rest/mcc/templates/directives/loginOverlay',
      link: function ($scope, element, attrs) {
        var reset = function () {
          $scope.loginForm = {
            username: '',
            password: ''
          };
        };
        reset();
        
        $scope.clickLogin = function () {
          $scope.loginInProgress = true;
          user.login($scope.loginform.username, $scope.loginform.password).
                  success(function (data, status, headers, config) {
                    $rootScope.toggle('mcc.loginOverlay', 'off');
                    user.setLoginData(true, data);
                    toasterTranslate.success(data.dict);
                    reset();
                  }).
                  error(function (data, status, headers, config) {
                    $scope.loginFailed = true;
                    $scope.loginInProgress = false;
                    toasterTranslate.error(data.dict);
                  });
        };
        
        $scope.clickLogout = function () {
          user.logout().success(function (data, status, headers, config) {
            user.setLoginData(false);
            $rootScope.toggle('mcc.loginOverlay', 'off');
            toasterTranslate.success(data.dict);
          }).error(function (data, status, headers, config) {
            toasterTranslate.error(data.dict);
          });
        };
      }
    };
  }]);
angular.module('mcc').directive("mccModal", [
  '$modal',
  function ($modal) {
    return {
      restrict: "A",
      scope: {
        data: '=mccModalData'
      },
      link: function ($scope, element, attrs) {
        element.bind('click', function () {
          var modalInstance;
          modalInstance = $modal.open({
            templateUrl: attrs.mccModal,
            size: attrs.mccModalSize,
            controller: attrs.mccModalController,
            resolve: {
              data: function () {
                return $scope.data;
              },
              modalInstance: function () {
                return modalInstance;
              }
            }
          });
        });
      }
    };
  }]);
angular.module('mcc').directive('mccNews', ['$rootScope', 'mcc.newsData', 
  function ($rootScope, newsData) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'rest/mcc/templates/directives/news',
      link: function ($scope, element, attrs) {
        $scope.scrollCb = function () {
        };

        var init = function () {
          $scope.loadInProgress = false;
          $scope.isInitialized = false;
          $scope.news = {data: [], pagination: {}};
        };

        init();

        var loadedHandle = function (data) {
          $scope.news.pagination = data.pagination;          
          $scope.news.data = $scope.news.data.concat(data.news);          
          $scope.loadInProgress = false;
          $scope.isInitialized = true;
          newsData.saveToLocalStorage($scope.news);
        };

        var load = function () {
          $scope.loadInProgress = true;
          newsData.getTitles($scope.news.data.length).then(loadedHandle);
        };

        $scope.addedNew = function(){
          $scope.refresh();
          $rootScope.toggle('mcc.overlayEditorNews', 'off');          
        };

        $scope.refresh = function () {
          $scope.newNews = {published: false, contents: "", ingress: "", title: ""};
          newsData.reset();
          init();
          load();
        };

        $scope.atTheEnd = function () {
          if ($scope.loadInProgress || $scope.news.pagination.isLast) {
            return;
          }
          load();
        };

        // init news
        newsData.init().then(loadedHandle);
      }
    };
  }]);

angular.module('mcc').directive("mccNewsEditor", ['$http', '$rootScope', 'mcc.toasterTranslate', 'dialogs',
  function ($http, $rootScope, toasterTranslate, dialogs) {
    return {
      restrict: "A",
      transclude: true,
      scope: {
        news: "=mccNewsEditor",
        cbDelete: "=mccNewsDeleteCb",
        cbAdd: "=mccNewsSaveCb"
      },
      templateUrl: 'rest/mcc/templates/directives/editorNews',
      link: function ($scope, element, attrs) {
        var layerName = attrs.newsOverlay;
        $scope.editorACE = true;
        $scope.modify = !('mccNewsNew' in attrs);
        $scope.fileParams = {};
        $scope.fe = new mcc.figureEditor({
          id: 'figureEditorCanvasNews',
          maxWidth: 750,
          maxHeight: 500
        });
        $scope.show = 'editor';
        // cancel figure
        $scope.cancelFigure = function () {
          $scope.show = 'editor';
        };
        // delete news
        $scope.del = function (id) {
          var dlg = dialogs.confirm(undefined, undefined, {size: 'sm'});
          dlg.result.then(function () {
            $http({method: 'DELETE',
              url: 'rest/private/news/' + id}).
                    success(function (data, status, headers, config) {
                      toasterTranslate.success(data.dict);
                      $rootScope.toggle(layerName, 'off');
                      $scope.cbDelete();
                    }).
                    error(function (data, status, headers, config) {
                      toasterTranslate.error(data.dict);
                    });
          },
                  function () {
                    toasterTranslate.info('DELETE_CANCELLED');
                  }
          );
        };
        // file submission
        $scope.fileReceived = function (file, element, params) {
          $scope.fileParams = params;
          $scope.file = file;
          $scope.figure = {
            name: file.name,
            maxdim: $scope.fileParams.resize,
            type: $scope.fileParams.type
          };
          if (file.type.indexOf("image") !== -1) {
            $scope.show = 'figure';
            $scope.fe.drawFullImage(file);
            $scope.$apply();
          }
        };
        // follow mouse position
        $scope.mousePosition = function (x, y) {
          $scope.mouse = {x: x, y: y};
          $scope.$apply();
        };
        // Set to current time
        $scope.setCurrentTime = function () {
          $http({method: 'GET',            
            url: 'rest/private/news/' + $scope.news.id + '/settocurrenttime'}).
                  success(function (data, status, headers, config) {
                    toasterTranslate.success(data.dict);                    
                  }).
                  error(function (data, status, headers, config) {
                    toasterTranslate.error(data.dict);
                  });
        };
        // Save news
        $scope.save = function (close) {
          close = arguments.length > 0 ? close : true;
          if (!$scope.modify) {
            if ($scope.news.published == undefined) {
              $scope.news.published = false;
            }
            $http({method: 'POST',
              data: {
                title: $scope.news.title,
                contents: $scope.news.contents,
                ingress: $scope.news.ingress,
                published: $scope.news.published
              },
              url: 'rest/private/news'}).
                    success(function (data, status, headers, config) {
                      toasterTranslate.success(data.dict);
                      $rootScope.toggle(layerName, 'off');
                      $scope.cbAdd();
                    }).
                    error(function (data, status, headers, config) {
                      toasterTranslate.error(data.dict);
                    });
          }
          else {
            $http({method: 'PUT',
              data: $scope.news,
              url: 'rest/private/news'}).
                    success(function (data, status, headers, config) {
                      toasterTranslate.success(data.dict);
                      if (close) {
                        $rootScope.toggle(layerName, 'off');
                      }
                    }).
                    error(function (data, status, headers, config) {
                      toasterTranslate.error(data.dict);
                    });
          }
        };
        // Save figure
        $scope.saveFigure = function () {
          var editor = ace.edit('aceEditor_' + $scope.figure.type);
          var fd = new FormData();
          fd.append('file', $scope.file);
          fd.append('resize', $scope.figure.maxdim);
          fd.append('name', $scope.figure.name);
          fd.append('crop', JSON.stringify($scope.fe.getCropPoints()));
          $http.post('rest/private/files', fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
          }).success(function (data, status, headers, config) {
            var add;
            if (data.isImage && $scope.figure.type == 'contents') {
              add = '<p>\n' +
                      '  <figure>\n' +
                      '    <img src="' + data.relPath + '">\n' +
                      '    <figcaption></figcaption>\n' +
                      '  </figure>\n' +
                      '</p>';
            }
            else if (data.isImage) {
              add = '<img src="' + data.relPath + '">\n';
            }
            else {
              add = '<a href="' + data.relPath + '" target="blank"></a>';
            }
            editor.insert(add);
            $scope.$apply();
            toasterTranslate.common('success', 'FILE_UPLOADED');
            $scope.show = 'editor';
          }).error(function (data, status, headers, config) {
            toasterTranslate.error(data.dict);
          });
        };
        // Set crop point
        $scope.setCropPoint = function () {
          $scope.fe.setCropPoint($scope.mouse.x, $scope.mouse.y);
        };
        $scope.swapEditorType = function() {
          $scope.editorACE = !$scope.editorACE;
        }
      }
    };
  }]);
angular.module('mcc').directive('mccNewsSelected', [
  '$routeParams',
  '$location',
  '$http',
  '$rootScope',
  'mcc.newsData',
  'mcc.toasterTranslate',
  'dialogs',
  function ($routeParams, $location, $http, $rootScope,
          newsData, toasterTranslate, dialogs) {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'rest/mcc/templates/directives/newsSelected',
      link: function ($scope, element, attrs) {        
        $scope.id = $routeParams.id;
        $scope.news = {title: '', contents: ''};
        $scope.comments = [];
        var resetComments = function () {
          $scope.comment = {name: '', email: '', contents: ''};
        };
        resetComments();
        $scope.isInitialized = false;
        newsData.getById($scope.id).then(
                function (data) {
                  $scope.news = data.news;
                  $scope.previous = data.news_previous;
                  $scope.next = data.news_next;
                  $scope.isInitialized = true;
                }
        );
        $scope.afterDelete = function () {
          $rootScope.toggle('mcc.overlayEditorNews', 'off');
          $location.path('news');
        };
        // load comments
        $scope.loadComments = function () {
          $http({method: 'GET',
            url: 'rest/news/comments/' + $scope.id}).
                  success(function (data, status, headers, config) {
                    $scope.comments = data.comments;
                  }).
                  error(function (data, status, headers, config) {
                    toasterTranslate.error(data.code);
                  });
        };
        // post reply to comment
        $scope.postReply = function (index) {
          $http({method: 'PUT',
            data: $scope.comments[index],
            url: 'rest/private/news/comment'}).
                  success(function (data, status, headers, config) {
                    toasterTranslate.success(data.dict);
                    resetComments();
                    $scope.loadComments();
                  }).
                  error(function (data, status, headers, config) {
                    toasterTranslate.error(data.dict);
                  });
        };
        $scope.deleteComment = function (commentId) {
          var dlg = dialogs.confirm(undefined, undefined, {size: 'sm'});
          dlg.result.then(function () {
            $http({method: 'DELETE',
              url: 'rest/private/news/comment/' + commentId}).
                    success(function (data, status, headers, config) {
                      toasterTranslate.success(data.dict);
                      $scope.loadComments();
                    }).
                    error(function (data, status, headers, config) {
                      toasterTranslate.error(data.dict);
                    });
          });
        };
        $scope.postComment = function () {
          $http({method: 'POST',
            data: $scope.comment,
            url: 'rest/news/comment/' + $scope.id}).
                  success(function (data, status, headers, config) {
                    toasterTranslate.success(data.dict);
                    resetComments();
                    $scope.loadComments();
                  }).
                  error(function (data, status, headers, config) {
                    toasterTranslate.error(data.dict);
                  });
        };
        $scope.loadComments();
      }
    };
  }]);

angular.module('mcc').directive("mccOnChange", [function () {
    return {restrict: 'A',
      scope: {fun: '=mccOnChange'},
      link: function ($scope, element, attrs) {
        $(element).bind('change', function () {
          var data = $(element).data();
          if (data != undefined) {
            $scope.fun(data, $(element).val());
          }
          else {
            $scope.fun($(element).val());
          }
        });
      }
    };
  }]);


angular.module('mcc').directive("mccOnClickPrompt", ['$http', 'mcc.toasterTranslate',
  function ($http, toasterTranslate) {
    return {restrict: 'A',
      scope: {
        value: '=mccOnClickPrompt',
        data: '=mccOnClickData'
      },
      link: function ($scope, element, attrs) {
        var isSet = false;
        element.bind('click', function () {
          if (!isSet) {
            $scope.$watch('data', function () {
              $http({method: attrs.mccOnClickMethod, url: attrs.mccOnClickUrl, data: $scope.data}).
                      success(function (data, status, headers, config) {
                        toasterTranslate.success(data.dict);
                        $scope.data = data[attrs.mccOnClickObject];
                      }).
                      error(function (data, status, headers, config) {
                        toasterTranslate.error(data.dict);
                      });
            }, true);
            isSet = true;
          }
          var val = prompt(attrs.mccOnClickText, $scope.value);
          if (val == '' || val == null || val == undefined) {
            return;
          }
          $scope.value = val;
          $scope.$apply();
        });

      }
    };
  }]);

angular.module('mcc').directive("mccPagination", function () {
  return {restrict: 'A',
    scope: '@',
    transclude: true,
    template: '<div><ng-transclude></ng-transclude></div>',
    link: function ($scope, element, attrs) {
      var raw = element[0];
      element.bind('scroll', function () {
        var pos = window.innerHeight + element[0].scrollTop;
        var height = element[0].children[0].offsetHeight - parseInt(attrs.heightMargin);
        if (pos > height) {
          $scope[attrs.mccPagination]();
        }
      });
    }
  };
});


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
angular.module('mcc').directive("mccSideBarLeft", [
  function () {
    return {
      restrict: 'A',      
      scope: true,
      templateUrl: 'rest/mcc/templates/directives/sideBarLeft',
      link: function ($scope, element, attrs) {
        $scope.sb = CONFIG.structure;                
      }
    };
  }]);
angular.module('mcc').directive("mccSideBarLeftLinks", [
  '$rootScope',
  '$location',
  function($rootScope, $location) {
    return {
      restrict: 'A',
      scope: {links: '=mccSideBarLeftLinks'},
      templateUrl: 'rest/mcc/templates/directives/sideBarLeftLinks',
      link: function($scope, element, attrs) {
        $scope.click = function(link, parent) {
          if ('link' in link) {
            if (arguments.length == 2 && 'path' in parent) {
              $location.path(parent.path + '/' + link.link);
            }
            else {
              $location.path(link.link);
            }
          }          
          if ('overlay' in link) {
            $rootScope.toggle(link.overlay, 'on');
          }
          if ('url' in link){
           window.open(link.url); 
          }
          if (!$scope.hasChildLinks(link)) {
            $rootScope.toggle('mainSidebar', 'off');
          }
        };
        $scope.hasChildLinks = function(link) {
          if ('contents' in link) {
            for (var i = 0; i < link.contents.length; i++) {
              if ('title' in link.contents[i]) {
                return true;
              }
              if ('contents' in link.contents[i]) {
                if (hasChildLinks(link.contents[i])) {
                  return true;
                }
              }
            }
          }
          return false;
        };
        $scope.show = function(link, parent) {
          if (!('title' in link)) {
            return false;
          }
          if (arguments.length == 2 && parent != null) {
            if ($rootScope.activeArea == parent.path) {
              return true;
            }
            return false;
          }
          if (!('title' in link)) {
            return false;
          }
          if ('ishttps' in link && link.ishttps) {
            if ('isLoggedIn' in link) {
              return $rootScope.ishttps && ($rootScope.isLoggedIn === link.isLoggedIn);
            }
            return $rootScope.ishttps;
          }
          if ('isLoggedIn' in link && link.isLoggedIn) {
            return $rootScope.isLoggedIn == link.isLoggedIn;
          }
          return true;
        }

      }
    };
  }]);
angular.module('mcc').directive("mccTabToSpace", function () {
  return {restrict: 'A',
    link: function ($scope, element, attrs) {
      $(element).keydown(function (evt) {
        if (evt.which == 9) {
          this.focus();
          var cursorLocation = this.selectionStart;
          var startString = '';
          var endString = '';
          var val = $(element).val();
          startString = val.substr(0, cursorLocation);
          endString = val.substr(cursorLocation, val.length);
          for (var k = 0; k < attrs.tabToSpace; k++) {
            startString += ' ';
          }
          $(element).val(startString + endString);
          $(element).selectRange(parseInt(cursorLocation) + parseInt(attrs.tabToSpace));          
          evt.preventDefault();
        }
      });
    }
  };

});

angular.module('mcc').directive("mccTooltip", function() {  
  return {restrict: 'A',    
    link: function(scope, element, attrs) {            
      var div = document.createElement('div');
      $(element[0]).css({position: 'relative'});
      $(div).hide();
      $(div).css({position: 'absolute','z-index':10000}).
              html(attrs.mccTooltip).
              addClass('mcc-tooltip').
              appendTo(element);      
      element.bind('mousemove', function(e) {
        var myWidth = $(div).width();
        var myHeight = $(div).width(); 
        var cursor = 8;
        $(div).css({
          top: e.offsetY-myHeight/2+cursor,
          left: e.offsetX+10
        });
      });
      element.bind('mouseenter', function() {
        $(div).fadeIn(100);
      });
      element.bind('mouseleave', function() {
        $(div).fadeOut(100);
      });
      /*
      element.bind('touchdown', function() {
        $('.mcc-tooltip').fadeOut(100,function(){
          $(div).fadeIn(100);
        });        
      });
      */
      /*
      $('body').bind('touchmove',function(){
        $('.mcc-tooltip').fadeOut(100);
      },true);
      */
    }
  };
});
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
angular.module('mcc').service('mcc.code',
        ['mcc.$http', 'mcc.crud', function (http, crud) {
            var urlBasePrivate = 'rest/private/';
            var client = new crud(urlBasePrivate, urlBasePrivate, 'data');
            return client;
          }]);
angular.module('mcc').service('mcc.crud',
        ['mcc.$http', function (http) {
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
                  return http.getViaDefer(urlBasePrivate + objectKey + '_all');
                };
                getAllPubFun = function () {
                  return http.getViaDefer(urlBasePrivate + objectKey + '_all');
                };
              }
              this.getAll = getAllFun;
              this.getAllPub = getAllPubFun;
              // update
              this.update = function (obj) {
                return http.putViaDefer(urlBasePrivate + objectKey + '/' + obj.id, obj);
              };
              // delete
              this.remove = function (id) {
                return http.deleteViaDefer(urlBasePrivate + objectKey + '/' + id);
              };
            };
          }
        ]);
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
angular.module('mcc').service('mcc.newsData', function ($http, $q, $localStorage) {

  var get = function (url) {
    return function () {
      var request = $http({
        method: 'get',
        url: url
      });
      return request.then(handleSuccess, handleError);
    };
  };

  var init = function () {
    var data = $localStorage.news;
    var latestTimestamp = $localStorage.newsTimestamp;
    var timeStamp = new Date().getTime();
    if (data == null || data.news == null || data.news.length == 0 || (timeStamp - data.updated) > 1000 * 600) {
      return getTitles(0);
    }
    var fun = get('rest/news/latest/timestamp');
    var deferred = $q.defer();
    fun().then(function (entry) {
      if (latestTimestamp == entry.timestamp) {
        deferred.resolve(data);
      } else {
        var recent = getTitles();
        recent.then(function (data) {
          deferred.resolve(data);
        });
      }
    });
    return deferred.promise;
  };

  var saveToLocalStorage = function (data) {
    data.updated = new Date().getTime();
    $localStorage.news = data;
  };

  var reset = function () {
    delete $localStorage.news;
  };

  var getTitles = function (from) {
    from = (arguments.length === 1) ? from : 0;
    if (from == 0) {
      var latest = get('rest/news/latest/timestamp');
      latest().then(function (data) {
        $localStorage.newsTimestamp = data.timestamp;
      });
    }
    var fun = get('rest/news/titles/' + from);
    return fun();
  };


  var getById = function (id) {
    var fun = get('rest/news/' + id);
    return fun();
  };

  var handleSuccess = function (response) {
    return response.data;
  };

  var handleError = function (response) {    
    if (!angular.isObject(response.data) || !response.data.message) {
      return $q.reject("An unknown error occurred.");
    }
    // Otherwise, use expected error message.
    return $q.reject(response.data.message);
  };

  // init interface
  return {
    getTitles: getTitles,
    getById: getById,
    init: init,
    saveToLocalStorage: saveToLocalStorage,
    reset: reset
  };

});
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
angular.module('mcc').service('mcc.user',
        ['$localStorage', '$rootScope', '$http',
          'mcc.toasterTranslate',
          function ($localStorage, $rootScope, $http, toasterTranslate) {

            var obj = {};
            obj.autoLogin = function () {
              if ($rootScope.ishttps) {
                $http({method: 'GET',
                  url: 'rest/private/auth'}).
                        success(function (data, status, headers, config) {
                          $rootScope.isLoggedIn = true;
                          $rootScope.user = data.user;
                        }).
                        error(function (data, status, headers, config) {
                          $rootScope.isLoggedIn = false;
                          $rootScope.user = {};
                        });
              }
            }

            obj.login = function (username, password) {
              var data = {
                username: username,
                password: password
              };
              return $http({method: 'POST',
                data: data,
                url: 'rest/private/auth'});
            };

            obj.logout = function () {
              delete $localStorage.user;
              delete $localStorage.isLoggedIn;
              return $http({method: 'GET',
                url: 'rest/private/auth/logout'});
            };

            obj.setLoginData = function (isLoggedIn, data) {
              $rootScope.isLoggedIn = isLoggedIn;
              if (arguments.length == 2 && isLoggedIn) {
                $rootScope.user = data.user;
              } else {
                $rootScope.user = {};
              }
            };

            obj.setToScope = function ($scope) {
              if ($rootScope.isLoggedIn) {
                $scope.user = $rootScope.user;
                $scope.isLoggedIn = true;
              }
              else {
                $scope.isLoggedIn = false;
              }
            }

            return obj;
          }]);


(function (self, $, undefined) {
  // figure editor
  self.figureEditor = function (param) {
    /*
     * PRIVATE
     */
    var that = {
      image: null,
      param: null,
      scale: 1,
      cropPoints: []
    };
    that.param = param;

    var getCanvas = function () {
      if ('canvas' in that.param){
        return that.param.canvas;
      }
      return document.getElementById(that.param.id);
    };
    var getContext = function () {
      return getCanvas().getContext('2d');
    };
    var loader = function () {
      that.img.removeEventListener("load", loader);
      drawImage();
    };
    var drawCropPoints = function () {
      drawImage();
      var context = getContext();
      var canvas = getCanvas();
      for (var k = 0; k < that.cropPoints.length; k++) {
        // vertical
        context.beginPath();
        context.moveTo(that.cropPoints[k].x, 0);
        context.lineTo(that.cropPoints[k].x, canvas.height);
        context.stroke();
        // horizontal
        context.beginPath();
        context.moveTo(0, that.cropPoints[k].y);
        context.lineTo(canvas.width, that.cropPoints[k].y);
        context.stroke();
      }
    };
    var drawImage = function () {
      var canvas = getCanvas();
      var context = getContext();
      var w = that.img.width;
      var h = that.img.height;
      var scaleW = w > that.param.maxWidth ? that.param.maxWidth / w : 1;
      var scaleH = h > that.param.maxHeight ? that.param.maxHeight / h : 1;
      var scale = Math.min(scaleW, scaleH);
      that.scale = scale;
      var newW = Math.round(w * scale);
      var newH = Math.round(h * scale);
      canvas.width = newW;
      canvas.height = newH;
      context.drawImage(that.img, 0, 0, newW, newH);
    };
    /*
     * PUBLIC
     */
    this.drawFullImage = function (file) {
      var reader = new FileReader();
      that.img = new Image();
      that.img.addEventListener("load", loader, false);
      reader.onload = function (evt) {
        that.img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    };
    this.setCropPoint = function (x, y) {
      if (that.cropPoints.length < 2) {
        that.cropPoints.push({x: x, y: y});
      }
      else {
        var dist0 = Math.sqrt(Math.pow(that.cropPoints[0].x - x, 2) + Math.pow(that.cropPoints[0].y - y, 2));
        var dist1 = Math.sqrt(Math.pow(that.cropPoints[1].x - x, 2) + Math.pow(that.cropPoints[1].y - y, 2));
        var replaceInd = dist0 < dist1 ? 0 : 1;
        that.cropPoints[replaceInd] = {x: x, y: y};
      }
      drawCropPoints();
    };
    this.getCropPoints = function () {
      var cropPoints = [];
      for (var k = 0; k < that.cropPoints.length; k++) {
        cropPoints.push({
          x: Math.round(that.cropPoints[k].x / that.scale),
          y: Math.round(that.cropPoints[k].y / that.scale)
        });
      }
      return cropPoints;
    };
  };
}(window.mcc = window.mcc || {}, jQuery));