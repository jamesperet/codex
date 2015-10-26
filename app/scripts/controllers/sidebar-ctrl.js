

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

    $scope.showSidebar = true;

    $scope.goToAllNotes = function() {
      $rootScope.$broadcast('main-window:note-list');
      $rootScope.$broadcast('window-view:change');
      $state.go("index");
    }

    $rootScope.$on('sidebar:toogle', function() {
      if(!$scope.$$phase) {
        $scope.$apply(function(){
          $scope.toogleSidebar();
        });
      } else {
        $scope.toogleSidebar();
      }
    });

    $scope.toogleSidebar = function() {
      if( $scope.showSidebar == true){
        $scope.showSidebar = false;
      } else {
        $scope.showSidebar = true;
      }
    }

  }]);
