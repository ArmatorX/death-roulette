import {Command} from "./command.interface";
import {SlashCommandBuilder} from "@discordjs/builders";
import {Client, CommandInteraction} from "discord.js";
import {votes} from "../../index";

export class ClearMyOldVotesCommand implements Command {
    public data: Omit<SlashCommandBuilder, string>;

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('reiniciar-mis-votos')
            .setDescription('Elimina los votos que no usaste todavía para que puedas votar nuevas pelis.')
    }

    public async execute(interaction: CommandInteraction, client: Client): Promise<void> {
        votes.removeUnusedVotesFromUser(interaction.user.id);
        interaction.reply({ content: 'Se reiniciaron todos los votos que no usaste.', ephemeral: true });
    }
}

const command = new ClearMyOldVotesCommand();

export default command;