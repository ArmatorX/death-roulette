import {Command} from "./command.interface";
import {SlashCommandBuilder} from "@discordjs/builders";
import {Client, CommandInteraction} from "discord.js";
import {votes} from "../../index";

export class PickRandomCommand implements Command {
    public data: Omit<SlashCommandBuilder, string>;

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('sortear')
            .setDescription('Realiza el sorteo de la película.')
    }

    public async execute(interaction: CommandInteraction, client: Client): Promise<void> {
        votes.clearIfEmpty();

        if (votes.isEmpty) {
            await interaction.reply({ content: 'La lista está vacía.', ephemeral: true });
            return;
        }

        await interaction.reply('La ruleta empezó a girar. El destino decidirá...');
        const pick = votes.pickRandomMovie();
        await interaction.followUp(`Se mira **${pick.movieName}**. ¡La ruleta ha hablado!`);
    }
}

const command = new PickRandomCommand();

export default command;