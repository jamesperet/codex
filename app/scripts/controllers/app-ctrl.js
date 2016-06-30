

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.index', [])
  .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$location', 'FileService', 'PrefsService', '$timeout', '$location', '$anchorScroll', function ($scope,  $rootScope, $state, $location, FileService, PrefsService, $timeout, $location, $anchorScroll) {

    var all_files = [];
    var current_page = 0;
    var page_count = 5
    var info_count = 0;
    var loaded = false;
    $scope.files = [];

    $scope.setView = function() {
      $scope.view = PrefsService.getCurrentView()
      //$scope.files = [];
      $timeout(function() {
        switch ($scope.view) {
          case "All Notes":
            var note = { type : "All Notes" }
            FileService.setCurrentNote(note);
            all_files = FileService.getAllNotes();
            info_count = all_files.length;
            var f = [];
            var i = 0;
            for (i = 0; i <= (page_count * 5); i++) {
              if(all_files[i] != undefined){
                f.push(all_files[i])
              } else {
                break;
              }
            }
            $scope.files = f;
            all_files.splice(0, i);
            var info = info_count + " Notes"
            $rootScope.$broadcast('footer:info', info);
            break;
          case "All Files":
            var note = { type : "All Files" }
            FileService.setCurrentNote(note);
            all_files = FileService.getAllFiles();
            info_count = all_files.length;
            var f = [];
            var i = 0;
            for (i = 0; i <= (page_count * 5); i++) {
              if(all_files[i] != undefined){
                f.push(all_files[i])
              } else {
                break;
              }
            }
            $scope.files = f;
            all_files.splice(0, i);
            var info = all_files.length + " Files"
            $rootScope.$broadcast('footer:info', info);
            break;
          case "Notebooks":
            $scope.current_folder = FileService.getNotesDir();
            $scope.files = FileService.getFolders();
            var info = $scope.files.length + " Notebooks"
            $rootScope.$broadcast('footer:info', info);
            break;
          case "Notebook":
            $scope.files = FileService.getFiles(FileService.getCurrentNote().path);
            var info = $scope.files.length + " Items"
            $rootScope.$broadcast('footer:info', info);
            break;
          case "Searched Files":
            $scope.files = FileService.getSearchFiles();
            var info = $scope.files.length + " Items"
            $rootScope.$broadcast('footer:info', info);
            break;
        }
        $location.hash('grid');
        $anchorScroll();
        loaded = true;
        $scope.fader = "fade-in";
      }, 25);
    }

    $scope.setView();

    $rootScope.$on('window-view:change', function(){
      console.log("Changin view...");
      current_page = 1;
      loaded = false;
      $scope.fader = "fade-out";

      var state = FileService.getCurrentNote();
      if(state.type == "All Notes" || state.type == "All Files" || state.type == "Folder"){
        $scope.setView();
      } else {
        $timeout(function() {
          $state.go($state.current, {}, {reload: true});
        }, 200);
      }
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
          FileService.setCurrentNote(file)
          PrefsService.setCurrentView("Notebook");
          $scope.setView();
          break;
        case "Image":
          FileService.setCurrentNote(file)
          $rootScope.$broadcast('main-window:note-view');
          $state.go("image-view");
          break;
        default:
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
      //var html_items = document.getElementsByClassName("file-view-item");
      //var items = [].slice.call(html_items);
      // var items = HTMLNodesToArray('grid', 'li');
      // for (var i = 0; i < items.length; i++) {
      //   items[i].style.margin = "55px";
      //   console.log(item[i]);
      // }
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
      menu.append(new MenuItem({ label: 'Delete', click: function () {
        if(FileService.deleteFile(file.path)){
          var index = $scope.files.indexOf(file);
          if (index > -1) {
            if(!$scope.$$phase) {
              $scope.$apply(function(){
                $scope.files.splice(index, 1);
              });
            } else {
                $scope.files.splice(index, 1);
            }
          }
        };
      } }));
      menu.popup(currentWindow);
    }

    $scope.infiniteScroll = function() {
      if(loaded == true){
        if (FileService.getCurrentNote().type == "All Notes" || FileService.getCurrentNote().type == "All Files"){
          if(all_files.length > 0 && $scope.files.length < info_count){
              current_page = current_page + 1;
              console.log("scrolling")
              var i = 0;
              for (i = 0; i <= page_count; i++) {
                if(all_files[i] != undefined){
                  $scope.files.push(all_files[i])
                } else {
                  break;
                }

              }
              all_files.splice(0, i + 1);
          }
        }
      }
    }

    var HTMLNodesToArray = function (reference, elems) {
        reference = document.getElementById(reference);
        console.log(reference);
        //elems = elems || '*';
        //var nodes = [];
        //var elements = reference.getElementsByClassName(elems);
        var elements = angular.element(document.querySelector( '.file-view-item' ));
        console.log(elements);
        // var i;
        // nodes = Array.prototype.slice.call(elements);
        // console.log( Array.isArray(elements))
        // console.log( Array.isArray(nodes))
        // console.log(nodes)
        // var len = elements.length;
        // console.log(len)
        // for(i = 0; i< len; i += 1) {
        //     var node = elements[i];
        //     nodes.push(node);
        // }
        return elements;
    }

  }]);
