"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientErrorMessages = exports.ClientErrorCodes = void 0;
var ClientErrorCodes;
(function (ClientErrorCodes) {
    ClientErrorCodes["CLIENT_NOT_READY"] = "CLIENT_NOT_READY";
    ClientErrorCodes["NOT_GUILD_CHANNEL"] = "NOT_GUILD_CHANNEL";
    ClientErrorCodes["NOT_TEXT_BASED_CHANNEL"] = "NOT_TEXT_BASED_CHANNEL";
    ClientErrorCodes["NO_CURRENT_CHANNEL"] = "NO_CURRENT_CHANNEL";
    ClientErrorCodes["CANNOT_FETCH_GUILD"] = "CANNOT_FETCH_GUILD";
    ClientErrorCodes["NO_VIEWABLE_CHANNEL_IN_GUILD"] = "NO_VIEWABLE_CHANNEL_IN_GUILD";
    ClientErrorCodes["CANNOT_FETCH_CHANNEL"] = "CANNOT_FETCH_CHANNEL";
    ClientErrorCodes["MISSING_PERMISSIONS"] = "MISSING_PERMISSIONS";
    ClientErrorCodes["INCORRECT_IPC_CHANNEL"] = "INCORRECT_IPC_CHANNEL";
    ClientErrorCodes["CANNOT_FETCH_USER"] = "CANNOT_FETCH_USER";
    ClientErrorCodes["CANNOT_CREATE_DM"] = "CANNOT_CREATE_DM";
})(ClientErrorCodes || (exports.ClientErrorCodes = ClientErrorCodes = {}));
exports.ClientErrorMessages = {
    CLIENT_NOT_READY: 'Discord client is not ready yet.',
    NOT_GUILD_CHANNEL: 'Target channel is not a guild channel.',
    NOT_TEXT_BASED_CHANNEL: 'Target channel is not a text-based channel.',
    NO_CURRENT_CHANNEL: 'No channel is currently selected.',
    CANNOT_FETCH_GUILD: 'Target guild could not be fetched.',
    NO_VIEWABLE_CHANNEL_IN_GUILD: 'Target guild does not have a channel viewable by client user.',
    CANNOT_FETCH_CHANNEL: 'Target channel could not be fetched.',
    MISSING_PERMISSIONS: 'Client user does not have permissions to perform the action.',
    INCORRECT_IPC_CHANNEL: 'Incorrect IPC channel was used.',
    CANNOT_FETCH_USER: 'Target used could not be fetched.',
    CANNOT_CREATE_DM: 'A DM channel could not be created with the target user.',
};
