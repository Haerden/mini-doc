const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 680,
        webPreferences: {
            nodeIntegration: true, // web + node
            contextIsolation: false, // 环境不隔离
            enableRemoteModule: true  // 打开remote
        }
    });

    const urlLocation = isDev ? 'http://localhost:3000' : 'xxxx';

    mainWindow.loadURL(urlLocation);
});