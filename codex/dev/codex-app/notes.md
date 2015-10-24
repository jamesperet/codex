# Notes

Links, snipets and references for the Codex App.

## Library Links

* [Isotope](http://isotope.metafizzy.co/) - Filter & sort magical layouts
* [Packery](http://packery.metafizzy.co/) - The bin-packing layout library
* [Mansonary](http://masonry.desandro.com/) - Cascading grid layout library
* [Wavesurfer.js](http://wavesurfer-js.org/) - Web Audio Waveform Visualizer

## List folder and files

In my project I use this function for getting huge amount of files. It's pretty fast (put require("FS") out to make it even faster):

    var _getAllFilesFromFolder = function(dir) {

        var filesystem = require("fs");
        var results = [];

        filesystem.readdirSync(dir).forEach(function(file) {

            file = dir+'/'+file;
            var stat = filesystem.statSync(file);

            if (stat && stat.isDirectory()) {
                results = results.concat(_getAllFilesFromFolder(file))
            } else results.push(file);

        });

        return results;

    };

usage is clear:

    _getAllFilesFromFolder(__dirname + "folder");

## Electron File object

The DOM's File interface provides abstraction around native files in order to let users work on native files directly with the HTML5 file API. Electron has added a path attribute to the File interface which exposes the file's real path on filesystem.

Example on getting a real path from a dragged-onto-the-app file:

    <div id="holder">
      Drag your file here
    </div>

    <script>
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
        return false;
      };
    </script>

## Using Native Node Modules

The most straightforward way to rebuild native modules is via the electron-rebuild package, which handles the manual steps of downloading headers and building native modules:

    npm install --save-dev electron-rebuild

    # Every time you run npm install, run this
    node ./node_modules/.bin/electron-rebuild

## How to read a file in AngularJS?

    .directive("ngFileSelect",function(){    
      return {
        link: function($scope,el){          
          el.bind("change", function(e){          
            $scope.file = (e.srcElement || e.target).files[0];
            $scope.getFile();
          });          
        }        
      }

Working exapmle: http://plnkr.co/edit/y5n16v?p=preview

Thanks to lalalalalmbda for this [link](http://odetocode.com/blogs/scott/archive/2013/07/03/building-a-filereader-service-for-angularjs-the-service.aspx).
