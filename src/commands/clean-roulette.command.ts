import {Command} from "./command.interface";
import {SlashCommandBuilder} from "@discordjs/builders";
import {Client, CommandInteraction} from "discord.js";
import votesJson from "../votes.json";

export class PickRandomCommand implements Command {
    public data: Omit<SlashCommandBuilder, string>;

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('limpiar-lista')
            .setDescription('Reinicia la lista de películas.')
    }

    public async execute(interaction: CommandInteraction, client: Client): Promise<void> {
        await interaction.reply({ content: 'La lista ha sido destruida.' });
        votesJson.splice(0, votesJson.length);
    }
}

const command = new PickRandomCommand();

export default command;