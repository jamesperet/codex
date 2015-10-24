

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.index', [])
  .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$location', 'FileService', function ($scope,  $rootScope, $state, $location, FileService) {

    $scope.files = FileService.getNotes();


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





    $scope.openNote = function(note){
      //console.log($location.path());
      console.log("openning note " + note.title + " (" + note.id + ")");
      FileService.setCurrentNote(note)
      $state.go("note");
      //$location.path('/notes/' + 'test1')
      //console.log($location.path());
    }

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

  }]);
