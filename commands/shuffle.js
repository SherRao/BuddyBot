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
        let voiceChannels = [];
        for(let i = 1; i <= channelCount; i++) {
            try {
                const vc = await server.channels.create("Test #" + i, { type: "voice", reason: "Trivia Night" });
                voiceChannels.push(vc);
            
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

        // Writes the created channels IDs to 'data.json'.
        let dataFile = require('/data.json');
        let data = {}
        data.channels = voiceChannels;

        fs.writeFile("data.json", JSON.stringify(data), function(err) {
            if(err) throw err;
            console.log("Complete");

        } );
    }

}