

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */

angular.module('codexApp.prefs.databases', [])
  .controller('DatabasesPrefsCtrl', ['$scope', '$rootScope', '$state', '$location', 'FileService', 'PrefsService', '$timeout', function ($scope,  $rootScope, $state, $location, FileService, PrefsService, $timeout) {

    console.log("-> Preferences/General");
    $scope.notesDir = FileService.getNotesDir();

    $scope.changeDir = function(){
      dialog.showOpenDialog({ defaultPath: FileService.getNotesDir(), properties: ['openDirectory'] }, function (dir) {
        console.log("-> Changin folder location to: " + dir);
        FileService.setNotesDir(dir);
        if(!$scope.$$phase) {
          $scope.$apply(function(){
              $scope.notesDir = dir[0];
          });
        } else {
            $scope.notesDir = dir[0];
        }
      });
    }

  }]);
