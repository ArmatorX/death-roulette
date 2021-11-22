import {Client, Collection, CommandInteraction, Interaction} from "discord.js";
import {REST} from "@discordjs/rest";
import * as fs from "fs";
import {Command} from "./commands/command.interface";
import {Routes} from "discord-api-types/v9";


export class CommandManager {
    private guildId: string;
    private clientId: string;
    private client: Client;
    private rest: REST;
    private commands: Collection<string, Command>;

    constructor(guildId: string, clientId: string, token: string, client: Client) {
        this.guildId = guildId;
        this.clientId = clientId;
        this.client = client;
        this.rest = new REST({ version: "9" }).setToken(token);
        this.commands = this.getCommands();
    }

    async reloadCommands() {
        try {
            console.log("Started refreshing application (/) commands.");

            await this.rest.put(
                Routes.applicationGuildCommands(this.clientId, this.guildId),
                { body: this.commands.map((c) => c.data) }
            );

            console.log("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.error(error);
        }
    }

    async processInteraction(interaction: Interaction) {
        console.log("Processing interaction.");
        if (!interaction.isCommand()) {
            console.log("Interaction is not a command.");
            return;
        }

        const command = this.commands.get(interaction.commandName);

        if (!command) {
            console.log("Interaction is not a know command.");
            return;
        }

        try {
            console.log(`Command detected: ${interaction.commandName}`);
            await command.execute(interaction, this.client)
                .catch(async (error: any) => await this.commandErrorProcessing(error, interaction));
        } catch (error) {
            await this.commandErrorProcessing(error, interaction);
        }
    }

    getCommands(): Collection<string, Command> {
        const commands = new Collection<string, Command>();
        const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.command.ts'));

        for (const file of commandFiles) {
            const command = require(`./commands/${file}`).default;
            commands.set(command.data.name, command);
        }

        return commands;
    }

    async commandErrorProcessing(error: any, interaction: CommandInteraction) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}
