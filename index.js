const discordAdmin = require('discord.js');
const discord = new discordAdmin.Client();

const config = require('./config.json');

async function main() {
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

async function registerCommandEvent() {
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

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} array to split
 * @param chunk_size {Integer} Size of every group
 */
 function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
}

async function shuffleCommand(interaction) {
    let args = interaction.data.options;
    let channelId = args[0].value;

    let server = getGuild(interaction);
    let initialVoiceChannel = discord.channels.cache.get(channelId);

    let userPerChannel = 2;
    let members = initialVoiceChannel.members;
    let channelCount = members.size / userPerChannel;

    // Creates and stores new voice channels.
    let voiceChannels = [];
    for(let i = 1; i <= channelCount; i++) {
        try {
            const vc = await server.channels.create("Trivia Night Room #" + i, { type: "voice", reason: "Trivia Night" });
            voiceChannels.push(vc);
        
        } catch (err) {
            console.log(err);
        }
    }

    for(let i = 0; i < members.size; i++) {
        console.log(members.get(0));
        const member = members[i];
        const channel = voiceChannels[0];
        member.voice.setChannel(channel);

    }

    // Move each member to alternating voice channels.
    // let counter = 0;
    // members.forEach(async member => {
    //     try {
    //         let channel = voiceChannels[counter % channelCount];
    //         let channelSet = await member.voice.setChannel(channel);
    //         counter++;

    //     } catch(err) {
    //         console.log(err);
        
    //     }
    // });

}

main();