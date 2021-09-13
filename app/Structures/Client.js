const {Client:oldClient, ClientOptions} = require('discord.js');
const { BrowserWindow } = require('electron');

class Client extends oldClient {
    /**
     * 
     * @param {ClientOptions} clientOptions 
     * @param {BrowserWindow} mainWindow 
     */
    constructor(clientOptions, mainWindow){
        super(clientOptions);
        this.mainWindow = mainWindow;

        this.on('messageCreate', async message => {
            if(message.channel.type !== 'GUILD_TEXT') return;
            if(message.type === 'REPLY'){
                message.repliesTo = await message.fetchReference();
                message.repliesTo.authorAvatarURL = message.repliesTo.author.displayAvatarURL();
                message.repliesTo.authorVerifiedBot = message.repliesTo.author.flags?.has('VERIFIED_BOT');
            }
            message.authorAvatarURL = message.author.displayAvatarURL();
            message.authorVerifiedBot = message.author.flags?.has('VERIFIED_BOT');
            message.stickers.forEach(sticker => sticker.URL = sticker.url);
            this.mainWindow.webContents.send('messageCreate', message, message.channel);
        });
    }
}

module.exports = Client;