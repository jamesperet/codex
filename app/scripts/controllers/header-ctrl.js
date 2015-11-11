

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.header', [])
  .controller('HeaderCtrl',['$scope', '$rootScope', '$state', 'FileService', function ($scope,  $rootScope, $state, FileService) {

    console.log('-> Header loaded')

    $scope.noteViewBtnClass = "";
    $scope.noteEditBtnClass = "";

    // Create New Note

    $scope.createNewNote = function() {
      dialog.showSaveDialog({ defaultPath: FileService.getDefaultNotesDir(), filters: [ { name: 'markdown', extensions: ['md'] }] }, function (fileName) {
        var fs = require('fs');
        if (fileName === undefined) return;
        fs.writeFile(fileName, "", function (err) {
          console.log("-> CREATE NEW NOTE: " + fileName)
          var note = FileService.getNote(fileName);
          FileService.setCurrentNote(note)
          console.log(note)
          $scope.activateNoteEdit();
        });
      });
    }

    // Toogle sidebar

    $scope.toogleSidebar = function() {
      $rootScope.$broadcast('sidebar:toogle');
    }

    // Go To Home note
    $scope.goToHome = function() {
      $rootScope.$broadcast('window-view:change');
      FileService.setCurrentNote(FileService.getDefaultNote());
      $rootScope.$broadcast('note-view:reload');
      $state.go("note-view");
    }

    // Go to the precious note
    $scope.goBack = function() {
      $rootScope.$broadcast('window-view:change');
      FileService.goToPreviousNote();
      $rootScope.$broadcast('note-view:reload');
      $state.go("note-view");
    }

    // Go to the next note
    $scope.goForward = function() {
      $rootScope.$broadcast('window-view:change');
      FileService.goToNextNote();
      $rootScope.$broadcast('note-view:reload');
      $state.go("note-view");
    }

    // Note View active button

    $scope.activateNoteView = function() {
      $rootScope.$broadcast('window-view:change');
      $state.go("note-view");
      $scope.noteViewBtnClass = "active";
      $scope.noteEditBtnClass = "";
    }

    $scope.activateNoteEdit = function() {
      $rootScope.$broadcast('window-view:change');
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
    });

    $rootScope.$on('main-window:note-edit', function() {
      if(!$scope.$$phase) {
        $scope.$apply(function(){
          $scope.noteViewBtnClass = "";
          $scope.noteEditBtnClass = "active";
        });
      } else {
        $scope.noteViewBtnClass = "";
        $scope.noteEditBtnClass = "active";
      }
    });

  }]);
