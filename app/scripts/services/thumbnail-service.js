angular.module('codexApp')
.service('ThumbnailService', [ '$rootScope', '$http',  function($rootScope, $http) {

  var createThumbnail = function(file_path, app_data_path) {

    //console.log("-> Creating Thumbnail for " + file_path);
    var webshot = require('webshot');
    var fs      = require('fs');
    var marked = require('marked');

    var options = {
      screenSize: {
        width: 220
      , height: 170
      }
    , shotSize: {
        width: 220
      , height: '170'
      }
    , userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
        + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
    , siteType:'html'
    };

    var data = fs.readFileSync(file_path);
    var page_data = String.fromCharCode.apply(null, data);
    console.log(app_data_path)
    var thumbnail_path = getThumbnailName(file_path, app_data_path);
    var page = '<html><head><style>body {width: 210px;} body, h1, h2, h3, h4, h5, p, span, table, code, ul, ol { font-family: helvetica; overflow-wrap: break-word; font-weight: 300; } p, ul, ol, code { font-size: 11px;} h1 {font-size: 16px;} h2 {font-size: 14px;} h3 { font-size: 12px; font-weight: 400} code { font-family: monospace; }</style></head><body>' + marked(page_data); + '</body></html>';
    var renderStream = webshot(page, thumbnail_path, options, function(err) {
      // screenshot now saved to hello_world.png
    });
    //var file = fs.createWriteStream('google.png', {encoding: 'binary'});



    console.log("-> Created thumbnail " + thumbnail_path);
    return thumbnail_path;
  }

  var getThumbnailName = function(file_path, app_data_path) {
    var filename = file_path.split('\\').pop().split('/').pop();
    var name = filename.split('.');
    //if (lastIndex < 1) return "";
    var path = file_path.split('/');
    path.pop();
    var thumb_path = path.join('/');
    //return thumb_path + "/" + name[0] + ".thumb.png";
    var date = new Date();
    var components = [
        date.getYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    ];

    var id = components.join("");

    return app_data_path + "/thumbs/" + id + ".png"
  }

  var thumbnailExists = function(file_path) {
    var url = getThumbnailName(file_path);
    //console.log(url);
    // var http = new XMLHttpRequest();
    // http.open('HEAD', url, false);
    // http.send();
    // console.log(http.status==200);
    // return http.status==200;
    var fs = require('fs');
    return fs.existsSync(url);
  }

  this.createNoteThumbnail = function(file_path, app_data_path) {
    if(thumbnailExists(file_path) == false){
      return createThumbnail(file_path, app_data_path);
    }
    return getThumbnailName(file_path);
  }



}])
