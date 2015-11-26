# Notes

Links, snipets and references for the Codex App.

## Library Links

* [Isotope](http://isotope.metafizzy.co/) - Filter & sort magical layouts
* [Packery](http://packery.metafizzy.co/) - The bin-packing layout library
* [Mansonary](http://masonry.desandro.com/) - Cascading grid layout library
* [Wavesurfer.js](http://wavesurfer-js.org/) - Web Audio Waveform Visualizer
* [Cheerio](https://github.com/cheeriojs/cheerio) - Fast, flexible, and lean implementation of core jQuery designed specifically for the server
* [angular-inview](https://github.com/thenikso/angular-inview) - AngularJS directive to check if a DOM element is in the browser viewport.

## Reading

* [How do Promises Work?](http://robotlolita.me/2015/11/15/how-do-promises-work.html)
* [From Karma to Mocha, with a taste of jsdom](https://medium.com/podio-engineering-blog/from-karma-to-mocha-with-a-taste-of-jsdom-c9c703a06b21#.3gy10vj6i)

## List folder and files

In my project I use this function for getting huge amount of files. It's pretty fast (put require("FS") out to make it even faster):

``` javascript
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
```

usage is clear:

``` javascript
_getAllFilesFromFolder(__dirname + "folder");
```

## Electron File object

The DOM's File interface provides abstraction around native files in order to let users work on native files directly with the HTML5 file API. Electron has added a path attribute to the File interface which exposes the file's real path on filesystem.

Example on getting a real path from a dragged-onto-the-app file:

``` html
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

```

## Using Native Node Modules

The most straightforward way to rebuild native modules is via the electron-rebuild package, which handles the manual steps of downloading headers and building native modules:

``` bash
npm install --save-dev electron-rebuild

# Every time you run npm install, run this
node ./node_modules/.bin/electron-rebuild
```

## How to read a file in AngularJS?

``` javascript
.directive("ngFileSelect",function(){    
return {
  link: function($scope,el){          
    el.bind("change", function(e){          
      $scope.file = (e.srcElement || e.target).files[0];
      $scope.getFile();
    });          
  }        
}
```

Working exapmle: http://plnkr.co/edit/y5n16v?p=preview

Thanks to lalalalalmbda for this [link](http://odetocode.com/blogs/scott/archive/2013/07/03/building-a-filereader-service-for-angularjs-the-service.aspx).
