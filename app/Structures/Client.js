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

        this.on('messageCreate', message => {
            if(message.channel.type !== 'GUILD_TEXT') return;
            message.authorAvatarURL = message.author.displayAvatarURL(),
            message.authorVerifiedBot = message.author.flags?.has('VERIFIED_BOT')
            this.mainWindow.webContents.send('messageCreate', message, message.channel);
        });
    }
}

module.exports = Client;