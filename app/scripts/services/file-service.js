angular.module('codexApp')
.service('FileService', [ '$rootScope', '$http', 'ThumbnailService', '$state', 'PrefsService',  function($rootScope, $http, ThumbnailService, $state , PrefsService) {

  var defaultUserContentPath = "";
  var appDataPath = "";
  var appData = {};
  var notes_dir = "";
  var searched_files = [];
  var recent_file_views = [];
  var default_notes_dir = "/codex/inbox";
  var default_home_note = "/codex/index.md"
  var notes = [];
  var current_note = "";
  var note_history = [];
  var note_history_index = 0;

  var getAppData = function(){
    if(notes_dir === ""){
      var remote = require('remote');
      var app = remote.require('app');
      appDataPath = app.getPath("userData");
      defaultUserContentPath = app.getPath("home") + "/Documents/codex";
      findOrGenerateUserDataFile(appDataPath, defaultUserContentPath);
      var raw_data = fs.readFileSync(appDataPath + '/userData.json', 'utf8');
      var data = JSON.parse(raw_data);
      appData = data;
      notes_dir = appData.UserDataDirectory;
      default_notes_dir = notes_dir + "/inbox";
      default_home_note = notes_dir + "/index.md"
    } else {
      data = appData;
    }
    return data
  }

  var findOrGenerateUserDataFile = function(path, defaultUserContentPath) {
    var generate_settings = true;
    fs = require('fs')
    fs.readdirSync(path).forEach(function(file) {
      if(file == "UserData.json"){
        console.log("-> Loading Settings");
        generate_settings = false;
      }
    });
    if (generate_settings){
      // Generate file
      file_path = path + "/UserData.json";
      console.log("-> Generating user settings file: '" + file_path + "'");
      var content = '{ "UserDataDirectory" : "' + defaultUserContentPath +'", "thumbs" : [] }';
      mkdirSync(defaultUserContentPath);
      console.log(content);
      saveAppData(JSON.parse(content));
      return true;
    }
  }

  var saveAppData = function(data) {
    console.log("-> Saving user data...");
    console.log(data);
    fs.writeFileSync(appDataPath + "/UserData.json", JSON.stringify(data), 'utf8');
    appData = data;
  }

  var mkdirSync = function (path) {
    try {
      fs.mkdirSync(path);
    } catch(e) {
      if ( e.code != 'EEXIST' ) throw e;
    }
  }

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
    if (typeof(extension)==='undefined' || extension == "") extension = 'dir';
    switch (extension) {
      case "pdf":
        return "Document";
      case "jpg":
        return "Image";
      case "png":
        return "Image";
      case "gif":
        return "Image";
      case "jpeg":
        return "Image";
      case "md":
        return "Markdown";
      case 'dir':
        return "Folder";
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

  var getThumbnail = function(file_path) {
    var type = getFileType(file_path);
    var thumbs = appData.thumbs
    //console.log("Thumbs data:")
    //console.log(thumbs)
    switch (type) {
      case "Markdown":
        var thumb = ""
        for (var i=0; i < thumbs.length; i++) {
          if (thumbs[i].file == file_path) {
              thumb = thumbs[i].path;
              break;
          }
        }
        if(thumb == "" || thumb == undefined){
          // [ ] Thumbnail generation queue
          // [ ] Default thumbnail
          console.log("> NO THUMBNAIL FOUND! GENERATING NEW ONE")
          //thumb = saveThumbnail(file_path);
        }
        return thumb
      default:
        return "";
    }
  }

  var saveThumbnail = function(file_path){
    for (var i=0; i < appData.thumbs.length; i++) {
      if (appData.thumbs[i].file === file_path) {
          var fs = require("fs");
          fs.unlink(appData.thumbs[i].path);
          appData.thumbs.splice(i)
          break;
      }
    }
    thumb = ThumbnailService.createNoteThumbnail(file_path, appDataPath);
    obj = { "file" : file_path, "path" : thumb }
    appData.thumbs.push(obj)
    saveAppData(appData)
    console.log("> Saving thumbnail: " + thumb )
    return thumb
  }

  var isValidFile = function(file) {
    if(file != ".DS_Store" && file != "info.json") {
      var parts = file.split('.');
      if (parts[parts.length -2] == "thumb") {
        return false;
      } else {
        return true
      }
    }
  }

  var SetFileInfo = function(jsonData, dir, file_path, stat) {
    //console.log(jsonData.title);
    if (typeof(jsonData)==='undefined') jsonData = {};
    if(jsonData.title != "" && jsonData.title != undefined){
      var title = jsonData.title;
    } else {
      var title = getNameFromPath(file_path);
    }
    if(jsonData.thumbnail != "" && jsonData.thumbnail != undefined){
      var thumbnail_path = jsonData.thumbnail;
    } else {
      var thumbnail_path = getThumbnail(file_path);
    }
    var file_obj = {
      title: title,
      path: file_path,
      size: prettySize(directorySize(dir)),
      type: getFileType(file_path),
      author: jsonData.author,
      index: jsonData.index,
      id: jsonData.id,
      created_at: dateFormat(stat["birthdate"], "mediumDate"),
      modified_at: dateFormat(stat["mtime"], "mediumDate"),
      accessed_at: dateFormat(stat["atime"], "mediumDate"),
      thumbnail: thumbnail_path
    }
    return file_obj;
  }

  var getAllFilesFromFolder = function(dir) {
    if (typeof(dir)==='undefined') dir = notes_dir;
    //console.log("Loading file list for " + dir)
    var results = searchRecentFileViews(dir);
    if(results === undefined){
      results = listAllFilesFromFolder(dir)
      var history = {"dir" : dir, "files" : results }
      recent_file_views.push(history);
      console.log("Saved " + history.files.length + " files...")
    } else {
      console.log("Loading " + results.length + " files...")
    }
    $rootScope.$broadcast('file-service:files-loaded');
    return results;
  };

  var getFilesFromFolder = function(dir) {
    //if (typeof(dir)==='undefined') dir = notes_dir;
    // var results = searchRecentFileViews(dir);
    // if(results === undefined){
    //   results = listFilesFromFolder(dir)
    //   var history = {"dir" : dir, "files" : results }
    //   recent_file_views.push(history);
    //   console.log("Saved " + history.files.length + " files...")
    // } else {
    //   console.log("Loading " + results.length + " files...")
    // }
    results = listFilesFromFolder(dir)
    $rootScope.$broadcast('file-service:files-loaded');
    return results;
  };

  var listAllFilesFromFolder = function(dir){
    var filesystem = require("fs");
    var results = [];
    filesystem.readdirSync(dir).forEach(function(file) {
        file_path = dir+'/'+file;
        var stat = filesystem.statSync(file_path);
        if (stat && stat.isDirectory()) {
            results = results.concat(listAllFilesFromFolder(file_path))
        } else {
          if(isValidFile(file)) {
            var jsonData = {};
            var file_obj = SetFileInfo(jsonData, dir, file_path, stat)
            results.push(file_obj);
          }
        }
    });
    return results;
  }

  var listFilesFromFolder = function(dir){
    var filesystem = require("fs");
    var results = [];
    filesystem.readdirSync(dir).forEach(function(file) {
        file_path = dir+'/'+file;
        var stat = filesystem.statSync(file_path);
        if(isValidFile(file)) {
          var jsonData = {};
          var file_obj = SetFileInfo(jsonData, dir, file_path, stat)
          results.push(file_obj);
        }
    });
    return results;
  }

  var searchRecentFileViews = function(dir){
    for (var i = 0; i < recent_file_views.length; i++) {
      if(recent_file_views[i].dir == dir){
        var files = extend([], recent_file_views[i].files);
        return files
      }
    }
  }


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
    fs.writeFile(file_path, content, 'utf8', function(err) {
        if(err) {
            console.log("-> ERROR SAVING FILE: " + file_path);
            console.log(err);
        } else {
          console.log("-> FILE SAVED: " + file_path);
          saveThumbnail(file_path)
        }
    });
  }

  var getNote = function(file_path){
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

  var getNameFromPath = function(path) {
    path = path.split('/');
    var filename = path[path.length - 1];
    //filename = filename.split('.');
    //filename.pop();
    //name = filename[filename.length -1];
    return filename
  }

  var getUrlParts = function(url) {
      var a = document.createElement('a');
      a.href = url;

      return {
          href: a.href,
          host: a.host,
          hostname: a.hostname,
          port: a.port,
          pathname: a.pathname,
          protocol: a.protocol,
          hash: a.hash,
          search: a.search
      };
  }

  var absoluteToRelativeURL = function(current_url, absolute_url) {
    //console.log(current_url);
    //console.log(absolute_url);
    // split urls and create arrays
    var current_path = current_url.split('/');
    var absolute_path = getUrlParts(absolute_url).pathname.split('/');
    var root_path = getUrlParts(notes_dir).pathname.split('/');
    // remove the current note's filename from the url and the image filename from the url
    //current_path.pop();
    current_path.shift();
    //absolute_path.shift();
    // count how many folders the current path has
    var current_path_count = 0;
    for (var i = 0; i < current_path.length; i++) {
      current_path_count = current_path_count + 1;
    }
    // count how many folders the absolute path has
    var absolute_path_count = 0;
    for (var i = 0; i < absolute_path.length; i++) {
      absolute_path_count = absolute_path_count + 1;
    }
    var root_path_count = 0;
    for (var i = 0; i < root_path.length; i++) {
      root_path_count = root_path_count + 1;
    }
    var count = current_path_count - root_path_count;
    //console.log(current_path_count + " - " + root_path_count + " = " + count);

    //dif = current_path_count - (absolute_path_count -1);
    for (var i = 0; i < count; i++) {
      absolute_path.shift();
    }
    // make the relative path a string again
    var relative_path = absolute_path.join('/');
    //console.log("* Converted relative URL: " + relative_path)
    return relative_path;
  }

  // Absolute to relative URL
  this.absoluteToRelativeURL = function(current_url, absolute_url) {
    return absoluteToRelativeURL(current_url, absolute_url);
  }

  var shortenPath = function(path) {
    //console.log(current_url);
    //console.log(absolute_url);
    // split urls and create arrays
    var current_path = path.split('/');
    var root_path = getUrlParts(notes_dir).pathname.split('/');
    // count how many folders the current path has
    var current_path_count = 0;
    for (var i = 0; i < current_path.length; i++) {
      current_path_count = current_path_count + 1;
    }
    var root_path_count = 0;
    for (var i = 0; i < root_path.length; i++) {
      root_path_count = root_path_count + 1;
    }
    var diff = current_path_count - root_path_count;
    var count = current_path_count - diff;
    console.log(current_path_count + " - " + root_path_count + " = " + count);

    //dif = current_path_count - (absolute_path_count -1);
    for (var i = 0; i < count; i++) {
      current_path.shift();
    }
    // make the relative path a string again
    var relative_path = current_path.join('/');
    console.log("* Shortened Path: " + relative_path)
    return relative_path;
  }

  // Absolute to relative URL
  this.shortenPath = function(path) {
    return shortenPath(path);
  }

  // Get folders

  var getFolders = function(root) {
    if (typeof(root)==='undefined') root = notes_dir;
    var filesystem = require("fs");
    var results = [];
    filesystem.readdirSync(root).forEach(function(file) {
        file_path = root+'/'+file;
        var stat = filesystem.statSync(file_path);
        if (stat && stat.isDirectory()) {
          results.push(SetFileInfo( undefined, root, file_path, stat));
        }
    });
    //console.log(results);
    return results;
  }

  this.getFolders = function(root){
    return getFolders(root);
  }

  // Sort files
  var date_sort_asc = function (date1, date2) {
    if (date1.modified_at > date2.modified_at) return 1;
    if (date1.modified_at < date2.modified_at) return -1;
    return 0;
  };

  var date_sort_desc = function (date1, date2) {
    if (date1.modified_at > date2.modified_at) return -1;
    if (date1.modified_at < date2.modified_at) return 1;
    return 0;
  };

  var filterNotes = function(files) {
    var filtered = [];
    for (var i = 0; i < files.length; i++) {
      if(files[i].type == "Markdown") {
        filtered.push(files[i]);
      }
    }
    return filtered;
  }

  var deleteFile = function(file){
    var fs = require('fs');
    fs.unlinkSync(file);
    console.log('-> Successfully Deleted ' + file);
    return true;
  }

  extend = function(origin, add) {
    // Don't do anything if add isn't an object
    if (!add || typeof add !== 'object') return origin;

    var keys = Object.keys(add);
    var i = keys.length;
    while (i--) {
      origin[keys[i]] = add[keys[i]];
    }
    return origin;
  };



  // RESPONSE
  this.getAllFiles = function(dir) {
    getAppData();
    if (typeof(dir)==='undefined') dir = notes_dir;
    notes = getAllFilesFromFolder(dir);
    return notes.sort(date_sort_asc);
  }

  this.getFiles = function(dir) {
    getAppData();
    if (typeof(dir)==='undefined') dir = notes_dir;
    notes = getFilesFromFolder(dir);
    return notes.sort(date_sort_asc);
  }

  this.getAllNotes = function() {
    getAppData();
    notes = getAllFilesFromFolder();
    notes = filterNotes(notes);
    return notes.sort(date_sort_asc);
  }

  this.getNote = function(path) {
    return getNote(path);
  }

  this.getCurrentNote = function() {
    return current_note;
  }

  this.setCurrentNote = function(note) {
    //console.log("searcing for: " + note_id)
    current_note = note;
    if((note_history.length -1) != note_history_index){
      var dif = note_history.length - note_history_index - 1;
      for (var i = 0; i < dif; i++) {
        note_history.pop();
      }
    }

    note_history.push(current_note);
    note_history_index = note_history.length -1;

    //console.log(current_note);
    //console.log("Current_note: " + current_note.title)
  }

  this.goToPreviousNote = function(){
    if(note_history_index > 0) {
      note_history_index = note_history_index - 1;
      current_note = note_history[note_history_index];
      changeController();
      $rootScope.$broadcast('window-view:change');
      $rootScope.$broadcast('note-view:reload');
    }
    console.log(current_note);
  }

  this.goToNextNote = function(){
    if(note_history_index < (note_history.length - 1)){
      note_history_index = note_history_index + 1;
      current_note = note_history[note_history_index];
      changeController();
      $rootScope.$broadcast('window-view:change');
      $rootScope.$broadcast('note-view:reload');
    }
  }

  this.getLastHistoryView = function(){
    return note_history[note_history.length - 2]
  }

  this.setNotesDir = function(dir) {
    appData.UserDataDirectory = dir[0];
    saveAppData(appData);
    notes_dir = dir[0];
  }

  this.getNotesDir = function() {
    return notes_dir;
  }

  this.getDefaultNotesDir = function() {
    return default_notes_dir;
  }

  this.getDefaultNote = function() {
    return getNote(default_home_note);
  }

  var changeController = function(){
    console.log(current_note)
    if(current_note.search_results){
      searched_files = current_note.search_results;
    }
    switch (current_note.type) {
      case "Markdown":
        $state.go("note-view");
        break;
      case "Folder":
        $state.go("index");
        break;
      case "Notebook":
        $state.go("index");
        break;
      case "Image":
        $state.go("image-view");
        break;
      case "All Notes":
        PrefsService.setCurrentView("All Notes");
        $state.go("index");
        break;
      case "All Files":
        PrefsService.setCurrentView("All Files");
        $state.go("index");
        break;
    }
  }

  this.changeController = function() {
    changeController();
  }

  this.deleteFile = function(file) {
    return deleteFile(file);
  }

  this.getAppDataPath = function() {
    return appDataPath;
  }

  this.saveThumbnail = function(file_path){
    return saveThumbnail(file_path);
  }

  this.setSearchedFiles = function(files){
    searched_files = files;
  }

  this.getSearchFiles = function() {
    return searched_files;
  }

  getAppData();
  console.log("-> Loading content from folder: " + appData.UserDataDirectory);

}])
