"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Router {
    _currentChannel;
    client;
    constructor(client) {
        this.client = client;
        this._currentChannel = null;
    }
    navigateTo(targetChannel) {
        this._currentChannel = targetChannel ?? null;
        return this._currentChannel;
    }
    get currentChannel() {
        return this._currentChannel;
    }
    get currentGuild() {
        if (this._currentChannel instanceof discord_js_1.GuildChannel)
            return this._currentChannel.guild;
        return;
    }
}
exports.default = Router;
