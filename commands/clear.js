module.exports = {

    // Data object that includes all the JSON to post to the Discord command endpoint.
    "data": {
        "name": "clear",
        "description": "Clears all voice channels that have been made by BuddyBot.",

    },

    // A list that contains all the ids of the roles allowed to use this command. Set null for any role.
    permission_roles: null,

    // A list that contains all the Strings of the permissions needed to use this command. Set null for any permission.
    permissions: null,

    /**
     * 
     * Clears all the channels created by BuddyBot.
     * 
     * @author Nausher Rao
     * @author Nathan Laundry
     * 
     */
    execute: async (discord, interaction) => {
        let channels = require('/data.json').channels;
        for(const uid of channels) {
            console.log(`Deleted channel: ${uid}`);
            discord.channels.cache.get(uid).delete();

        }
    }

}