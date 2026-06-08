const path = require('path');
const { app, BrowserWindow, dialog, shell } = require('electron');
const dotenv = require('dotenv');

function loadEnvFiles() {
    const executableDir = path.dirname(process.execPath);
    const resourceDir = process.resourcesPath;
    const appRoot = path.join(__dirname, '..');

    const desktopEnvFiles = [
        path.join(executableDir, '.env.desktop'),
        path.join(resourceDir, '.env.desktop'),
        path.join(appRoot, '.env.desktop')
    ];

    const fallbackEnvFiles = [
        path.join(executableDir, '.env'),
        path.join(resourceDir, '.env'),
        path.join(appRoot, '.env')
    ];

    desktopEnvFiles.forEach((envPath) => dotenv.config({ path: envPath }));
    fallbackEnvFiles.forEach((envPath) => dotenv.config({ path: envPath }));
}

loadEnvFiles();

const backendPort = Number(process.env.DESKTOP_BACKEND_PORT || process.env.PORT || 5000);
let backendBooted = false;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForBackend(url, maxAttempts = 40, delayMs = 500) {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return true;
            }
        } catch (error) {
            // Backend is still starting up.
        }
        await wait(delayMs);
    }
    return false;
}

function bootBackendServer() {
    if (backendBooted) {
        return;
    }

    process.env.PORT = String(backendPort);
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

    // Reuse the existing backend entrypoint in-process.
    // This keeps one packaged executable and works offline on desktop.
    require(path.join(__dirname, '..', 'backend', 'src', 'server.js'));
    backendBooted = true;
}

function createMainWindow() {
    const win = new BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1120,
        minHeight: 720,
        show: false,
        title: 'KGMAO Desktop',
        backgroundColor: '#0f172a',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });

    win.once('ready-to-show', () => {
        win.show();
    });

    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    win.loadURL(`http://127.0.0.1:${backendPort}`);
}

app.whenReady().then(async () => {
    try {
        bootBackendServer();

        const backendReady = await waitForBackend(`http://127.0.0.1:${backendPort}/health`);
        if (!backendReady) {
            throw new Error(`Local backend did not become ready on port ${backendPort}.`);
        }

        createMainWindow();
    } catch (error) {
        dialog.showErrorBox(
            'KGMAO Desktop Startup Failed',
            `${error.message}\n\nCheck local DB configuration (.env/.env.desktop) and restart the app.`
        );
        app.quit();
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    app.quit();
});
