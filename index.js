const discordAdmin = require('discord.js');
const discord = new discordAdmin.Client();

const config = require('./config.json');
const userPerChannel = 4;

function main() {
    initializeBot();
    disconnectBot();
    registerCommandEvent();

    discord.login(config.token);
}

function initializeBot() {
    discord.once('ready', () => {
        setPresence();
        postCommand();

        console.log("Bot ready!");
    });
}

function disconnectBot() {
    discord.once("disconnect", () => {
        console.log("Bot disconnected!");

    });
}

function registerCommandEvent() {
    discord.ws.on("INTERACTION_CREATE", async interaction => {
        const command = interaction.data.name.toLowerCase();
        if (command == "shuffle") {
            const member = getMember(interaction);
            if (member.roles.cache.has(config.mod_role)) {
                shuffleCommand(interaction);

            } else { } //say bad message

        }
    });
}

function getMember(interaction) {
    const guild = discord.guilds.cache.get(interaction.guild_id);
    const uid = interaction.member.user.id;
    const member = guild.members.cache.get(uid);

    return member;
}

function getGuild(interaction) {
    return discord.guilds.cache.get(interaction.guild_id);

}

function setPresence() {
    discord.user.setPresence({
        status: "dnd",
        activity: {
            name: "on twitch.tv/ccubed_dev !",
            type: "STREAMING",
            url: "https://www.twitch.tv/ccubed_dev"

        }, type: "STREAMING"
    });
}

function postCommand() {
    let command = {
        "data": {
            "name": "shuffle",
            "description": "Used to shuffle the people in a voice channel to a bunch of different voice channels.",
            "options": [
                {
                    "name": "channel",
                    "description": "The channel that contains all the peoples.",
                    "type": 7,
                    "required": true
                },
            ]
        }
    };

    discord.api.applications(discord.user.id).guilds(config.server).commands.post(command);
}

function shuffleCommand(interaction) {
    let args = interaction.data.options;
    let channelId = args[0].value;

    let server = getGuild(interaction);
    let initialVoiceChannel = discord.channels.cache.get(channelId);

    let members = initialVoiceChannel.members;
    let channelCount = members.size / userPerChannel;
    
    let voiceChannels = [];
    for(var i = 1; i <= channelCount; i++) {
        server.channels.create("Trivia Night Room #" + i, { type: "voice", reason: "Trivia Night" })
            .then(channel => {
                voiceChannels.
                   
            })

            .catch(console.error);

    }

    let counter = 0;
    members.each( member => {
        let channel = voiceChannels[counter % channelCount];
        member.voice.setChannel(channel)
            .then(console.log("Moved"))
            .catch(console.error);

        counter++;

    } );

}

main();