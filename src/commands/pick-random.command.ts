import {Command} from "./command.interface";
import {SlashCommandBuilder} from "@discordjs/builders";
import {Client, CommandInteraction} from "discord.js";
import votesJson from "../votes.json";
import {Vote} from "./vote.interface";

export class PickRandomCommand implements Command {
    public data: Omit<SlashCommandBuilder, string>;
    private votes = votesJson as Vote[];

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('sortear')
            .setDescription('Realiza el sorteo de la película.')
    }

    public async execute(interaction: CommandInteraction, client: Client): Promise<void> {
        this.votes = votesJson.filter(v => !v.hasBeenWatched);
        if (this.votes.length === 0) {
            await interaction.reply({ content: 'La lista está vacía.', ephemeral: true });
            votesJson.splice(0, votesJson.length - 1);
            return;
        }
        await interaction.reply('La ruleta empezó a girar. El destino decidirá...');
        const index = Math.floor(Math.random() * this.votes.length);
        const pick = this.votes[index];
        this.votes.filter(v => v.movieName === pick.movieName)
            .forEach(v => v.hasBeenWatched = true);
        await interaction.followUp(`Se mira **${pick.movieName}**. ¡La ruleta ha hablado!`);
    }
}

const command = new PickRandomCommand();

export default command;