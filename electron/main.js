
import { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let tray;
let isPopupMode = false; // 追踪当前是否为弹窗模式

// 窗口尺寸常量 - 调整为更精致紧凑的尺寸
const DASHBOARD_SIZE = { width: 720, height: 520 };
const POPUP_SIZE = { width: 440, height: 480 }; // 稍微调小弹窗

// 确保单实例
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // 如果用户尝试再次打开 App，恢复主界面
    switchToDashboardMode();
  });
}

// 注册为默认浏览器协议
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('http', process.execPath, [path.resolve(process.argv[1])]);
    app.setAsDefaultProtocolClient('https', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('http');
  app.setAsDefaultProtocolClient('https');
}

function createTray() {
  const icon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVRYR+2V0QqAIAxF7///RxeC8MaSIdiwByYIOnWvS6mqqm4NInIDmImuY7K9f0vObeX3BpgR+Z3v0vX9GZAAAtR7YNoH/AI6v6A94F8LIPIDP6mqqp7vAgYmN6IDonXWAAAAAElFTkSuQmCC');
  tray = new Tray(icon.resize({ width: 18, height: 18 }));
  const contextMenu = Menu.buildFromTemplate([
    { label: '打开控制台', click: () => switchToDashboardMode() },
    { type: 'separator' },
    { label: '退出 LinkMaster', click: () => {
        app.isQuitting = true;
        app.quit();
      } 
    }
  ]);
  tray.setToolTip('LinkMaster Pro');
  tray.setContextMenu(contextMenu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: DASHBOARD_SIZE.width,
    height: DASHBOARD_SIZE.height,
    show: false,
    frame: false,
    transparent: true,
    resizable: false, // 禁止用户手动调整大小，由程序控制
    backgroundColor: '#00000000',
    hasShadow: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 默认启动时不显示，等待 activate 或 open-url 决定显示模式
  mainWindow.once('ready-to-show', () => {
    // 如果没有通过 URL 启动，显示主面板
    if (!isPopupMode) {
      switchToDashboardMode();
    }
  });

  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  // 失去焦点时，如果是弹窗模式，则自动隐藏
  mainWindow.on('blur', () => {
    if (isPopupMode) {
      mainWindow.hide();
    }
  });
}

// 切换到主面板模式
function switchToDashboardMode() {
  if (!mainWindow) return;
  isPopupMode = false;
  mainWindow.setSize(DASHBOARD_SIZE.width, DASHBOARD_SIZE.height, true);
  mainWindow.center();
  mainWindow.show();
  mainWindow.focus();
  // 通知 React 切换视图
  mainWindow.webContents.send('view-mode-change', 'dashboard');
}

// 切换到弹窗模式
function switchToPopupMode(url, sourceApp) {
  if (!mainWindow) return;
  isPopupMode = true;
  mainWindow.setSize(POPUP_SIZE.width, POPUP_SIZE.height, true);
  mainWindow.center();
  mainWindow.show();
  mainWindow.setAlwaysOnTop(true); // 弹窗模式暂时置顶
  mainWindow.focus();
  mainWindow.setAlwaysOnTop(false); // 聚焦后取消置顶，允许交互
  
  // 发送数据和模式切换指令
  mainWindow.webContents.send('view-mode-change', 'popup');
  // 稍微延迟发送数据，确保 React 已渲染弹窗组件
  setTimeout(() => {
    mainWindow.webContents.send('deep-link', { url, source: sourceApp });
  }, 100);
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

// 监听 macOS 点击 Dock 图标
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    switchToDashboardMode();
  }
});

// 处理外部链接唤起
app.on('open-url', (event, url) => {
  event.preventDefault();
  
  const script = `tell application "System Events" to get name of first application process whose frontmost is true`;
  exec(`osascript -e '${script}'`, (error, stdout) => {
    const sourceApp = error ? '外部应用' : stdout.trim();
    
    if (mainWindow) {
      switchToPopupMode(url, sourceApp);
    } else {
      // 窗口未创建时的处理
      createWindow();
      mainWindow.once('ready-to-show', () => {
        switchToPopupMode(url, sourceApp);
      });
    }
  });
});

ipcMain.on('open-in-browser', (event, { url, browserPath }) => {
  const command = `open -a "${browserPath}" "${url}"`;
  exec(command, (err) => {
    if (!err) {
      mainWindow.hide();
      // 这里的逻辑改为：处理完后不主动恢复主界面，保持隐藏，下次点击图标再恢复
      isPopupMode = false; 
    }
  });
});

ipcMain.on('close-window', () => {
  mainWindow.hide();
});

ipcMain.on('resize-me', (event, { width, height }) => {
    if(mainWindow) mainWindow.setSize(width, height);
})
