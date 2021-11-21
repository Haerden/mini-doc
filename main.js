const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const menuTemplate = require('./src/menuTemplate');
const Store = require('electron-store');
const QiniuManager = require('./src/utils/QiniuManager');
const settingsStore = new Store({ name: 'Settings' });
const fileStore = new Store({ name: "Files Data" });

let mainWindow, setttingsWindow;

const createManager = () => {
    const accessKey = settingsStore.get('accessKey');
    const secretKey = settingsStore.get('secretKey');
    const bucketName = settingsStore.get('bucketName');

    return new QiniuManager(accessKey, secretKey, bucketName);
};

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

    ipcMain.on('upload-file', (event, data) => {
        const manager = createManager();
        manager.uploadFile(data.key, data.path).then(data => {
            console.log('上传成功', data);
            mainWindow.webContents.send('active-file-uploaded');
        }).catch(() => {
            dialog.showErrorBox('同步失败', '请检查七牛云参数');
        });
    });

    ipcMain.on('download-file', (event, data) => {
        const manager = createManager();
        const filesObj = fileStore.get('files');
        const { key, path, id } = data;

        manager.getStat(data.key).then((resp) => {
            // console.log(resp);
            // console.log(filesObj[data.id]);
            const serverUpdatedTime = Math.round(resp.putTime / 10000);
            const localUpdatedTime = filesObj[id].updatedAt
            if (serverUpdatedTime > localUpdatedTime || !localUpdatedTime) {
                console.log('同步成功');
                manager.downloadFile(key, path).then(() => {
                    mainWindow.webContents.send('file-downloaded', {
                        status: 'download-success',
                        id
                    })
                })
            } else {
                console.log('使用本地');
                mainWindow.webContents.send('file-downloaded', {
                    status: 'no-new-file',
                    id
                })
            }

        }, err => {
            console.log(err);
            if (err.statusCode === 612) {
                mainWindow.webContents.send('file-downloaded', {
                    status: 'no-file',
                    id
                })
            }
        });
    });
}); 