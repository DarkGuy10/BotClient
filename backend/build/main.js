"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const electron_updater_1 = require("electron-updater");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const Client_1 = __importDefault(require("@/classes/Client"));
const utils_1 = require("@/utils");
const ElectronStore_1 = __importDefault(require("./classes/ElectronStore"));
const ClientError_1 = __importDefault(require("./classes/ClientError"));
const typings_1 = require("./typings");
const Router_1 = __importDefault(require("./classes/Router"));
const discord_js_1 = require("discord.js");
let appWindow = null;
let client = null;
let router = null;
const AppData = new ElectronStore_1.default();
const appPreferenceStore = AppData.createSlice('appPreference');
const userStore = AppData.createSlice('savedUsers');
class AppUpdater {
    constructor() {
        electron_log_1.default.transports.file.level = 'info';
        electron_updater_1.autoUpdater.logger = electron_log_1.default;
        electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
    }
}
if (electron_is_dev_1.default) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('electron-debug')({
        showDevTools: true,
        devToolsMode: 'right',
    });
}
const spawnAppWindow = async () => {
    const RESOURCES_PATH = electron_is_dev_1.default
        ? path_1.default.join(__dirname, '../../assets')
        : path_1.default.join(process.resourcesPath, 'assets');
    const getAssetPath = (...paths) => {
        return path_1.default.join(RESOURCES_PATH, ...paths);
    };
    appWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        icon: getAssetPath('icon.png'),
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    appWindow.loadURL(electron_is_dev_1.default
        ? 'http://localhost:3000'
        : `file://${path_1.default.join(__dirname, '../../frontend/build/index.html')}`);
    appWindow.maximize();
    appWindow.setMenu(null);
    appWindow.show();
    appWindow.on('closed', () => {
        appWindow = null;
    });
};
electron_1.app.on('ready', () => {
    new AppUpdater();
    spawnAppWindow();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
/*
 * ======================================================================================
 * Hours wasted: 7
 * ======================================================================================
 * Just spent the entire after afternoon trying to implement event loading from
 * separate files, and I give up...
 *
 * For anyone who tries to re-attempt this in the future and fails, please increment
 * that counter at the top of this comment.
 * ======================================================================================
 */
/*
 * ======================================================================================
 *                                IPC Main Events: Action
 * ======================================================================================
 */
electron_1.ipcMain.on('action-login', async (event, token) => {
    try {
        if (!appWindow)
            return;
        if (client) {
            client.destroy();
            client = null;
        }
        const privilegedIntents = (await (0, utils_1.fetchPrivilegedIntents)(token)) || [];
        client = new Client_1.default({ appWindow, privilegedIntents });
        router = new Router_1.default(client);
        await client.login(token);
        if (appPreferenceStore.get('tokenPersistence', true))
            client.on('ready', client => {
                userStore.set(client.user.id, {
                    username: client.user.username,
                    discriminator: client.user.discriminator,
                    id: client.user.id,
                    avatarUrl: client.user.displayAvatarURL(),
                    token,
                });
            });
        event.reply('action-login-sucess');
    }
    catch (error) {
        electron_log_1.default.error(error);
        event.reply('error', (0, utils_1.serializeObject)(error));
        event.reply('action-login-error');
    }
});
electron_1.ipcMain.on('action-logout', event => {
    try {
        if (!client?.isReady())
            throw new ClientError_1.default(typings_1.ClientErrorCodes.CLIENT_NOT_READY);
        userStore.delete(client.user.id);
        client.destroy();
        client = null;
        event.reply('action-logout-success');
    }
    catch (error) {
        electron_log_1.default.error(error);
        event.reply('error', (0, utils_1.serializeObject)(error));
        event.reply('action-logout-error');
    }
});
electron_1.ipcMain.on('action-messageCreate', async (event, options) => {
    try {
        if (!client?.isReady())
            throw new ClientError_1.default(typings_1.ClientErrorCodes.CLIENT_NOT_READY);
        if (!router?.currentChannel)
            throw new ClientError_1.default(typings_1.ClientErrorCodes.NO_CURRENT_CHANNEL);
        await router.currentChannel.send(options);
        event.reply('action-messageCreate-success');
    }
    catch (error) {
        electron_log_1.default.error(error);
        event.reply('error', (0, utils_1.serializeObject)(error));
        event.reply('action-messageCreate-error');
    }
});
electron_1.ipcMain.on('action-messageDelete', async (event, messageId) => {
    try {
        if (!client?.isReady())
            throw new ClientError_1.default(typings_1.ClientErrorCodes.CLIENT_NOT_READY);
        if (!router?.currentChannel)
            throw new ClientError_1.default(typings_1.ClientErrorCodes.NO_CURRENT_CHANNEL);
        await router.currentChannel.messages.delete(messageId);
        event.reply('action-messageDelete-success');
    }
    catch (error) {
        electron_log_1.default.error(error);
        event.reply('error', (0, utils_1.serializeObject)(error));
        event.reply('action-messageDelete-error');
    }
});
/*
 * ======================================================================================
 *                                IPC Main Events: Resource
 * ======================================================================================
 */
electron_1.ipcMain.handle('resource-guilds-all', async (event) => {
    try {
        if (!client?.isReady())
            throw new ClientError_1.default(typings_1.ClientErrorCodes.CLIENT_NOT_READY);
        const guilds = [...(await client.guilds.fetch()).values()].map(guild => (0, utils_1.serializeObject)(guild));
        return { data: { guilds }, error: false };
    }
    catch (error) {
        electron_log_1.default.error(error);
        event.sender.send('error', (0, utils_1.serializeObject)(error));
        return { data: { guilds: [] }, error: true };
    }
});
electron_1.ipcMain.handle('resource-guild-channels-all', async (event) => {
    try {
        if (!client?.isReady())
            throw new ClientError_1.default(typings_1.ClientErrorCodes.CLIENT_NOT_READY);
        if (!router?.currentGuild)
            throw new ClientError_1.default(typings_1.ClientErrorCodes.NOT_GUILD_CHANNEL);
        const guildChannels = [
            ...(await router.currentGuild.channels.fetch()).values(),
        ].map(channel => (0, utils_1.serializeObject)(channel));
        return { data: { guildChannels }, error: false };
    }
    catch (error) {
        electron_log_1.default.error(error);
        event.sender.send('error', (0, utils_1.serializeObject)(error));
        return { data: { guildChannels: [] }, error: true };
    }
});
electron_1.ipcMain.handle('resource-dm-channels-all', async (event) => {
    try {
        if (!client?.isReady())
            throw new ClientError_1.default(typings_1.ClientErrorCodes.CLIENT_NOT_READY);
        const dmChannels = [
            ...client.channels.cache
                .filter(channel => channel.type === discord_js_1.ChannelType.DM)
                .map(channel => (0, utils_1.serializeObject)(channel)),
        ];
        return { data: { dmChannels }, error: false };
    }
    catch (error) {
        electron_log_1.default.error(error);
        event.sender.send('error', (0, utils_1.serializeObject)(error));
        return { data: { dmChannels: [] }, error: true };
    }
});
electron_1.ipcMain.handle('resource-messages-bulk', async (event, fetchOptions) => {
    try {
        if (!client?.isReady())
            throw new ClientError_1.default(typings_1.ClientErrorCodes.CLIENT_NOT_READY);
        if (!router?.currentChannel)
            throw new ClientError_1.default(typings_1.ClientErrorCodes.NO_CURRENT_CHANNEL);
        if (!router.currentChannel.isTextBased())
            throw new ClientError_1.default(typings_1.ClientErrorCodes.NOT_TEXT_BASED_CHANNEL);
        const messages = [
            ...(await router.currentChannel.messages.fetch(fetchOptions)).values(),
        ].map(message => (0, utils_1.serializeObject)(message));
        const hasReachedTop = (fetchOptions.limit && messages.length < fetchOptions.limit) ||
            !(await router.currentChannel.messages.fetch({
                limit: 1,
                before: messages[messages.length - 1].id,
            })).size;
        return { data: { messages, hasReachedTop }, error: false };
    }
    catch (error) {
        electron_log_1.default.error(error);
        event.sender.send('error', (0, utils_1.serializeObject)(error));
        return { data: { messages: [], hasReachedTop: false }, error: true };
    }
});
electron_1.ipcMain.handle('resource-guild-members-all', async (event) => {
    try {
        if (!client?.isReady())
            throw new ClientError_1.default(typings_1.ClientErrorCodes.CLIENT_NOT_READY);
        if (!router?.currentChannel)
            throw new ClientError_1.default(typings_1.ClientErrorCodes.NO_CURRENT_CHANNEL);
        if (!(router.currentChannel instanceof discord_js_1.GuildChannel))
            throw new ClientError_1.default(typings_1.ClientErrorCodes.NOT_GUILD_CHANNEL);
        const members = [...router.currentChannel.members.values()].map(member => (0, utils_1.serializeObject)(member));
        return { data: { members }, error: false };
    }
    catch (error) {
        electron_log_1.default.error(error);
        event.sender.send('error', (0, utils_1.serializeObject)(error));
        return { data: { members: [] }, error: true };
    }
});
/* Events related to app data management go here*/
/*
 * ======================================================================================
 *                                IPC Main Events: Navigation
 * ======================================================================================
 */
electron_1.ipcMain.handle('navigate-guild', async (event, guildId) => {
    try {
        if (!client?.isReady())
            throw new ClientError_1.default(typings_1.ClientErrorCodes.CLIENT_NOT_READY);
        const targetGuild = await client.guilds.fetch(guildId);
        if (!targetGuild)
            throw new ClientError_1.default(typings_1.ClientErrorCodes.CANNOT_FETCH_GUILD);
        const targetChannel = targetGuild.channels.cache.find(channel => channel.type === discord_js_1.ChannelType.GuildText && channel.viewable);
        if (!targetChannel)
            throw new ClientError_1.default(typings_1.ClientErrorCodes.NO_VIEWABLE_CHANNEL_IN_GUILD);
        if (!targetChannel.isTextBased())
            throw new ClientError_1.default(typings_1.ClientErrorCodes.NOT_TEXT_BASED_CHANNEL);
        router?.navigateTo(targetChannel);
        return {
            data: {
                currentGuild: (0, utils_1.serializeObject)(router?.currentGuild),
                currentChannel: (0, utils_1.serializeObject)(router?.currentChannel),
            },
            error: false,
        };
    }
    catch (error) {
        electron_log_1.default.error(error);
        event.sender.send('error', (0, utils_1.serializeObject)(error));
        return { data: { currentGuild: {}, currentChannel: {} }, error: true };
    }
});
electron_1.ipcMain.handle('navigate-channel', async (event, channelOrUserId, isDM = false) => {
    try {
        if (!client?.isReady())
            throw new ClientError_1.default(typings_1.ClientErrorCodes.CLIENT_NOT_READY);
        let targetChannel;
        if (isDM) {
            const recipient = await client.users.fetch(channelOrUserId);
            if (!recipient)
                throw new ClientError_1.default(typings_1.ClientErrorCodes.CANNOT_FETCH_USER);
            try {
                targetChannel = await recipient.createDM();
            }
            catch (error) {
                throw new ClientError_1.default(typings_1.ClientErrorCodes.CANNOT_CREATE_DM);
            }
        }
        else {
            targetChannel = await client.channels.fetch(channelOrUserId);
            if (!targetChannel || !(targetChannel instanceof discord_js_1.GuildChannel))
                throw new ClientError_1.default(typings_1.ClientErrorCodes.CANNOT_FETCH_CHANNEL);
            if (!targetChannel.isTextBased())
                throw new ClientError_1.default(typings_1.ClientErrorCodes.NOT_TEXT_BASED_CHANNEL);
            if (!targetChannel.viewable)
                throw new ClientError_1.default(typings_1.ClientErrorCodes.MISSING_PERMISSIONS);
        }
        router?.navigateTo(targetChannel);
        return {
            data: { currentChannel: (0, utils_1.serializeObject)(router?.currentChannel) },
            error: false,
        };
    }
    catch (error) {
        electron_log_1.default.error(error);
        event.sender.send('error', (0, utils_1.serializeObject)(error));
        return { data: { currentChannel: {} }, error: true };
    }
});
