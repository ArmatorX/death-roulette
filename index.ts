import {Client, Intents} from "discord.js";
import {CommandManager} from "./src/command-manager.class";
import {ENVIRONMENT} from "./environment";


const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commandManager = new CommandManager(ENVIRONMENT.guildId, ENVIRONMENT.clientId, ENVIRONMENT.discordToken, client);
commandManager.reloadCommands();

client.on('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', (interaction) => commandManager.processInteraction(interaction));

client.login(ENVIRONMENT.discordToken);

