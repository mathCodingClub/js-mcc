app.run(['$rootScope', '$FB', '$location', 'mcc.user',
  function ($rootScope, $FB, $location, user) {

    $rootScope.ishttps = $location.protocol() == 'https' || $location.host() == 'localhost';
    $rootScope.isDev = $location.host() == 'localhost';

    user.autoLogin();

    $FB.init('414065895386859');

    $rootScope.$on("$routeChangeStart", function () {
      $rootScope.loading = true;
      var path = $location.path().split('/');
      var active = path[1];
      if (active == undefined || active == '') {
        active = 'home';
      }
      $rootScope.activeArea = active;
      $rootScope.activeAreaSub = path[2];
    });

    $rootScope.$on("$routeChangeSuccess", function () {
      $rootScope.loading = false;
    });

  }]);



