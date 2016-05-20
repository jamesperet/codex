angular.module('codexApp')
.service('SearchService', [ '$rootScope', '$http', 'ThumbnailService', '$state', 'FileService',  function($rootScope, $http, ThumbnailService, $state, FileService) {

  var fs = require('fs');

  var fulltextsearchlight = require('full-text-search-light');
  var search = new fulltextsearchlight();
  var appDataPath = FileService.getAppDataPath();

  this.init = function() {
    // Load db
    fulltextsearchlight.load(appDataPath + '/search.json', function(error, search_loaded){
      if(error){
        console.log("> SEARCH DB NOT FOUND!")
        console.log(error)
        search.save(appDataPath + '/search.json', function(error){
          console.log("> CREATING SEARCH DB")
          buildSearchDB();
          console.log("> NEW SEARCH DB CREATED")
        });
      }
      else {
        search = search_loaded
        console.log("> SEARCH DB LOADED");
      }
    });
  }

  this.search = function(search_text) {
    var results = search.search(search_text)
    console.log("> FOUND " + results.length + " RESULTS");
    return results
  }

  var buildSearchDB = function() {
    var parsed_files = []
    var all_files = FileService.getAllFiles();
    for (var i = 0; i < all_files.length; i++) {
      file = all_files[i]
      var file_data = {
        path: file.path,
        title: file.title,
        type: file.type
      }
      if(file.type == "Markdown"){
        var raw_data = fs.readFileSync(file.path, 'utf8');
        var data = new Buffer(raw_data).toString('utf8')
        console.log(file);
        file_data.content = data;
        file_data.thumbnail = file.thumbnail;
      }
      parsed_files.push(file_data);
    }
    for (var i = 0; i < parsed_files.length; i++) {
      console.log(parsed_files[i].title);
      search.add(parsed_files[i]);
    }
    search.save(appDataPath + '/search.json', function(error){
      console.log("> SEARCH DB SAVED")
    });
  }

}])
