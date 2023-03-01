const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require("fs");
const mm = require('music-metadata');


const createWindow = () => {
    const win = new BrowserWindow({
        width: 1100,
        height: 900,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#917f58',
            symbolColor: '#ea9d00'
        },
        icon: './images/logo-desktop.png',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        resizable: false
    })

    win.loadFile('index.html')

    return win
}

// Metadata for music files
const isMusicFile = (filepath) => {
    const types = ['.mp3', '.wav']
    const ext = path.extname(filepath)

    if (types.includes(ext)) {
        return true
    }
    else {
        return false
    }
}


async function asyncGetMusicMetadata(file) {
    try {
        const fileMetadata = await mm.parseFile(file);
        // console.log(fileMetadata)
        return fileMetadata
    } catch (error) {
        return console.error('An error was encountered==' + error.message);
    }
}

const loadTracks = (musicFolder) => {
    let tracks = []

    fs.readdir(musicFolder, function (err, files) {
        if (err) {
            console.log('Error encountered: ' + err)
        }
        if (files) {
            files.forEach(function (file) {
                const musicFilePath = musicFolder + "\\" + file
                if (isMusicFile(musicFilePath)) {
                    tracks.push({
                        path: musicFilePath,
                        title: '',
                        album: '',
                        year: '',
                        artist: '',
                        duration: '',
                        picture: '',
                        pictureFormat: '',
                        fileURL: ''
                    })
                }
            })
        }


        tracks.forEach(function (track) {
            asyncGetMusicMetadata(track.path).then(

                function (value) {
                    const metadata = value

                    if (value) {
                        const picture = mm.selectCover(metadata.common.picture)

                        track.title = metadata.common.title
                        track.album = metadata.common.album
                        track.year = metadata.common.year
                        track.artist = metadata.common.artist
                        track.duration = Math.round(metadata.format.duration)
                        track.picture = picture ? picture.data.toString('base64') : "./images/cover_place_holder.jpg"
                        track.pictureFormat = picture ? picture.format : ""
                        track.fileURL = url.pathToFileURL(track.path).href
                    }
                },
                function (error) {
                    console.log(error)
                }
            )
        })
    })

    return tracks
}
//Windown interaction
app.whenReady().then(() => {
    const mainWindow = createWindow()
    //Album path
    const album = "L:\\Electron\\Goodbye & Good Riddance Album";
    
    const songs = loadTracks(album);


    mainWindow.webContents.once('dom-ready', () => {
        mainWindow.webContents.send('send-music', songs)
    })  

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
