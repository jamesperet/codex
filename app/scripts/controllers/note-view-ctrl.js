

/**
 * @ngdoc function
 * @name domainManagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the domainManagerApp
 */
angular.module('codexApp.noteView', [])
  .controller('NoteViewCtrl',['$scope', '$rootScope', '$state', 'FileService', function ($scope,  $rootScope, $state, FileService) {

    var marked = require('marked');

    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: true,
      sanitize: false,
      smartLists: true,
      smartypants: true
    });
    var filesystem = require("fs");

    console.log('-> Note View opened!')

    $scope.note = FileService.getCurrentNote();
    $scope.container = "note-container";
    $scope.html_data = "";


    $scope.loadNoteView = function() {
      filesystem.readFile($scope.note.path, function(err, data) {
        //$scope.note.data = String.fromCharCode.apply(null, data);
        $scope.note.data = new Buffer(data).toString('utf8')
        if(!$scope.$$phase) {
          $scope.$apply(function(){
            $scope.html_data = marked($scope.note.data);
          });
        } else {
            $scope.html_data = marked($scope.note.data);
        }

        //console.log($scope.raw_data);
        $scope.fixImgURLs($scope.note.path, $scope.html_data);
        var a = document.getElementsByTagName('a'), ajax;
        for (var i=0; i<a.length; ++i) {
           a[i].addEventListener('click', handleAnchor, false);
        }

        // Syntax Highlight
        code = document.getElementsByTagName("code");
        for (var i = 0; i < code.length; i++) {
          hljs.highlightBlock(code[i]);
        }
        function handleAnchor(e){
            e.preventDefault();
            var r = new RegExp('^(?:[a-z]+:)?//', 'i');
            if(e.srcElement.protocol == "http:"){
              console.log("-> Prevented link from opening: " + e.srcElement.outerHTML.match(/href="([^"]*)/)[1]);
              var open = require("open");
              open(e.srcElement.outerHTML.match(/href="([^"]*)/)[1]);
            }
            if(e.srcElement.protocol == "file:"){
              var url = e.srcElement.outerHTML.match(/href="([^"]*)/)[1];
              //url = FileService.getNotesDir() + "/" + url;
              url = $scope.fixRelativeURL($scope.note.path, url)
              var note = FileService.getNote(url);
              FileService.setCurrentNote(note);
              $scope.note = note;
              console.log("-> Opening Link: " + note.path)
              $scope.loadNoteView();
            }
        }
        function updateContent() {
            // Do something with `this.responseText`
        }
      });
    }

    $scope.loadNoteView();

    $rootScope.$on('note-view:reload', function() {
      $scope.note = FileService.getCurrentNote();
      $scope.html_data = "";
      $scope.loadNoteView();
    });

    $scope.fixImgURLs = function(current_note_path, html){
      // var images = html.getElementsByTagName('img');
      // var srcList = [];
      // for(var i = 0; i < images.length; i++) {
      //     console.log(images[i]);
      //     images[i].src = $scope.fixRelativeURL(current_note_path, images[i].src);
      // }
      // page = angular.element(html);
      // console.log(page.find("img"))
      // page.find("img").each(function() {
      //   var obj = angular.element(this);
      //   console.log(page)
      //   console.log(obj)
      //   obj.attr('src') =  $scope.fixRelativeURL(current_note_path, obj.attr('src'));
      //   console.log(obj.attr('src'));
      // });

      var imgs = angular.element(html).find("img");
      var img_urls = []
      for (var i = 0; i < imgs.length; i++) {
        img_urls.push($scope.fixRelativeURL(current_note_path, $scope.absoluteToRelativeURL(current_note_path, imgs[i].src)));
      }
      var page_images = document.getElementsByTagName('img');
      console.log("-> Changing "+ img_urls.length + " images")
      for(var i = 0; i < img_urls.length; i++) {
          console.log(page_images[i]);
          page_images[i].src = img_urls[i];

      }
    }

    $scope.fixRelativeURL = function(current_url, relative_url) {
      console.log("-> Fixing URL")
      console.log("   * Relative URL: " + relative_url)
      console.log("   * Note URL: " + current_url)
      // split urls and create arrays
      var current_path = current_url.split('/');
      var relative_path = relative_url.split('/');
      // remove the current note's filename from the url
      current_path.pop();
      // count how many folders the relative path goes back and erase '..'
      var count = 0;
      for (var i = 0; i < relative_path.length; i++) {
        if(relative_path[i] == ".."){
          count = count + 1;
          relative_path[i] = "";
        }
      }
      // make the relative path a string again
      relative_path = relative_path.join('/');
      // remove the same count of folders from the end of the current notes url
      for (var i = 0; i < count; i++) {
        current_path.pop();
      }
      // make the current note's url a string again
      current_path = current_path.join('/');
      // add a '/' if the relative url pointed to a file or folder above the current notes root
      if(count == 0){
        var fixed_url = current_path + "/" + relative_path;
      } else {
        var fixed_url = current_path + relative_path;
      }
      // return the fixed relative url
      console.log("   * Fixed URL: " + fixed_url)
      return fixed_url;
    }



    $scope.absoluteToRelativeURL = function(current_url, absolute_url) {
      console.log("-> Converting absolute URL to relative")
      console.log("   * Absolute URL: " + absolute_url)
      console.log("   * Note URL: " + current_url)
      // split urls and create arrays
      var current_path = current_url.split('/');
      var absolute_path = $scope.getUrlParts(absolute_url).pathname.split('/');
      // remove the current note's filename from the url and the image filename from the url
      current_path.pop();
      current_path.shift();
      absolute_path.shift();
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
      absolute_path_count = absolute_path_count - 1;
      console.log("   * Cleaned current  URL (" + current_path_count + " parts): " + current_path.join('/'))
      console.log("   * Cleaned absolute URL (" + absolute_path_count + " parts): " + absolute_path.join('/'))
      dif = current_path_count - (absolute_path_count -1);
      for (var i = 0; i < absolute_path_count; i++) {
        absolute_path.shift();
      }
      console.log("   * Modified current  URL (" + current_path_count + " parts): " + current_path.join('/'))
      console.log("   * Modified absolute URL (" + absolute_path_count + " parts): " + absolute_path.join('/'))
      // make the relative path a string again
      var relative_path = absolute_path.join('/');
      console.log("   * Converted relative URL: " + relative_path)
      return relative_path;
    }



    $scope.getUrlParts = function(url) {
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

  }]);
