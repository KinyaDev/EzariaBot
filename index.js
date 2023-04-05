require("dotenv").config();
const fs = require("fs");
const { Client, PermissionFlagsBits } = require("discord.js");

const bot = new Client({
  intents: [
    "GuildMembers",
    "GuildMessages",
    "Guilds",
    "MessageContent",
    "GuildIntegrations",
  ],
});

let commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

const commands = [];
bot.commands = new Map();
bot.interactions = new Map();
bot.events = new Map();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  bot.commands.set(command.data.name, command);
}

let interactionFiles = fs
  .readdirSync("./interactions")
  .filter((file) => file.endsWith(".js"));

for (const file of interactionFiles) {
  const interaction = require(`./interactions/${file}`);
  bot.interactions.set(file.replace(".js", ""), interaction);
}

let eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  bot.events.set(file.replace(".js", ""), event);
}

bot.on("interactionCreate", async (interaction) => {
  if (interaction.channel.isTextBased()) {
    if (interaction.isCommand()) {
      const command = bot.commands.get(interaction.commandName);
      if (!command) return;

      await command.run(interaction);
    }

    if (interaction.isButton()) {
      let interac = bot.interactions.get(interaction.customId);
      if (!interac) return;

      interac(interaction);
    }
  }
});

bot.events.forEach((v, k) => {
  bot.on(k, v);
});

bot.login(process.env.TOKEN);
