/* 
  Simple die rolling system for use in Discord, since it's lacking on Discord and is pretty convenient for various purposes.
  Format: /roll 1d10000 [+]/[-]#
  +/-# provides an offset, ie, /roll 1d20 - 5 will subtract 5 from the final result.
*/

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a die.")
    .addStringOption((option) => {
      return option
        .setName("diestring")
        .setDescription(
          "Express your desired dice roll in the format #d#. Example: 1d6 rolls a 6 sided die 1 time."
        )
        .setRequired(true);
    }),
  async execute(interaction) {
    let d = await interaction.options.getString("diestring");
    let finalString;

    let valid = true;

    try {
      const checkRegex = /(\d+d\d+)([\+|\-]\d+)?/;
      let finalCount = 0;
      let individualRolls = [];

      let processedString = d.match(checkRegex);

      if (processedString === null) throw new Error();
      const stringArray = processedString[1].split("d");
      const num1 = parseInt(stringArray[0]);
      const num2 = parseInt(stringArray[1]);

      const biasString = processedString[2];
      let finalBias, biasNumber, biasOperator;

      if (biasString !== undefined) {
        biasOperator = biasString.split("")[0];
        biasNumber = parseInt(biasString.substring(1));
        finalBias = biasOperator === "+" ? 0 + biasNumber : 0 - biasNumber;
      }

      if (num1 === 0 || num2 === 0) {
        finalString = `${num1}d${num2}: 0`;
      } else if (isNaN(num1) || isNaN(num2)) {
        throw new Error();
      } else if (num1 > 20 || num2 > 10000) {
        finalString =
          "Okay, Cantor, keep the numbers a bit lower alright? Max of 20 rolls and a 10000 sided die.";
      } else {
        for (let i = 0; i < num1; i++) {
          let newRoll = Math.floor(Math.random() * num2) + 1;
          finalCount += newRoll;
          individualRolls.push(newRoll);
        }

        const finalBiasString = finalBias
          ? ` ( ${finalCount} with a bias of ${biasOperator}${biasNumber} )`
          : "";

        finalString = `${num1}d${num2}: ${
          finalCount + (finalBias ? finalBias : 0)
        } (${individualRolls.join(" ")}) ${finalBiasString}`;
      }
    } catch (e) {
      console.log(e);
      valid = false;
    } finally {
      if (!valid) {
        await interaction.reply(
          `That roll "${d}" was invalid. Please use the formats #d#, #d#+# or #d#-#.`
        );
      } else {
        await interaction.reply(finalString);
      }
    }
  },
};
