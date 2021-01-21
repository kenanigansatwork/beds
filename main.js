/**
 * main.js
 * # beds
 */

const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

// create menu template (an array of objects)
const mainMenuTemplate = [
  {
    label: 'File'
  }
];

// Listen for app to be ready
app.on('ready', function(){
  // create new window
  mainWindow = new BrowserWindow({});
  // load html file into window
  let mainURL = url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  });
  mainWindow.loadURL(mainURL);

  // build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // insert menu
  Menu.setApplicationMenu(mainMenu);
});