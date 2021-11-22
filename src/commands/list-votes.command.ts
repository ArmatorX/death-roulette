import {Command} from "./command.interface";
import {SlashCommandBuilder} from "@discordjs/builders";
import {Client, CommandInteraction} from "discord.js";
import votesJson from "../votes.json";
import {Vote} from "./vote.interface";

export class ListVotesCommand implements Command {
    public data: Omit<SlashCommandBuilder, string>;
    private votes = votesJson as Vote[];

    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('listar-votos')
            .setDescription('Muestra la lista de películas con la cantidad de votos de cada una.');
    }

    public async execute(interaction: CommandInteraction, client: Client): Promise<void> {
        this.votes = votesJson.filter(v => !v.hasBeenWatched);
        if (this.votes.length === 0) {
            await interaction.reply({ content: 'La lista está vacía.', ephemeral: true });
            votesJson.splice(0, votesJson.length);
            return;
        }
        let response = `La lista de películas es:\n\n`;

        const linesWithDupplicates = this.votes.map(getFormattedVote)
            .sort((fv1, fv2) => fv1.numberOfVotes > fv2.numberOfVotes ? -1 : 1)
            .map(getMovieLine);

        const movieLines = [...new Set(linesWithDupplicates)];

        response += movieLines.join('\n');

        await interaction.reply(response);
    }
}

const command = new ListVotesCommand();


function getMovieLine(value: any): string {
    return ` ${value.id}. **${value.movieName}**: ${value.numberOfVotes} voto${value.numberOfVotes === 1 ? '' : 's'}.`;
}

function getFormattedVote(value: Vote, index: number, array: Vote[]) {
    return {
        id: array.find(v => v.movieName === value.movieName)?.id,
        movieName: value.movieName,
        numberOfVotes: getNumberOfVotes(array, value.movieName)
    };
}

function getNumberOfVotes(votes: Vote[], movieName: string) : number {
    return votes.filter(vote => vote.movieName === movieName).length;
}

export default command;