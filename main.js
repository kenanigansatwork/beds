/**
 * main.js
 * # beds
 */

const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow,
    addWindow;

// Listen for app to be ready
app.on('ready', function(){
  // create new window
  mainWindow = new BrowserWindow({
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: true
    }
  });
  // load html file into window
  let mainURL = url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  });
  mainWindow.loadURL(mainURL);

  // quit app when closed
  mainWindow.on('closed', function(){
    app.quit();
  });

  // build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // insert menu
  Menu.setApplicationMenu(mainMenu);
});

// handle creation of the Add window
function createAddWindow() {
  // create new window
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add Shopping List Item",
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: true
    }
  });
  // load html file into window
  let addURL = url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  });
  addWindow.loadURL(addURL);
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// catch item:add
ipcMain.on('item:add', function(e, item){
  // send to mainWindow
  console.log(item);
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
});

// create menu template (an array of objects)
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        click() {
          createAddWindow();
        }
      },
      {
        label: 'Clear Items'
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q':'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

// if mac, add empty object to mainMenuTemplate
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({}); // adds empty object to beginning of array
}

// add dev tools item if not in production
if(process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'DevTools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I':'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}