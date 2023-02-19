const { app, BrowserWindow } = require("electron");
const path = require("path");

let windows = new Set();

const createWindow = () => {
  let mainWindow = new BrowserWindow({
    width : 600,
    height: 400,
    backgroundColor: "#ffdab9",
    webPreferences: {
      nodeIntegration: true,
      }
  });

  windows.add(mainWindow);

  mainWindow.loadFile(path.join(__dirname, "index.html"));
};

let videoWindow = null;

function createVideoWindow() {
  videoWindow = new BrowserWindow({
    width: 1000,
    height: 620,
    backgroundColor: "#ffdab9",
    webPreferences: {
      nodeIntegration: true
    },
  });

  windows.add(videoWindow);
  videoWindow.loadFile(path.join(__dirname, "stream.html"));

  videoWindow.on("closed", () => {
    windows.delete(videoWindow);
    videoWindow = null;
  });
}

module.exports.createVideoWindow = createVideoWindow;

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
