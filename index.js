const discordAdmin = require('discord.js');
const discord = new discordAdmin.Client();

const config = require('./config.json');
const userPerChannel = 4;

function main() {
    discord.once('ready', () => {
        setPresence();
        postCommand();

        console.log("Bot ready!");
    });

    discord.once("disconnect", () => {
        console.log("Bot disconnected!");

    } );

    discord.ws.on("INTERACTION_CREATE", async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;
        if(command == "shuffle" ){//&& interaction.member.roles.has(config.mod_role)) {
            let guild = discord.guilds.cache.get(interaction.guild_id);
            let member = guild.members.cache.get(interaction.member.user.id);
            if(member.roles.cache.has(config.mod_role)) {
                shuffleCommand(args);

            } else {} //say bad message

        }
    });
    
    discord.login(config.token);
}

function setPresence() {
    discord.user.setPresence({
        status: "dnd",
        activity: {
            name: "on twitch.tv/ccubed_dev !", 
            type: "STREAMING",
            url: "https://www.twitch.tv/ccubed_dev"

        }, type: "STREAMING" });
        
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

function shuffleCommand(args) {
    let voiceChannel = discord.channels.get(args[0][0]);
    let members = voiceChannel.members;
    let channelCount = ~~(members.len / userPerChannel);
    for(var i = 0; i < channelCount; i++) {
        interaction.guild.channels.create("Trivia Night Room #" + (i + 1), {reason: "Trivia Night"})
            .then(console.log)
            .catch(console.error);

        console.log("this works");
    
    }

}

main();