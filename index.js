const { TextChannel, Message } = require('discord.js');
const { app, BrowserWindow, ipcMain, dialog} = require('electron');
const Client = require('./app/Structures/Client');

/**
 * @type {BrowserWindow}
 */
let mainWindow = null;
/**
 * @type {Client}
 */
let client = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1920,
		height: 1080,
        backgroundColor: '#2c2f33',
        transparent: true,
		icon: __dirname + `/app/Assets/icon.png`,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
    });
    mainWindow.loadFile(`${__dirname}/app/HTML/index.html`);
    mainWindow.setMenu(null);
  mainWindow.openDevTools(); //for testing
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if(process.platform != 'darwin'){
        app.quit();
    }
});


// ipc Renderer communications
ipcMain.on('login', (event, token) => {
    if(client){ // prevents creation of extra clients
        client.destroy();
        client = null;
    }
    client = new Client({
        intents: ['GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_EMOJIS_AND_STICKERS']
    }, mainWindow);
    client.login(token).catch(error => {
        console.log(error);
        event.reply('error', error.code, error.message);
    });
    client.once('ready', () => {
        event.reply('login', client.user.toJSON(), token);
    });
});

ipcMain.on('load-all-guilds', async (event) => {
    const guilds = client.guilds.cache.each(guild => {
        guild.iconURL = guild.iconURL();
    });
    event.reply('load-all-guilds', guilds);
});

ipcMain.on('load-one-guild', async (event, id) => {
    const guild = client.guilds.cache.get(id);
    const channels = await guild.channels.fetch();
    event.reply('load-one-guild', channels, guild);    
    loadOneChannel(event, channels.first().id);
});

ipcMain.on('load-one-channel', async (event, id) => {
    loadOneChannel(event, id);
});

const loadOneChannel = async (event, id) => {
    /**
     * @type {TextChannel}
     */
    const channel = await client.channels.fetch(id);
    if(channel.type !== 'GUILD_TEXT') return;

    try{
        let messages = await channel.messages.fetch({limit: 50});
        for(const message of messages.values()){
            if(message.type === 'REPLY'){
                message.repliesTo = await message.fetchReference();
                message.repliesTo.authorAvatarURL = message.repliesTo.author.displayAvatarURL();
                message.repliesTo.authorVerifiedBot = message.repliesTo.author.flags?.has('VERIFIED_BOT');
            }
            message.authorAvatarURL = message.author.displayAvatarURL();
            message.authorVerifiedBot = message.author.flags?.has('VERIFIED_BOT');
            message.stickers.forEach(sticker => sticker.URL = sticker.url);
        }
        const members = channel.members;
        event.reply('load-one-channel', channel, messages, members);
    } catch(error) {
        event.reply('error', error.code, error.message);
        console.error(error);
    }
};

ipcMain.on('message', async (event, channelID, content, files) => {
    try {
        let messagePayload = {};
        if(content) messagePayload.content = content;
        if(files) messagePayload.files = files;
        await client.channels.cache.get(channelID).send(messagePayload);
    } catch (error) {
        event.reply('error', error.code, error.message);
        console.error(error);
    };
});

ipcMain.on('upload-files', async (event, channelID) => {
    try {
        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
            title: 'File Upload',
            defaultPath: `~/`,
            buttonLabel: 'Open',
            filters: [
                { name: 'All Files', extensions: ['*'] }
            ],
            properties: ['openFile', 'showHiddenFiles']
        });
        if(canceled) return;
        const fileObjects = filePaths.map(each => new Object({
            attachment: each,
            name: each.split('/').pop()
        }));
        event.reply('upload-files', fileObjects);
    } catch (error) {
        event.reply('error', error.code, error.message);
        console.error(error);
    }
});