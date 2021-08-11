const { app, BrowserWindow, Menu } = require('electron');
const isDev = require('electron-is-dev');
const menuTemplate = require('./src/menuTemplate');
let mainWindow;

let template = [{
    label: '文件',
    submenu: [{
        label: '新建',
        accelerator: 'CmdOrCtrl+N',
        click: (menuItem, browserWindow, event) => {
            browserWindow.webContents.send('create-new-file');
        }
    }, {
        label: '保存',
        accelerator: 'CmdOrCtrl+S',
        click: (menuItem, browserWindow, event) => {
            browserWindow.webContents.send('save-edit-file');
        }
    }, {
        label: '搜索',
        accelerator: 'CmdOrCtrl+F',
        click: (menuItem, browserWindow, event) => {
            browserWindow.webContents.send('search-file');
        }
    }, {
        label: '导入 ',
        accelerator: 'CmdOrCtrl+O',
        click: (menuItem, browserWindow, event) => {
            browserWindow.webContents.send('import-file');
        }
    }]
}];

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

    // set the menu
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});