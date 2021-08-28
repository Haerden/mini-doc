const { BrowserWindow } = require('electron');

class AppWindow extends BrowserWindow {
    constructor(config, urlLocation) {
        const basicConfig = {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true, // web + node
                contextIsolation: false, // 环境不隔离
                enableRemoteModule: true  // 打开remote
            },
            show: false,
            backgroundColor: '#efefef'
        }

        const finalConfig = {
            ...basicConfig,
            ...config
        };

        super(finalConfig);

        this.loadURL(urlLocation);
        
        // 无闪烁
        this.once('ready-to-show', () => {
            this.show();
        });
    }
}

module.exports = AppWindow;