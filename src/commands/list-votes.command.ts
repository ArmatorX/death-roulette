import {Command} from "./command.interface";
import {SlashCommandBuilder} from "@discordjs/builders";
import {Client, CommandInteraction} from "discord.js";
import {votes} from "../../index";

export class ListVotesCommand implements Command {
    public data: Omit<SlashCommandBuilder, string>;

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('listar-votos')
            .setDescription('Muestra la lista de películas con la cantidad de votos de cada una.');
    }

    public async execute(interaction: CommandInteraction, client: Client): Promise<void> {
        votes.clearIfEmpty();

        if (votes.isEmpty) {
            await interaction.reply({ content: 'La lista está vacía.' });
            return;
        }

        let response = `La lista de películas es:\n\n`;

        const movieLines = votes.getMoviesWithVotes();

        response += movieLines.join('\n');

        await interaction.reply(response);
    }
}

const command = new ListVotesCommand();

export default command;