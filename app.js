var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var preferencesWindow = null;

var createMainWindow = function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1030,
    height: 700,
    'min-width': 500,
    'min-height': 200,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden',
    'fullscreen' : true
  });

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

  // Open the DevTools.
  //mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

var createPreferencesWindow = function() {
  if(preferencesWindow === null){
    preferencesWindow = new BrowserWindow({
      width: 500,
      height: 300,
      show: true,
      resizable: false,
      'title-bar-style': 'hidden',
      'fullscreen' : false
    });
    preferencesWindow.loadUrl('file://' + __dirname + '/app/preferences-window.html');
    preferencesWindow.on('closed', function() {
      preferencesWindow = null;
    });
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  createMainWindow();
  //createPreferencesWindow();
  ipc.on('show-preferences-window', function() {
      createPreferencesWindow();
  });
});
