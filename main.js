const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const dns = require('dns');


let onlineLoadingScreen = null;
let offLineLoadingScreen = null;
let mainWindow = null;

let isConnected = false;
let loadingSplash = true;
let isLoaded = false;

let mainTimeout;

function liveCheck() {
    dns.lookup("www.google.com", function (err, addr) {
        if (err) {
            if(loadingSplash){
                deleteTimeout();
                if(offLineLoadingScreen == null){
                    createOfflineLoadingScreen();
                }
                if(onlineLoadingScreen != null){
                    onlineLoadingScreen.close();
                    onlineLoadingScreen = null;
                }
                if(mainWindow != null){
                    mainWindow.close();
                    mainWindow = null;
                }
            }
            else{

            }
        }
        else {
            isConnected = true;
            if(loadingSplash){
                if(onlineLoadingScreen == null){
                    createOnlineLoadingScreen();
                    startTimeout();
                }
                if(offLineLoadingScreen != null){
                    offLineLoadingScreen.close();
                    offLineLoadingScreen = null;
                }
            }
            else{

            }
        }
    });
}

function createWindow() {
    loadingSplash = false;
    mainWindow = new BrowserWindow({
        width: '100%',
        height: '100%',
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true,
            nodeIntegration: true
        },
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
    //mainWindow.loadURL('https://app.ads2grid.com/play/')
    mainWindow.maximize();

    mainWindow.webContents.on('did-finish-load', () => {
        /// then close the loading screen window and show the main window
        if (onlineLoadingScreen) {
            onlineLoadingScreen.close();
            onlineLoadingScreen = null;
        }
        mainWindow.show();
    });
}

const createOnlineLoadingScreen = () => {
    onlineLoadingScreen = new BrowserWindow({
        width: '100%',
        height: '100%',
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true
        }
    });
    onlineLoadingScreen.loadFile('splash_online.html')
    onlineLoadingScreen.maximize();
    onlineLoadingScreen.on('closed', () => (onlineLoadingScreen = null));
    onlineLoadingScreen.webContents.on('did-finish-load', () => {
        onlineLoadingScreen.show();
    });
};

const createOfflineLoadingScreen = () => {
    offLineLoadingScreen = new BrowserWindow({
        width: '100%',
        height: '100%',
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true
        }
    });
    offLineLoadingScreen.loadFile('splash_offline.html')
    offLineLoadingScreen.maximize();
    offLineLoadingScreen.on('closed', () => (offLineLoadingScreen = null));
    offLineLoadingScreen.webContents.on('did-finish-load', () => {
        offLineLoadingScreen.show();
    });
};

function startTimeout(){
    mainTimeout = setTimeout(() => {
        loadingSplash = false;
        if(!isLoaded && mainWindow != null){
            console.log(13)
            mainWindow.close();
            createWindow();
        }
        else if(!isLoaded && mainWindow == null){
            console.log(14)
            createWindow();
        }
        else if(isLoaded && mainWindow != null){
            console.log(15)
            //mainWindow.show();
            createWindow();
        }
        else if(isLoaded && mainWindow == null){
            console.log(16)
            isLoaded = false;
            createWindow();
        }
        if(onlineLoadingScreen != null){
            console.log(17)
            onlineLoadingScreen.close();
            onlineLoadingScreen = null;
        }
        if(offLineLoadingScreen != null){
            console.log(18)
            offLineLoadingScreen.close();
            offLineLoadingScreen = null;
        }

    }, 5000);
}

function deleteTimeout(){
    clearTimeout(mainTimeout);
}

ipcMain.on('request-mainprocess-action', async (event, arg) => {
    console.log('init ui')
    await init();
});


ipcMain.on('main-dom-ready', async (event, arg) => {
    console.log('main page loaded')
    isLoaded = true;
});


async function init() {
    loadingSplash = true;
    await dns.lookup("www.github.com", function (err, addr) {
        if (err) {
            if(offLineLoadingScreen == null){
                console.log(1)
                createOfflineLoadingScreen();
            }
            if(onlineLoadingScreen != null){
                console.log(2)
                onlineLoadingScreen.close();
                onlineLoadingScreen = null;
            }

            if(!isLoaded && mainWindow != null){
                console.log(3)
                mainWindow.close();
                mainWindow = null;
            }
            else if(!isLoaded && mainWindow == null){
                console.log(4)
                isLoaded = false;
            }
            else if(isLoaded && mainWindow != null){
                console.log(5)
                //mainWindow.hide();
                mainWindow.close();
                mainWindow = null;
            }
            else if(isLoaded && mainWindow == null){
                console.log(6)
                isLoaded = false;
            }
        }
        else {
            if(onlineLoadingScreen == null){
                console.log(7)
                createOnlineLoadingScreen();
            }
            if(offLineLoadingScreen != null){
                console.log(8)
                offLineLoadingScreen.close();
                offLineLoadingScreen = null;
            }
            if(!isLoaded && mainWindow != null){
                console.log(9)
                mainWindow.close();
                mainWindow = null;
            }
            else if(!isLoaded && mainWindow == null){
                console.log(10)
                isLoaded = false;
            }
            else if(isLoaded && mainWindow != null){
                console.log(11)
                //mainWindow.hide();
                mainWindow.close();
                mainWindow = null;
            }
            else if(isLoaded && mainWindow == null){
                console.log(12)
                isLoaded = false;
            }
            startTimeout();
        }
    });

    setInterval(function () {
        if(loadingSplash){
            liveCheck();
        }
    }, 1000);
}

app.whenReady().then(async () => {

    await init();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) init()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})


