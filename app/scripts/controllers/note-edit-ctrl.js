

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.noteEdit', [])
  .controller('NoteEditCtrl',['$scope', '$rootScope', '$state', '$timeout', 'FileService', function ($scope,  $rootScope, $state, $timeout, FileService) {

    $scope.note = FileService.getCurrentNote();
    console.log('-> Editing File: ' + $scope.note.path)
    $scope.savedBeforeQuit = false;

    $rootScope.$on('window-view:change', function() {
      if($scope.raw_data != "" && $scope.raw_data != undefined) {
        if($scope.savedBeforeQuit == false) {
          $scope.savedBeforeQuit = true;
          FileService.saveFile($scope.note.path, $scope.raw_data)
        }
      }

    });

    $scope.loadFile = function() {
      var fs = require('fs');
      fs.readFile($scope.note.path, function(err, data) {
        $scope.note.data = new Buffer(data).toString('utf8')
        if(!$scope.$$phase) {
          $scope.$apply(function(){
            $scope.raw_data = $scope.note.data;
          });
        } else {
            $scope.raw_data = $scope.note.data;
        }
      });
      console.log($scope.raw_data);
    }

    if($scope.note.data != undefined || $scope.note.data != ""){
      $scope.loadFile();
    } else {
      $scope.raw_data = $scope.note.data;
    }

    $scope.aceLoaded = function(_editor) {
       _editor.setReadOnly(false);
      //console.log($scope.raw_data);
    };

    $scope.aceChanged = function(e) {
      //console.log("-> Note data changed.");
    };

  }]);
