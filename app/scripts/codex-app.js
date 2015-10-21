
/**
 * @ngdoc overview
 * @name domainManagerApp
 * @description
 * # domainManagerApp
 *
 * Main module of the application.
 */
angular
  .module('codexApp', [
    'ui.router',
    'codexApp.index'
  ])

  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

    // Configs
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // UI router
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/");
    $stateProvider
    .state('index', {
      url: "/",
      templateUrl: 'views/index.html',
      controller: 'AppCtrl'
    })


  }]);
