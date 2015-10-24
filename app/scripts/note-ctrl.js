

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.note', [])
  .controller('NoteCtrl',['$scope', '$rootScope', '$state', 'FileService', function ($scope,  $rootScope, $state, FileService) {

    var marked = require('marked');
    var filesystem = require("fs");

    console.log('Note opened!')

    $scope.note = FileService.getCurrentNote();
    $scope.container = "note-container";



    filesystem.readFile($scope.note.path, function(err, data) {
      var str = String.fromCharCode.apply(null, data);
      if(!$scope.$$phase) {
        $scope.$apply(function(){
          $scope.note.data = marked(str);
        });
      } else {
          $scope.note.data = marked(str);
      }
      //console.log($scope.note);
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

  }]);
