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
        if(command == "shuffle") {
            const member = getMember(interaction);
            if(member.roles.cache.has(config.mod_role)) {
                shuffleCommand(args);

            } else {} //say bad message

        }
    });
}

function getMember(interaction) {
    const uid = interaction.member.user.id;
    const member = guild.members.cache.get(uid);

    return member
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
    let channelId = args[0].value;
    let voiceChannel = discord.channels.cache.get(channelId);
    let members = voiceChannel.members;
    let channelCount = members.size / userPerChannel;

    for(var i = 1; i <= channelCount; i++) {
        interaction.guild.channels.create("Trivia Night Room #" + i, {reason: "Trivia Night"})
            .then(console.log)
            .catch(console.error);

    }
}

main();