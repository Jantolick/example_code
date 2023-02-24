const { Events, ChannelType } = require("discord.js");

/* Basic setup for reacting to messages.
Currently set up to simply use the channel bot as a puppet to say whatever the authorized sender sends to it. This is
meant to be another huggingface.co integration, which is currently on hold due to waiting for a problem with the API key to be resolved.
*/

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    console.log(
      `${message.channel.id} ${message.author.username}: ${message.content}`
    );

    if (message.content.indexOf("What is a man?") > -1) {
      await message.reply("A miserable pile of secrets.");
    }

    if (
      message.channel.type === ChannelType.DM &&
      message.author.id === process.env.BOT_MASTER_ID
    ) {
      if (message.content.split(" ")?.[0] === "say") {
        const targetChannel = client.channels.cache.get(
          process.env.TARGET_CHANNEL_ID
        );
        await targetChannel.send(
          message.content.slice(message.content.indexOf(" "))
        );
      }
    }
  },
};
