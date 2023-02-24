/*
  Interactivity to provide a way for users to set their own channel timers, created for a personal server. User chooses the next or following Saturday
  as the challenge end date, which is recorded on the DB. This also includes an automatic announcement scheduler
*/

const { SlashCommandBuilder } = require("discord.js");
const moment = require("moment-timezone");
const { updateChallengeNotification } = require("../../database/");
const database = require("../../database/");

const dateOptions = [
  { name: "This Saturday", value: 1 },
  { name: "A week from this Satudray", value: 2 },
];

const { ART_CHANNEL_ID } = process.env;

//Function called on an interval for gathering any active challenge, and if so, announcing it to the channel.
const notifyChannelFunction = async (client) => {
  const channel = client.channels.cache.get(ART_CHANNEL_ID);

  const challenges = await database.getCurrentChallenge();
  if (challenges?.length == 0) return;
  let challenge = challenges[0];

  let currentTime = {
    momentTime: moment.tz(moment(), "America/New_York"),
    ticks: moment.tz(moment(), "America/New_York").valueOf(),
  };

  const reminder = `REMINDER: Challenge **${challenge.challenge_name.toUpperCase()}**${
    challenge.description
      ? " with description **" + challenge.description + "**"
      : ""
  } will end at ${moment
    .tz(parseInt(challenge.end_date), "America/New_York")
    .format("MM/DD/YYYY hh:mma")} ! Remember to get your submission in!`;

  if (challenge.last_challenge_notice === null) {
    updateChallengeNotification(currentTime.ticks, challenge.id);
    console.log("Updating challenge.");
    return;
  } else {
    const last_notice = moment.tz(
      parseInt(challenge.last_challenge_notice),
      "America/New_York"
    );
    const hours = currentTime.momentTime.diff(last_notice, "hours");
    if (hours >= 6) {
      console.log("Updating challenge.");
      updateChallengeNotification(currentTime.ticks, challenge.id);
      channel.send(reminder);
    }
  }
};

module.exports = {
  //Check every 5 minutes to see if it's time to send another announcement to the channel.
  init: async (client) => {
    setInterval(() => {
      notifyChannelFunction(client);
    }, 1000 * 60 * 30);
  },
  data: new SlashCommandBuilder()
    .setName("setchallenge")
    .setDescription("Set an art challenge reminder.")
    .addIntegerOption((option) => {
      return option
        .setName("week")
        .setDescription("When should this art challenge run until?")
        .setRequired(true)
        .addChoices(...dateOptions);
    })
    .addStringOption((option) => {
      return option
        .setName("challenge_theme")
        .setDescription("What is the theme of the challenge?")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("challenge_description")
        .setDescription(
          "Are there any additional details about this challenge theme?"
        )
        .setRequired(false);
    }),

  async execute(interaction, client) {
    //Specific channel for Art challenges
    let finalmessage;

    //If a challenge is currently running, a new one cannot be added.
    const currentChallenge = await database.getCurrentChallenge();
    if (currentChallenge.length > 0) {
      finalmessage = `You can't set a new art challenge because the **${currentChallenge[0].challenge_name.toUpperCase()}** challenge is still running!\n\nIt will end at ${moment
        .tz(parseInt(currentChallenge[0].end_date), "America/New_York")
        .format("MM/DD/YYYY hh:mma")}`;
      await interaction.reply({
        content: finalmessage,
      });
      return;
    }

    //Record the challenge date and record the users of the new change.
    finalmessage = await database.setNewChallenge(
      interaction.options.getString("challenge_theme"),
      interaction.options.getString("challenge_description"),
      interaction.user,
      interaction.options.getInteger("week")
    );

    await interaction.reply({
      content: finalmessage,
    });
  },
};
