
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
    'ui.ace',
    'codexApp.index',
    'codexApp.header',
    'codexApp.footer',
    'codexApp.sidebar',
    'codexApp.noteView',
    'codexApp.noteEdit',
    'codexApp.imageView',
    'hljs'
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
    .state('note-view', {
      url: "/note-view",
      templateUrl: "views/note-view.html",
      controller: 'NoteViewCtrl',
      resolve: {
        pageData: function($stateParams) {
          //console.log('resolve ok')
          return 'resolve ok';
        },
      }
    })
    .state('note-edit', {
      url: "/note-edit",
      templateUrl: "views/note-edit.html",
      controller: 'NoteEditCtrl'
    })
    .state('image-view', {
      url: "/image-view",
      templateUrl: "views/image-view.html",
      controller: 'ImageViewCtrl'
    })
    $urlRouterProvider.otherwise("/");


  }]);
