

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.noteEdit', [])
  .controller('NoteEditCtrl',['$scope', '$rootScope', '$state', 'FileService', function ($scope,  $rootScope, $state, FileService) {

    console.log('-> Note Editor opened!')

    $scope.note = FileService.getCurrentNote();
    $scope.container = "note-container";
    $scope.raw_data = "";
    $scope.savedBeforeQuit = false;

    $rootScope.$on('window-view:change', function() {
      if($scope.savedBeforeQuit == false) {
        $scope.savedBeforeQuit = true;
        FileService.saveFile($scope.note.path, $scope.raw_data)
      }
    });

    $scope.aceLoaded = function(_editor) {
       _editor.setReadOnly(false);
      //console.log($scope.raw_data);
    };

    $scope.aceChanged = function(e) {
      console.log("-> Note data changed.");
    };

  }]);
