import {Command} from "./command.interface";
import {SlashCommandBuilder} from "@discordjs/builders";
import {Client, CommandInteraction} from "discord.js";
import {votes} from "../../index";

export class CountMyVotesCommand implements Command {
    public data: Omit<SlashCommandBuilder, string>;

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('cuantos-votos-me-quedan')
            .setDescription('Devuelve la cantidad de votos que te quedan.')
    }

    public async execute(interaction: CommandInteraction, client: Client): Promise<void> {
        await interaction.reply({ content: `Te quedan ${votes.getNumberOfVotesLeftForUser(interaction.user.id)} votos.`, ephemeral: true });
    }
}

const command = new CountMyVotesCommand();

export default command;