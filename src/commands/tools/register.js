/*
  Some channel functions required registration to use. This isn't really a Discord requirement, I just wanted to set this up to add a roadblock
  in case someone attempted to hijack the bot for spamming purposes.
*/

const { SlashCommandBuilder } = require("discord.js");
const dbconnection = require("../../database/");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register yourself for using bot features."),
  async execute(interaction) {
    const response = await dbconnection.addUser(interaction.user);
    await interaction.reply({
      content: response,
      ephemeral: true,
    });
  },
};
