import {app, BrowserWindow, Notification, systemPreferences, ipcMain, Menu, Tray} from 'electron'
import path from 'path'
import {Server} from 'http'
import AdmZip from 'adm-zip'
import fs from 'fs'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string

if (require('electron-squirrel-startup')) {
    app.quit()
}

const isDebug = (() => {
    return process.env.npm_lifecycle_event === 'start'
})()

const sleep = (ms: any) => {
    return new Promise((r) => setTimeout(r, ms))
}

interface MainInterface {
    data: {}
    init: () => void
    setListener: () => void
    createWindow: () => void
}

const Main: MainInterface = {
    data: {},
    init() {
        Main.setListener()
        app.whenReady().then(Main.createWindow)
    },
    setListener() {
        ipcMain.on('installVscode', () => {})
    },
    createWindow() {
        const mainWindow = new BrowserWindow({
            height: 600,
            width: 800,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
            },
        })

        // and load the index.html of the app.
        mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

        // Open the DevTools.
        mainWindow.webContents.openDevTools()
    },
}

Main.init()
