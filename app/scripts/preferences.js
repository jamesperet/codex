angular
  .module('codexApp', [
    'ui.router',
    'ngSanitize',
    'codexApp.prefs.nav',
    'codexApp.prefs.general',
    'codexApp.prefs.databases'

  ])

  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

    // Configs
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // UI router
    // For any unmatched url, redirect to /state1

    $stateProvider
    .state('general', {
      url: "/",
      templateUrl: 'views/preferences/general.html',
      controller: 'GeneralPrefsCtrl'
    })
    .state('databases', {
      url: "/databases",
      templateUrl: 'views/preferences/databases.html',
      controller: 'DatabasesPrefsCtrl'
    })
    $urlRouterProvider.otherwise("/");


  }]);
