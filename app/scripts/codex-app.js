
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
    'ngSanitize',
    'codexApp.index',
    'codexApp.sidebar',
    'codexApp.note'
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
    .state('index', {
      url: "/",
      templateUrl: 'views/index.html',
      controller: 'AppCtrl'
    })
    .state('note', {
      url: "/notes",
      templateUrl: "views/note.html",
      controller: 'NoteCtrl',
      resolve: {
        pageData: function($stateParams) {
          console.log('resolve ok')
          return 'resolve ok';
        },
      }
    })
    $urlRouterProvider.otherwise("/");


  }]);
