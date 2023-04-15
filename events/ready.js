const { Client, REST, Routes, ActivityType } = require("discord.js");
const fs = require("fs");
/**
 *
 * @param {Client} bot
 */
module.exports = async (bot) => {
  const commands = [];
  let cmdfolder = __dirname.replace("\\events", "\\commands");
  let commandFiles = fs
    .readdirSync(cmdfolder)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
  }

  console.log("connecté");

  bot.user.setActivity({
    name: "Je vous fais voyager dans Ezaria!",
    type: ActivityType.Listening,
  });

  const rest = new REST({ version: "10" }).setToken(bot.token);

  (async () => {
    try {
      await rest.put(Routes.applicationCommands(bot.user.id), {
        body: commands,
      });

      console.log("Successfully Registered Commands");
    } catch (e) {
      console.error(e);
    }
  })();
};
