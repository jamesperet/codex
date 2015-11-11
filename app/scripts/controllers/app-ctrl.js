

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.index', [])
  .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$location', 'FileService', 'PrefsService', function ($scope,  $rootScope, $state, $location, FileService, PrefsService) {

    $scope.setView = function() {
      $scope.view = PrefsService.getCurrentView();
      switch ($scope.view) {
        case "All Notes":
          $scope.files = FileService.getAllNotes();
          break;
        case "All Files":
          $scope.files = FileService.getAllFiles();
          break;
        case "Notebooks":
          $scope.current_folder = FileService.getNotesDir();
          $scope.files = FileService.getFolders();
          break;
        case "Notebook":
          $scope.files = FileService.getFiles($scope.current_folder);
          break;
      }
    }

    $scope.setView();

    $rootScope.$on('window-view:change', function(){
      $scope.setView();
    });

    var remote = require('remote')
    var Menu = remote.require('menu')
    var MenuItem = remote.require('menu-item')

    // Build our new menu
    var menu = new Menu()
    menu.append(new MenuItem({
      label: "append",
      click: function() {
        // Trigger an alert when menu item is clicked
        alert('Deleted')
      }
    }))
    menu.append(new MenuItem({
      label: 'More Info...',
      click: function() {
        // Trigger an alert when menu item is clicked
        alert('Here is more information')
      }
    }))

    // Add the listener
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelector('.js-context-menu').addEventListener('click', function (event) {
        menu.popup(remote.getCurrentWindow());
      })
    })




    var holder = document.getElementById('holder');
    holder.ondragover = function () {
      return false;
    };
    holder.ondragleave = holder.ondragend = function () {
      return false;
    };
    holder.ondrop = function (e) {
      e.preventDefault();
      var file = e.dataTransfer.files[0];
      console.log('File you dragged here is', file.path);
      document.getElementById('image-container').src = file.path
      return false;
    };

    $scope.openFile = function(file){
      console.log("openning " + file.type + " link: " + file.path);
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

  }]);
