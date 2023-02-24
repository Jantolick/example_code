/*
  Rock, Paper, Scissors on Discord, set up for integration with a remote database. See: /src/database/models for model information.
  Works with DiscordJS to provide interactivity for the bot to play a simple, random chance game of rock paper scissors. User information
  and game outcome is stored in the database.
*/

const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
const database = require("../../database/");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play_rps")
    .setDescription("Play a fast game of rock paper scissors."),
  async execute(interaction, client) {
    if (interaction.isButton()) {
      rps_game(interaction, client);
      console.log("__________IS BUTTON________");
    }

    if (interaction.isChatInputCommand()) {
      await interaction.deferReply({
        ephemeral: true,
      });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("rpsgame_rock")
          .setLabel("ROCK")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("rpsgame_paper")
          .setLabel("PAPER")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("rpsgame_scissors")
          .setLabel("SCISSORS")
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.editReply({
        content:
          "You've challenged THE MACHINE to a game or Rock Paper Scissors!\n\nWhat will you choose?",
        components: [row],
        ephemeral: true,
      });

      let m = await interaction.fetchReply();

      const filter = (i) => {
        return (
          i.customId.indexOf("rpsgame_") > -1 &&
          i.user.id === interaction.user.id &&
          i.message.id === m.id
        );
      };

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 15000,
      });

      collector.on("collect", async (i) => {
        const choice = i.customId.split("_")[1].toUpperCase();

        await interaction.editReply({
          content: `You chose ${i.customId
            .split("_")[1]
            .toUpperCase()}! Let's see how you do...`,
          components: [],
        });
        rps_game(interaction, choice);
      });
    }
  },
};

async function rps_game(interaction, choice) {
  const possibilities = ["ROCK", "PAPER", "SCISSORS"];

  const playerName = `${
    interaction.member.nickname
      ? interaction.member.nickname
      : interaction.user.username
  }`;

  let replychoice =
    possibilities[Math.floor(Math.random() * possibilities.length)];

  let responseMessage;

  let matchResult;

  if (choice === replychoice) {
    responseMessage = `${playerName} decided to challenge the MACHINE in a game of Rock Paper Scissors and both chose ${replychoice}! It's a draw!`;
    matchResult = "DRAW";
  } else if (
    (choice === "ROCK" && replychoice === "SCISSORS") ||
    (choice === "SCISSORS" && replychoice === "PAPER") ||
    (choice === "PAPER" && replychoice === "ROCK")
  ) {
    matchResult = "WIN";
    responseMessage = `${playerName} decided to challenge the MACHINE in a game of Rock Paper Scissors and chose ${choice} while the machine chose ${replychoice}! You win!`;
  } else {
    matchResult = "LOSE";
    responseMessage = `${playerName} decided to challenge the MACHINE in a game of Rock Paper Scissors and chose ${choice} while the machine chose ${replychoice} -- you LOSE, good DAY sir.`;
  }

  await interaction.followUp({
    content: responseMessage,
  });

  console.log(
    `${playerName} chose ${choice} and the machine chose ${replychoice}.`
  );

  database.logRPSGame(interaction.user, choice, 0, replychoice);
}
