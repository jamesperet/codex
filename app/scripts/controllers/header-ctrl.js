

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.header', [])
  .controller('HeaderCtrl',['$scope', '$rootScope', '$state', function ($scope,  $rootScope, $state) {

    console.log('Header loaded')

    $scope.noteViewBtnClass = "";
    $scope.noteEditBtnClass = "";

    $scope.activateNoteView = function() {
      $rootScope.$broadcast('activate-note-view');
      $state.go("note-view");
      $scope.noteViewBtnClass = "active";
      $scope.noteEditBtnClass = "";
    }

    $scope.activateNoteEdit = function() {
      $rootScope.$broadcast('activate-note-edit');
      $state.go("note-edit");
      $scope.noteViewBtnClass = "";
      $scope.noteEditBtnClass = "active";
    }

    $rootScope.$on('main-window:note-list', function() {
      if(!$scope.$$phase) {
        $scope.$apply(function(){
          $scope.noteViewBtnClass = "";
          $scope.noteEditBtnClass = "";
        });
      } else {
        $scope.noteViewBtnClass = "";
        $scope.noteEditBtnClass = "";
      }
      //console.log($scope.raw_data);
    });

    $rootScope.$on('main-window:note-view', function() {
      if(!$scope.$$phase) {
        $scope.$apply(function(){
          $scope.noteViewBtnClass = "active";
          $scope.noteEditBtnClass = "";
        });
      } else {
        $scope.noteViewBtnClass = "active";
        $scope.noteEditBtnClass = "";
      }
      //console.log($scope.raw_data);
    });

  }]);
