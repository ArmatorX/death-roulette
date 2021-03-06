import {Command} from "./command.interface";
import {SlashCommandBuilder} from "@discordjs/builders";
import {Client, CommandInteraction} from "discord.js";
import {votes} from "../../index";

export class CleanRouletteCommand implements Command {
    public data: Omit<SlashCommandBuilder, string>;

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('limpiar-lista')
            .setDescription('Reinicia la lista de películas.')
    }

    public async execute(interaction: CommandInteraction, client: Client): Promise<void> {
        votes.clear();
        await interaction.reply({ content: 'La lista ha sido destruida.' });
    }
}

const command = new CleanRouletteCommand();

export default command;