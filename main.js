const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const menuTemplate = require('./src/menuTemplate');
const Store = require('electron-store');
const settingsStore = new Store({ name: 'Settings' });

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

    // set the menu
    let menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // hook up main events
    ipcMain.on('open-settings-window', () => {
        const setttingsWindowConfig = {
            width: 500,
            height: 400,
            parent: mainWindow
        }

        const settingsFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`;

        setttingsWindow = new AppWindow(setttingsWindowConfig, settingsFileLocation);
        setttingsWindow.removeMenu();
        setttingsWindow.on('closed', () => {
            setttingsWindow = null;
        });
    });

    ipcMain.on('config-is-saved', () => {
        // 注意 index
        let qiniuMenu = process.platform === 'darwin' ? menu.items[3] : menu.items[2];
        const switchItems = (toggle) => {
            [1,2,3].forEach(number => {
                qiniuMenu.submenu.items[number].enabled = toggle;
            })
        };
        
        const qiniuIsConfiged = ['accessKey', 'secretKey', 'bucketName'].every(key => !!settingsStore.get(key));
        if (qiniuIsConfiged) {
            switchItems(true);
        } else {
            switchItems(false);
        }
    });

});