

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.index', [])
  .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$location', 'FileService', 'PrefsService', '$timeout', function ($scope,  $rootScope, $state, $location, FileService, PrefsService, $timeout) {

    $scope.setView = function() {
      $scope.view = PrefsService.getCurrentView();
      $scope.files = [];
      $timeout(function() {
        switch ($scope.view) {
          case "All Notes":
            $scope.files = FileService.getAllNotes();
            var info = $scope.files.length + " Notes"
            $rootScope.$broadcast('footer:info', info);
            break;
          case "All Files":
            $scope.files = FileService.getAllFiles();
            var info = $scope.files.length + " Files"
            $rootScope.$broadcast('footer:info', info);
            break;
          case "Notebooks":
            $scope.current_folder = FileService.getNotesDir();
            $scope.files = FileService.getFolders();
            var info = $scope.files.length + " Notebooks"
            $rootScope.$broadcast('footer:info', info);
            break;
          case "Notebook":
            $scope.files = FileService.getFiles($scope.current_folder);
            var info = $scope.files.length + " Items"
            $rootScope.$broadcast('footer:info', info);
            break;
        }
      }, 1);
    }

    $scope.setView();

    $rootScope.$on('window-view:change', function(){
      $scope.setView();
    });

    var remote = require('remote')

    $scope.openFile = function(file){
      console.log("-> Openning " + file.type + " link: " + file.path);
      switch (file.type) {
        case "Markdown":
          FileService.setCurrentNote(file)
          $rootScope.$broadcast('main-window:note-view');
          $state.go("note-view");
          break;
        case "Folder":
          $scope.current_folder = file.path;
          PrefsService.setCurrentView("Notebook");
          $scope.setView();
          break;
      }
    }

    $scope.editFile = function(file){
      console.log("-> Editing " + file.type + " link: " + file.path);
      switch (file.type) {
        case "Markdown":
          FileService.setCurrentNote(file)
          $rootScope.$broadcast('main-window:note-edit');
          $state.go("note-edit");
          break;
      }
    }

    $rootScope.$on('file-service:files-loaded', function(){
      if(!$scope.$$phase) {
          $scope.$apply(function(){
            //$scope.itemSpacing();
          });
        } else {
            //$scope.itemSpacing();
        }
    })

    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
        console.log(unfoundState.to); // "lazy.state"
        console.log(unfoundState.toParams); // {a:1, b:2}
        console.log(unfoundState.options); // {inherit:false} + default options
    })

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
      console.log('Change state error'); // "lazy.state"
      console.log(error)
      console.log(toState)
      console.log(toParams)
      console.log(fromState)
      console.log(fromParams)
    })

    $scope.itemSpacing = function(){
      var items = document.getElementsByClassName("file-view-item");
      for (var i = 0; i < items.length; i++) {
        items[i].style.margin = "15px";
      }
    }

    $scope.isImage = function(file_type) {
      if(file_type != 'Image') { return true; }
      else { return false; }
    }

    $scope.getImageURL = function(img_url) {
      return "" + FileService.absoluteToRelativeURL(FileService.getNotesDir(), img_url)
    }

    $scope.shortenPath = function(path) {
      if($scope.current_folder != null) {
        return FileService.shortenPath(path);
      } else {
        return "";
      }
    }

    var Menu = remote.require('menu');
    var MenuItem = remote.require('menu-item');
    var currentWindow = remote.getCurrentWindow();
    var clipboard = require('clipboard');

    $scope.fileContextMenu = function (file) {
      var menu = new Menu();
      menu.append(new MenuItem({ label: 'Open File', click: function () {
        $scope.openFile(file);
      } }));
      menu.append(new MenuItem({ label: 'Edit File', click: function () {
        $scope.editFile(file);
      } }));
      menu.append(new MenuItem({ label: 'Copy File URL', click: function () {
        var url = file.path;
        console.log("-> Copying URL to clipboard " + url);
        clipboard.writeText(url);
      } }));
      menu.popup(currentWindow);
    }
  }]);
