# JS absolute or relative URL

    var r = new RegExp('^(?:[a-z]+:)?//', 'i');
    r.test('http://example.com'); // true - regular http absolute URL
    r.test('HTTP://EXAMPLE.COM'); // true - HTTP upper-case absolute URL
    r.test('https://www.exmaple.com'); // true - secure http absolute URL
    r.test('ftp://example.com/file.txt'); // true - file transfer absolute URL
    r.test('//cdn.example.com/lib.js'); // true - protocol-relative absolute URL
    r.test('/myfolder/test.txt'); // false - relative URL
    r.test('test'); // false - also relative URL