const { app, BrowserWindow, Notification, ipcMain } = require('electron')
const path = require('path')
const url = require('url');

// Khi frontend gọi window.electronAPI.focusApp()
ipcMain.on('focus-app', () => {
  const win = BrowserWindow.getAllWindows()[0];
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    }
  })

  // ⚠️ Quan trọng: dùng loadURL để React Router hoạt động
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, '../dist/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  )

  // win.webContents.openDevTools(); // ✅ mở DevTools đúng cách
}

app.whenReady().then(() => {
  createWindow();

    // ✅ Chỉ gọi Notification sau khi app ready
  new Notification({
    title: 'Tin nhắn mới',
    body: 'Bạn có tin nhắn mới trong cuộc trò chuyện'
  }).show();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
