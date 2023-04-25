const fs = require("fs");
const { Client } = require("discord.js");

require("dotenv").config();

const bot = new Client({
  intents: [
    "GuildMembers",
    "GuildMessageReactions",
    "GuildMessages",
    "MessageContent",
    "Guilds",
    "MessageContent",
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

let commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

const commands = [];
bot.commands = new Map();
bot.events = new Map();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  bot.commands.set(command.data.name, command);
}

let eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  bot.events.set(file.replace(".js", ""), event);
}

bot.on("interactionCreate", async (interaction) => {
  if (interaction.channel.isTextBased() && interaction.isCommand()) {
    const command = bot.commands.get(interaction.commandName);
    if (!command) return;

    await command.run(interaction);
  }
});

bot.events.forEach((v, k) => {
  bot.on(k, v);
});

bot.login(process.env.TOKEN);
