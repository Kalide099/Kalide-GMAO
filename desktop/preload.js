const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('kgmaoDesktop', {
    platform: process.platform,
    isDesktop: true
});
