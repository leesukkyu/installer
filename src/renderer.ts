/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css'
import $ from 'jquery'
import * as electron from 'electron'
import AdmZip from 'adm-zip'
import fs from 'fs'

const {ipcRenderer} = electron

const Renderer = {
    data: {
        isInstallVscode: false,
    },
    init() {
        Renderer.attachEventListener()
    },
    attachEventListener() {
        $('button[data-install-vscode]').on('click', Renderer.installVscode)
    },
    installVscode() {
        const {isInstallVscode} = Renderer.data
        if (isInstallVscode) {
            Renderer.logger.warn('vscode 설치중입니다.')
            return
        }
        Renderer.data.isInstallVscode = true
        const zip = new AdmZip('static/VSCode-darwin-universal.zip')
        const target = './temp/'
        zip.extractAllToAsync(target, true, () => {
            if (fs.existsSync('/Applications/Visual Studio Code.app')) {
                Renderer.logger.warn('vscode가 이미 있습니다.')
                return
            }
            fs.rename('./temp/Visual Studio Code.app', '/Applications/Visual Studio Code.app', () => {
                Renderer.data.isInstallVscode = false
                Renderer.logger.warn('vscode 설치되었습니다.')
            })
        })
    },
    logger: {
        info: (str: string) => {
            $(`<p class="line-1">${str}</p>`).appendTo($('div[data-terminal-history]'))
        },
        warn: (str: string) => {
            $(`<p class="line-2">${str}</p>`).appendTo($('div[data-terminal-history]'))
        },
    },
}

Renderer.init()
