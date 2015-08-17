app.config(['$routeProvider',
  '$locationProvider',
  '$translateProvider',
  'dialogsProvider',
  '$sceDelegateProvider',
  function($routeProvider, $locationProvider, $translateProvider, dialogsProvider, $sceDelegateProvider) {

    $locationProvider.html5Mode(true);

    for (var i = 0; i < CONFIG.nav.length; i++) {
      mcc.route.add('/', CONFIG.nav[i], $routeProvider);
    }

    // default language
    $translateProvider.useUrlLoader('rest/dict/json');
    $translateProvider.preferredLanguage('gb-EN');

    // set dialogs
    dialogsProvider.useBackdrop('static');
    dialogsProvider.useEscClose(true);
    dialogsProvider.useCopy(false);
    dialogsProvider.setSize('sm');

    // whitelist videos from external services
    $sceDelegateProvider.resourceUrlWhitelist([      
      'self',            
      'https://*.cdninstagram.com/**'
    ]);

  }]);