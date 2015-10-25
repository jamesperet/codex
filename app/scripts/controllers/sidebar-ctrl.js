

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.sidebar', [])
  .controller('SidebarCtrl',['$scope', '$rootScope', '$state', function ($scope,  $rootScope, $state) {

    console.log('-> Sidebar loaded')

    $scope.goToAllNotes = function() {
      $rootScope.$broadcast('main-window:note-list');
      $rootScope.$broadcast('window-view:change');
      $state.go("index");
    }

  }]);
