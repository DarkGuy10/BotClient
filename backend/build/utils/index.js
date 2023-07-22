"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPrivilegedIntents = exports.serializeObject = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const discord_js_1 = require("discord.js");
const node_fetch_1 = __importDefault(require("node-fetch"));
const serializeObject = (source) => {
    /*
    const sink: any = Object.assign({}, source)
    const proto = Object.getPrototypeOf(source)

    Object.entries(Object.getOwnPropertyDescriptors(proto))
        .filter(([, descriptor]) => typeof descriptor.get === 'function')
        .forEach(([key, descriptor]) => {
            if (descriptor && key[0] !== '_')
                try {
                    sink[key] = source[key]
                } catch (error) {
                    console.error(`Error in calling getter ${key}`, error)
                }
        })

    return sink
    */
    return JSON.parse(JSON.stringify(source));
};
exports.serializeObject = serializeObject;
const fetchPrivilegedIntents = async (token) => {
    const privilegedIntents = [];
    try {
        const response = await (0, node_fetch_1.default)('https://discord.com/api/v10/applications/@me', {
            headers: {
                Authorization: `Bot ${token}`,
                'User-Agent': 'DiscordBot',
            },
        });
        const { flags } = await response.json();
        if ((flags &
            (discord_js_1.ApplicationFlags.GatewayGuildMembers |
                discord_js_1.ApplicationFlags.GatewayGuildMembersLimited)) !==
            0)
            privilegedIntents.push(discord_js_1.GatewayIntentBits.GuildMembers);
        if ((flags &
            (discord_js_1.ApplicationFlags.GatewayPresence |
                discord_js_1.ApplicationFlags.GatewayPresenceLimited)) !==
            0)
            privilegedIntents.push(discord_js_1.GatewayIntentBits.GuildPresences);
        if ((flags &
            (discord_js_1.ApplicationFlags.GatewayMessageContent |
                discord_js_1.ApplicationFlags.GatewayMessageContentLimited)) !==
            0)
            privilegedIntents.push(discord_js_1.GatewayIntentBits.MessageContent);
    }
    catch (error) {
        console.error(error);
    }
    return privilegedIntents;
};
exports.fetchPrivilegedIntents = fetchPrivilegedIntents;
