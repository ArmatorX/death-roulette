import {SlashCommandBuilder} from "@discordjs/builders";
import {Client, CommandInteraction} from "discord.js";

export interface Command {
    data: Omit<SlashCommandBuilder, string>;
    execute(interaction: CommandInteraction, client: Client): Promise<void>;
}