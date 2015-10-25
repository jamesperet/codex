angular.module('codexApp')
.service('FileService', [ '$rootScope', '$http',  function($rootScope, $http) {

  var notes_dir = "/Users/james/dev/codex/codex";
  var default_notes_dir = "/Users/james/dev/codex/codex/inbox";
  var notes = [];
  var current_note = "";

  var prettySize = function(bytes) {
    if (bytes <= 1024) {
      return bytes + " KB"
    } else {
      var megabytes = parseFloat(Math.round(bytes/1024 * 100) / 100).toFixed(0);
      return megabytes + " MB"
    }
  }

  var getFilePathExtension = function(path) {
    var filename = path.split('\\').pop().split('/').pop();
    var lastIndex = filename.lastIndexOf(".");
    if (lastIndex < 1) return "";
    return filename.substr(lastIndex + 1);
  }

  var getFileType = function(path) {
    var extension = getFilePathExtension(path);
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

  var directorySize = function(dir) {
    var filesystem = require("fs");
    var size = 0;
    var results = [];
    filesystem.readdirSync(dir).forEach(function(file) {
        file_path = dir+'/'+file;
        var stat = filesystem.statSync(file_path);
        if (stat && stat.isDirectory()) {
            results = results.concat(directorySize(file_path))
        } else {
          if(file != ".DS_Store") {
            size = size + stat["size"];
            //console.log("* " + stat["size"] + " KB -> " + file_path)
          }
        }
    });
    return size;
  }

  var noteCount = function(){
    var count = $scope.notes.length
    switch (count) {
      case 0:
        return '0 notes';
      case 1:
        return '1 note';
      default:
        return count + ' notes';
    }
  }

  var SetFileInfo = function(jsonData, dir, file_path, stat) {
    //console.log(jsonData.title);
    if (typeof(jsonData)==='undefined') jsonData = {};
    var file_obj = {
      title: jsonData.title,
      path: file_path,
      size: prettySize(directorySize(dir)),
      type: getFileType(file_path),
      author: jsonData.author,
      index: jsonData.index,
      id: jsonData.id,
      created_at: dateFormat(stat["birthdate"], "mediumDate"),
      modified_at: dateFormat(stat["mtime"], "mediumDate"),
      accessed_at: dateFormat(stat["atime"], "mediumDate")
    }
    return file_obj;
  }

  var getNotesFromFolders = function(dir) {
    if (typeof(dir)==='undefined') dir = notes_dir;
    var filesystem = require("fs");
    filesystem.readdirSync(dir).forEach(function(file) {

        file_path = dir+'/'+file;
        var stat = filesystem.statSync(file_path);
        if (stat && stat.isDirectory()) {
            notes = notes.concat(getNotesFromFolders(file_path))
        } else {
          if(file == "info.json"){
            filesystem.readFile(file_path, function(err, data) {
              var jsonData = JSON.parse(data);
              var file_obj = SetFileInfo(jsonData, dir, file_path, stat)
              notes.push(file_obj);
            });
          }
        }
    });
    return notes;
  };

  this.getNotesFromFolders = getNotesFromFolders;

  var getAllFilesFromFolder = function(dir) {
    if (typeof(dir)==='undefined') dir = notes_dir;
    var filesystem = require("fs");
    var results = [];
    filesystem.readdirSync(dir).forEach(function(file) {

        file_path = dir+'/'+file;
        var stat = filesystem.statSync(file_path);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFilesFromFolder(file_path))
        } else {
          if(file != ".DS_Store" && file != "info.json") {
            var jsonData = {};
            var file_obj = SetFileInfo(jsonData, dir, file_path, stat)
            results.push(file_obj);
          }
        }

        //console.log(file_obj);
    });
    return results;
  };

  var findNoteInFolder = function(note_id, dir) {
    if (typeof(dir)==='undefined') dir = notes_dir;
    var filesystem = require("fs");
    var results = [];
    filesystem.readdirSync(dir).forEach(function(file) {
        file_path = dir+'/'+file;
        var stat = filesystem.statSync(file_path);
        if (stat && stat.isDirectory()) {
            results = results.concat(findNoteInFolder(note_id, file_path))
        } else {
          if(file == "info.json"){
            filesystem.readFile(file_path, function(err, data) {
              var jsonData = JSON.parse(data);
              console.log(jsonData.id)
              if(jsonData.id == note_id){
                var file_obj = SetFileInfo(jsonData, dir, file_path, stat)
                results.push(file_obj);
              }
            });
          }
        }
    });
    console.log(results);
    return results[0];
  };

  this.saveFile = function(file_path, content){
    var fs = require('fs');
    fs.writeFile(file_path, content, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("-> FILE SAVED: " + file_path);
    });
  }

  this.getNote = function(file_path){
    var filesystem = require("fs");
    var stat = filesystem.statSync(file_path);
    var file_obj = {
      title: "",
      path: file_path,
      size: stat['size'],
      type: getFileType(file_path),
      author: "",
      index: "",
      id: "",
      created_at: dateFormat(stat["birthdate"], "mediumDate"),
      modified_at: dateFormat(stat["mtime"], "mediumDate"),
      accessed_at: dateFormat(stat["atime"], "mediumDate")
    }
    return file_obj
  }


  // RESPONSE
  this.getNotes = function() {
    notes = [];
    return getAllFilesFromFolder();
  }

  this.getCurrentNote = function() {
    return current_note;
  }

  this.setCurrentNote = function(note) {
    //console.log("searcing for: " + note_id)
    current_note = note;
    //console.log(current_note);
    //console.log("Current_note: " + current_note.title)
  }

  this.getDefaultNotesDir = function() {
    return default_notes_dir;
  }

}])
