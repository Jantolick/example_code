const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

const { BOT_CLIENT_ID, BOT_GUILD_ID } = process.env;

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push({ ...command.data, execute: command.execute });
        if (command.init) {
          command.init(client);
          console.log(command.data.name, "initialized.");
        }

        console.log(
          `Command: ${command.data.name} has been passed through the handler.`
        );
      }
    }

    const clientId = BOT_CLIENT_ID;
    const guildId = BOT_GUILD_ID;
    const rest = new REST({ version: "9" }).setToken(process.env.token);

    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: client.commandArray,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);

      console.log("Command Array:", client.commandArray);
    }
  };
};
