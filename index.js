const fs = require('fs');
const config = require('./config.json');

const discord = new require('discord.js').Client();
const logger = require('js-logger');

let commands = [];  
let events = [];

/**
 * 
 * Main function that handles all calls to other parts of the bot.
 * 
 * @author Nausher Rao
 * 
 */
function main() {
    discord.once('ready', () => {
        logger.useDefaults();

        setPresence();
        registerCommands();
        registerEvents();
        handleCommands();

        console.log("Bot loaded!");
    });

    discord.login(config.token);
}

/**
 * 
 * Sets the initial Discord bot user presence text. 
 * This should be changed to your liking.
 * 
 * @author Nausher Rao
 *
 */
function setPresence() {
    discord.user.setPresence({
        status: "dnd",
        activity: {
            name: "Loading bot...", 
            type: "WATCHING",
            url: null
        },     

    type: "WATCHING" });
}

/**
 * 
 * Load all command files from the "commands" folder, and POST them to the Discord 
 * command endpoint for the specific server.
 * 
 * @author Nausher Rao
 * 
 */
function registerCommands() {
    console.log("Loading commands!");
    let files = fs.readdirSync('./commands')
                    .filter(file => file.endsWith('.js') && file != 'example.js')

    for(const file of files) {
        const command = require(`./commands/${file}`);
        commands.push(command);
        discord.api.applications(discord.user.id).guilds(config.server).commands.post(command);
        
        console.log(`Loaded command from file: ./commands/${file}`);
    }
}

/**
 * 
 * Load all event handler files from the "events" folder, and registers them 
 * with the Discord event manager.
 * 
 * @author Nausher Rao
 * 
 */
function registerEvents() {
    console.log("Loading event handlers!");
    let files = fs.readdirSync('./events')
                    .filter(file => file.endsWith('.js') && file != 'example.js');

    for(const file of files) {
        const event = require(`./events/${file}`);
        events.push(event);
        if(event.once)
            discord.once(event.name, discord.execute(discord));

        else discord.on(event.name, event.execute(discord))
        
        console.log(`Loaded event handler from file: ./events/${file}`);
    }  
}

/**
 * 
 * Code registered directly with the web socket to execute code 
 * when a slash command ("interaction") is recorded. 
 * 
 * @author Nausher Rao
 * 
 */
function handleCommands() {
    console.log("Registering command interaction create listener!");
    discord.ws.on('INTERACTION_CREATE', async interaction => {
        const input = interaction.data.name.toLowerCase();
        
        const user = null;
        const userPermissions = interaction;
        const userRoles = interaciton;

        for(const command of commands) {
            if(command.data.name == input) {
                let permissionsRoles = command.permission_roles;
                let permissions = command.permission;
                if(permissions != null && permissions.includes())

                console.log("Processing command: " + command);
                command.execute(client, interaction);
                break;

            } else
                continue;
    
        }
    });
}

main();