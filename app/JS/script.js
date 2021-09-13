// Global variables
const { Message, TextChannel, CategoryChannel, MessageEmbed, MessageAttachment, Sticker } = require("discord.js");
const { ipcRenderer } = require("electron");
const messageArea = document.querySelector('discord-messages');
const messageField = document.querySelector('#messageField');
const guildHeader = document.querySelector('#guildHeader');
const channelHeader = document.querySelector('#channelHeader');
const channelList = document.querySelector('#channelList');
const loadingWrapper = document.querySelector('#loadingWrapper');
const loadingGif = document.querySelector('#loadingGif');

const token = window.localStorage.getItem('token');
let clientUser, loaded = false;
let currentGuildId, currentChannelId, channelsInCurrentGuild;

// ******************* CHECK LOGIN *******************
if(!token)
    window.location.assign('login.html');
else
    ipcRenderer.send('login', token);

// ******************* LOADING SCREEN *******************
const clearLoadingScreen = async () => {
    loadingGif.pause();
    setTimeout(() => {
        loadingWrapper.style.display = 'none';
    }, 1000);
    return true;
}

// ******************* HANDLING MESSAGE BOX *******************
messageField.addEventListener('keyup', event => {
    if(event.key != 'Enter' || !messageField.value.trim()) return;
    ipcRenderer.send('message', messageField.value.trim(), currentChannelId);
    messageField.value = "";
});


// ******************* HANDLING IPC RENDERER EVENTS *******************
ipcRenderer.on('error', (event, code, message) => {
    alert(`${code} ${message}`)
    if(code === 'TOKEN_INVALID'){
        window.localStorage.removeItem('token');
        window.location.assign('login.html');
    }
    
});

ipcRenderer.on('login', (event, data) => {
    clientUser = data;
    document.querySelector('#clientUserAvatar').setAttribute('src', clientUser.avatarURL);
    document.querySelector('#clientUsername').innerText = clientUser.username;
    document.querySelector('#clientDiscriminator').innerText = `#${clientUser.discriminator}`;
    ipcRenderer.send('load-all-guilds', {});
});

ipcRenderer.on('load-all-guilds', (event, guilds) => {
    const guildList = document.querySelector('#guildList');

    // Load first guild to populate the UI
    ipcRenderer.send('load-one-guild', guilds.keys().next().value);
    
    for(const [id, guild] of guilds){
        const guildElement = document.createElement('li');
        guildElement.classList.add('guildElement');
        guildElement.innerHTML = `<img src="${guild.iconURL}" alt="image" class="guildIcon">`;
        guildElement.setAttribute('data-guild-id', guild.id);
        guildElement.addEventListener('click', function(){
            ipcRenderer.send('load-one-guild', this.getAttribute('data-guild-id'));
        });
        guildList.appendChild(guildElement);
    }
});

ipcRenderer.on('load-one-guild', (event, unfiltered, guild) => {
    guildHeader.innerText = guild.name;
    currentGuildId = guild.id;
    channelsInCurrentGuild = unfiltered;
    channelList.innerHTML = '';

    // Sort channels in order in which they are displayed
    const channels = [...unfiltered.values()].filter(channel => ['GUILD_TEXT', 'GUILD_CATEGORY'].includes(channel.type));

    const categoryChannels = channels.filter(channel => channel.type === 'GUILD_CATEGORY').sort((a,b) => a.rawPosition - b.rawPosition);
    const textChannels = channels.filter(channel => channel.type === 'GUILD_TEXT').sort((a,b) => a.rawPosition - b.rawPosition);
    const orphanChannels = textChannels.filter(channel => !channel.parentId);
    const orderedChannels = [];
    orderedChannels.pushArray(orphanChannels);
    for(const categoryChannel of categoryChannels){
        const children = textChannels.filter(channel => channel.parentId === categoryChannel.id);
        orderedChannels.push(categoryChannel);
        orderedChannels.pushArray(children);
    }
    
    orderedChannels.forEach(channel => addChannelElement(channel));
})

ipcRenderer.on('load-one-channel', (event, channel, messages, members) => {
    if(!loaded) // Removes load screen
        loaded = clearLoadingScreen();

    channelHeader.innerHTML = `<i class="fas fa-hashtag" style="color:#b9bbbe; font-size: 18px"></i> ${channel.name}`;
    
    messageField.setAttribute('placeholder', `Message #${channel.name}`);
    currentChannelId = channel.id;
    
    // Loads messages [limit : 50]
    messageArea.innerHTML = '';
    [...messages.values()].reverse().forEach(message => {
        addMessageElement(message);
    });
});

// <=== DISCORD CLIENT EVENTS RELAYED THROUGH IPC EVENTS ===>
ipcRenderer.on('messageCreate', (event, message, channel) => {
    if(channel.id !== currentChannelId)
        return;
    addMessageElement(message);
});







// *************************** UTIITY FUNCTIONS **********************

/**
 * Creates a new <discord-message> element
 * @param {Message} message The message to add
 */
const addMessageElement = message => {
    const fullyScrolled = messageArea.scrollTop + messageArea.clientHeight >= messageArea.scrollHeight;

    const messageElement = document.createElement('discord-message');

    messageElement.setAttributes({
        author: message.author.username,
        avatar: message.authorAvatarURL,
        bot: message.author.bot,
        verified: message.authorVerifiedBot,
        timestamp: parseTimestamp(message.createdTimestamp),
        edited: message.editedTimestamp ? true : false
    });

    if(message.type === 'REPLY'){
        const replyElement = document.createElement('discord-reply');
        replyElement.setAttributes({
            slot: 'reply',
            edited: message.repliesTo.editedTimestamp ? true : false,
            author: message.repliesTo.author.username,
            avatar: message.repliesTo.authorAvatarURL,
            bot: message.repliesTo.author.bot,
            verified: message.repliesTo.authorVerifiedBot,
            attachment: message.repliesTo.editedTimestamp ? true : false
        });

        const allowance = 80 - message.repliesTo.author.username.length;
        const replyContent = message.repliesTo.content.substring(0, allowance) + (message.repliesTo.content.length >= allowance ? '...' : '');
        replyElement.innerText = replyContent;
        messageElement.appendChild(replyElement);
    }
    
    messageElement.innerHTML += format(message);

    // <=== PARSE IMAGE ATTACHMENTS AND STICKERS SIMILARLY ===>
    message.stickers.forEach(sticker => {
        parseSticker(sticker, messageElement);
    })
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    const imageAttachments = [...message.attachments.values()].filter(attachment => allowedImageTypes.includes(attachment.contentType));
    imageAttachments.forEach(attachment => {
        parseImageAttachments(attachment, messageElement);
    });

    // <=== PARSE MESSAGE EMBEDS ===>
    message.embeds.forEach(embed => {
        parseMessageEmbed(embed, messageElement);
    });

    messageElement.setAttribute('data-message-id', message.id);
    messageElement.setAttribute('data-author-id', message.author.id);

    messageArea.appendChild(messageElement);
    
    // <=== AUTOSCROLLING ===> HOPEFULLY FIXED
    if(fullyScrolled)
        setTimeout(() => {
            messageArea.scrollTo(0, messageArea.scrollHeight);
        }, 700);
    
};

/**
 * Parse image attachments into components
 * @param {MessageAttachment} imageAttachment The attachment to parse
 * @param {Element} messageElement The <discord-message> element represnting the message this attachment belongs to
 */
const parseImageAttachments = (imageAttachment, messageElement) => {
    const attachment = document.createElement('discord-attachment');
    attachment.setAttribute('slot', 'attachments');
    attachment.setAttribute('url', imageAttachment.url);

    // <=== RESIZE IMAGE ===>
    const biggerSide = (imageAttachment.height > imageAttachment.width) ? 'height' : 'width';
    const allowance = biggerSide === 'height' ? 300 : 500;
    attachment.setAttribute(biggerSide, Math.min(imageAttachment[biggerSide], allowance));

    attachment.setAttribute('alt', imageAttachment.name);
    messageElement.appendChild(attachment);
};


/**
 * Parse tenor video embeds to <discord-tenor-vide> components
 * @param {MessageEmbed} embed The tenor video embed
 * @param {Element} messageElement The <discord-message> element representing the message this embed belongs to
 */
const parseTenorVideo = (embed, messageElement) => {
    const tenorVideoElement = document.createElement('discord-tenor-video');
    // <=== RESIZE VIDEO ===>
    const biggerSide = (embed.video.height > embed.video.width) ? 'height' : 'width';
    const allowance = biggerSide === 'height' ? 300 : 400;
    tenorVideoElement.setAttributes({
        slot: 'attachments',
        url: embed.video.url,
    });
    tenorVideoElement.setAttribute(`${biggerSide}`, Math.min(embed.video[biggerSide], allowance));
    messageElement.appendChild(tenorVideoElement);
}


/**
 * Parse stickers into components [similar to image attachments]
 * @param {Sticker} sticker The sticker to parse
 * @param {Element} messageElement The <discord-message> element represnting the message this sticker belongs to
 */
const parseSticker = (sticker, messageElement) => {
    const attachment = document.createElement('discord-attachment');
    attachment.setAttribute('slot', 'attachments');
    attachment.setAttribute('url', sticker.URL);
    attachment.setAttribute('width', 150);
    attachment.setAttribute('alt', sticker.name);
    messageElement.appendChild(attachment);
};

/**
 * Parse embeds into components
 * @param {MessageEmbed} embed The message embed to parse
 * @param {HTMLElement} messageElement The <discord-message> element represnting the message this embed belongs to
 */
const parseMessageEmbed = (embed, messageElement) => {
    // <=== TENOR VIDEO EMBEDS SHOULD BE PARSED DIFFERENTLY ===>
    if(embed.provider?.name === 'Tenor')
        return parseTenorVideo(embed, messageElement);

    const embedElement = document.createElement('discord-embed');
    embedElement.setAttribute('slot', 'embeds');
    if(embed.author?.name) embedElement.setAttribute('author-name', embed.author.name);
    if(embed.author?.iconURL) embedElement.setAttribute('author-image', embed.author.iconURL);
    if(embed.author?.url) embedElement.setAttribute('author-url', embed.author.url);
    if(embed.color) embedElement.setAttribute('color', colorToHexString(embed.color));
    if(embed.title) embedElement.setAttribute('embed-title', embed.title);
    if(embed.footer?.iconURL) embedElement.setAttribute('footer-image', embed.footer.iconURL);
    if(embed.image?.url) embedElement.setAttribute('image', embed.image.url);
    if(embed.url) embedElement.setAttribute('url', embed.url);
    if(embed.timestamp) embedElement.setAttribute('timestamp', parseTimestamp(embed.timestamp));
    if(embed.video){
        embedElement.setAttribute('video', embed.video.url);
        embedElement.setAttribute('provider', embed.provider.name);
        embedElement.setAttribute('image', embed.thumbnail.url);
    } else {
        if(embed.thumbnail?.url) embedElement.setAttribute('thumbnail', embed.thumbnail.url);
        embedElement.textContent = embed.description;
    }

    if(embed.fields){
        const embedFields = document.createElement('discord-embed-fields');
        embedFields.setAttribute('slot', 'fields');
        embed.fields.forEach(field => {
            const embedField = document.createElement('discord-embed-field');
            embedField.setAttribute('field-title', field.name);
            if(field.inline) {
                embedField.setAttribute('inline', true);
                const lastField = embedFields.lastElementChild;
                let lastFieldIndex;
                if(lastField?.getAttribute('inline'))
                    lastFieldIndex = parseInt(lastField.getAttribute('inline-index'));
                const thisIndex = !lastFieldIndex ? 1 : (lastFieldIndex === 3 ? 1 : lastFieldIndex + 1);
                embedField.setAttribute('inline-index', thisIndex);
            }
            embedField.textContent = field.value;
            embedFields.appendChild(embedField);
        });
        embedElement.appendChild(embedFields);
    }
    
    messageElement.appendChild(embedElement);
};

/**
 * Creates a new channelElement in channelPane
 * @param {TextChannel | CategoryChannel} channel The channel to add
 */
const addChannelElement = channel => {
    const channelElement = document.createElement('li');
    channelElement.setAttribute('data-channel-id', channel.id);
    channelElement.classList.add('channelElement');
    if(channel.type === 'GUILD_CATEGORY')
        channelElement.classList.add('categoryChannel');
    else{
        channelElement.addEventListener('click', function(){
            ipcRenderer.send('load-one-channel', this.getAttribute('data-channel-id'));
        });
        channelElement.innerHTML = '<i class="fas fa-hashtag"></i> ';
    }
    channelElement.innerHTML += channel.name;
    channelList.appendChild(channelElement);
}

/**
 * Formats mentions in message content
 * @param {Message} message The message to format
 * @returns String
 */
const format = message => {
    let formatted;
    formatted = sanitizeHTML(message.content);
    
    // <=== ROLE MENTIONS ===>
    formatted = formatted.replace(new RegExp(`&lt;@&amp;(\\d{18})&gt;`, 'g'), (match, id) => {
        const role = message.mentions.roles.get(id);
        return `<discord-mention type="role" ${role.color ? `color="${colorToHexString(role.color)}"`: ''}>${role.name}</discord-mention>`
    });    

    // <=== CHANNEL MENTIONS ===>
    const channelTypes = {
        GUILD_TEXT: 'channel',
        GUILD_VOICE: 'voice',
        GUILD_PUBLIC_THREAD: 'thread',
        GUILD_PRIVATE_THREAD: 'thread',
        GUILD_STAGE_VOICE: 'voice',
    }
    formatted = formatted.replace(new RegExp(`&lt;#(\\d{18})&gt;`, 'g'), (match, id) => {
        const channel = channelsInCurrentGuild.get(id);
        if(!channel) return `&lt;#${id}&gt;`;
        return `<discord-mention type="${channelTypes[channel.type] || 'channel'}">${channel.name}</discord-mention>`
    });

    // <=== USER MENTIONS ===>
    formatted = formatted.replace(new RegExp(`&lt;@!?(\\d{18})&gt;`, 'g'), (match, id) => {
        const user = message.mentions.users.get(id);
        return `<discord-mention>${user.username}</discord-mention>`
    });

    return formatted;
}

/**
 * Sanitize a string to prevent XSS attacks before inserting as innerHTML
 * @param {String} str String to parse
 * @returns String
 */
const sanitizeHTML = str => {
	const temp = document.createElement('div');
    temp.style.whiteSpace = 'pre';
	temp.textContent = str;
	return temp.innerHTML;
};

/**
 * Convert decimal color to hex with a leading #
 * @param {Number} dColor Decimal color
 * @returns String
 */
function colorToHexString(dColor) {
    return '#' + dColor.toString(16)
}

/**
 * Parses timestamp as mm-dd-yyyy string
 * @param {*} timestamp Timestamp to parse
 * @returns String
 */
const parseTimestamp = timestamp => {
    let dateObject = new Date(timestamp);
    return `${dateObject.getMonth() + 1}/${dateObject.getDate()}/${dateObject.getFullYear()}`;
}

/**
 * Append an array to this array
 * @param {Array} arr Array to append
 */
Array.prototype.pushArray = function(arr) {
    this.push.apply(this, arr);
};

/**
 * Assign multiple attributes at once
 * @param {any} attrs Object with attributes as keys
 */
Element.prototype.setAttributes = function(attrs) {
    for(var key in attrs) {
        this.setAttribute(key, attrs[key]);
    }
}
  