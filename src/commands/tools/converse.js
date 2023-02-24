/*
  Placeholder for accessing the huggingface.co API to be able to make use of a few custom rolled natural language processing ML models.
*/
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("converse")
    .setDescription("Testing a basic conversation."),
  async execute(interaction) {
    await interaction.reply({
      content: "I don't feel like talking right now.",
      ephemeral: true,
    });

    console.log(
      `The channel was ${interaction.channel} and ${interaction.user}`
    );
    interaction.followUp({ content: "Sorry", ephemeral: true });
  },
};
