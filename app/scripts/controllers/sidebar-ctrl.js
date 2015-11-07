

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.sidebar', [])
  .controller('SidebarCtrl',['$scope', '$rootScope', '$state', 'PrefsService', function ($scope,  $rootScope, $state, PrefsService) {

    console.log('-> Sidebar loaded')

    $scope.showSidebar = true;

    $scope.goToAllNotes = function() {
      PrefsService.setCurrentView("All Notes");
      $scope.activateSidebarBtn(0);
      $rootScope.$broadcast('main-window:note-list');
      $rootScope.$broadcast('window-view:change');
      $state.go("index");
    }

    $scope.goToAllFiles = function() {
      PrefsService.setCurrentView("All Files");
      $scope.activateSidebarBtn(1);
      $rootScope.$broadcast('main-window:file-list');
      $rootScope.$broadcast('window-view:change');
      $state.go("index");
    }

    $scope.goToNotebooks = function() {
      PrefsService.setCurrentView("Notebooks");
      $scope.activateSidebarBtn(2);
      $rootScope.$broadcast('main-window:file-list');
      $rootScope.$broadcast('window-view:change');
      $state.go("index");
    }

    $rootScope.$on('main-window:note-view', function(){
      $scope.activateSidebarBtn();
    });

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

    $scope.sidebar = [
      {
        "view" : "All Notes",
        "active" : "active"
      },
      {
        "view" : "All Files",
        "active" : ""
      },
      {
        "view" : "Notebooks",
        "active" : ""
      }
    ]

    $scope.activateSidebarBtn = function(num) {
      if(!$scope.$$phase) {
        $scope.$apply(function(){
          for (var i = 0; i < $scope.sidebar.length; i++) {
            $scope.sidebar[i].active = "";
          }
          $scope.sidebar[num].active = "active";
        });
      } else {
        for (var i = 0; i < $scope.sidebar.length; i++) {
          $scope.sidebar[i].active = "";
        }
        if (typeof(num)==='undefined') return;
        $scope.sidebar[num].active = "active";
      }
    }

  }]);
