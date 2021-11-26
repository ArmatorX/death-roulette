import {Command} from "./command.interface";
import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import {Client, CommandInteraction} from "discord.js";
import {Vote} from "../classes/vote.class";
import {NULL_VOTE} from "../global.constants";
import {votes} from "../../index";

export class VoteCommand implements Command {
    public data: Omit<SlashCommandBuilder, string>;
    private vote: Vote = NULL_VOTE;

    constructor() {
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
        if (votes.canUserVote(interaction.user.id)) {
            this.vote = new Vote(votes.length, interaction.user.id, interaction.options.getString('pelicula') as string);
            const voteId = parseInt(this.vote.movieName);

            if (!isNaN(voteId)) {
                const vote = votes.findVoteById(voteId);

                if (vote.hasBeenWatched) {
                    await interaction.reply({ content: 'Ya vimos esta peli.', ephemeral: true });
                    return;
                }

                this.vote.movieName = vote.movieName;
            }

            votes.add(this.vote);
            console.log(this.vote);
            await interaction.reply(`Has votado para ver \`${this.vote.movieName}\`\n\nTiene un total de \`${votes.getNumberOfVotesForMovie(this.vote.movieName)}\` votos.`);
        } else {
            await interaction.reply({ content: 'No te quedan votos.', ephemeral: true });
        }

    }
}

const command = new VoteCommand();

export default command;