

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.noteView', [])
  .controller('NoteViewCtrl',['$scope', '$rootScope', '$state', 'FileService', function ($scope,  $rootScope, $state, FileService) {

    var marked = require('marked');
    var filesystem = require("fs");

    console.log('-> Note View opened!')

    $scope.note = FileService.getCurrentNote();
    $scope.container = "note-container";
    $scope.raw_data = "";


    $scope.loadNoteView = function() {
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
            var r = new RegExp('^(?:[a-z]+:)?//', 'i');
            if(e.srcElement.protocol == "http:"){
              console.log("-> Prevented link from opening: " + e.srcElement.outerHTML.match(/href="([^"]*)/)[1]);
            }
            if(e.srcElement.protocol == "file:"){
              var current_note = FileService.getCurrentNote().path;
              var current_path = current_note.split('/');
              current_path.pop();
              var relative_path = e.srcElement.outerHTML.match(/href="([^"]*)/)[1];
              relative_path = relative_path.split('/');
              var count = 0;
              for (var i = 0; i < relative_path.length; i++) {
                if(relative_path[i] == ".."){
                  count = count + 1;
                  relative_path[i] = "";
                }
              }
              relative_path = relative_path.join('/');
              for (var i = 0; i < count; i++) {
                current_path.pop();
              }
              current_path = current_path.join('/');
              current_path = current_path + relative_path

              var note = FileService.getNote(current_path);
              FileService.setCurrentNote(note);
              $scope.note = note;
              console.log("-> Opening Link: " + note.path)
              $scope.loadNoteView()
            }


        }
        function updateContent() {
            // Do something with `this.responseText`
        }
      });
    }

    $scope.loadNoteView();

    $scope.marked = function(str) {
      if(str != "" && str != undefined) {
        return marked(str);
      } else {
        return str;
      }

    }



  }]);
