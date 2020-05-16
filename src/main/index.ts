import 'dotenv/config';
import {app, BrowserWindow, Menu} from 'electron';
import {is} from 'electron-util';
import windowStateKeeper from 'electron-window-state';
import _ from 'lodash';
import path from 'path';
import url from 'url';
import yargs from 'yargs';

(async () => {
  await app.whenReady();
  if (is.development) {
    const {
      default: install,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    } = await import('electron-devtools-installer');
    await install([
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    ]);
  } else {
    Menu.setApplicationMenu(null);
  }
  let state = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600,
    maximize: true
  });
  let win = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
    fullscreen: state.isFullScreen,
    webPreferences: {
      nodeIntegration: true
    }
  });
  if (state.isMaximized)
    win.maximize();
  state.manage(win);
  if (is.development)
    win.webContents.openDevTools();
  win.on('closed', () => app.quit());
  let file = _.head(yargs.argv._);
  let renderer = url.format(is.development ? {
    protocol: 'http',
    hostname: process.env.HOST,
    port: process.env.PORT
  } : {
    protocol: 'file',
    pathname: path.join(__dirname, '../renderer/index.html'),
    hash: file && url.format({
      pathname: '/movie',
      query: {file}
    })
  });
  await win.loadURL(renderer);
})();
