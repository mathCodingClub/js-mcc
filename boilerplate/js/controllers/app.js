app.controller('app', ['$rootScope', 'mcc.analytics', '$location', function ($rootScope, analytics, $location) {

  $rootScope.$on("$routeChangeStart", function () {
    analytics.send('pageview', {page: $location.path()});
    $rootScope.loading = true;
  });

  $rootScope.$on("$routeChangeSuccess", function () {
    $rootScope.loading = false;
  });

}]);
