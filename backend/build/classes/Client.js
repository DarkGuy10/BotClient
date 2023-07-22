"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/utils");
const discord_js_1 = require("discord.js");
class Client extends discord_js_1.Client {
    appWindow;
    constructor(clientOptions) {
        const intents = [
            discord_js_1.GatewayIntentBits.Guilds,
            discord_js_1.GatewayIntentBits.DirectMessages,
            discord_js_1.GatewayIntentBits.GuildMessages,
            discord_js_1.GatewayIntentBits.GuildMembers,
            discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
            discord_js_1.GatewayIntentBits.GuildVoiceStates,
            ...clientOptions.privilegedIntents,
        ];
        super({ intents });
        this.appWindow = clientOptions.appWindow;
        this._patchEvents();
    }
    _patchEvents() {
        Object.keys(discord_js_1.Events).forEach(event => {
            this.on(event, (...args) => {
                const serializedArguements = args.map(each => (0, utils_1.serializeObject)(each));
                this.appWindow.webContents.send(event, ...serializedArguements);
            });
        });
    }
}
exports.default = Client;
