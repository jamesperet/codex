

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.index', [])
  .controller('AppCtrl',['$scope', '$rootScope', function ($scope,  $rootScope) {



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

    var marked = require('marked');
    console.log(marked('I am using __markdown__.'));


    $scope.prettySize = function(bytes) {
      if (bytes <= 1024) {
        return bytes + " KB"
      } else {
        var megabytes = parseFloat(Math.round(bytes/1024 * 100) / 100).toFixed(0);
        return megabytes + " MB"
      }
    }

    $scope.getFilePathExtension = function(path) {
    	var filename = path.split('\\').pop().split('/').pop();
    	var lastIndex = filename.lastIndexOf(".");
    	if (lastIndex < 1) return "";
    	return filename.substr(lastIndex + 1);
    }

    $scope.getFileType = function(path) {
      var extension = $scope.getFilePathExtension(path);
      console.log(extension)
      switch (extension) {
        case "pdf":
          return "Document";
        case "jpg":
          return "Image";
        case "png":
          return "Image";
        case "md":
          return "Markdown";
        default:
          return "File";
      }
    }

    var _getAllFilesFromFolder = function(dir) {
      var filesystem = require("fs");
      var results = [];
      filesystem.readdirSync(dir).forEach(function(file) {

          file_path = dir+'/'+file;
          var stat = filesystem.statSync(file_path);
          if (stat && stat.isDirectory()) {
              results = results.concat(_getAllFilesFromFolder(file_path))
          } else {
            var file_obj = {
              name: file,
              path: file_path,
              size: $scope.prettySize(stat["size"]),
              type: $scope.getFileType(file_path),
              created_at: dateFormat(stat["birthdate"], "mediumDate"),
              modified_at: dateFormat(stat["mtime"], "mediumDate"),
              accessed_at: dateFormat(stat["atime"], "mediumDate")
            }
            results.push(file_obj);
          }

          console.log(file_obj);
      });
      return results;
    };

    //console.log(_getAllFilesFromFolder("/Users/james/dev/codex/codex"));
    $scope.files = _getAllFilesFromFolder("/Users/james/dev/codex/codex");


  }]);
