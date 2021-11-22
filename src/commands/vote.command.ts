import {Command} from "./command.interface";
import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import {Client, CommandInteraction, User} from "discord.js";
import votesJson from "../votes.json";
import {Vote} from "./vote.interface";

const USER_VOTES = 2;

export class VoteCommand implements Command {
    public data: Omit<SlashCommandBuilder, string>;
    private votes = votesJson as Vote[];
    private vote: Vote;

    constructor() {
        this.vote = { id: 0, movieName: 'undefined', userId: 'undefined', hasBeenWatched: false };
        this.data = new SlashCommandBuilder()
            .setName('votar')
            .setDescription('Permite votar una película.')
            .addStringOption((option: SlashCommandStringOption) =>
                option
                    .setName('pelicula')
                    .setDescription('Película a votar. También puedes votar usando su id.')
                    .setRequired(true)
            );
    }

    public async execute(interaction: CommandInteraction, client: Client): Promise<void> {
        if (this.userHasVotes(interaction.user)) {
            this.vote = { id: 0, movieName: 'undefined', userId: 'undefined', hasBeenWatched: false };
            this.vote.id = this.votes.length;
            this.vote.userId = interaction.user.id;
            const movieName = interaction.options.getString('pelicula') as string;
            const movieId = parseInt(movieName);

            if (isNaN(movieId)) {
                this.vote.movieName = movieName;
            } else {
                const vote = this.votes.find(v => v.id === movieId) as Vote;

                if (vote.hasBeenWatched) {
                    await interaction.reply({ content: 'Ya vimos esta peli.', ephemeral: true });
                    return;
                }

                this.vote.movieName = vote.movieName;
            }

            this.votes.push(this.vote);

            await interaction.reply(`Has votado para ver \`${this.vote.movieName}\`\n\nTiene un total de \`${this.getNumberOfVotesFromMovie()}\` votos.`);
        } else {
            await interaction.reply({ content: 'No te quedan votos.', ephemeral: true });
        }

    }

    private userHasVotes(user: User): boolean {
        return this.votes.filter(v => v.userId === user.id).length < USER_VOTES;
    }

    private getNumberOfVotesFromMovie(): number {
        return this.votes.filter(v => v.movieName === this.vote.movieName).length
    }
}

const command = new VoteCommand();

export default command;