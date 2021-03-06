const config = require('./../config.json');

let voiceChannels = [];
let numbers = [];

module.exports = {

    "data": {
        "name": "shuffle",
        "description": "Used to shuffle the people in a voice channel to a bunch of different voice channels.",
        "options": [
            {
                "name": "channel",
                "description": "The channel that contains all the peoples.",
                "type": 7,
                "required": true
                // "options": [
                //     {
                //         "name": "usersPerChannel",
                //         "description": "The amount of users to put into each channel.",
                //         "type": 4,
                //         "required": false
                //     }]
            },
        ]
    },

    // A list that contains all the ids of the roles allowed to use this command. Set null for any role.
    permission_roles: null,

    // A list that contains all the Strings of the permissions needed to use this command. Set null for any permission.
    permissions: null,

    /**
     * 
     * Grabs all server members from the voice channel specified, and deletes them from the server.
     * 
     * @author Nausher Rao
     * @author Nathan Laundry
     * 
     */
     execute: async (discord, interaction) => {
        let args = interaction.data.options;
        let channelId = args[0].value; // Grabs the channel ID for the initial channel.
        let userPerChannel = args.length > 1 ? args[1] : 2; // Grabs the users per channel - defaults to 2.

        let server = discord.guilds.cache.get(interaction.guild_id);
        let initialVoiceChannel = discord.channels.cache.get(channelId);
    
        let members = initialVoiceChannel.members;
        let channelCount = Math.ceil(members.size / userPerChannel);
    
        // Creates and stores new voice channels.
        for(let i = 1; i <= channelCount; i++) {
            try {
                let r = Math.floor(Math.random() * 98) + 1;
                console.log(r);

                const vc = await server.channels.create("Trivia Night #" + r, { type: "voice", reason: "RUHacks Trivia Night" });
                vc.setParent(config.category);
                voiceChannels.push(vc);
                numbers.push(r);

            } catch(err) {
                console.log(err);
            }
        }
    
        //Moves people to voice channels.
        let counter = 0;  
        members.forEach( member => {
            member.voice.setChannel(voiceChannels[counter % channelCount]);
            counter += 1;
            
        } );

        discord.api.interactions(interaction.id, interaction.token).callback.post({
            data: { type: 4, data: {content: `Moved ${members.size} people!`} }

        });
    },
}