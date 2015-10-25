

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.noteEdit', [])
  .controller('NoteEditCtrl',['$scope', '$rootScope', '$state', 'FileService', function ($scope,  $rootScope, $state, FileService) {

    var marked = require('marked');
    var filesystem = require("fs");

    console.log('Note opened!')

    $scope.note = FileService.getCurrentNote();
    $scope.container = "note-container";
    $scope.raw_data = "";
    $scope.showNoteView = true;
    $scope.showNoteEdit = false;


    filesystem.readFile($scope.note.path, function(err, data) {
      var str = String.fromCharCode.apply(null, data)
      if(!$scope.$$phase) {
        $scope.$apply(function(){
          $scope.note.data = str;
          $scope.raw_data = str
        });
      } else {
          $scope.note.data = str;
          $scope.raw_data = str;
      }
      //console.log($scope.raw_data);
      var a = document.getElementsByTagName('a'), ajax;
      for (var i=0; i<a.length; ++i) {
         a[i].addEventListener('click', handleAnchor, false);
      }
      function handleAnchor(e){
          e.preventDefault();
          if(ajax) ajax.abort();
          ajax = new XMLHttpRequest();
          ajax.onload = updateContent;
          ajax.open("get", this.href, true);
          ajax.send();
          console.log("-> Prevented link from opening: " + e.srcElement.href);
      }
      function updateContent() {
          // Do something with `this.responseText`
      }
    });

    $scope.marked = function(str) {
      return marked(str);
    }

    $rootScope.$on('activate-note-view', function() {
      if(!$scope.$$phase) {
        $scope.$apply(function(){
          $scope.showNoteView = true;
          $scope.showNoteEdit = false;
        });
      } else {
        $scope.showNoteView = true;
        $scope.showNoteEdit = false;
      }
    });

    $rootScope.$on('activate-note-edit', function() {
      if(!$scope.$$phase) {
        $scope.$apply(function(){
          $scope.showNoteView = false;
          $scope.showNoteEdit = true;
        });
      } else {
        $scope.showNoteView = false;
        $scope.showNoteEdit = true;
      }
      //console.log($scope.raw_data);
    });

    $scope.aceLoaded = function(_editor) {
       _editor.setReadOnly(false);
      console.log($scope.raw_data);
    };

    $scope.aceChanged = function(e) {
      console.log("-> Note data changed.");
    };

  }]);
