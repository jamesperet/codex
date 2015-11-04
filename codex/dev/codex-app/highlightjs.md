# How to use highlight.js

## Getting Started

The bare minimum for using highlight.js on a web page is linking to the library along with one of the styles and calling initHighlightingOnLoad:

```
<link rel="stylesheet" href="/path/to/styles/default.css">
<script src="/path/to/highlight.pack.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
```

This will find and highlight code inside of ```<pre><code>``` tags; it tries to detect the language automatically. If automatic detection doesn't work for you, you can specify the language in the class attribute:

```
<pre><code class="html">...</code></pre>
```

The list of supported language classes is available in the class reference. Classes can also be prefixed with either language- or lang-.

To disable highlighting altogether use the nohighlight class:

```
<pre><code class="nohighlight">...</code></pre>
```

### Custom Initialization

When you need a bit more control over the initialization of highlight.js, you can use the highlightBlock and configure functions. This allows you to control what to highlight and when.

Here's an equivalent way to calling initHighlightingOnLoad using jQuery:

```
$(document).ready(function() {
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});
```

You can use any tags instead of <pre><code> to mark up your code. If you don't use a container that preserve line breaks you will need to configure highlight.js to use the <br> tag:

```
hljs.configure({useBR: true});

$('div.code').each(function(i, block) {
  hljs.highlightBlock(block);
});
```

For other options refer to the documentation for configure.

## Getting the Library

You can get highlight.js as a hosted, or custom-build, browser script or as a server module. Right out of the box the browser script supports both AMD and CommonJS, so if you wish you can use RequireJS or Browserify without having to build from source. The server module also works perfectly fine with Browserify, but there is the option to use a build specific to browsers rather than something meant for a server. Head over to the download page for all the options.

Note: the library is not supposed to work straight from the source on GitHub; it requires building. If none of the pre-packaged options work for you refer to the building documentation.

#### Hosted

A prebuilt version of highlight.js with 22 commonly used languages is hosted by following CDNs:

##### cdnjs

```
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.9.1/styles/default.min.css">
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.9.1/highlight.min.js"></script>
```

##### jsdelivr

```
<link rel="stylesheet" href="//cdn.jsdelivr.net/highlight.js/8.9.1/styles/default.min.css">
<script src="//cdn.jsdelivr.net/highlight.js/8.9.1/highlight.min.js"></script>
```

You can find the list of commonly used languages below in the custom download form.

For other available styles look into the highlight.js styles directory (and don't forget to add ".min" before ".css").

#### Custom package

You can download a custom bundle including only the languages you need [here](https://highlightjs.org/download/).

#### Node.js

Highlight.js can be used on the server through the API. The package with all supported languages is installable from NPM:

```
npm install highlight.js
```

Alternatively, you can build it from the source:

```
node tools/build.js -t node
```

#### Source

Current source is available on GitHub

## License

Highlight.js is released under the BSD License. See LICENSE file for details.

## Links

The official site for the library is at [https://highlightjs.org/](https://highlightjs.org/).

Further in-depth documentation for the API and other topics is at [http://highlightjs.readthedocs.org/](http://highlightjs.readthedocs.org/).

Authors and contributors are listed in the AUTHORS.en.txt file.