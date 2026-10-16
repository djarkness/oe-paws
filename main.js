const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.exit();
});

// Обработчик для чтения .md файлов с диска компьютера
ipcMain.handle('read-md-file', async (event, filename) => {
    try {
        const filePath = path.join(app.getAppPath(), filename);
        if (!fs.existsSync(filePath)) {
            // Если файла нет, создаем шаблон по умолчанию
            const defaultContent = `## ${filename.replace('.md', '')}\n\n| №   | Название игры | Условие получения | Балл рейтинга |\n| --- | ------------- | ----------------- | ------------- |\n| 1.  | *Название1*   | *Условие1*        | 50            |\n| 2.  | *Название2*   | *Условие2*        | 100           |\n| 2.1 | *Название3*   | *Условие3*        | 30            |\n| 3.  | *Название4*   | *Условие4*        | 40            |`;
            fs.writeFileSync(filePath, defaultContent, 'utf-8');
        }
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(`Ошибка чтения ${filename}:`, error);
        return '';
    }
});