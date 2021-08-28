const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const menuTemplate = require('./src/menuTemplate');
let mainWindow, setttingsWindow;

const AppWindow = require('./src/AppWindow');

app.on('ready', () => {
    const mainWindowConfig = {
        width: 1024,
        height: 680,
        webPreferences: {
            nodeIntegration: true, // web + node
            contextIsolation: false, // 环境不隔离
            enableRemoteModule: true  // 打开remote
        }
    };

    const urlLocation = isDev ? 'http://localhost:3000' : 'xxxx';

    mainWindow = new AppWindow(mainWindowConfig, urlLocation);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // hook up main events
    ipcMain.on('open-settings-window', () => {
        const setttingsWindowConfig = {
            width: 500,
            height: 400,
            parent: mainWindow
        }

        const settingsFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`;

        setttingsWindow = new AppWindow(setttingsWindowConfig, settingsFileLocation);

        setttingsWindow.on('closed', () => {
            setttingsWindow = null;
        });
    });

    // set the menu
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});